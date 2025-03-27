import express from 'express';
import Artist from '../models/Artist.js';
import multer from 'multer';
import path from "path";
import fs from "fs";

// dir for new photos
const uploadDir = path.join("public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure this directory is accessible
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage });

export const artistRouter = express.Router();

// Handle photo upload
artistRouter.post("/:id/upload-photo", upload.single("photo"), async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    artist.photos.push(photoUrl);
    await artist.save();

    res.json({ photoUrl });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// GET /api/artist return all artists
artistRouter.get('/', async (req, res) => {
    try {
        const artist = await Artist.find();
        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


// GET /api/artist/:id return artist by id
artistRouter.get("/:id", async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);

        if (!artist) {
            return res.status(404).send("Artist not found");
        }
        res.json(artist)
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
});

// Fetch artist profile
artistRouter.get("/:id/dashboard", async (req, res) => {
  try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) {
          return res.status(404).json({ message: "Artist not found" });
      }
      res.json(artist);
  } catch (error) {
      console.error("Error fetching artist:", error);
      res.status(500).json({ message: "Server error" });
  }
});


// POST /api/artist create a new artist
artistRouter.post("/", async (req, res) => {
    
    try {
        const newArtist = new Artist(req.body);
        await newArtist.save();
        res.status(201).json(newArtist);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});          


// DELETE /api/artist/:id delete artist by the id
artistRouter.delete("/:id", async (req, res) => {
    try {
        const deletedArtist = await Artist.findByIdAndDelete(req.params.id);

        if(!deletedArtist) {
            return res.status(404).send("Artist not found");
        }

        res.status(204).send("Artist deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


// PATCH /api/artist/:id update a artist by the id 
artistRouter.patch("/:id", async (req, res) => {
    try { // .findById vs .findByIdAndUpdate //
        const artist = await Artist.findById(req.params.id);

        if (!artist) {
            return res.status(404).send("Artist not found");
        }

        // update name , or change to whatever is on the schema
        if (req.body.name) {
            //...
            artist.name = req.body.name
        }
        
        //artist bio 
        if (req.body.bio) {
            artist.bio.push(...req.body.bio)
        }

        await artist.save();
        res.json(artist);


    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Add a photo to an artist's portfolio
artistRouter.put("/:id/add-photo", async (req, res) => {
    try {
      const { photo } = req.body;
      const artist = await Artist.findByIdAndUpdate(req.params.id, { $push: { photos: photo } }, { new: true });
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Error adding photo" });
    }
  });
  
  // Delete a photo from an artist's portfolio
  artistRouter.put("/:id/delete-photo", async (req, res) => {
    try {
      const { photo } = req.body;
      const artist = await Artist.findByIdAndUpdate(req.params.id, { $pull: { photos: photo } }, { new: true });
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Error deleting photo" });
    }
  });
  