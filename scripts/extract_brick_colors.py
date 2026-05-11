#!/usr/bin/env python3
"""
Brick Color Extraction Pipeline
=================================
For each active product variant with an image URL:
  1. Downloads the image
  2. Crops the outer 15% border, resizes to 200×200
  3. Runs K-means (k=1) to extract the dominant RGB
  4. Converts RGB → hex and CIE Lab
  5. Matches to the nearest standard color via Delta-E (CIEDE2000)
  6. Writes results to data/brick_colors.csv

Optionally syncs the extracted hex + Lab + standard_color back into the
Category table (requires the Prisma migration to have been applied first —
see README note below).

Usage:
    # Step 1 — extract colors and write CSV (no DB writes):
    python scripts/extract_brick_colors.py

    # Step 2 — preview what would be written to DB:
    python scripts/extract_brick_colors.py --sync

    # Step 3 — actually commit to DB:
    python scripts/extract_brick_colors.py --sync --confirm

    # Sync from an existing CSV without re-extracting images:
    python scripts/extract_brick_colors.py --sync-only --confirm

BEFORE running --sync you must apply the Prisma migration:
    cd Backend
    npx prisma migrate dev --name add_lab_to_category
"""

import argparse
import csv
import io
import json
import os
import sys
import time
from collections import defaultdict
from pathlib import Path

import numpy as np
import requests
import colour
from dotenv import load_dotenv
from PIL import Image
from sklearn.cluster import KMeans

import psycopg2
import psycopg2.extras

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")

DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

STANDARD_COLORS_FILE = DATA_DIR / "standard_colors.json"
OUTPUT_CSV = DATA_DIR / "brick_colors.csv"

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not found in Backend/.env")


# ── Image helpers ──────────────────────────────────────────────────────────────

def fetch_image(url: str, timeout: int = 20) -> Image.Image | None:
    """Download an image from a URL, return PIL Image or None on failure."""
    try:
        resp = requests.get(
            url,
            timeout=timeout,
            headers={"User-Agent": "Mozilla/5.0 (compatible; BrickColorBot/1.0)"},
        )
        resp.raise_for_status()
        return Image.open(io.BytesIO(resp.content)).convert("RGB")
    except Exception as exc:
        print(f"    WARN: could not fetch image — {exc}")
        return None


def extract_dominant_rgb(img: Image.Image) -> tuple[int, int, int]:
    """
    Crop the outer 15% border, resize to 200×200, then run K-means (k=1)
    to find the dominant RGB centroid.
    Returns (r, g, b) as integers 0-255.
    """
    w, h = img.size
    cx = int(w * 0.15)
    cy = int(h * 0.15)
    img = img.crop((cx, cy, w - cx, h - cy))
    img = img.resize((200, 200), Image.LANCZOS)

    pixels = np.array(img).reshape(-1, 3).astype(np.float32)
    km = KMeans(n_clusters=1, n_init=1, random_state=42)
    km.fit(pixels)
    r, g, b = (int(round(v)) for v in km.cluster_centers_[0])
    return r, g, b


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def rgb_to_lab(r: int, g: int, b: int) -> tuple[float, float, float]:
    """Convert sRGB (0-255) to CIE Lab using D65 illuminant."""
    srgb = np.array([r / 255.0, g / 255.0, b / 255.0])
    xyz = colour.sRGB_to_XYZ(srgb)
    lab = colour.XYZ_to_Lab(xyz)
    return float(lab[0]), float(lab[1]), float(lab[2])


def lab_to_hex(l: float, a: float, b: float) -> str:
    """Convert a CIE Lab centroid back to the nearest sRGB hex."""
    lab = np.array([l, a, b])
    xyz = colour.Lab_to_XYZ(lab)
    srgb = np.clip(colour.XYZ_to_sRGB(xyz), 0.0, 1.0)
    r, g, bv = (int(round(v * 255)) for v in srgb)
    return rgb_to_hex(r, g, bv)


# ── Standard-color matching ────────────────────────────────────────────────────

def load_standard_colors() -> dict:
    if not STANDARD_COLORS_FILE.exists():
        sys.exit(f"ERROR: {STANDARD_COLORS_FILE} not found")
    with open(STANDARD_COLORS_FILE) as f:
        return json.load(f)


def match_standard_color(
    lab_l: float, lab_a: float, lab_b: float, standards: dict
) -> str:
    """
    Compare Lab values against each standard color centroid using CIEDE2000.
    Returns the closest standard color whose ΔE is within its own tolerance,
    or 'Other' if none qualify.

    Iterates all candidates and picks the best one within tolerance rather
    than short-circuiting on the globally closest match (which may itself be
    outside its stricter tolerance).
    """
    sample = np.array([lab_l, lab_a, lab_b])
    best_name, best_de = "Other", float("inf")

    for name, sc in standards.items():
        ref = np.array([sc["lab_l"], sc["lab_a"], sc["lab_b"]])
        de = float(colour.delta_E(sample, ref, method="CIE 2000"))
        if de <= sc["tolerance"] and de < best_de:
            best_de = de
            best_name = name

    return best_name


