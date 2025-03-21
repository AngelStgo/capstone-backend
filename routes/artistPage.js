import express from 'express';
import Artist from '../models/Artist.js';


export const artistRouter = express.Router();

//! NOTE: verify the notations, plural and singulars

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
