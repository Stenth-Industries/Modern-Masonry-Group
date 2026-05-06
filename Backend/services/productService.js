import prisma from "../config/prisma.js";

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
  const { search, colour, collection, style, manufacturer, material, series } = query;

  const where = {};
  const AND = [];

  // Default to only active variants; allow explicit override via ?isActive=false
  const activeFilter = query.isActive !== undefined ? query.isActive === "true" : true;
  AND.push({ isActive: activeFilter });

  // ── Free-text search ────────────────────────────────────────────────────────
  if (search && search.trim()) {
    const q = search.trim();
    AND.push({
      OR: [
        { colourName: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        {
          product: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { material: { contains: q, mode: "insensitive" } },
              {
                categories: {
                  some: {
                    category: { value: { contains: q, mode: "insensitive" } },
                  },
                },
              },
              {
                manufacturers: {
                  some: {
                    manufacturer: {
                      name: { contains: q, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    });
  }

  // ── Category filters (collection / style) ─────────────────────────
  const buildProductCategoryFilter = (type, rawValue) => {
    if (!rawValue) return null;
    const values = rawValue
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (!values.length) return null;
    return {
      product: {
        categories: {
          some: {
            category: {
              type,
              value: { in: values, mode: "insensitive" },
            },
          },
        },
      },
    };
  };

  const collectionFilter = buildProductCategoryFilter("collection", collection);
  const styleFilter = buildProductCategoryFilter("style", style);
  const seriesFilter = buildProductCategoryFilter("series", series);

  if (collectionFilter) AND.push(collectionFilter);
  if (styleFilter) AND.push(styleFilter);
  if (seriesFilter) AND.push(seriesFilter);

  if (colour) {
    const values = colour
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length) {
      AND.push({
        OR: [
          { colourName: { in: values, mode: "insensitive" } },
          {
            product: {
              categories: {
                some: {
                  category: {
                    type: "colour",
                    value: { in: values, mode: "insensitive" },
                  },
                },
              },
            },
          },
        ],
      });
    }
  }

  // ── Manufacturer filter ─────────────────────────────────────────────────────
  if (manufacturer) {
    const names = manufacturer
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (names.length) {
      AND.push({
        product: {
          manufacturers: {
            some: {
              manufacturer: { name: { in: names, mode: "insensitive" } },
            },
          },
        },
      });
    }
  }

  // ── Material filter ─────────────────────────────────────────────────────────
  if (material) {
    const materials = material
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (materials.length) {
      AND.push({
        product: { material: { in: materials, mode: "insensitive" } },
      });
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

  const [total, variants] = await Promise.all([
    prisma.variant.count({ where }),
    prisma.variant.findMany({
      where,
      skip,
      take: limit,
      orderBy: { product: { name: "asc" } },
      include: {
        product: {
          include: {
            manufacturers: { include: { manufacturer: true } },
            categories: { include: { category: true } },
          },
        },
      },
    }),
  ]);

  // Flatten for cleaner API response, making Variants act like parent Products
  const data = variants.map((v) => ({
    id: v.id,
    name: `${v.product.name} - ${v.colourName || "Standard"}`,
    productTitle: v.product.name,
    colorName: v.colourName || "Standard",
    slug: v.product.slug,
    description: v.product.description,
    material: v.product.material,
    createdAt: v.createdAt,
    manufacturers: v.product.manufacturers.map((pm) => ({
      id: pm.manufacturer.id,
      name: pm.manufacturer.name,
      website: pm.manufacturer.website,
      country: pm.manufacturer.country,
    })),
    categories: v.product.categories.map((pc) => ({
      id: pc.category.id,
      type: pc.category.type,
      value: pc.category.value,
      hexCode: pc.category.hexCode,
    })),
    variants: [v], // Place the variant in an array so the frontend seamlessly reads v[0].imageUrl
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

export const getFilterOptions = async (query = {}) => {
  const { material } = query;
  const materialFilter = material
    ? { product: { material: { equals: material, mode: "insensitive" } } }
    : {};

  // Only return categories linked to at least one active variant
  const [categories, manufacturerRows, materials] = await Promise.all([
    prisma.category.findMany({
      where: {
        products: {
          some: {
            product: {
              variants: { some: { isActive: true } },
              ...(material ? { material: { equals: material, mode: "insensitive" } } : {}),
            },
          },
        },
      },
      orderBy: [{ type: "asc" }, { value: "asc" }],
    }),
    material
      ? prisma.$queryRaw`
          SELECT DISTINCT m.id, m.name, c.value as collection
          FROM "Manufacturer" m
          JOIN "ProductManufacturer" pm ON pm."manufacturerId" = m.id
          JOIN "Product" p ON p.id = pm."productId"
          JOIN "ProductCategory" pc ON pc."productId" = p.id
          JOIN "Category" c ON c.id = pc."categoryId" AND c.type = 'collection'
          JOIN "Variant" v ON v."productId" = p.id AND v."isActive" = true
          WHERE LOWER(p.material) = LOWER(${material})
          ORDER BY m.name, c.value
        `
      : prisma.$queryRaw`
          SELECT DISTINCT m.id, m.name, c.value as collection
          FROM "Manufacturer" m
          JOIN "ProductManufacturer" pm ON pm."manufacturerId" = m.id
          JOIN "Product" p ON p.id = pm."productId"
          JOIN "ProductCategory" pc ON pc."productId" = p.id
          JOIN "Category" c ON c.id = pc."categoryId" AND c.type = 'collection'
          JOIN "Variant" v ON v."productId" = p.id AND v."isActive" = true
          ORDER BY m.name, c.value
        `,
    prisma.product.findMany({
      where: {
        material: { not: null },
        variants: { some: { isActive: true } },
      },
      select: { material: true },
      distinct: ["material"],
      orderBy: { material: "asc" },
    }),
  ]);

  // Group collections under each manufacturer
  const mfgMap = {};
  for (const row of manufacturerRows) {
    if (!mfgMap[row.name]) mfgMap[row.name] = { id: row.id, name: row.name, collections: [] };
    mfgMap[row.name].collections.push(row.collection);
  }
  const manufacturersWithCollections = Object.values(mfgMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const grouped = categories.reduce((acc, cat) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push({ id: cat.id, value: cat.value, hexCode: cat.hexCode });
    return acc;
  }, {});

  return {
    colours: grouped["colour"] || [],
    styles: grouped["style"] || [],
    series: grouped["series"] || [],
    manufacturersWithCollections,
    materials: materials.map((p) => p.material).filter(Boolean),
  };
};

// ── Single product by slug ─────────────────────────────────────────────────────

export const getProductBySlug = async (slug) => {
  // First try by slug (normal case)
  let product = await prisma.product.findUnique({
    where: { slug },
    include: {
      manufacturers: { include: { manufacturer: true } },
      categories: { include: { category: true } },
      variants: { orderBy: { colourName: "asc" } },
    },
  });

  // Fallback: slug may actually be a variant UUID (from shared links)
  if (!product) {
    const variant = await prisma.variant.findUnique({
      where: { id: slug },
      include: {
        product: {
          include: {
            manufacturers: { include: { manufacturer: true } },
            categories: { include: { category: true } },
            variants: { orderBy: { colourName: "asc" } },
          },
        },
      },
    });
    if (variant) product = variant.product;
  }

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
