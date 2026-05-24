import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Find stone products where style categories include both Natural and Sawn
const stoneProducts = await prisma.product.findMany({
  where: { material: { equals: 'Stone', mode: 'insensitive' } },
  include: {
    variants: { select: { sku: true } },
    categories: { include: { category: true } },
  }
});

stoneProducts.forEach(p => {
  const styles = p.categories.filter(pc => pc.category.type === 'style').map(pc => pc.category.value);
  const skus = p.variants.map(v => v.sku);
  const hasSawnSku = skus.some(s => s?.includes('SAWN'));
  const hasSawnStyle = styles.includes('Sawn');
  const hasNaturalStyle = styles.includes('Natural');

  if (styles.length > 1 || (hasSawnSku && !hasSawnStyle)) {
    console.log(p.name, '| styles:', styles.join(', '), '| skus:', skus.join(', '));
  }
});

await prisma.$disconnect();
await pool.end();
