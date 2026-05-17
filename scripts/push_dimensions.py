#!/usr/bin/env python3
"""
Push sizeLabel changes from data/variant_dimensions.csv into the Variant table.
Edit the sizeLabel column in the CSV, then run this script.
Use | to separate multiple sizes on one line (e.g. for stone).

Dry run by default. Pass --confirm to write to DB.

Usage:
    python scripts/push_dimensions.py           # preview changes
    python scripts/push_dimensions.py --confirm # write to DB
"""

import argparse
import csv
import os
import sys
from pathlib import Path
from urllib.parse import urlparse, urlunparse

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")
sys.stdout.reconfigure(encoding='utf-8')

import psycopg2

DATABASE_URL = os.environ.get("DIRECT_URL") or os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not found in Backend/.env")

CSV_PATH = ROOT / "data" / "variant_dimensions.csv"


def get_conn():
    parsed = urlparse(DATABASE_URL)
    netloc = parsed.netloc.replace(":5432", ":6543")
    clean = parsed._replace(netloc=netloc, query="")
    return psycopg2.connect(urlunparse(clean))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--confirm", action="store_true", help="Write to DB (default: dry run)")
    args = parser.parse_args()

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute('SELECT sku, "sizeLabel" FROM "Variant" WHERE "isActive" = true')
        db = {sku: label for sku, label in cur.fetchall()}

    updates = []
    for row in rows:
        sku = row["sku"].strip()
        new_label = row["sizeLabel"].strip().replace("|", "\n") or None
        old_label = db.get(sku)
        if new_label != old_label:
            updates.append((sku, row["colour_name"], row["collection"], old_label, new_label))

    print(f"{'DRY RUN — ' if not args.confirm else ''}Changes: {len(updates)}\n")
    for sku, name, coll, old, new in updates:
        print(f"  [{coll:30}] {name:30} ({sku})")
        print(f"    was: {repr(old)}")
        print(f"    now: {repr(new)}")

    if not updates:
        print("No changes.")
        conn.close()
        return

    if not args.confirm:
        print("\nAdd --confirm to write these to the DB.")
        conn.close()
        return

    with conn.cursor() as cur:
        for sku, _, _, _, new_label in updates:
            cur.execute('UPDATE "Variant" SET "sizeLabel" = %s WHERE sku = %s', (new_label, sku))
    conn.commit()
    conn.close()
    print(f"\n✓ Updated {len(updates)} variants.")


if __name__ == "__main__":
    main()
