import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  images: {
    front: { type: String, required: true },
    back: { type: String, required: true }
  },
  category: { type: String, required: true },
  categoryId: { type: Number, required: true },
  fitType: { type: String, required: true },
  fitTypeId: { type: Number, required: true },
  units: { type: Number, default: 0 }
}, {
  timestamps: true
});


const Product = mongoose.model('Product', productSchema);

export default Product;
