#!/usr/bin/env python3
"""
Push dimension data from brampton_brick.json into the Variant table.

Handles:
  - Direct colour name matches
  - Fuzzy matches (PRP / Metric Norman suffix variants)

Dry run by default. Pass --confirm to write to DB.

Usage:
    python scripts/push_brampton_dimensions.py           # preview
    python scripts/push_brampton_dimensions.py --confirm # write
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")
sys.stdout.reconfigure(encoding='utf-8')

import psycopg2
import psycopg2.extras

DATABASE_URL = os.environ.get("DIRECT_URL") or os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not found in Backend/.env")

JSON_PATH = ROOT / "Backend" / "data" / "brampton_brick.json"

# ── Standard dimension sets ────────────────────────────────────────────────────
PRP_DIMS    = {"sizeLabel": '3-1/8" H × 10-1/8" L × 3-1/2" D', "heightMm": 79,  "widthMm": 257, "depthMm": 90}
NORMAN_DIMS = {"sizeLabel": '2-1/4" H × 11-1/2" L × 3-1/2" D', "heightMm": 57,  "widthMm": 290, "depthMm": 90}


def get_conn():
    parsed = urlparse(DATABASE_URL)
    qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
    clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
    from urllib.parse import urlunparse
    return psycopg2.connect(urlunparse(clean))


def parse_dims(dim_str: str) -> dict:
    """Parse 'LENGTH 257 MM (10 1/8")\\nHEIGHT 79 MM (3 1/8")\\nDEPTH 90 MM (3 1/2")' into dims dict."""
    lines = dim_str.strip().split("\n")
    result = {}
    for line in lines:
        line = line.strip()
        mm_match  = re.search(r"(\d+)\s*MM", line, re.IGNORECASE)
        inch_match = re.search(r'\(([^)]+)\)', line)
        if not mm_match or not inch_match:
            continue
        mm_val   = int(mm_match.group(1))
        inch_val = inch_match.group(1).strip().rstrip('"').strip()
        # normalise "10 1/8" → "10-1/8"
        inch_val = re.sub(r'(\d)\s+(\d)', r'\1-\2', inch_val)

        if line.upper().startswith("LENGTH"):
            result["widthMm"]  = mm_val
            result["L_inch"]   = inch_val
        elif line.upper().startswith("HEIGHT"):
            result["heightMm"] = mm_val
            result["H_inch"]   = inch_val
        elif line.upper().startswith("DEPTH"):
            result["depthMm"]  = mm_val
            result["D_inch"]   = inch_val

    if "H_inch" in result and "L_inch" in result and "D_inch" in result:
        result["sizeLabel"] = f'{result["H_inch"]}" H × {result["L_inch"]}" L × {result["D_inch"]}" D'
    return result


def build_json_lookup(json_data: list) -> dict:
    """
    Build lookup: (series_lower, colour_lower) → dims
    Also strip ", Premier Plus (PRP)" suffixes for fuzzy matching.
    """
    lookup = {}
    for entry in json_data:
        series  = (entry.get("series_name") or "").strip().lower()
        variant = entry["variant"].strip()
        dims    = parse_dims(entry.get("dimensions", ""))
        if not dims.get("sizeLabel"):
            continue

        # Exact key
        lookup[(series, variant.lower())] = dims

        # Fuzzy key: strip suffix like ", Premier Plus (PRP)"
        stripped = re.sub(r',?\s*(premier plus\s*\(prp\)|prp|\(prp\))', '', variant, flags=re.IGNORECASE).strip()
        if stripped.lower() != variant.lower():
            lookup[(series, stripped.lower())] = dims

    return lookup


def fetch_brampton_variants(conn) -> list:
    sql = """
        SELECT DISTINCT ON (v.id)
            v.id,
            v.sku,
            v."colourName",
            v."sizeLabel",
            p.name  AS product_name,
            (
                SELECT c2.value FROM "ProductCategory" pc2
                JOIN "Category" c2 ON c2.id = pc2."categoryId"
                WHERE pc2."productId" = p.id AND c2.type = 'collection'
                LIMIT 1
            ) AS collection
        FROM "Variant" v
        JOIN "Product"             p  ON p.id  = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer"        m  ON m.id  = pm."manufacturerId"
        WHERE LOWER(m.name) LIKE '%brampton%'
          AND v."isActive" = true
        ORDER BY v.id, v."colourName"
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql)
        return [dict(r) for r in cur.fetchall()]


def resolve_dims(variant: dict, lookup: dict) -> dict | None:
    """Try to find dims for a DB variant using exact then fuzzy matching."""
    colour     = (variant["colourName"] or "").strip()
    collection = (variant["collection"] or "").strip().lower()
    colour_lo  = colour.lower()

    # 1. Exact match on (collection, colour)
    if (collection, colour_lo) in lookup:
        return lookup[(collection, colour_lo)]

    # 2. "Metric Norman" suffix → Norman dims, match base colour
    if "metric norman" in colour_lo:
        base = re.sub(r'\s*metric\s*norman', '', colour, flags=re.IGNORECASE).strip().lower()
        if (collection, base) in lookup:
            return NORMAN_DIMS

    # 3. "PRP" suffix → PRP dims, match base colour
    if colour_lo.endswith("prp"):
        base = re.sub(r'\s*prp$', '', colour, flags=re.IGNORECASE).strip().lower()
        if (collection, base) in lookup:
            return PRP_DIMS

    # 4. Try matching across any series (collection-agnostic)
    for (ser, col), dims in lookup.items():
        if col == colour_lo:
            return dims

    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--confirm", action="store_true", help="Write changes to DB (default: dry run)")
    args = parser.parse_args()

    with open(JSON_PATH, encoding="utf-8") as f:
        json_data = json.load(f)

    lookup = build_json_lookup(json_data)

    conn = get_conn()
    try:
        variants = fetch_brampton_variants(conn)
        print(f"Found {len(variants)} Brampton variants in DB\n")

        updates  = []
        skipped  = []

        for v in variants:
            dims = resolve_dims(v, lookup)
            if dims:
                updates.append((v, dims))
            else:
                skipped.append(v)

        print(f"{'DRY RUN — ' if not args.confirm else ''}Updates: {len(updates)} | No match: {len(skipped)}\n")

        print("── UPDATES ──────────────────────────────────────────────────────")
        for v, dims in updates:
            print(f"  [{v['collection']:22}] {v['colourName']:30} → {dims['sizeLabel']}")

        if skipped:
            print(f"\n── NO MATCH (skipped) ───────────────────────────────────────────")
            for v in skipped:
                print(f"  [{v['collection']:22}] {v['colourName']}")

        if not args.confirm:
            print("\nAdd --confirm to write these changes to the DB.")
            return

        # Write to DB
        with conn.cursor() as cur:
            for v, dims in updates:
                cur.execute(
                    """
                    UPDATE "Variant"
                       SET "sizeLabel" = %s,
                           "widthMm"   = %s,
                           "heightMm"  = %s,
                           "depthMm"   = %s
                     WHERE id = %s
                    """,
                    (dims["sizeLabel"], dims["widthMm"], dims["heightMm"], dims["depthMm"], v["id"])
                )
        conn.commit()
        print(f"\n✓ Updated {len(updates)} variants in the DB.")

    finally:
        conn.close()


if __name__ == "__main__":
    main()
