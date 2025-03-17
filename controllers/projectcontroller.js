const db = require("../database/database");

exports.createProject = (req, res) => {
    const { name, color, is_favorite } = req.body;
    if (!name) return res.status(400).json({ error: "Project name is required" });

    db.run(
        "INSERT INTO projects (name, color, is_favorite) VALUES (?, ?, ?)",
        [name, color, is_favorite ? 1 : 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, color, is_favorite });
        }
    );
};

exports.getAllProjects = (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        console.log(rows);
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.deleteProject = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM projects WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    });
};