# ── DB helpers ─────────────────────────────────────────────────────────────────

def get_conn():
    # Supabase appends ?pgbouncer=true for Prisma's benefit; psycopg2 doesn't accept it
    from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
    parsed = urlparse(DATABASE_URL)
    qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
    clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
    return psycopg2.connect(urlunparse(clean))


def fetch_variants(conn) -> list[dict]:
    """
    Return all active variants that have an imageUrl, joined with their
    manufacturer name and product material.
    One row per variant — colour categories are averaged later during sync.
    """
    sql = """
        SELECT
            v.id,
            v.sku,
            v."colourName",
            v."imageUrl",
            p.material,
            m.name AS manufacturer
        FROM "Variant" v
        JOIN "Product"              p  ON p.id  = v."productId"
        JOIN "ProductManufacturer"  pm ON pm."productId" = p.id
        JOIN "Manufacturer"         m  ON m.id  = pm."manufacturerId"
        WHERE v."isActive" = true
          AND v."imageUrl" IS NOT NULL
          AND v."imageUrl" <> ''
        ORDER BY m.name, v."colourName"
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql)
        return [dict(r) for r in cur.fetchall()]


def lab_columns_exist(conn) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'Category' AND column_name = 'labL'
            LIMIT 1
            """
        )
        return cur.fetchone() is not None


def sync_to_db(conn, rows: list[dict], dry_run: bool = True) -> None:
    """
    Aggregate per-variant rows by colourName, average Lab values, derive hex,
    then update Category rows where type='colour'.

    With dry_run=True (default) only prints what would change — nothing is written.
    """
    has_lab = lab_columns_exist(conn)
    if not has_lab:
        print(
            "\n⚠️  Lab columns (labL, labA, labB, standardColor) are not yet in the"
            " Category table.\n"
            "   Run the migration first:\n"
            "     cd Backend && npx prisma migrate dev --name add_lab_to_category\n"
            "   Then re-run with --sync --confirm.\n"
            "   Falling back to hexCode-only update.\n"
        )

    # Group rows by colourName, averaging Lab across all variants
    groups: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        key = (row["colour_name"] or "").strip()
        if key:
            groups[key].append(row)

    updates = []
    for colour_name, group in groups.items():
        avg_l = sum(r["lab_l"] for r in group) / len(group)
        avg_a = sum(r["lab_a"] for r in group) / len(group)
        avg_b = sum(r["lab_b"] for r in group) / len(group)
        hex_code = lab_to_hex(avg_l, avg_a, avg_b)
        standard = group[0]["matched_standard"]
        updates.append((colour_name, hex_code, avg_l, avg_a, avg_b, standard))

    if dry_run:
        print(f"\n[DRY RUN] Would update {len(updates)} colour categories:")
        for name, hex_code, l, a, b, std in updates[:15]:
            print(f"  {name:<28} -> {hex_code}  Lab({l:5.1f}, {a:5.1f}, {b:5.1f})  std={std}")
        if len(updates) > 15:
            print(f"  ... and {len(updates) - 15} more")
        print("\nAdd --confirm to apply these changes to the DB.")
        return

    with conn.cursor() as cur:
        updated = 0
        for colour_name, hex_code, l, a, b, std in updates:
            if has_lab:
                cur.execute(
                    """
                    UPDATE "Category"
                       SET "hexCode"      = %s,
                           "labL"         = %s,
                           "labA"         = %s,
                           "labB"         = %s,
                           "standardColor"= %s
                     WHERE type = 'colour' AND value = %s
                    """,
                    (hex_code, l, a, b, std, colour_name),
                )
            else:
                cur.execute(
                    'UPDATE "Category" SET "hexCode" = %s WHERE type = %s AND value = %s',
                    (hex_code, "colour", colour_name),
                )
            updated += cur.rowcount
        # Also set standardColor on categories whose value IS a standard color name
        # (e.g. Brampton Brick COLOUR CLASS values like "GREY", "BLACK", "BROWN")
        standards = load_standard_colors()
        extra = 0
        for std_name in standards:
            cur.execute(
                """
                UPDATE "Category"
                   SET "standardColor" = %s
                 WHERE type = 'colour'
                   AND LOWER(value) = LOWER(%s)
                   AND ("standardColor" IS NULL OR "standardColor" <> %s)
                """,
                (std_name, std_name, std_name),
            )
            extra += cur.rowcount
        # Write standardColor to each Variant row in one batch UPDATE
        variant_rows = [(r["matched_standard"], r["sku"]) for r in rows if r.get("sku") and r.get("matched_standard")]
        variant_updated = 0
        if variant_rows:
            args = ",".join(cur.mogrify("(%s,%s)", vr).decode() for vr in variant_rows)
            cur.execute(
                f'UPDATE "Variant" AS v SET "standardColor" = vals.std FROM (VALUES {args}) AS vals(std, sku) WHERE v.sku = vals.sku'
            )
            variant_updated = cur.rowcount

        conn.commit()
    print(f"Updated {updated} colour categories in the database.")
    print(f"Updated {variant_updated} variant standardColor values.")
    if extra:
        print(f"Also tagged {extra} colour-class categories with standardColor (e.g. Brampton GREY->Grey).")


