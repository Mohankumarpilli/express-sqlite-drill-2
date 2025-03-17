const express = require("express");
const { createTask, getAllTasks, updateTaskStatus, deleteTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/task", createTask);
router.get("/tasks", getAllTasks);
router.put("/tasks/:id", updateTaskStatus);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
