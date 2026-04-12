import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

// POST /api/quotes
router.post('/', async (req, res) => {
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
    console.error('Error creating quote:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
