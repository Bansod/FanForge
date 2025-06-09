import {
  getProductsController,
  createProductController,
  bulkInsertProductsController,
  getProductByProductIdController,
  getProductsByCategoryIdController
} from './productController.js';

import express from "express";
const router = express.Router();

router.get('/', getProductsController);
router.post('/', createProductController);
router.post('/bulk', bulkInsertProductsController);
router.get('/category/:categoryId', getProductsByCategoryIdController);
router.get('/:productId', getProductByProductIdController);

export default router;
