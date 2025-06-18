const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");


//import models
const {staff}= require ("./models/staffModel");
const {user}= require ("./models/userModel");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(expressLayouts);
app.set("layout", "index"); // index.ejs in /views

 // MongoDB connection
const url = "mongodb+srv://angelsmycourses16:angel725@cluster0.51gncrh.mongodb.net/final_project?retryWrites=true&w=majority&appName=Cluster0";
const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectToDatabase(); // Connect to MongoDB

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Routes

/*Redirect root to staff listing
app.get("/", (req, res) => res.redirect("/staff"));*/

// Modular Routes
app.use("/staff", require("./routes/staffRoute"));
app.use("/project", require("./routes/projectRoute"));


//Rendering index page
app.get("/", async (req, res) => {
  try {
      res.render("index");
  } catch (error) {
    res.status(500).send("Error loading homepage");
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
