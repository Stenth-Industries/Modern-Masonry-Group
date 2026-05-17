#!/usr/bin/env python3
"""
Scrape dimension data from Arriscraft stone product pages using Firecrawl,
then push sizeLabel values into the Variant table.

Usage:
    python scripts/scrape_arriscraft_stone_dimensions.py           # scrape + preview
    python scripts/scrape_arriscraft_stone_dimensions.py --confirm # scrape + write to DB
    python scripts/scrape_arriscraft_stone_dimensions.py --from-cache --confirm
"""

import argparse
import json
import os
import re
import sys
import time
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "Backend" / ".env")
sys.stdout.reconfigure(encoding='utf-8')

import psycopg2
import psycopg2.extras
import requests

DATABASE_URL  = os.environ.get("DIRECT_URL") or os.environ.get("DATABASE_URL")
FIRECRAWL_KEY = os.environ.get("FIRECRAWL_API_KEY")
CACHE_PATH    = ROOT / "data" / "arriscraft_stone_dimensions_cache.json"

if not DATABASE_URL:
    sys.exit("ERROR: DATABASE_URL not found in Backend/.env")
if not FIRECRAWL_KEY:
    sys.exit("ERROR: FIRECRAWL_API_KEY not found in Backend/.env")

FIRECRAWL_URL = "https://api.firecrawl.dev/v1/scrape"


# ── Collection scrape strategy ─────────────────────────────────────────────────
# (mode, url_or_None, onlyMainContent)
# Modes:
#   'landing'  - scrape the fixed URL, parse PRODUCT CODE/DIMENSIONS section
#   'product'  - build URL from {slug.removeprefix("arriscraft-")}, parse Available Sizes
#   'edgerock' - build URL as /arriscraft-edge-rock/{colour}/, parse Available Sizes
#   'single'   - scrape fixed URL, parse Available Sizes
#   'sills'    - colour-to-URL mapping (handled separately)
#   'skip'     - no standard dimensions

COLLECTION_CONFIG = {
    'Arris Clip':   ('landing', 'https://arriscraft.com/product-landing-page-arris-clip/', True),
    'Arris Tile':   ('landing', 'https://arriscraft.com/product-landing-page-arris-tile/', True),
    'Stack':        ('landing', 'https://arriscraft.com/product-landing-page-stack/', True),
    'Coastal':      ('landing', 'https://arriscraft.com/product-landing-page-coastal-thin-building-stone/', True),
    'Fresco':                   ('product', None, False),
    'Evolution':                ('product', None, False),
    'Georgia Renaissance':      ('product', None, False),
    'Cambridge Renaissance':    ('product', None, False),
    'Laurier':                  ('product', None, False),
    'Matterhorn':               ('product', None, False),
    'Georgia Citadel':          ('product', None, False),
    'Urban Ledgestone':         ('product', None, False),
    'Shadow Stone':             ('product', None, False),
    'Highfalls Ledgestone':     ('product', None, False),
    'Old Country':              ('product', None, False),
    'Adair Limestone':          ('product', None, False),
    'Adair Masonry Units':      ('product', None, False),
    'Edge Rock':                ('edgerock', None, True),
    'Adair Parliament':         ('single', 'https://arriscraft.com/products/adair-parliament/', False),
    'Sills':                    ('sills',  None, False),
    'Adair Anchored Dimension Stone': ('skip', None, False),
    'Arris Cast':               ('skip', None, False),
}

# Sills: DB colourName → URL
SILLS_URLS = {
    'Gray':  'https://arriscraft.com/products/gray-rocked-georgia-sill/',
    'Brown': 'https://arriscraft.com/products/brown-rocked-georgia-sill/',
    'Tan':   'https://arriscraft.com/products/tan-rocked-georgia-sill/',
    'White': 'https://arriscraft.com/products/white-rocked-georgia-sill/',
}


# ── Firecrawl ──────────────────────────────────────────────────────────────────

