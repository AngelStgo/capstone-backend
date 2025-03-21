import mongoose from "mongoose";


const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String
    }
});


export default mongoose.model("artist", artistSchema);