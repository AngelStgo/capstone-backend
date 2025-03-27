import express from "express"
import Artist from "../models/Artist.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const LoginRouter = express.Router();

LoginRouter.post("/", async (req, res) =>{
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  try {
    const artist = await Artist.findOne({ email });

    if (!artist) {
      return res.status(400).json({ message: "Artist not found" });
    }

    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token and send as response
    const token = jwt.sign({ id: artist._id, role: artist.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, role: artist.role, id:artist._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
