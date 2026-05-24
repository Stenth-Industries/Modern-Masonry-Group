import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data", "brampton-stone.json");
const OUT_DIR = path.join(__dirname, "data", "stone-images");

function toHighResUrl(url) {
  // Swap Drupal thumbnail style for the full-size colour swatch style
  return url.replace("styles/product_model__pm_image__search", "styles/product_model__image__full");
}

async function downloadImage(url, dest) {
  const res = await fetch(toHighResUrl(url), {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; bot/1.0)" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const products = JSON.parse(raw);

  const all = [];
  for (const p of products) {
    for (const c of p.colours) {
      if (c.image) all.push({ sku: c.sku, url: c.image, series: p.series_name });
    }
  }

  console.log(`\nDownloading ${all.length} images to ${OUT_DIR}\n`);

  let ok = 0, fail = 0;
  for (const { sku, url, series } of all) {
    const ext = url.includes(".webp") ? ".webp" : ".jpg";
    const filename = `${sku.toLowerCase()}${ext}`;
    const dest = path.join(OUT_DIR, filename);
    try {
      await downloadImage(url, dest);
      console.log(`  ✓ ${series} / ${sku}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${sku}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone — ${ok} downloaded, ${fail} failed`);
  console.log(`Saved to: ${OUT_DIR}\n`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
