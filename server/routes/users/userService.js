// import User from "./userModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// // POST /api/users/signup
// export async function signup(req, res) {
//   const { name, email, password } = req.body;

//   console.log({name,email,password})

//   try {
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });

//     const savedUser = await user.save();

//     const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: "1d" });

//     res.status(201).json({ token, user: { name: savedUser.name, email: savedUser.email } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // POST /api/users/login
// export async function login(req, res) {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.status(200).json({ token, user: { name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }


import User from './userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || '123123';
const JWT_EXPIRE = '30m';
const JWT_EXPIRE_REMEMBER = '7d';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export async function registerUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();


    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
    });

    return res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).json({ error: 'Invalid verification link' });

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.json({ message: 'Email verified successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ error: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const expiresIn = rememberMe ? JWT_EXPIRE_REMEMBER : JWT_EXPIRE;
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn });

    return res.json({ accessToken: token, expiresIn });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
