//staffModel.js

const mongoose = require('mongoose');

//uploaded documents
const documentSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

//Employement history
const employmentSchema = new mongoose.Schema({
  role: String,
  type: String,
  startDate: String,
  endDate: String
});

//Staff details model
const staffSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  designation: String,
  photo: String,

  gender: String,
  nationality: String,
  employeeId: String,
  department: String,
  address: String,
  role: String,

  documents: [documentSchema],
  employmentHistory: [employmentSchema] // Array of employment objects
});


const Staff = mongoose.model("Staff", staffSchema); //name, schema , collection
module.exports = { Staff };

