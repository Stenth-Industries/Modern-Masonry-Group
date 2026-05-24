#!/usr/bin/env python3
"""
Fix sizeLabel data quality issues for specific Arriscraft stone collections.
Dry run by default; pass --confirm to write.

Issues fixed:
  - Arris Clip:  6 lines → 3 (remove Return/corner entries); fix missing × in line 3
  - Arris Tile:  6 lines → 3 (remove Return/corner entries)
  - Stack:       remove STA21: prefix from line 1; trim to 3 lines (remove incomplete entries)
  - Coastal:     remove COA21: prefix from line 1
  - Midtown:     set size-specific labels (14 variants matched by colourName height token)
"""

import argparse
import os
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


def get_conn():
    parsed = urlparse(DATABASE_URL)
    netloc = parsed.netloc.replace(":5432", ":6543")
    clean = parsed._replace(netloc=netloc, query="")
    return psycopg2.connect(urlunparse(clean))


ARRIS_CLIP_FIXED = (
    '3-5/8" H × 23-5/8" L × 1-3/8" T\n'
    '7-5/8" H × 23-5/8" L × 1-3/8" T\n'
    '11-5/8" H × 23-5/8" L × 1-3/8" T'
)

ARRIS_TILE_FIXED = (
    '3-5/8" H × 23-5/8" L × 3/4" T\n'
    '7-5/8" H × 23-5/8" L × 3/4" T\n'
    '11-5/8" H × 23-5/8" L × 3/4" T'
)

STACK_FIXED = (
    '2-1/8" Height × Fragmented (4" to 23-5/8") Lengths × 1-1/2" Bed\n'
    '3-5/8" Height × Fragmented (4" to 23-5/8") Lengths × 1-1/4" Bed\n'
    '5-7/8" Height × Fragmented (4" to 23-5/8") Lengths × 1-1/8" Bed'
)

COASTAL_FIXED = (
    '2-1/8 Height × Fragmented (4 to 23-5/8) Lengths × 1-1/2 Bed\n'
    '3-5/8 Height × Fragmented (4 to 23-5/8) Lengths × 1-1/4 Bed\n'
    '6-1/8 Height × Fragmented (4 to 23-5/8) Lengths × 1-1/8 Bed\n'
    '2-1/8 Height × Fragmented (4 to 10) Lengths × 1-1/2 Bed × 2 to 4 Depth\n'
    '3-5/8 Height × Fragmented (4 to 10) Lengths × 1-1/4 Bed × 2 to 4 Depth\n'
    '6-1/8 Height × Fragmented (4 to 10) Lengths × 1-1/8 Bed × 2 to 4 Depth'
)

MIDTOWN_21_FIXED = (
    '2-1/8" Height × Fragmented (4" to 23-5/8") Lengths × Mixed (7/8" 1" 1-1/8" 1-1/4") Bed\n'
    '2-1/8" Height × Fragmented (4" to 10") Lengths × Mixed (7/8" 1" 1-1/8" 1-1/4") Bed × 2" to 4" Depth'
)

MIDTOWN_35_FIXED = (
    '3-5/8" Height × Fragmented (4" to 23-5/8") Lengths × Mixed (7/8" 1" 1-1/8" 1-1/4") Bed\n'
    '3-5/8" Height × Fragmented (4" to 10") Lengths × Mixed (7/8" 1" 1-1/8" 1-1/4") Bed × 2" to 4" Depth'
)

MIDTOWN_57_FIXED = (
    '5-7/8" Height × Fragmented (up to 23-5/8") Lengths × 1-1/2" Bed\n'
    '5-7/8" Height × Fragmented (4" to 10") Lengths × 1-1/2" Bed × 2" to 4" Depth'
)

# Keys match the existing short sizeLabel values (with or without " Sawn" suffix)
MIDTOWN_SIZE_MAP = {
    '2-1/8': MIDTOWN_21_FIXED,
    '3-5/8': MIDTOWN_35_FIXED,
    '5-7/8': MIDTOWN_57_FIXED,
}

FIXES = {
    'Arris Clip': ARRIS_CLIP_FIXED,
    'Arris Tile': ARRIS_TILE_FIXED,
    'Stack':      STACK_FIXED,
    'Coastal':    COASTAL_FIXED,
}


def fetch_variants(conn, collection: str) -> list[dict]:
    sql = """
        SELECT v.id, v."colourName", v."sizeLabel",
               c.value AS collection
        FROM "Variant" v
        JOIN "Product" p ON p.id = v."productId"
        JOIN "ProductCategory" pc ON pc."productId" = p.id
        JOIN "Category" c ON c.id = pc."categoryId" AND c.type = 'collection'
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE LOWER(m.name) LIKE '%%arriscraft%%'
          AND c.value = %s
          AND v."isActive" = true
        ORDER BY v.id
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql, (collection,))
        return [dict(r) for r in cur.fetchall()]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--confirm", action="store_true", help="Write to DB (default: dry run)")
    args = parser.parse_args()

    conn = get_conn()
    all_updates = []

    for collection, fixed_label in FIXES.items():
        variants = fetch_variants(conn, collection)
        print(f"\n── {collection} ({len(variants)} variants) ────────────────────────────")
        for v in variants:
            current = v['sizeLabel'] or ''
            if current == fixed_label:
                print(f"  {v['colourName']:30} — already correct")
            else:
                print(f"  {v['colourName']:30} — WILL UPDATE")
                print(f"    was:  {repr(current[:80])}")
                print(f"    now:  {repr(fixed_label[:80])}")
                all_updates.append((v['id'], fixed_label))

    # Midtown: each variant's colourName contains the height token
    midtown_variants = fetch_variants(conn, 'Midtown')
    print(f"\n── Midtown ({len(midtown_variants)} variants) ────────────────────────────")
    for v in midtown_variants:
        current = v['sizeLabel'] or ''
        display = f"{v['colourName']} — {current}"
        fixed_label = None
        for token, label in MIDTOWN_SIZE_MAP.items():
            if current.startswith(token):
                fixed_label = label
                break
        if fixed_label is None:
            print(f"  {display:50} — SKIPPED (unrecognised sizeLabel)")
            continue
        if current == fixed_label:
            print(f"  {display:50} — already correct")
        else:
            print(f"  {display:50} — WILL UPDATE")
            print(f"    was:  {repr(current[:80])}")
            print(f"    now:  {repr(fixed_label[:80])}")
            all_updates.append((v['id'], fixed_label))

    print(f"\n{'DRY RUN — ' if not args.confirm else ''}Total updates: {len(all_updates)}")

    if not args.confirm:
        print("\nAdd --confirm to write to DB.")
        conn.close()
        return

    with conn.cursor() as cur:
        for vid, label in all_updates:
            cur.execute('UPDATE "Variant" SET "sizeLabel" = %s WHERE id = %s', (label, vid))
    conn.commit()
    conn.close()
    print(f"\n✓ Updated {len(all_updates)} variants.")


if __name__ == "__main__":
    main()
