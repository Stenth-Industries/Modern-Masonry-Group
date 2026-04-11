import fs from 'fs/promises';
import prisma from './config/prisma.js';
import supabase from './config/supabase.js';

// IMPORTANT: Replace this with the actual name of your Supabase storage bucket
// Make sure this bucket is set to "Public" in the Supabase Dashboard
const BUCKET_NAME = 'stenth'; 

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
      console.log("iamge error------>",error)
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
  console.log('Reading kings.json...');
  const fileContent = await fs.readFile('./kings.json', 'utf-8');
  const data = JSON.parse(fileContent);

  console.log(`Found ${data.length} items. Starting import...`);

  for (const item of data) {
    console.log(`Processing item: ${item.name} (ID: ${item.id})`);
    
    // Process Manufacturers
    const manufacturerIds = [];
    const mfgList = item.allManufacturers?.length ? item.allManufacturers : (item.manufacturer ? [item.manufacturer] : []);
    
    for (const mfgName of mfgList) {
      if (!mfgName) continue;
      let mfg = await prisma.manufacturer.findFirst({ where: { name: mfgName } });
      if (!mfg) {
        mfg = await prisma.manufacturer.create({
          data: {
            name: mfgName,
            country: 'USA', // Generated random fit 
            description: `A premier manufacturer of ${mfgName} products.`, // Generated random fit
            website: `https://www.${mfgName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`, // Generated random fit
          }
        });
      }
      manufacturerIds.push(mfg.id);
    }

    // Process Categories (Colors, Collections, Styles)
    const categoryIds = [];
    
    const colors = item.allColors?.length ? item.allColors : (item.color ? [item.color] : []);
    for (const cName of colors) {
      if (!cName) continue;
      let category = await prisma.category.findUnique({ where: { type_value: { type: 'colour', value: cName } } });
      if (!category) {
        category = await prisma.category.create({ data: { type: 'colour', value: cName, hexCode: '#808080' } }); 
      }
      categoryIds.push(category.id);
    }

    if (item.collection) {
      let category = await prisma.category.findUnique({ where: { type_value: { type: 'collection', value: item.collection } } });
      if (!category) {
        category = await prisma.category.create({ data: { type: 'collection', value: item.collection } }); 
      }
      categoryIds.push(category.id);
    }

    if (item.attributes?.Texture) {
      let category = await prisma.category.findUnique({ where: { type_value: { type: 'style', value: item.attributes.Texture } } });
      if (!category) {
        category = await prisma.category.create({ data: { type: 'style', value: item.attributes.Texture } }); 
      }
      categoryIds.push(category.id);
    }

    // Process Product
    const slugBase = (item.name || 'product').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let slug = slugBase;
    let slugExists = await prisma.product.findUnique({ where: { slug } });
    let slugCounter = 1;
    while (slugExists) {
        slug = `${slugBase}-${slugCounter++}`;
        slugExists = await prisma.product.findUnique({ where: { slug } });
    }

    const product = await prisma.product.create({
      data: {
        name: item.name || 'Unknown Product',
        slug: slug,
        description: item.description || `Experience the quality of ${item.name}. Ideal for stunning architectural facades and robust exterior designs.`, // Added generated description
        material: "Brick", // Since catalogue contains typical brick textures
        manufacturers: {
          create: manufacturerIds.map(id => ({ manufacturerId: id }))
        },
        categories: {
          create: categoryIds.map(id => ({ categoryId: id }))
        }
      }
    });

    // Upload Image
    let uploadedImageUrl = null;
    if (item.image) {
      const parsedUrl = new URL(item.image);
      let filename = String(parsedUrl.pathname.split('/').pop() || 'image.png');
      // Append a timestamp to avoid overwriting existing pictures of the same name from different URLs
      let parts = filename.split('.');
      let ext = parts.pop();
      let nameWithoutExt = parts.join('-');
      let finalFileName = `${nameWithoutExt}-${Date.now()}.${ext}`;

      uploadedImageUrl = await downloadAndUploadImage(item.image, finalFileName);
    }

    if( item.images){
      uploadedImagesUrl = [];
      for(const image of item.images){
        const parsedUrl = new URL(image);
        let filename = String(parsedUrl.pathname.split('/').pop() || 'image.png');
        // Append a timestamp to avoid overwriting existing pictures of the same name from different URLs
        let parts = filename.split('.');
        let ext = parts.pop();
        let nameWithoutExt = parts.join('-');
        let finalFileName = `${nameWithoutExt}-${Date.now()}.${ext}`;

        uploadedImageUrl = await downloadAndUploadImage(image, finalFileName);
        uploadedImagesUrl.push(uploadedImageUrl);
      }
    }

    // Process Variant
    const sizeLabel = item.attributes?.Sizes || 'Standard';
    await prisma.variant.create({
      data: {
        productId: product.id,
        sku: `SKU-${slugBase.substring(0, 5).toUpperCase()}-${ran(1000, 9999)}`,
        colourName: item.color || "Standard",
        hexCode: "#000000",
        sizeLabel: sizeLabel,
        widthMm: ran(190, 230),  // Adding random realistic dimensions
        heightMm: ran(50, 75),
        depthMm: ran(90, 110),
        imageUrl: uploadedImageUrl,
        imagesUrl: uploadedImagesUrl,
        isActive: true
      }
    });

    console.log(` -> Created Product: ${product.name} (Slug: ${product.slug}) [Image: ${uploadedImageUrl ? 'Uploaded' : 'Failed/Missing'}]`);
  }

  console.log("Seeding and image backup successfully finished!");
}

main()
  .catch(e => {
    console.error("Fatal exception during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
