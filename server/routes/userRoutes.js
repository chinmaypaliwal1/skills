const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET user profile
router.get('/profile', authMiddleware, require('../controllers/userController').getProfile);

// GET /me - current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADD THIS: PATCH /me - update skills
router.patch("/me", authMiddleware, async (req, res) => {
    console.log("Decoded userId:", req.userId); // 🔍
  
    try {
      const { skills } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { skills },
        { new: true }
      ).select("-password");
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
    

module.exports = router;
