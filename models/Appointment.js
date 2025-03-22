import mongoose from "mongoose";
import { format } from "morgan";


const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
     },
    email: {
         type: String,
         required: true 
        },
    phone: { 
        type: Number 
    },
    date: { 
        type: Date, 
        format: Date,
        required: true 
    }, // consults should be every 30 min only
    time: { 
        type: Number, 
        required: true 
    },
    serviceType: { 
        type: String, 
        enum: ["Consult"],
        required: true,
    },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Cancelled'], 
        default: 'Scheduled' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


export default mongoose.model("appointment", appointmentSchema);