def scrape_page(url: str, only_main: bool) -> str | None:
    payload  = {"url": url, "formats": ["markdown"], "onlyMainContent": only_main}
    headers  = {"Authorization": f"Bearer {FIRECRAWL_KEY}", "Content-Type": "application/json"}
    try:
        r = requests.post(FIRECRAWL_URL, headers=headers, json=payload, timeout=30)
        if r.status_code == 200:
            return r.json().get("data", {}).get("markdown", "") or ""
        print(f"    WARN: HTTP {r.status_code} for {url}")
        return None
    except Exception as e:
        print(f"    WARN: {e}")
        return None


# ── Dimension parsing ──────────────────────────────────────────────────────────

def parse_available_sizes(md: str) -> str | None:
    """Parse '## Available Sizes' section from a product page."""
    if 'Available Sizes' not in md:
        return None
    idx = md.find('Available Sizes')
    section = md[idx:idx+1000]
    # Extract bullet lines: • Size N: CODE: dim string
    bullets = re.findall(r'[•·]\s*Size\s*\d+\s*:?\s*([^\n]+)', section)
    if not bullets:
        return None
    dims = []
    for b in bullets:
        b = b.strip()
        # Strip product code prefix like "CIT/FRE23:" or "ELN35:" or "METRIC REN09:" or "IMPERIAL REN758:"
        # Remove "METRIC X:" and "IMPERIAL X:" prefixes (keep the inch values in brackets)
        metric_match = re.match(r'METRIC\s+\S+:\s+\d+\s*mm\s*x\s*\d+\s*mm\s*x\s*\d+\s*mm\s*\(([^)]+)\)', b, re.IGNORECASE)
        if metric_match:
            b = metric_match.group(1).strip()  # use the inch values
        else:
            imperial_match = re.match(r'IMPERIAL\s+\S+:\s*(.*)', b, re.IGNORECASE)
            if imperial_match:
                b = imperial_match.group(1).strip()
            else:
                # Strip leading code like "RS358 CLIP:" or "CIT/FRE23:" or "GC22:"
                b = re.sub(r'^[A-Z0-9/ ]+(?:CLIP|TILE|Return)?:\s*', '', b, flags=re.IGNORECASE).strip()
        # Normalise
        b = normalise_quotes(b)
        b = re.sub(r'\s+x\s+', ' × ', b)
        b = re.sub(r'\s{2,}', ' ', b).strip()
        if b:
            dims.append(b)
    return '\n'.join(dims) if dims else None


def parse_landing_dims(md: str) -> str | None:
    """Parse 'PRODUCT CODE/DIMENSIONS' section from a collection landing page."""
    if 'PRODUCT CODE' not in md:
        return None
    idx = md.find('PRODUCT CODE')
    section = md[idx:idx+1500]
    # Lines like: RS358 CLIP: 3-5/8" H x 23-5/8" L x 1-3/8" T
    lines = re.findall(r'[A-Z0-9/][\w/]{1,15}(?:\s+(?:CLIP|TILE|Return|STA|COA))?\s*:\s*([^\n]+)', section)
    dims = []
    seen = set()
    for line in lines:
        dim = line.strip()
        # Skip Return/corner variants
        if 'Return' in dim or 'return' in dim:
            continue
        dim = normalise_quotes(dim)
        dim = re.sub(r'\s+x\s+', ' × ', dim)
        dim = re.sub(r'\s{2,}', ' ', dim).strip()
        if dim and dim not in seen:
            seen.add(dim)
            dims.append(dim)
    return '\n'.join(dims) if dims else None


def normalise_quotes(s: str) -> str:
    """Normalise all unicode quote variants to ASCII double quote."""
    return (s.replace('″', '"')   # double prime ″
             .replace('“', '"')   # left double quotation mark "
             .replace('”', '"')   # right double quotation mark "
             .replace('’', "'")   # right single quotation mark '
             .replace('″', '"'))


