import prisma from './config/prisma.js';

const colors = await prisma.category.findMany({
  where: { type: 'colour' },
  orderBy: { value: 'asc' },
  select: { id: true, value: true, hexCode: true },
});

for (const c of colors) {
  console.log(`${c.hexCode || 'NO HEX'} | ${c.value}`);
}

await prisma.$disconnect();
