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

/* ---------- CORE PROJECT ROUTES ---------- */

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

//  Place this ABOVE `/:id`
router.get("/taskproject", async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("project/taskproject", { projects });
  } catch (err) {
    console.error("Error loading task project view:", err);
    res.status(500).send("Error loading task project view");
  }
});

// GET: Project details (must come last)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.render("project/projectDetails", {
      project,
      activeTab: "details"
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).send("Internal server error");
  }
});

/* ---------- TASK ROUTES ---------- */

router.get("/:id/tasks", (req, res) => {
  const { id } = req.params;
  res.redirect(`/project/${id}/tasks/backlog`);
});

router.get("/:id/tasks/backlog", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("project/tasks/backlogs", {
    project,
    activeTab: "tasks",
    activeTaskTab: "backlog"
  });
});

router.get("/:id/tasks/bugs", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("tasks/bugs", {
    project,
    activeTab: "tasks",
    activeTaskTab: "bugs"
  });
});

router.get("/:id/tasks/sprints", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("tasks/sprints", {
    project,
    activeTab: "tasks",
    activeTaskTab: "sprints"
  });
});

module.exports = router;
