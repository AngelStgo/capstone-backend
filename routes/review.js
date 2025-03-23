import express from 'express';
import Review from '../models/Review.js';


export const reviewRouter = express.Router();

// GET /api/review return all reviews
reviewRouter.get('/', async (req, res) => {
    try {
        const review = await Review.find();
        res.json(review);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


// GET /api/review/:id return review by id
reviewRouter.get("/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).send("Review not found");
        }
        res.json(review)
    } catch (error) {
        console.error(error)
        res.status(500).send(error.message)
    }
});

// POST /api/review create a new review
reviewRouter.post("/", async (req, res) => {
    
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});


// DELETE /api/review/:id delete review by the id
reviewRouter.delete("/:id", async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);

        if(!deletedReview) {
            return res.status(404).send("Review not found");
        }

        res.status(204).send("Review deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});