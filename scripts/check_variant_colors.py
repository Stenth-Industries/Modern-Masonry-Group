import os
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / "Backend" / ".env")
import psycopg2, psycopg2.extras
from collections import Counter

url = os.environ["DATABASE_URL"]
parsed = urlparse(url)
qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
conn = psycopg2.connect(urlunparse(clean))

with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
    cur.execute("""
        SELECT v."standardColor", m.name as mfg, COUNT(*) as cnt
        FROM "Variant" v
        JOIN "Product" p ON p.id = v."productId"
        JOIN "ProductManufacturer" pm ON pm."productId" = p.id
        JOIN "Manufacturer" m ON m.id = pm."manufacturerId"
        WHERE v."isActive" = true
        GROUP BY v."standardColor", m.name
        ORDER BY m.name, v."standardColor"
    """)
    rows = cur.fetchall()
    for r in rows:
        print(f"  {r['mfg']:<30} {str(r['standardColor']):<12} {r['cnt']}")

conn.close()
