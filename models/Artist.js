import mongoose from "mongoose";
import bcrypt from "bcrypt";


const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { // Hashed password
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

// Hash password before saving
artistSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });


export default mongoose.model("artist", artistSchema); 