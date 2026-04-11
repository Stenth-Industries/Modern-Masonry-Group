import express from 'express';
import exampleController from '../controllers/exampleController.js';
import productRoutes from './products.js';

const router = express.Router();

// ── Products (Catalogue) ───────────────────────────────────────────────────────
router.use('/products', productRoutes);

// ── Legacy example route ───────────────────────────────────────────────────────
router.get('/examples', exampleController.getExamples);

export default router;
