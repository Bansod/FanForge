import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRoutes from "./routes/products/index.js";
import userRoutes from "./routes/users/index.js";

dotenv.config(); // load .env variables

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log('Request Body:', req);
  next();
});

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
