#!/usr/bin/env python3
"""
Extract dominant colors for Canada Brick variants only and append to
data/brick_colors.csv, then optionally sync to DB.

Skips any SKU already present in the CSV so it's safe to re-run.

Usage:
    python scripts/extract_canadabrick_colors.py               # extract + write CSV
    python scripts/extract_canadabrick_colors.py --sync        # extract + preview DB update
    python scripts/extract_canadabrick_colors.py --sync --confirm   # extract + write to DB
    python scripts/extract_canadabrick_colors.py --sync-only --confirm  # sync existing CSV only
"""

import argparse
import csv
import io
import json
import os
import sys
import time
sys.stdout.reconfigure(encoding='utf-8')
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

import numpy as np
import requests
import colour
from dotenv import load_dotenv
from PIL import Image
from sklearn.cluster import KMeans
import psycopg2
import psycopg2.extras

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not found in Backend/.env")

OUTPUT_CSV           = ROOT / "data" / "brick_colors.csv"
STANDARD_COLORS_FILE = ROOT / "data" / "standard_colors.json"

FIELDS = ["manufacturer", "sku", "colour_name", "hex", "lab_l", "lab_a", "lab_b", "matched_standard"]

# ── DB ─────────────────────────────────────────────────────────────────────────

def get_conn():
    parsed = urlparse(DATABASE_URL)
    qs     = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
    clean  = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
    return psycopg2.connect(urlunparse(clean))


