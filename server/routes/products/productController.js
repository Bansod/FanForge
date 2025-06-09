import {
  getAllProducts,
  createProduct,
  bulkInsertProducts,
  getProductByProductId,
  getProductsByCategoryId,
} from './productService.js';

export const getProductsController = (req, res) => getAllProducts(req, res);
export const createProductController = (req, res) => createProduct(req, res);
export const bulkInsertProductsController = (req, res) => bulkInsertProducts(req, res);
export const getProductByProductIdController = (req, res) => getProductByProductId(req, res);
export const getProductsByCategoryIdController = (req, res) => getProductsByCategoryId(req, res);
