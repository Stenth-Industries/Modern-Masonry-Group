#!/usr/bin/env python3
"""
Normalise sizeLabel values in data/variant_dimensions.csv to a consistent format:
  {dim}" {H|L|D|T|Bed|W} × ...   keywords like Random, Fragmented kept as-is.

Rewrites the CSV in place. Run push_dimensions.py --confirm afterward to sync to DB.

Usage:
    python scripts/normalise_dimensions.py
"""

import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "variant_dimensions.csv"

sys.stdout.reconfigure(encoding='utf-8')

# Labels that are genuinely not dimension strings — leave untouched
NON_DIM = {
    'standard', 'modular', 'oversize', 'antique oversize',
    'modular, oversize', 'sawn',
}


def normalise(raw: str) -> str:
    if not raw:
        return raw

    # Skip non-dimension labels
    if raw.strip().lower() in NON_DIM:
        return raw

    # Work pipe-by-pipe (multi-size entries)
    parts = raw.split('|')
    return '|'.join(_fix(p.strip()) for p in parts)


def _fix(s: str) -> str:
    # Skip short/non-dimension fragments
    if not s or s.strip().lower() in NON_DIM:
        return s

    # 1. Unicode quotes → ASCII "
    s = s.replace('″', '"').replace('″', '"').replace('“', '"').replace('”', '"')

    # 2. Specific known typo: "3-/8" → "3-5/8"
    s = s.replace('3-/8', '3-5/8')

    # 3. Space after hyphen in fractions: "3- 5/8" → "3-5/8"
    s = re.sub(r'(\d)-\s+(\d)', r'\1-\2', s)

    # 4. Spaces in fractions (no hyphen): "2 1/4" → "2-1/4"
    #    Only when a whole number is directly followed by a space then fraction
    s = re.sub(r'(?<!\d)(\d{1,2}) (\d/\d{1,2})(?!\d)', r'\1-\2', s)

    # 5. Standalone " x " or " X " → " × "
    s = re.sub(r'\s+[xX]\s+', ' × ', s)

    # 6. Full word dimension labels → abbreviations (keep Bed, keep Random, Fragmented)
    s = re.sub(r'\bHeight\b', 'H', s)
    s = re.sub(r'\bLengths\b', 'L', s)
    s = re.sub(r'\bDepth\b', 'D', s)

    # 7. "Hx" typo → "H ×"
    s = re.sub(r'"\s*Hx\b', '" H ×', s)

    # 8. "RandomL" → "Random L"
    s = s.replace('RandomL', 'Random L')

    # 9. Remove stray "?" after a digit or after closing quote (before " insertion)
    s = re.sub(r'(\d)\?', r'\1', s)
    s = s.replace('"?', '"')

    # 10. Missing " before dimension label (H, L, D, T, Bed, W)
    #     e.g. "3-5/8 H" → '3-5/8" H',  "1-1/2 Bed" → '1-1/2" Bed'
    #     Only when not already preceded by "
    s = re.sub(r'(\d)\s+(H|L|D|T|W|Bed)\b', r'\1" \2', s)

    # 11. Sill format: letter immediately after closing quote → add space
    #     "5-1/2"W" → "5-1/2" W"
    s = re.sub(r'"(W|H|L|D|T)\b', r'" \1', s)

    # 12. "(+/-" → "(±"
    s = s.replace('(+/-', '(±')

    # 13. Add missing "H" label to bare leading dimension (no label after first ×)
    #     e.g. '2-1/4" × Random ...' → '2-1/4" H × Random ...'
    s = re.sub(r'^(\d[\d\-/]+" )×', r'\1H ×', s)

    # 14. Add missing "L" before × when length section ends with ) or "
    #     e.g. 'Random (up to 23-5/8") × 3-3/4"' → 'Random (up to 23-5/8") L × 3-3/4"'
    s = re.sub(r'([")]) ×(?! *[A-Z])', r'\1 L ×', s)

    # 14. Collapse multiple spaces
    s = re.sub(r'  +', ' ', s)

    return s.strip()


def main():
    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))

    changed = 0
    for row in rows:
        original = row['sizeLabel']
        fixed = normalise(original)
        if fixed != original:
            print(f"  [{row['collection']:30}] {row['colour_name']:25}")
            print(f"    was: {repr(original)}")
            print(f"    now: {repr(fixed)}")
            row['sizeLabel'] = fixed
            changed += 1

    if not changed:
        print("Nothing to normalise.")
        return

    print(f"\n{changed} rows updated — writing CSV.")

    fieldnames = ['manufacturer', 'sku', 'colour_name', 'collection', 'sizeLabel']
    with open(CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print("Done. Run: python scripts/push_dimensions.py --confirm")


if __name__ == '__main__':
    main()
