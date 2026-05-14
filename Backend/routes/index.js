import express from 'express';
import productRoutes from './products.js';
import quoteRoutes from './quotes.js';

const router = express.Router();

// ── Products (Catalogue) ───────────────────────────────────────────────────────
router.use('/products', productRoutes);

// ── Quotes ────────────────────────────────────────────────────────────────
router.use('/quotes', quoteRoutes);

export default router;
