import express from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Artist from '../models/Artist.js';

export const AuthRouter = express.Router();

const SECRET_KEY = process.env.SECRET_KEY ; 

//* Artist Sign Up
// AuthRouter.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, specialty } = req.body;
//     const existingArtist = await Artist.findOne({ email });
//     if (existingArtist) return res.status(400).json({ error: "Email already exists" });

//     const newArtist = new Artist({ name, email, password, specialty, photos: [] });
//     await newArtist.save();
//     res.status(201).json({ message: "Artist registered successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Error signing up" });
//   }
// });

// Artist Login
AuthRouter.post("/login", async (req, res) => {
  console.log("Received Login Request:", req.body); // Debugging
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
  }

  const artist = await Artist.findOne({ email });
  if (!artist) {
      return res.status(400).json({ message: "User not found." });
  }

  const isMatch = await bcrypt.compare(password, artist.password);
  if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign({ id: artist._id, role: artist.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
  });

  res.json({ token, role: artist.role });
});

// Get Artist Profile
AuthRouter.get("/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching artist profile" });
  }
});


