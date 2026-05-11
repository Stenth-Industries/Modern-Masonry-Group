import os, json
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

with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    cur.execute("""
        SELECT p.name as product, c.type, c.value, c."standardColor"
        FROM "Product" p
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        JOIN "ProductCategory" pc ON pc."productId" = p.id
        JOIN "Category" c ON c.id = pc."categoryId"
        WHERE m.name = 'Brampton Brick' AND c.type = 'colour'
        ORDER BY p.name, c.value
    """)
    rows = cur.fetchall()
    print(f"Brampton colour links: {len(rows)}")
    for r in rows[:20]:
        print(f"  {r['product']:<25} {r['value']:<20} std={r['standardColor']}")

    # Also check what Categories exist for these colour values
    cur.execute("""
        SELECT value, "standardColor" FROM "Category"
        WHERE type = 'colour' AND value IN ('GREY','BLACK','BROWN','RED','CREAM','WHITE','BUFF','BURGUNDY','ORANGE')
        ORDER BY value
    """)
    cats = cur.fetchall()
    print(f"\nColour categories in DB:")
    for c in cats:
        print(f"  {c['value']:<20} std={c['standardColor']}")

conn.close()
