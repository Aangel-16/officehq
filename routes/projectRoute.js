const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { Project } = require("../models/ProjectModel");

// Create upload directory
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------- CORE PROJECT ROUTES ---------- */

// GET: All Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("project/projectList", { projects });
  } catch (err) {
    res.status(500).send("Error loading project list");
  }
});

// ADD Project Form
router.get("/addProject", (req, res) => {
  res.render("project/addProject");
});

// ADD Project POST
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
      team: [],
      stakeholders: []
    });

    await newProject.save();
    res.redirect("/project");
  } catch (err) {
    res.status(500).send("Failed to save project");
  }
});

/* ---------- TEAM ROUTES ---------- */

router.get("/:id/team", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/teamList", {
    project,
    teamMembers: project.team,
    activeTab: "team"
  });
});

router.get("/:id/team/addTeam", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/addTeam", {
    project,
    activeTab: "team"
  });
});

router.post("/:id/team/addTeam", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  const { name, role, contact, email, type } = req.body;
  project.team.push({ name, role, contact, email, type });
  await project.save();

  res.redirect(`/project/${req.params.id}/team`);
});

/* ---------- STAKEHOLDER ROUTES ---------- */

router.get("/:id/stakeholders", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/stakeholderList", {
    project,
    stakeholders: project.stakeholders,
    activeTab: "stakeholders"
  });
});

router.get("/:id/stakeholders/add", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/addStakeholder", {
    project,
    activeTab: "stakeholders"
  });
});

router.post("/:id/stakeholders/add", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  const { name, contact, email, type, address } = req.body;
  project.stakeholders.push({ name, contact, email, type, address });
  await project.save();

  res.redirect(`/project/${req.params.id}/stakeholders`);
});

router.get("/:id/stakeholders/edit/:index", async (req, res) => {
  const { id, index } = req.params;
  const project = await Project.findById(id);
  if (!project || !project.stakeholders[index]) return res.status(404).send("Not found");

  res.render("project/editStakeholder", {
    project,
    stakeholder: project.stakeholders[index],
    index,
    activeTab: "stakeholders"
  });
});

router.post("/:id/stakeholders/edit/:index", async (req, res) => {
  const { id, index } = req.params;
  const { name, contact, email, type, address } = req.body;

  const project = await Project.findById(id);
  if (!project || !project.stakeholders[index]) return res.status(404).send("Not found");

  project.stakeholders[index] = { name, contact, email, type, address };
  await project.save();

  res.redirect(`/project/${id}/stakeholders`);
});

router.post("/:id/stakeholders/delete/:index", async (req, res) => {
  const { id, index } = req.params;
  const project = await Project.findById(id);
  if (!project || !project.stakeholders[index]) return res.status(404).send("Not found");

  project.stakeholders.splice(index, 1);
  await project.save();

  res.redirect(`/project/${id}/stakeholders`);
});

/* ---------- MILESTONES ---------- */

router.get("/:id/milestones", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/milestoneList", {
    project,
    activeTab: "milestones"
  });
});

router.get("/:id/milestones/add", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/addMilestone", {
    project,
    milestone: {},
    edit: false,
    activeTab: "milestones"
  });
});

router.post("/:id/milestones/milestone_add", async (req, res) => {
  const { title, description, startDate, endDate, state } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  project.milestones = project.milestones || [];
  project.milestones.push({ title, description, startDate, endDate, state });
  await project.save();

  res.redirect(`/project/${req.params.id}/milestones`);
});

router.get("/:id/milestones/edit/:index", async (req, res) => {
  const { id, index } = req.params;
  const project = await Project.findById(id);
  if (!project || !project.milestones[index]) return res.status(404).send("Milestone not found");

  res.render("project/addMilestone", {
    project,
    milestone: project.milestones[index],
    index,
    edit: true,
    activeTab: "milestones"
  });
});

router.post("/:id/milestones/edit/:index", async (req, res) => {
  const { id, index } = req.params;
  const { title, description, startDate, endDate, state } = req.body;

  const project = await Project.findById(id);
  if (!project || !project.milestones[index]) return res.status(404).send("Milestone not found");

  project.milestones[index] = { title, description, startDate, endDate, state };
  await project.save();

  res.redirect(`/project/${id}/milestones`);
});

router.post("/:id/milestones/delete/:index", async (req, res) => {
  const { id, index } = req.params;
  const project = await Project.findById(id);
  if (!project || !project.milestones[index]) return res.status(404).send("Milestone not found");

  project.milestones.splice(index, 1);
  await project.save();

  res.redirect(`/project/${id}/milestones`);
});

/* ---------- DOCUMENTS ---------- */

router.get("/:id/documents", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");

  res.render("project/documentList", {
    project,
    activeTab: "documents"
  });
});

router.post("/:id/documents/add", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Not found");

  if (!req.files || !req.files.file) return res.status(400).send("No file uploaded.");

  const { category, type, description } = req.body;
  const file = req.files.file;
  const savedName = Date.now() + "_" + file.name;
  const filePath = path.join(uploadDir, savedName);
  await file.mv(filePath);

  project.documents = project.documents || [];
  project.documents.push({ category, type, description, filename: savedName, uploadedAt: new Date() });
  await project.save();

  res.redirect(`/project/${req.params.id}/documents`);
});

router.post("/:id/documents/edit/:index", async (req, res) => {
  const project = await Project.findById(req.params.id);
  const idx = parseInt(req.params.index);
  const { category, type, description, filename } = req.body;

  if (!project || !project.documents[idx]) return res.status(404).send("Document not found");

  project.documents[idx] = { category, type, description, filename, uploadedAt: project.documents[idx].uploadedAt };
  await project.save();

  res.redirect(`/project/${req.params.id}/documents`);
});

router.post("/:id/documents/delete/:index", async (req, res) => {
  const project = await Project.findById(req.params.id);
  const idx = parseInt(req.params.index);

  if (!project || !project.documents[idx]) return res.status(404).send("Document not found");

  project.documents.splice(idx, 1);
  await project.save();

  res.redirect(`/project/${req.params.id}/documents`);
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

/* ---------- PROJECT DETAILS (Last) ---------- */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).send("Project not found");

    res.render("project/projectDetails", {
      project,
      activeTab: "details"
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
