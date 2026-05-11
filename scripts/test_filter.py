import os
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / "Backend" / ".env")
import psycopg2, psycopg2.extras

url = os.environ["DATABASE_URL"]
parsed = urlparse(url)
qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
conn = psycopg2.connect(urlunparse(clean))

filter_value = "Grey"

with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    # Full count with no limit
    cur.execute("""
        SELECT COUNT(*) as total,
               SUM(CASE WHEN m.name = 'Brampton Brick' THEN 1 ELSE 0 END) as brampton
        FROM "Variant" v
        JOIN "Product" p ON p.id = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE v."isActive" = true
          AND (
            LOWER(v."colourName") = LOWER(%s)
            OR EXISTS (
              SELECT 1 FROM "ProductCategory" pc
              JOIN "Category" c ON c.id = pc."categoryId"
              WHERE pc."productId" = p.id
                AND c.type = 'colour'
                AND (LOWER(c.value) = LOWER(%s) OR LOWER(c."standardColor") = LOWER(%s))
            )
          )
    """, (filter_value, filter_value, filter_value))
    row = cur.fetchone()
    print(f"Total matching: {row['total']}  Brampton: {row['brampton']}")

    # Check a Brampton variant manually
    cur.execute("""
        SELECT v.id, v."colourName", v."isActive",
               EXISTS (
                 SELECT 1 FROM "ProductCategory" pc
                 JOIN "Category" c ON c.id = pc."categoryId"
                 WHERE pc."productId" = p.id
                   AND c.type = 'colour'
                   AND LOWER(c."standardColor") = 'grey'
               ) as has_grey_cat
        FROM "Variant" v
        JOIN "Product" p ON p.id = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE m.name = 'Brampton Brick'
        LIMIT 5
    """)
    print("\nSample Brampton variants:")
    for r in cur.fetchall():
        print(f"  {r['colourName']:<20} active={r['isActive']} has_grey_cat={r['has_grey_cat']}")

conn.close()
