import express from 'express';
import Artist from '../models/Artist.js';
import multer from 'multer';

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save uploaded images in the "uploads" folder
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
  });
  
  const upload = multer({ storage });

export const artistRouter = express.Router();

artistRouter.post("/artist/:id/upload-photo", upload.single("photo"), async (req, res) => {
    try {
      const { id } = req.params;
      const artist = await Artist.findById(id);
  
      if (!artist) return res.status(404).json({ message: "Artist not found" });
  
      // Save image path to the artist's gallery
      artist.photos.push(`/uploads/${req.file.filename}`);
      await artist.save();
  
      res.json({ message: "Photo uploaded successfully", photoUrl: `/uploads/${req.file.filename}` });
    } catch (error) {
      res.status(500).json({ message: "Error uploading photo", error });
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
  