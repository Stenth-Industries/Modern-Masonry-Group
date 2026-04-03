import express from 'express';
import exampleController from '../controllers/exampleController.js';

const router = express.Router();

// Define API routes
router.get('/examples', exampleController.getExamples);

export default router;
