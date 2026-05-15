#!/usr/bin/env python3
"""
Export all variant sizeLabels to data/variant_dimensions.csv.
Run this to seed or refresh the CSV from the current DB.
Multi-line stone sizes are stored as pipe-separated values (|).

Usage:
    python scripts/export_dimensions.py
"""

import csv
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

CSV_PATH = ROOT / "data" / "variant_dimensions.csv"


def get_conn():
    parsed = urlparse(DATABASE_URL)
    netloc = parsed.netloc.replace(":5432", ":6543")
    clean = parsed._replace(netloc=netloc, query="")
    return psycopg2.connect(urlunparse(clean))


def main():
    conn = get_conn()
    sql = """
        SELECT
            m.name          AS manufacturer,
            v.sku,
            v."colourName"  AS colour_name,
            COALESCE(
                (SELECT c2.value FROM "ProductCategory" pc2
                 JOIN "Category" c2 ON c2.id = pc2."categoryId"
                 WHERE pc2."productId" = p.id AND c2.type = 'collection'
                 LIMIT 1),
                ''
            )               AS collection,
            v."sizeLabel"
        FROM "Variant" v
        JOIN "Product"             p  ON p.id  = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer"        m  ON m.id  = pm."manufacturerId"
        WHERE v."isActive" = true
        ORDER BY m.name, collection, v."colourName", v.sku
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql)
        rows = cur.fetchall()
    conn.close()

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["manufacturer", "sku", "colour_name", "collection", "sizeLabel"])
        for r in rows:
            label = (r["sizeLabel"] or "").replace("\n", "|")
            writer.writerow([r["manufacturer"], r["sku"], r["colour_name"], r["collection"], label])

    print(f"Exported {len(rows)} variants to {CSV_PATH}")


if __name__ == "__main__":
    main()
