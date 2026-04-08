import prisma from '../config/prisma.js';

/**
 * Build a Prisma `where` clause from query params.
 *
 * Supported params:
 *  search       – free-text: matches product name, slug, material,
 *                 variant colourName / sku, or any category value
 *  colour       – filter by colour category value  (comma-separated)
 *  collection   – filter by collection category value (comma-separated)
 *  style        – filter by style category value (comma-separated)
 *  manufacturer – filter by manufacturer name (comma-separated)
 *  material     – filter by product.material (comma-separated)
 *  isActive     – "true"/"false" – filter variants
 *  page         – page number (default 1)
 *  limit        – results per page (default 20, max 100)
 */

const buildWhere = (query) => {
  const { search, colour, collection, style, manufacturer, material } = query;

  const where = {};
  const AND = [];

  // ── Free-text search ────────────────────────────────────────────────────────
  if (search && search.trim()) {
    const q = search.trim();
    AND.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { material: { contains: q, mode: 'insensitive' } },
        {
          variants: {
            some: {
              OR: [
                { colourName: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
        },
        {
          categories: {
            some: {
              category: { value: { contains: q, mode: 'insensitive' } },
            },
          },
        },
        {
          manufacturers: {
            some: {
              manufacturer: { name: { contains: q, mode: 'insensitive' } },
            },
          },
        },
      ],
    });
  }

  // ── Category filters (colour / collection / style) ─────────────────────────
  const buildCategoryFilter = (type, rawValue) => {
    if (!rawValue) return null;
    const values = rawValue
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    if (!values.length) return null;
    return {
      categories: {
        some: {
          category: {
            type,
            value: { in: values, mode: 'insensitive' },
          },
        },
      },
    };
  };

  const colourFilter = buildCategoryFilter('colour', colour);
  const collectionFilter = buildCategoryFilter('collection', collection);
  const styleFilter = buildCategoryFilter('style', style);

  if (colourFilter) AND.push(colourFilter);
  if (collectionFilter) AND.push(collectionFilter);
  if (styleFilter) AND.push(styleFilter);

  // ── Manufacturer filter ─────────────────────────────────────────────────────
  if (manufacturer) {
    const names = manufacturer
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    if (names.length) {
      AND.push({
        manufacturers: {
          some: {
            manufacturer: {
              name: { in: names, mode: 'insensitive' },
            },
          },
        },
      });
    }
  }

  // ── Material filter ─────────────────────────────────────────────────────────
  if (material) {
    const materials = material
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    if (materials.length) {
      AND.push({ material: { in: materials, mode: 'insensitive' } });
    }
  }

  if (AND.length) where.AND = AND;
  return where;
};

// ── Main query ─────────────────────────────────────────────────────────────────

export const getProducts = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  const where = buildWhere(query);

  // Variant active filter (applied inside include, not at product level)
  const variantWhere =
    query.isActive !== undefined
      ? { isActive: query.isActive === 'true' }
      : undefined;

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        manufacturers: {
          include: { manufacturer: true },
        },
        categories: {
          include: { category: true },
        },
        variants: {
          where: variantWhere,
          orderBy: { colourName: 'asc' },
        },
      },
    }),
  ]);

  // Flatten for cleaner API response
  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    material: p.material,
    createdAt: p.createdAt,
    manufacturers: p.manufacturers.map((pm) => ({
      id: pm.manufacturer.id,
      name: pm.manufacturer.name,
      website: pm.manufacturer.website,
      country: pm.manufacturer.country,
    })),
    categories: p.categories.map((pc) => ({
      id: pc.category.id,
      type: pc.category.type,
      value: pc.category.value,
      hexCode: pc.category.hexCode,
    })),
    variants: p.variants,
  }));

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── Filter options (for populating sidebar dropdowns) ─────────────────────────

export const getFilterOptions = async () => {
  const [categories, manufacturers, materials] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ type: 'asc' }, { value: 'asc' }],
    }),
    prisma.manufacturer.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, country: true },
    }),
    prisma.product.findMany({
      where: { material: { not: null } },
      select: { material: true },
      distinct: ['material'],
      orderBy: { material: 'asc' },
    }),
  ]);

  const grouped = categories.reduce((acc, cat) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push({ id: cat.id, value: cat.value, hexCode: cat.hexCode });
    return acc;
  }, {});

  return {
    colours: grouped['colour'] || [],
    collections: grouped['collection'] || [],
    styles: grouped['style'] || [],
    manufacturers,
    materials: materials.map((p) => p.material).filter(Boolean),
  };
};

// ── Single product by slug ─────────────────────────────────────────────────────

export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      manufacturers: { include: { manufacturer: true } },
      categories: { include: { category: true } },
      variants: { orderBy: { colourName: 'asc' } },
    },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    material: product.material,
    createdAt: product.createdAt,
    manufacturers: product.manufacturers.map((pm) => pm.manufacturer),
    categories: product.categories.map((pc) => pc.category),
    variants: product.variants,
  };
};

export default { getProducts, getFilterOptions, getProductBySlug };
