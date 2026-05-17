#!/usr/bin/env python3
"""
Scrape dimension data from Arriscraft product pages using Firecrawl,
then push sizeLabel + mm values into the Variant table.

Usage:
    python scripts/scrape_arriscraft_dimensions.py           # scrape + preview
    python scripts/scrape_arriscraft_dimensions.py --confirm # scrape + write to DB
    python scripts/scrape_arriscraft_dimensions.py --from-cache --confirm  # reuse last scrape
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")
sys.stdout.reconfigure(encoding='utf-8')

import psycopg2
import psycopg2.extras
import requests

DATABASE_URL   = os.environ.get("DIRECT_URL") or os.environ.get("DATABASE_URL")
FIRECRAWL_KEY  = os.environ.get("FIRECRAWL_API_KEY")
CACHE_PATH     = ROOT / "data" / "arriscraft_dimensions_cache.json"

if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not found in Backend/.env")
if not FIRECRAWL_KEY:
    sys.exit("ERROR: FIRECRAWL_API_KEY not found in Backend/.env")

FIRECRAWL_URL  = "https://api.firecrawl.dev/v1/scrape"
ARRISCRAFT_BASE = "https://arriscraft.com/products/"

# ── Inch → mm lookup for common brick fractions ────────────────────────────────
INCH_TO_MM = {
    "2-1/4": 57, "2 1/4": 57,
    "3-1/8": 79, "3 1/8": 79,
    "3-1/2": 89, "3 1/2": 89,
    "3-3/4": 95, "3 3/4": 95,
    "10-1/8": 257, "10 1/8": 257,
    "11-1/2": 292, "11 1/2": 292,
}

def inch_str_to_mm(s: str) -> int | None:
    s = s.strip()
    return INCH_TO_MM.get(s) or INCH_TO_MM.get(s.replace("-", " "))


# ── Dimension parsing ──────────────────────────────────────────────────────────

def parse_arriscraft_dim(content: str) -> str | None:
    """
    Extract the first dimension line from Firecrawl markdown.
    Looks for patterns like:
      • CON31: 3-1/8″ H x Random L x 3-1/2″ D
      • LS22: 2-1/4″ x Random (up to 23-5/8″) L x 3-3/4″ D
    Returns normalised sizeLabel or None.
    """
    # Match product code followed by dimension string
    pattern = re.compile(
        r'[A-Z0-9/]{3,12}:\s*'          # product code like CON31:
        r'([\d\s\-/″"]+(?:H|h)?\s*x\s*'  # height part
        r'.+?(?:D|d)\b[^\n•]*)',          # rest up to D
        re.MULTILINE
    )
    for m in pattern.finditer(content):
        raw = m.group(1).strip()
        return normalise_dim(raw)
    return None


def normalise_dim(raw: str) -> str:
    """
    Normalise raw Arriscraft dim string to: H × L × D format.
    e.g. '3-1/8″ H x Random L x 3-1/2″ D' → '3-1/8" H × Random L × 3-1/2" D'
    """
    s = raw
    s = s.replace("″", '"').replace("″", '"')  # double prime → regular quote
    s = re.sub(r'\s+x\s+', ' × ', s)               # ' x ' → ' × '
    s = s.strip().rstrip('.')
    return s


def dim_to_mm(dim: str) -> tuple[int | None, int | None, int | None]:
    """Extract heightMm, widthMm, depthMm from a normalised dim string."""
    # Height: first number before H
    h_match = re.search(r'([\d][\d\s\-/]+)"?\s*H', dim)
    # Length: number before L (skip Random)
    l_match = re.search(r'([\d][\d\s\-/]+)"?\s*L', dim)
    # Depth: number before D
    d_match = re.search(r'([\d][\d\s\-/]+)"?\s*(?:×\s*)?([\d][\d\s\-/]+)"?\s*D', dim)
    d_direct = re.search(r'([\d][\d\s\-/]+)"?\s*D', dim)

    h_mm = inch_str_to_mm(h_match.group(1).strip()) if h_match else None
    l_mm = inch_str_to_mm(l_match.group(1).strip()) if l_match else None
    d_mm = inch_str_to_mm(d_direct.group(1).strip()) if d_direct else None

    return h_mm, l_mm, d_mm


# ── DB helpers ─────────────────────────────────────────────────────────────────

def get_conn():
    parsed = urlparse(DATABASE_URL)
    qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
    clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
    return psycopg2.connect(urlunparse(clean))


def fetch_missing_arriscraft(conn) -> list[dict]:
    sql = """
        SELECT DISTINCT ON (v.id)
            v.id, v.sku, v."colourName", v."sizeLabel", p.slug,
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
        WHERE LOWER(m.name) LIKE '%arriscraft%'
          AND v."isActive" = true
          AND (v."sizeLabel" IS NULL OR v."sizeLabel" = 'Standard')
          AND p.material ILIKE '%brick%'
        ORDER BY v.id
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql)
        return [dict(r) for r in cur.fetchall()]


