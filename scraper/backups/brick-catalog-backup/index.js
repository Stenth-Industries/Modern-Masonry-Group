import { getProducts } from '../../Backend/services/productService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  try {
    const result = await getProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[api/products] getProducts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
}
