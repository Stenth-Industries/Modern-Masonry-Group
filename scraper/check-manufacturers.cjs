const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });
const { PrismaClient } = require(path.join(__dirname, '../Backend/node_modules/@prisma/client'));
const { PrismaPg } = require(path.join(__dirname, '../Backend/node_modules/@prisma/adapter-pg'));
const { Pool } = require(path.join(__dirname, '../Backend/node_modules/pg'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const mfgs = await prisma.manufacturer.findMany({ orderBy: { name: 'asc' } });
  for (const m of mfgs) {
    const count = await prisma.variant.count({
      where: {
        isActive: true,
        product: { manufacturers: { some: { manufacturerId: m.id } } },
      },
    });
    console.log(`${m.name.padEnd(30)} active variants: ${count}`);
  }
}

main().finally(() => { prisma.$disconnect(); pool.end(); });
