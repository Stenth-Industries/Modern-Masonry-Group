import prisma from '../../Backend/config/prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  try {
    const { fullName, email, company, quantity, details, productId, isGeneral } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Full name and email are required' });
    }

    const newQuote = await prisma.quote.create({
      data: {
        fullName,
        email,
        company,
        quantity,
        details,
        productId: productId || null,
        isGeneral: isGeneral || false,
      },
    });

    res.status(201).json({ success: true, data: newQuote, message: 'Quote generated successfully' });
  } catch (error) {
    console.error('[api/quotes] createQuote:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
