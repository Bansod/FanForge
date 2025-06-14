import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