# ── CSV helpers ────────────────────────────────────────────────────────────────

FIELDS = ["manufacturer", "sku", "colour_name", "hex", "lab_l", "lab_a", "lab_b", "matched_standard"]


def write_csv(rows: list[dict]) -> None:
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"\n{len(rows)} rows written -> {OUTPUT_CSV}")


def read_csv() -> list[dict]:
    rows = []
    with open(OUTPUT_CSV, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            row["lab_l"] = float(row["lab_l"])
            row["lab_a"] = float(row["lab_a"])
            row["lab_b"] = float(row["lab_b"])
            rows.append(row)
    return rows


# ── Extraction pipeline ────────────────────────────────────────────────────────

def run_extraction(conn) -> list[dict]:
    standards = load_standard_colors()
    variants = fetch_variants(conn)
    total = len(variants)
    print(f"Found {total} active variants with images.\n")

    results = []
    skipped = 0

    for i, v in enumerate(variants, 1):
        colour_name = (v["colourName"] or "Unknown").strip()
        sku = v["sku"] or v["id"][:8]
        manufacturer = v["manufacturer"]
        url = v["imageUrl"]

        prefix = f"[{i}/{total}] {manufacturer} / {colour_name}"
        print(prefix)

        img = fetch_image(url)
        if img is None:
            skipped += 1
            continue

        r, g, b = extract_dominant_rgb(img)
        hex_code = rgb_to_hex(r, g, b)
        lab_l, lab_a, lab_b = rgb_to_lab(r, g, b)
        matched = match_standard_color(lab_l, lab_a, lab_b, standards)

        print(f"    {hex_code}  Lab({lab_l:.1f}, {lab_a:.1f}, {lab_b:.1f})  -> {matched}")

        results.append(
            {
                "manufacturer": manufacturer,
                "sku": sku,
                "colour_name": colour_name,
                "hex": hex_code,
                "lab_l": round(lab_l, 4),
                "lab_a": round(lab_a, 4),
                "lab_b": round(lab_b, 4),
                "matched_standard": matched,
            }
        )

    print(f"\nDone. Processed {len(results)}, skipped {skipped} (no image).")
    return results


# ── Entry point ────────────────────────────────────────────────────────────────

def rematch_csv() -> list[dict]:
    """
    Re-run standard-color matching against the existing CSV Lab values
    without re-downloading any images. Fast — no network calls.
    """
    if not OUTPUT_CSV.exists():
        sys.exit(f"ERROR: {OUTPUT_CSV} not found — run without --rematch first.")
    standards = load_standard_colors()
    rows = read_csv()
    print(f"Re-matching {len(rows)} rows from {OUTPUT_CSV} against updated standard_colors.json …")
    for row in rows:
        row["matched_standard"] = match_standard_color(
            row["lab_l"], row["lab_a"], row["lab_b"], standards
        )
    # Summary
    from collections import Counter
    counts = Counter(r["matched_standard"] for r in rows)
    print("\nMatching results:")
    for name, n in sorted(counts.items()):
        print(f"  {name:<12} {n}")
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract dominant colors from brick product images and sync to DB."
    )
    parser.add_argument(
        "--rematch",
        action="store_true",
        help="Re-run standard-color matching on existing CSV without re-downloading images.",
    )
    parser.add_argument(
        "--sync",
        action="store_true",
        help="After extraction/rematch, preview DB updates (dry run unless --confirm).",
    )
    parser.add_argument(
        "--sync-only",
        action="store_true",
        help="Skip image extraction; sync from existing data/brick_colors.csv.",
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Remove dry-run guard and actually write changes to the database.",
    )
    args = parser.parse_args()

    conn = get_conn()
    try:
        if args.rematch:
            rows = rematch_csv()
            write_csv(rows)
            if args.sync:
                sync_to_db(conn, rows, dry_run=not args.confirm)

        elif args.sync_only:
            if not OUTPUT_CSV.exists():
                sys.exit(f"ERROR: {OUTPUT_CSV} not found — run without --sync-only first.")
            rows = read_csv()
            print(f"Loaded {len(rows)} rows from {OUTPUT_CSV}")
            sync_to_db(conn, rows, dry_run=not args.confirm)

        elif args.sync:
            rows = run_extraction(conn)
            write_csv(rows)
            sync_to_db(conn, rows, dry_run=not args.confirm)

        else:
            rows = run_extraction(conn)
            write_csv(rows)
            print("\nNext steps:")
            print("  1. cd Backend && npx prisma db push")
            print("  2. python scripts/extract_brick_colors.py --rematch --sync --confirm")

    finally:
        conn.close()


if __name__ == "__main__":
    main()