def fetch_canada_brick_variants(conn):
    sql = """
        SELECT v.id, v.sku, v."colourName", v."imageUrl", p.material, m.name AS manufacturer
        FROM "Variant" v
        JOIN "Product"             p  ON p.id  = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer"        m  ON m.id  = pm."manufacturerId"
        WHERE v."isActive" = true
          AND v."imageUrl" IS NOT NULL AND v."imageUrl" <> ''
          AND m.name = 'Canada Brick'
        ORDER BY v."colourName"
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql)
        return [dict(r) for r in cur.fetchall()]


# ── Image helpers ───────────────────────────────────────────────────────────────

def fetch_image(url):
    try:
        resp = requests.get(url, timeout=20,
                            headers={"User-Agent": "Mozilla/5.0 (compatible; BrickColorBot/1.0)"})
        resp.raise_for_status()
        return Image.open(io.BytesIO(resp.content)).convert("RGB")
    except Exception as exc:
        print(f"    WARN: {exc}")
        return None


def extract_dominant_rgb(img):
    w, h = img.size
    cx, cy = int(w * 0.15), int(h * 0.15)
    img = img.crop((cx, cy, w - cx, h - cy)).resize((200, 200), Image.LANCZOS)
    pixels = np.array(img).reshape(-1, 3).astype(np.float32)
    km = KMeans(n_clusters=1, n_init=1, random_state=42)
    km.fit(pixels)
    return tuple(int(round(v)) for v in km.cluster_centers_[0])


def rgb_to_hex(r, g, b):
    return f"#{r:02X}{g:02X}{b:02X}"


def rgb_to_lab(r, g, b):
    srgb = np.array([r / 255.0, g / 255.0, b / 255.0])
    lab  = colour.XYZ_to_Lab(colour.sRGB_to_XYZ(srgb))
    return float(lab[0]), float(lab[1]), float(lab[2])


def lab_to_hex(l, a, b):
    lab  = np.array([l, a, b])
    srgb = np.clip(colour.XYZ_to_sRGB(colour.Lab_to_XYZ(lab)), 0.0, 1.0)
    return rgb_to_hex(*(int(round(v * 255)) for v in srgb))


# ── Standard color matching ─────────────────────────────────────────────────────

def load_standards():
    if not STANDARD_COLORS_FILE.exists():
        sys.exit(f"ERROR: {STANDARD_COLORS_FILE} not found")
    with open(STANDARD_COLORS_FILE) as f:
        return json.load(f)


def match_standard(lab_l, lab_a, lab_b, standards):
    sample = np.array([lab_l, lab_a, lab_b])
    best_name, best_de = "Other", float("inf")
    for name, sc in standards.items():
        ref = np.array([sc["lab_l"], sc["lab_a"], sc["lab_b"]])
        de  = float(colour.delta_E(sample, ref, method="CIE 2000"))
        if de <= sc["tolerance"] and de < best_de:
            best_de, best_name = de, name
    return best_name


# ── CSV helpers ─────────────────────────────────────────────────────────────────

def read_existing_csv():
    if not OUTPUT_CSV.exists():
        return [], set()
    rows, skus = [], set()
    with open(OUTPUT_CSV, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append(row)
            skus.add(row["sku"])
    return rows, skus


def write_csv(rows):
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"\n{len(rows)} total rows written -> {OUTPUT_CSV}")


# ── DB sync ─────────────────────────────────────────────────────────────────────

def sync_to_db(conn, new_rows, dry_run=True):
    """Update Category + Variant rows for Canada Brick colours only."""
    groups = defaultdict(list)
    for row in new_rows:
        key = (row["colour_name"] or "").strip()
        if key:
            groups[key].append(row)

    updates = []
    for colour_name, group in groups.items():
        avg_l = sum(float(r["lab_l"]) for r in group) / len(group)
        avg_a = sum(float(r["lab_a"]) for r in group) / len(group)
        avg_b = sum(float(r["lab_b"]) for r in group) / len(group)
        hex_code = lab_to_hex(avg_l, avg_a, avg_b)
        standard = group[0]["matched_standard"]
        updates.append((colour_name, hex_code, avg_l, avg_a, avg_b, standard))

    if dry_run:
        print(f"\n[DRY RUN] Would update {len(updates)} colour categories:")
        for name, hex_code, l, a, b, std in updates:
            print(f"  {name:<20} → {hex_code}  Lab({l:5.1f},{a:5.1f},{b:5.1f})  std={std}")
        print("\nAdd --confirm to apply.")
        return

    with conn.cursor() as cur:
        cat_updated, var_updated = 0, 0
        for colour_name, hex_code, l, a, b, std in updates:
            cur.execute(
                """UPDATE "Category"
                      SET "hexCode"=%s, "labL"=%s, "labA"=%s, "labB"=%s,
                          "standardColor"=%s
                    WHERE type='colour' AND value=%s""",
                (hex_code, l, a, b, std, colour_name),
            )
            cat_updated += cur.rowcount

        variant_rows = [(r["matched_standard"], r["sku"]) for r in new_rows if r.get("sku") and r.get("matched_standard")]
        if variant_rows:
            args = ",".join(cur.mogrify("(%s,%s)", vr).decode() for vr in variant_rows)
            cur.execute(
                f'UPDATE "Variant" AS v SET "standardColor"=vals.std '
                f'FROM (VALUES {args}) AS vals(std,sku) WHERE v.sku=vals.sku'
            )
            var_updated = cur.rowcount

        conn.commit()
    print(f"Updated {cat_updated} colour categories and {var_updated} variant standardColor values.")


# ── Main ────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sync",      action="store_true", help="Preview DB update after extraction")
    parser.add_argument("--sync-only", action="store_true", help="Skip extraction, sync from existing CSV")
    parser.add_argument("--confirm",   action="store_true", help="Actually write to DB")
    args = parser.parse_args()

    conn = get_conn()
    try:
        existing_rows, existing_skus = read_existing_csv()
        print(f"Existing CSV: {len(existing_rows)} rows\n")

        if args.sync_only:
            cb_rows = [r for r in existing_rows if r.get("manufacturer") == "Canada Brick"]
            print(f"Syncing {len(cb_rows)} Canada Brick rows from CSV...")
            sync_to_db(conn, cb_rows, dry_run=not args.confirm)
            return

        # ── Extraction ──────────────────────────────────────────────────────────
        variants  = fetch_canada_brick_variants(conn)
        standards = load_standards()
        to_process = [v for v in variants if v["sku"] not in existing_skus]

        print(f"Canada Brick variants in DB : {len(variants)}")
        print(f"Already in CSV (skipping)   : {len(variants) - len(to_process)}")
        print(f"To extract                  : {len(to_process)}\n")

        if not to_process:
            print("All Canada Brick variants already have color data in CSV.")
            if args.sync:
                cb_rows = [r for r in existing_rows if r.get("manufacturer") == "Canada Brick"]
                sync_to_db(conn, cb_rows, dry_run=not args.confirm)
            return

        new_rows = []
        skipped  = 0

        for i, v in enumerate(to_process, 1):
            colour_name = (v["colourName"] or "Unknown").strip()
            print(f"[{i}/{len(to_process)}] {colour_name:<20} {v['sku']}")

            img = fetch_image(v["imageUrl"])
            if img is None:
                skipped += 1
                continue

            r, g, b    = extract_dominant_rgb(img)
            hex_code   = rgb_to_hex(r, g, b)
            lab_l, lab_a, lab_b = rgb_to_lab(r, g, b)
            matched    = match_standard(lab_l, lab_a, lab_b, standards)

            print(f"    {hex_code}  Lab({lab_l:.1f},{lab_a:.1f},{lab_b:.1f})  -> {matched}")

            new_rows.append({
                "manufacturer":    "Canada Brick",
                "sku":             v["sku"],
                "colour_name":     colour_name,
                "hex":             hex_code,
                "lab_l":           round(lab_l, 4),
                "lab_a":           round(lab_a, 4),
                "lab_b":           round(lab_b, 4),
                "matched_standard": matched,
            })
            time.sleep(0.3)

        print(f"\nExtracted: {len(new_rows)}  |  Skipped (no image): {skipped}")

        # Merge with existing and save
        all_rows = existing_rows + new_rows
        write_csv(all_rows)

        if args.sync:
            sync_to_db(conn, new_rows, dry_run=not args.confirm)
        else:
            print("\nNext: python scripts/extract_canadabrick_colors.py --sync --confirm")

    finally:
        conn.close()


if __name__ == "__main__":
    main()
