import productService from '../services/productService.js';

/**
 * GET /api/products
 * Query params: search, colour, collection, style, manufacturer,
 *               material, isActive, page, limit
 */
export const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[productController] getProducts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

/**
 * GET /api/products/filters
 * Returns all available filter options (colours, collections, styles,
 * manufacturers, materials) for populating UI dropdowns.
 */
export const getFilterOptions = async (_req, res) => {
  try {
    const options = await productService.getFilterOptions();
    res.status(200).json({ success: true, data: options });
  } catch (error) {
    console.error('[productController] getFilterOptions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch filter options.' });
  }
};

/**
 * GET /api/products/:slug
 * Returns a single product with all relations.
 */
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('[productController] getProductBySlug:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};

export default { getProducts, getFilterOptions, getProductBySlug };
