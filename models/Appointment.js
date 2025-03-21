import mongoose from "mongoose";


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
        type: String 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    serviceType: { 
        type: String, 
        required: true },
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