//staffRoute.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { User, Department } = require("../models/userModel");
const { Staff } = require("../models/staffModel");

const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Show all staff (listing page)
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find();
    res.render("staff/staffList", { staff });
  } catch (err) {
    res.status(500).send("Error loading staff list");
  }
});

// Add new staff form
router.get("/add", async (req, res) => {
  try {
    const departments = await Department.find().sort({ deptName: 1 }); // optional: sort alphabetically
    res.render("staff/addStaff", { departments });
  } catch (err) {
    console.error("Error loading departments:", err);
    res.status(500).send("Failed to load form");
  }
});


// Handle new staff submission
router.post("/add", async (req, res) => {
  try {
   const { password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).send("Password and Confirm Password do not match");
    }else{
      
      let photoName = "";

      if (req.files && req.files.photo) {
        photoName = Date.now() + "_" + req.files.photo.name;
        const uploadPath = path.join(uploadDir, photoName);
        await req.files.photo.mv(uploadPath);
      }

      const newStaff = new Staff({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        nationality: req.body.nationality,
        employeeId: req.body.employeeId,
        department: req.body.department,
        designation: req.body.designation,
        address: req.body.address,
        photo: photoName
      });

      await newStaff.save();

      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = new User({
      username: req.body.email,
      password: hashedPassword,
      role: "staff"
      });

      await newUser.save();
      res.redirect("/staff");
    }

  } catch (err) {
    console.error("Error saving staff:", err);
    res.status(500).send("Failed to save staff");
  }
});

// View staff details
router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    res.render("staff/staffDetails", { staff });
  } catch (err) {
    console.error("Error fetching staff details:", err);
    res.status(500).send("Failed to fetch staff details");
  }
});

// Show edit staff profile form
/*router.get("/edit/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    res.render("staff/editStaffprofile", { staff });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Failed to load edit form");
  }
});*/

// Show edit staff profile form
router.get("/edit/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    const departments = await Department.find().sort({ deptName: 1 });

    res.render("staff/editStaffprofile", {
      staff,
      departments
    });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Failed to load edit form");
  }
});


// Handle staff update
router.post("/edit/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    if (req.files && req.files.photo) {
      const photoName = Date.now() + "_" + req.files.photo.name;
      const uploadPath = path.join(uploadDir, photoName);
      await req.files.photo.mv(uploadPath);
      staff.photo = photoName;
    }

    staff.firstName = req.body.firstName;
    staff.lastName = req.body.lastName;
    staff.email = req.body.email;
    staff.phone = req.body.phone;
    staff.gender = req.body.gender;
    staff.nationality = req.body.nationality;
    staff.employeeId = req.body.employeeId;
    staff.department = req.body.department;
    staff.designation = req.body.designation;
    staff.address = req.body.address;

    await staff.save();
    res.redirect("/staff");
  } catch (err) {
    console.error("Error updating staff:", err);
    res.status(500).send("Failed to update staff");
  }
});


router.get("/documentList/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    res.render("staff/documentList", {
      staff, // Pass the full staff object
      documents: staff.documents,
      staffId: staff._id
    });

  } catch (err) {
    console.error("Error loading document list:", err);
    res.status(500).send("Failed to load document list");
  }
});


// GET: Render add document form
router.get("/addDocument/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");
    res.render("staff/addDocument", { staffId: req.params.id });
  } catch (err) {
    console.error("Error loading add document form:", err);
    res.status(500).send("Failed to load form");
  }
});

// POST: Handle document upload
router.post("/documents/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    // File validation
    if (!req.files || !req.files.document) {
      return res.status(400).send("No file uploaded");
    }

    const documentFile = req.files.document;
    const fileName = Date.now() + "_" + documentFile.name;
    const uploadPath = path.join(__dirname, "../public/uploads", fileName);

    // Move file
    await documentFile.mv(uploadPath);

    // Add document to staff
    const newDocument = {
      category: req.body.category,
      type: req.body.type,
      description: req.body.description,
      fileName: fileName
    };

    staff.documents.push(newDocument);
    await staff.save();

    res.redirect(`/staff/documentList/${req.params.id}`);
  } catch (err) {
    console.error("Error adding document:", err);
    res.status(500).send("Failed to add document");
  }
});



// GET Employment History
router.get('/employment/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    res.render('staff/employment', {
      staff,
      employmentList: staff.employmentHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching employment history");
  }
});

// POST Add Employment
router.post('/addEmployment/:id', async (req, res) => {
  const { role, type, startDate, endDate } = req.body;
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send("Staff not found");

    staff.employmentHistory.push({ role, type, startDate, endDate });
    await staff.save();

    res.redirect(`/staff/employment/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving employment");
  }
});

module.exports = router;