def parse_sill_dim(md: str) -> str | None:
    """Parse sill dimension: 5-1/2"W x 3-1/8"H x 23-5/8"L"""
    if 'Available Sizes' not in md:
        return None
    idx = md.find('Available Sizes')
    section = normalise_quotes(md[idx:idx+400])
    # Match: GS315 Gray Rocked 5-1/2"W x 3-1/8"H x 23-5/8"L
    m = re.search(r'([\d\-/]+"W\s*[×x]\s*[\d\-/]+"H\s*[×x]\s*[\d\-/]+"L)', section)
    if m:
        dim = re.sub(r'\s*x\s*', ' × ', m.group(1))
        return dim.strip()
    # Cambridge sill: 6" W x 3-1/16" H x 31-5/8" L  (space before W/H/L)
    m2 = re.search(r'([\d\-/]+"\s*W\s*[×x]\s*[\d\-/]+"\s*H\s*[×x]\s*[\d\-/]+"\s*L)', section)
    if m2:
        dim = re.sub(r'\s*x\s*', ' × ', m2.group(1))
        return dim.strip()
    return None


def get_dim(md: str, mode: str) -> str | None:
    if mode == 'landing':
        return parse_landing_dims(md)
    elif mode in ('product', 'edgerock', 'single', 'sills'):
        return parse_available_sizes(md) or parse_sill_dim(md)
    return None


# ── DB helpers ─────────────────────────────────────────────────────────────────

def get_conn():
    parsed = urlparse(DATABASE_URL)
    qs = {k: v for k, v in parse_qs(parsed.query).items() if k != "pgbouncer"}
    clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
    return psycopg2.connect(urlunparse(clean))


def fetch_missing_stone_variants(conn) -> list[dict]:
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
          AND p.material NOT ILIKE '%brick%'
        ORDER BY v.id
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql)
        return [dict(r) for r in cur.fetchall()]


# ── Build URL for each variant ─────────────────────────────────────────────────

