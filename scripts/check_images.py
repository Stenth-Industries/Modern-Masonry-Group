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

with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    cur.execute("""
        SELECT COUNT(*) as total,
               SUM(CASE WHEN v."imageUrl" IS NULL OR v."imageUrl" = '' THEN 1 ELSE 0 END) as no_image
        FROM "Variant" v
        JOIN "Product" p ON p.id = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE m.name = 'Brampton Brick' AND v."isActive" = true
    """)
    r = cur.fetchone()
    print(f"Brampton variants: total={r['total']}, no_image={r['no_image']}")

    # Sample with images
    cur.execute("""
        SELECT v."colourName", v."imageUrl"
        FROM "Variant" v
        JOIN "Product" p ON p.id = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE m.name = 'Brampton Brick' AND v."isActive" = true
          AND v."imageUrl" IS NOT NULL
        LIMIT 3
    """)
    rows = cur.fetchall()
    print(f"Sample with images:")
    for r in rows:
        print(f"  {r['colourName']}: {r['imageUrl'][:60] if r['imageUrl'] else None}")

conn.close()
