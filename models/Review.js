import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    }, 
    //! create and array of all of the artists from the tattoo page
    artist: {
        type: String,
        required: true
    },
    rating: { 
        type: String, 
        // min: 1, 
        // max: 5, 
        required: true
     },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

export default mongoose.model("review", reviewSchema);