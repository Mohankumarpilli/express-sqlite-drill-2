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


exports.getbyid = (req,res) => {
    const params = req.url.split('/')[2];
    let getby = req.params.id;
    let sql;

    console.log(getby);
    console.log(params);

    if(params == "project-id"){        
        sql = `SELECT * FROM tasks WHERE project_id = ?`
    }else if(params == "due_date") {        
        sql = `SELECT * FROM tasks WHERE due_date = ?`
    }else if(params == "is_completed"){        
        sql = `SELECT is_completed FROM tasks WHERE id = ?`
    }else if(params == "created_at"){
        sql = `SELECT * FROM tasks WHERE created_at = ?`
    }else{
        return res.status(500).json({ error: "need any of this project_id, due_date, is_completed, created_at" });
    }

    db.all(
        sql,
        [getby],
        function (err,details) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(details);
        }
    )
}