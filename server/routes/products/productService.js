import Product from './productModel.js';

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createProduct(req, res) {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function bulkInsertProducts(req, res) {
  try {
    const inserted = await Product.insertMany(req.body);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getProductByProductId(req, res) {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductsByCategoryId(req, res) {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ categoryId: parseInt(categoryId) });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found in this category" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
