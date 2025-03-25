import mongoose from "mongoose";


const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialty: {
       type: String
    },
    bio: {
        type: String
    },
    portfolio: [String], // image URLs
});


export default mongoose.model("artist", artistSchema); 