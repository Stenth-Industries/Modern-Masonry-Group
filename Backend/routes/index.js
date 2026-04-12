import express from 'express';
import exampleController from '../controllers/exampleController.js';
import productRoutes from './products.js';
import quoteRoutes from './quotes.js';

const router = express.Router();

// ── Products (Catalogue) ───────────────────────────────────────────────────────
router.use('/products', productRoutes);

// ── Quotes ────────────────────────────────────────────────────────────────
router.use('/quotes', quoteRoutes);

// ── Legacy example route ───────────────────────────────────────────────────────
router.get('/examples', exampleController.getExamples);

export default router;
