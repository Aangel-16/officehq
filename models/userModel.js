//UserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
  createdAt: { type: Date, default: Date.now }
});

const departmentSchema = new mongoose.Schema({
  deptId: { type: Number, required: true, unique: true }, 
  deptName: { type: String, required: true }
});

// Models
const User = mongoose.model('User', userSchema);
const Department = mongoose.model('Department', departmentSchema);

// Exporting both
module.exports = { User, Department };

