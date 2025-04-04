import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import { healthRouter } from './routes/health.js'
import { artistRouter } from './routes/artistPage.js';
import { appointmentRouter } from './routes/appointment.js';
import { reviewRouter } from './routes/review.js';
// import { AuthRouter } from './routes/auth.js';
import { LoginRouter } from './routes/login.js';


dotenv.config();
// console.log(process.env.MONGODB_URI);

// Connect to mongoDB
await mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log(`Connected to MongoDB`))
.catch((e) => console.error(e));

const PORT = process.env.PORT || 4000;

const app = express();

//! purpose ?!
// View Engine
app.set('views', "./views");
app.set("view engine", "pug") // will be stored here


// Middlewares
app.use(express.static("./public")); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(helmet()); // for hide and secure 
app.use(cors()); //connect with our frontend
app.use("/uploads", express.static("uploads"));




// Routes 
app.get('/', (req, res) => {
    res.render("index");
})

//! can we discard the route?!
// routes
app.use('/health', healthRouter);
app.use('/artist', artistRouter);
app.use('/appointment', appointmentRouter);
app.use('/review', reviewRouter); 
// app.use('/auth', AuthRouter);
app.use('/login', LoginRouter);


//! MOVE errorHandling to another file and import it here
// Global error handling
app.use((err, _req, res, next) => {
    console.error(err)
    res.status(500).send("Seems like we messed up somewhere...");
  });


app.listen(PORT, () => console.log(`Server is running on port:${PORT}`));