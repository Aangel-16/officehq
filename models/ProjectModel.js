//ProjectModel
const mongoose = require('mongoose');

const projectSchema =new mongoose.Schema({
  projectId: String,
  pname: String,
  department: String,
  category : String,
  startDate: String,
  endDate: String,
  description : String
});

const Project = mongoose.model("Project", projectSchema); //name, schema , collection
module.exports = { Project };