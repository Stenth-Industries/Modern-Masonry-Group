import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, ".env") });

import { createClient } from "@supabase/supabase-js";
import prisma from "./config/prisma.js";

const BUCKET = "stenth-canada";
const IMG_DIR = path.join(__dirname, "data", "stone-images");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function main() {
  const files = await fs.readdir(IMG_DIR);
  const webpFiles = files.filter((f) => f.endsWith(".webp") || f.endsWith(".jpg"));
  console.log(`\nUploading ${webpFiles.length} images to Supabase bucket "${BUCKET}"\n`);

  let ok = 0, skipped = 0, fail = 0;

  for (const filename of webpFiles) {
    // filename like "bb-stone-art2-cha.webp" → SKU "BB-STONE-ART2-CHA"
    const sku = filename.replace(/\.(webp|jpg)$/, "").toUpperCase();

    const variant = await prisma.variant.findUnique({ where: { sku } });
    if (!variant) {
      console.log(`  – ${sku}: no variant in DB — skipping`);
      skipped++;
      continue;
    }

    const buf = await fs.readFile(path.join(IMG_DIR, filename));
    const storagePath = `bb-stone/${filename}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buf, { upsert: true, contentType: "image/webp" });

    if (error) {
      console.error(`  ✗ ${sku}: upload failed — ${error.message}`);
      fail++;
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    await prisma.variant.update({
      where: { sku },
      data: { imageUrl: data.publicUrl },
    });

    console.log(`  ✓ ${sku}`);
    ok++;
  }

  console.log(`\nDone — ${ok} uploaded, ${skipped} skipped (not in DB), ${fail} failed\n`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal:", err.message);
  await prisma.$disconnect();
  process.exit(1);
});
