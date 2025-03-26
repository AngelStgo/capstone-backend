const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const artistRoutes = require("./routes/artistRoutes"); // Import your updated routes

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Use your artist routes
app.use("/artist", artistRoutes);

mongoose.connect("mongodb://localhost:27017/tattoo_db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
