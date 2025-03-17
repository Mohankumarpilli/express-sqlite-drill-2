const db = require("../database/database");

exports.createTask = (req, res) => {
    const { project_id, content, description, due_date } = req.body;
    if (!project_id || !content) return res.status(400).json({ error: "Project ID and content are required" });

    db.run(
        "INSERT INTO tasks (project_id, content, description, due_date) VALUES (?, ?, ?, ?)",
        [project_id, content, description, due_date],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, project_id, content, description, due_date });
        }
    );
};

exports.getAllTasks = (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.updateTaskStatus = (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body;
    db.run(
        "UPDATE tasks SET is_completed = ? WHERE id = ?",
        [is_completed ? 1 : 0, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
            res.json({ message: "Task status updated" });
        }
    );
};

exports.deleteTask = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    });
};
