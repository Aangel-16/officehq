const mongoose = require('mongoose');

// Team Schema
const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  contact: String,
  email: String,
  type: String
}, { _id: false });

// Stakeholder Schema
const stakeholderSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  type: String,
  address: String
}, { _id: false });

// Milestone Schema
const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: String,
  endDate: String,
  state: String
}, { _id: false });

// Document Schema
const documentSchema = new mongoose.Schema({
  category: String,
  type: String,
  description: String,
  filename: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Project Schema
const projectSchema = new mongoose.Schema({
  projectId: String,
  pname: String,
  department: String,
  category: String,
  startDate: String,
  endDate: String,
  description: String,
  team: [teamMemberSchema],
  stakeholders: [stakeholderSchema],
  milestones: [milestoneSchema],
  documents: [documentSchema]
});

const Project = mongoose.model("Project", projectSchema);
module.exports = { Project };
