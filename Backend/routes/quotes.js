import express from 'express';
import prisma from '../config/prisma.js';
import { validateQuote, sanitizeQuote } from '../utils/validateQuote.js';

const router = express.Router();

// POST /api/quotes
router.post('/', async (req, res) => {
  try {
    const errors = validateQuote(req.body || {});
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const data = sanitizeQuote(req.body);
    const newQuote = await prisma.quote.create({ data });

    res.status(201).json({ success: true, data: newQuote, message: 'Quote generated successfully' });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