def build_url(variant: dict, cfg: tuple) -> str | None:
    mode, fixed_url, only_main = cfg
    if mode in ('landing', 'single'):
        return fixed_url
    if mode == 'product':
        slug_path = variant['slug'].removeprefix('arriscraft-')
        return f"https://arriscraft.com/products/{slug_path}/"
    if mode == 'edgerock':
        # slug: arriscraft-{colour}-edge-rock → extract colour
        m = re.match(r'arriscraft-(.+)-edge-rock$', variant['slug'])
        colour = m.group(1) if m else variant['colourName'].lower().replace(' ', '-')
        return f"https://arriscraft.com/arriscraft-edge-rock/{colour}/"
    if mode == 'sills':
        return SILLS_URLS.get(variant['colourName'])
    return None


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--confirm",    action="store_true")
    parser.add_argument("--from-cache", action="store_true")
    args = parser.parse_args()

    conn = get_conn()
    variants = fetch_missing_stone_variants(conn)
    print(f"Found {len(variants)} Arriscraft stone variants missing dimensions\n")

    # Group by collection
    by_collection = defaultdict(list)
    for v in variants:
        by_collection[v['collection'] or 'NULL'].append(v)

    # ── Scrape or load from cache ──────────────────────────────────────────────
    if args.from_cache and CACHE_PATH.exists():
        with open(CACHE_PATH, encoding='utf-8') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} results from cache\n")
    else:
        cache = {}  # url → dim_string

        for coll, coll_variants in sorted(by_collection.items()):
            cfg = COLLECTION_CONFIG.get(coll)
            if not cfg:
                print(f"WARN: No config for collection '{coll}' — skipping")
                continue

            mode, fixed_url, only_main = cfg
            if mode == 'skip':
                print(f"[SKIP] {coll} — no standard dimensions")
                continue

            # Decide which URLs to scrape for this collection
            if mode in ('landing', 'single'):
                # Same URL for all variants — scrape once
                url = fixed_url
                if url not in cache:
                    print(f"[{coll}] {url} ... ", end='', flush=True)
                    md = scrape_page(url, only_main)
                    dim = get_dim(md, mode) if md else None
                    cache[url] = dim
                    print(dim[:80] if dim else 'NO DIM')
                    time.sleep(0.3)
                # All variants get same dim
                for v in coll_variants:
                    v['_cache_key'] = url

            elif mode in ('product', 'edgerock'):
                # Scrape ONE representative per collection; key by collection name
                coll_key = f"collection:{coll}"
                if coll_key not in cache:
                    rep_url = build_url(coll_variants[0], cfg)
                    print(f"[{coll}] {rep_url} ... ", end='', flush=True)
                    md = scrape_page(rep_url, only_main)
                    dim = get_dim(md, mode) if md else None
                    cache[coll_key] = dim
                    print(dim[:80] if dim else 'NO DIM')
                    time.sleep(0.3)
                for v in coll_variants:
                    v['_cache_key'] = coll_key

            elif mode == 'sills':
                for v in coll_variants:
                    url = SILLS_URLS.get(v['colourName'])
                    if not url:
                        print(f"  WARN: no URL for sill colour '{v['colourName']}'")
                        v['_cache_key'] = None
                        continue
                    if url not in cache:
                        print(f"[Sills/{v['colourName']}] {url} ... ", end='', flush=True)
                        md = scrape_page(url, only_main)
                        dim = parse_sill_dim(md) if md else None
                        cache[url] = dim
                        print(dim or 'NO DIM')
                        time.sleep(0.3)
                    v['_cache_key'] = url

        # Save cache
        CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)
        print(f"\nResults cached to {CACHE_PATH}\n")

    # ── Build update list ──────────────────────────────────────────────────────
    updates, skipped = [], []
    for coll, coll_variants in sorted(by_collection.items()):
        cfg = COLLECTION_CONFIG.get(coll)
        mode = cfg[0] if cfg else 'unknown'
        for v in coll_variants:
            if mode == 'skip' or not cfg:
                skipped.append((v, 'no standard dims'))
                continue
            cache_key = v.get('_cache_key')
            if not cache_key:
                # For from-cache runs, rebuild the cache key
                if mode in ('landing', 'single'):
                    cache_key = cfg[1]
                elif mode in ('product', 'edgerock'):
                    cache_key = f"collection:{coll}"
                elif mode == 'sills':
                    cache_key = SILLS_URLS.get(v['colourName'])
            dim = cache.get(cache_key) if cache_key else None
            if dim:
                updates.append((v, dim))
            else:
                skipped.append((v, f"no dim (mode={mode})"))

    print(f"{'DRY RUN — ' if not args.confirm else ''}Updates: {len(updates)} | No dim: {len(skipped)}\n")
    print("── UPDATES ──────────────────────────────────────────────────────────")
    for v, dim in updates:
        first_line = dim.split('\n')[0]
        print(f"  [{(v['collection'] or '')[:35]:35}] {v['colourName']:30} → {first_line[:60]}")

    if skipped:
        print(f"\n── SKIPPED ──────────────────────────────────────────────────────")
        for v, reason in skipped:
            print(f"  [{(v['collection'] or '')[:35]:35}] {v['colourName']:30} — {reason}")

    if not args.confirm:
        print("\nAdd --confirm to write to DB.")
        conn.close()
        return

    with conn.cursor() as cur:
        for v, dim in updates:
            cur.execute(
                """
                UPDATE "Variant"
                   SET "sizeLabel" = %s
                 WHERE id = %s
                """,
                (dim, v["id"])
            )
    conn.commit()
    conn.close()
    print(f"\n✓ Updated {len(updates)} Arriscraft stone variants in the DB.")


if __name__ == "__main__":
    main()
