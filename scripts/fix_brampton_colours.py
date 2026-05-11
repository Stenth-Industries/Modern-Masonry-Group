#!/usr/bin/env python3
"""
One-time fix: create colour Category rows + ProductCategory links for Brampton Brick,
and tag those categories with standardColor.
"""
import json
import os
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

from dotenv import load_dotenv
import psycopg2
import psycopg2.extras

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")

DATABASE_URL = os.environ["DATABASE_URL"]
parsed = urlparse(DATABASE_URL)
qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))

STANDARD_COLORS = ["Black", "Brown", "Buff", "Burgundy", "Cream",
                   "Grey", "Orange", "Pink", "Red", "White"]

conn = psycopg2.connect(urlunparse(clean))

data = json.loads((ROOT / "Backend" / "data" / "brampton_brick.json").read_text(encoding="utf-8", errors="replace"))

with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    cur.execute("""
        SELECT p.id, p.name
        FROM "Product" p
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE m.name = 'Brampton Brick'
    """)
    products = {r["name"]: r["id"] for r in cur.fetchall()}

print("Brampton products found:", list(products.keys()))

cats_created = 0
links_created = 0

with conn.cursor() as cur:
    for item in data:
        series = item.get("series_name", "")
        colour_class = item.get("features", {}).get("COLOUR CLASS", "")
        if not colour_class or series not in products:
            continue
        product_id = products[series]
        colours = [c.strip() for c in colour_class.split(",") if c.strip()]
        for colour in colours:
            cur.execute("""
                INSERT INTO "Category" (id, type, value, "hexCode")
                VALUES (gen_random_uuid(), 'colour', %s, '#808080')
                ON CONFLICT (type, value) DO NOTHING
            """, (colour,))
            if cur.rowcount:
                cats_created += 1
            cur.execute('SELECT id FROM "Category" WHERE type=%s AND value=%s', ("colour", colour))
            cat_id = cur.fetchone()[0]
            cur.execute("""
                INSERT INTO "ProductCategory" ("productId", "categoryId")
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
            """, (product_id, cat_id))
            if cur.rowcount:
                links_created += 1
    conn.commit()

print(f"Created {cats_created} colour categories, {links_created} ProductCategory links")

with conn.cursor() as cur:
    tagged = 0
    for std in STANDARD_COLORS:
        cur.execute("""
            UPDATE "Category"
               SET "standardColor" = %s
             WHERE type = 'colour' AND LOWER(value) = LOWER(%s)
        """, (std, std))
        tagged += cur.rowcount
    conn.commit()

print(f"Tagged {tagged} colour categories with standardColor")
conn.close()
print("Done.")
