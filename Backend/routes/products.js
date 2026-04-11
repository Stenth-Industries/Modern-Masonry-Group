import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// GET /api/products/filters  — must be before /:slug to avoid conflict
router.get('/filters', productController.getFilterOptions);

// GET /api/products?search=&colour=&collection=&style=&manufacturer=&material=&page=&limit=
router.get('/', productController.getProducts);

// GET /api/products/:slug
router.get('/:slug', productController.getProductBySlug);

export default router;
