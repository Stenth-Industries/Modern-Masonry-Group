import { getFilterOptions } from '../../Backend/services/productService.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  try {
    const options = await getFilterOptions();
    res.status(200).json({ success: true, data: options });
  } catch (error) {
    console.error('[api/products/filters] getFilterOptions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch filter options.' });
  }
}
