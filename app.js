const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const mongoose = require("mongoose");

// Load DB config
const connectToDatabase = require("./dbConfig");

//import models
const {staff}= require ("./models/staffModel");
const {user, department}= require ("./models/userModel");
const {project}= require ("./models/ProjectModel");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectToDatabase();

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

// Modular Routes
app.use("/staff", require("./routes/staffRoute"));
app.use("/project", require("./routes/projectRoute"));


//Rendering login page
app.get("/", async (req, res) => {
  try {
      res.render("login");
  } catch (error) {
    res.status(500).send("Error loading homepage");
  }
});

//POST : login page
app.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Simple login check (hardcoded for now)
  if (username === 'admin@example.com' && password === 'admin123') {
    return res.redirect('home');
  } else {
    return res.send('<script>alert("Invalid credentials!"); window.location.href = "/";</script>');
  }
});

app.get('/home',(req, res)=>{
  res.render('home');
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
