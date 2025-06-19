const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { Project } = require("../models/ProjectModel");

// Ensure upload dir
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// GET: List all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("project/projectList", { projects });
  } catch (err) {
    console.error("Error loading project list:", err);
    res.status(500).send("Error loading project list");
  }
});

// GET: Show add project form
router.get("/addProject", (req, res) => {
  res.render("project/addProject");
});

// POST: Add new project
router.post("/addProject", async (req, res) => {
  try {
    const { projectId, pname, department, category, startDate, endDate, description } = req.body;

    const newProject = new Project({
      projectId,
      pname,
      department,
      category,
      startDate,
      endDate,
      description,
    });

    await newProject.save();
    res.redirect("/project");
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).send("Failed to save project");
  }
});

// This MUST come last to avoid conflicts with "/addProject"
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.render("project/projectDetails", { project });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
