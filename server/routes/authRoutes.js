const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post("/register", async (req, res) => {
    try {
      console.log("🔍 Request received at /register");
      console.log("📦 Body:", req.body);
  
      const { name, email, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      const savedUser = await newUser.save(); // ← important!
      console.log("✅ User saved:", savedUser);
  
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(200).json({ token, user: savedUser });
    } catch (err) {
      console.error("❌ Register error:", err.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
