const express = require("express");
const { createProject, getAllProjects, deleteProject } = require("../controllers/projectcontroller");

const router = express.Router();

router.post("/project", createProject);
router.get("/projects", getAllProjects);
router.delete("/projects/:id", deleteProject);

module.exports = router;