# ── Firecrawl scraper ──────────────────────────────────────────────────────────

def scrape_page(slug: str) -> str | None:
    """Scrape an Arriscraft product page via Firecrawl. Returns markdown or None."""
    url = ARRISCRAFT_BASE + slug.removeprefix("arriscraft-") + "/"
    payload = {"url": url, "formats": ["markdown"], "onlyMainContent": True}
    headers = {"Authorization": f"Bearer {FIRECRAWL_KEY}", "Content-Type": "application/json"}
    try:
        r = requests.post(FIRECRAWL_URL, headers=headers, json=payload, timeout=30)
        if r.status_code == 200:
            return r.json().get("data", {}).get("markdown", "")
        print(f"    WARN: HTTP {r.status_code} for {url}")
        return None
    except Exception as e:
        print(f"    WARN: {e}")
        return None


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--confirm",    action="store_true", help="Write to DB")
    parser.add_argument("--from-cache", action="store_true", help="Skip scraping, use cached results")
    args = parser.parse_args()

    conn = get_conn()
    variants = fetch_missing_arriscraft(conn)
    print(f"Found {len(variants)} Arriscraft brick variants missing dimensions\n")

    # ── Scrape or load from cache ──────────────────────────────────────────────
    if args.from_cache and CACHE_PATH.exists():
        with open(CACHE_PATH, encoding="utf-8") as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} results from cache\n")
    else:
        cache = {}
        seen_slugs = set()
        total = len(variants)
        for i, v in enumerate(variants, 1):
            slug = v["slug"]
            if slug in seen_slugs:
                print(f"[{i}/{total}] {v['colourName']:30} — reusing scraped slug")
                continue
            seen_slugs.add(slug)
            print(f"[{i}/{total}] {v['colourName']:30} ({slug})", end=" ... ", flush=True)
            content = scrape_page(slug)
            if content:
                dim = parse_arriscraft_dim(content)
                cache[slug] = dim
                print(dim or "NO DIM FOUND")
            else:
                cache[slug] = None
                print("FAILED")
            time.sleep(0.3)  # gentle rate limiting

        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)
        print(f"\nResults cached to {CACHE_PATH}\n")

    # ── Build update list ──────────────────────────────────────────────────────
    updates, skipped = [], []
    for v in variants:
        dim = cache.get(v["slug"])
        if dim:
            h_mm, l_mm, d_mm = dim_to_mm(dim)
            updates.append((v, dim, h_mm, l_mm, d_mm))
        else:
            skipped.append(v)

    print(f"{'DRY RUN — ' if not args.confirm else ''}Updates: {len(updates)} | No dim found: {len(skipped)}\n")
    print("── UPDATES ──────────────────────────────────────────────────────────")
    for v, dim, h, l, d in updates:
        print(f"  [{v['collection']:35}] {v['colourName']:30} → {dim}")

    if skipped:
        print(f"\n── NO DIM FOUND (skipped) ────────────────────────────────────────")
        for v in skipped:
            print(f"  [{v['collection']:35}] {v['colourName']}")

    if not args.confirm:
        print("\nAdd --confirm to write to DB.")
        conn.close()
        return

    with conn.cursor() as cur:
        for v, dim, h_mm, l_mm, d_mm in updates:
            cur.execute(
                """
                UPDATE "Variant"
                   SET "sizeLabel" = %s,
                       "heightMm"  = %s,
                       "widthMm"   = %s,
                       "depthMm"   = %s
                 WHERE id = %s
                """,
                (dim, h_mm, l_mm, d_mm, v["id"])
            )
    conn.commit()
    conn.close()
    print(f"\n✓ Updated {len(updates)} Arriscraft variants in the DB.")


if __name__ == "__main__":
    main()
