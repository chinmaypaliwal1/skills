import { Request, Response } from "express";
import User from "../models/User";

export const registerUser = async (req ,res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password }); // You should hash the password in production
    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
