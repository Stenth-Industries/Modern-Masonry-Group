import { getProductBySlug } from '../../Backend/services/productService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { slug } = req.query;
  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('[api/products/[slug]] getProductBySlug:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
}
