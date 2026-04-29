import fs from "fs/promises";
import prisma from "./config/prisma.js";
import supabase from "./config/supabase.js";

const BUCKET_NAME = "stenth-canada"; // Verify this matches your Supabase bucket

const ran = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

async function downloadAndUploadImage(url, filename) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    
    const arrayBuffer = await res.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, arrayBuffer, {
        upsert: true,
        contentType: res.headers.get('content-type') || 'image/jpeg'
      });

    if (error) {
      console.log("image error------>", error);
      console.error(`Error uploading ${filename} to Supabase:`, error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);
      
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error(`Failed to handle image ${url}:`, err.message);
    return null; 
  }
}

async function main() {
  console.log("Reading brampton_brick.json and kings.json...");
  const fileContent = await fs.readFile("./data/brampton_brick.json", "utf-8");
  const data = JSON.parse(fileContent);
  const kingsContent = await fs.readFile("./kings.json", "utf-8");
  const kingsData = JSON.parse(kingsContent);

  console.log(`Found ${data.length} items. Starting import...`);

  // 1. Ensure Manufacturer exists
  let mfg = await prisma.manufacturer.findFirst({
    where: { name: "Brampton Brick" },
  });
  if (!mfg) {
    mfg = await prisma.manufacturer.create({
      data: {
        name: "Brampton Brick",
        country: "Canada",
        description: "Manufacturer of quality masonry products.",
        website: "https://www.bramptonbrick.com",
      },
    });
  }

  for (const item of data) {
    console.log(
      `\nProcessing Variant: ${item.variant} (Series: ${item.series_name})`,
    );

    // Group Product by series_name (e.g., "Dorset")
    const productName = item.series_name || "Brampton Brick Product";
    const productSlugBase = productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    let product = await prisma.product.findUnique({
      where: { slug: productSlugBase },
    });

    // If Product does not exist, build new Categories and Product
    if (!product) {
      // Create product Categories based on features
      const categoryIds = [];

      // Collection Category
      if (item.series_name) {
        let cat = await prisma.category.findUnique({
          where: {
            type_value: { type: "collection", value: item.series_name },
          },
        });
        if (!cat) {
          cat = await prisma.category.create({
            data: { type: "collection", value: item.series_name },
          });
        }
        categoryIds.push(cat.id);
      }

      // Style Category
      const style = item.features?.STYLE;
      if (style) {
        let cat = await prisma.category.findUnique({
          where: { type_value: { type: "style", value: style } },
        });
        if (!cat) {
          cat = await prisma.category.create({
            data: { type: "style", value: style },
          });
        }
        categoryIds.push(cat.id);
      }

      product = await prisma.product.create({
        data: {
          name: productName,
          slug: productSlugBase,
          description: `Brampton Brick ${productName} collection. Recommended for: ${item.features?.["RECOMMENDED USE"] || "General masonry"}.`,
          material: item.features?.MATERIAL || "Brick",
          manufacturers: {
            create: [{ manufacturerId: mfg.id }],
          },
          categories: {
            create: categoryIds.map((id) => ({ categoryId: id })),
          },
        },
      });
      console.log(` -> Created Product: ${product.name}`);
    }

    // Prepare Colors for Variant
    const colours = item.features?.["COLOUR CLASS"]
      ? item.features["COLOUR CLASS"].split(",").map((c) => c.trim())
      : [];

    // Ensure color categories exist on the product level
    for (const color of colours) {
      let colorCat = await prisma.category.findUnique({
        where: { type_value: { type: "colour", value: color } },
      });
      if (!colorCat) {
        colorCat = await prisma.category.create({
          data: { type: "colour", value: color, hexCode: "#808080" },
        });
      }

      const existingProductCat = await prisma.productCategory.findUnique({
        where: {
          productId_categoryId: {
            productId: product.id,
            categoryId: colorCat.id,
          },
        },
      });

      if (!existingProductCat) {
        await prisma.productCategory.create({
          data: { productId: product.id, categoryId: colorCat.id },
        });
      }
    }

    // Upload Image
    let uploadedImageUrl = null;
    
    // Find matching image in kings.json
    const kingsMatch = kingsData.find(k => 
      k.name.toLowerCase().includes(item.variant.toLowerCase()) || 
      item.variant.toLowerCase().includes(k.name.toLowerCase())
    );

    if (kingsMatch && kingsMatch.image) {
      const parsedUrl = new URL(kingsMatch.image);
      let filename = String(parsedUrl.pathname.split('/').pop() || 'image.png');
      let parts = filename.split('.');
      let ext = parts.pop();
      let nameWithoutExt = parts.join('-');
      let finalFileName = `kings-${nameWithoutExt}-${Date.now()}.${ext}`;

      uploadedImageUrl = await downloadAndUploadImage(kingsMatch.image, finalFileName);
    } else {
      console.log(`No image match found in kings.json for variant: ${item.variant}`);
    }

    // Store secondary images using their original URLs (no download to our storage)
    let uploadedImagesUrl = [];
    if (item.house_images && Array.isArray(item.house_images)) {
      uploadedImagesUrl = item.house_images;
    }

    // Parse dimensions
    let widthMm = null,
      heightMm = null,
      depthMm = null;
    if (item.dimensions) {
      const wMatch = item.dimensions.match(/LENGTH\s+(\d+(?:\.\d+)?)\s*MM/i);
      if (wMatch) widthMm = parseFloat(wMatch[1]);

      const hMatch = item.dimensions.match(/HEIGHT\s+(\d+(?:\.\d+)?)\s*MM/i);
      if (hMatch) heightMm = parseFloat(hMatch[1]);

      const dMatch = item.dimensions.match(/DEPTH\s+(\d+(?:\.\d+)?)\s*MM/i);
      if (dMatch) depthMm = parseFloat(dMatch[1]);
    }

    // Create the Variant
    let variantSku =
      `SKU-${productSlugBase.substring(0, 3)}-${item.variant.substring(0, 3)}-${ran(1000, 9999)}`.toUpperCase();

    await prisma.variant.create({
      data: {
        productId: product.id,
        sku: variantSku,
        colourName: item.variant,
        hexCode: "#000000",
        sizeLabel: "Standard",
        widthMm,
        heightMm,
        depthMm,
        imageUrl: uploadedImageUrl,
        imagesUrl: uploadedImagesUrl,
        stock: item.stock || "In Stock",
        isActive: true,
      },
    });

    console.log(
      ` -> Created Variant: ${item.variant} (SKU: ${variantSku}) [Image: ${uploadedImageUrl ? "Uploaded" : "Failed/Missing"}]`,
    );
  }

  console.log("Seeding and image backup successfully finished!");
}

main()
  .catch((e) => {
    console.error("Fatal exception during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
