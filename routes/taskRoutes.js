const express = require("express");
const { createTask, getAllTasks, updateTaskStatus, deleteTask, getbyid } = require("../controllers/taskController");

const router = express.Router();

router.post("/task", createTask);

router.get("/tasks", getAllTasks);
router.get("/task/project-id/:id",getbyid);
router.get('/task/due_date/:id',);
router.get('/task/is_completed/:id',);
router.get('/task/created_at/:id',);

router.put("/tasks/:id", updateTaskStatus);

router.delete("/tasks/:id", deleteTask);

module.exports = router;
