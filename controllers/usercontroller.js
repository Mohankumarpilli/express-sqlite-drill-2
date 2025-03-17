const db = require("../database/database");

exports.createuser = (req, res) => {
    const { name, email} = req.body;
    if (!name) return res.status(400).json({ error: "Project name is required" });
    db.run(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, email });
        }
    );
};

exports.getallUsers = (req,res) => {
    db.all(
        "SELECT * FROM users",
        [],
        function (err,user_table) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(user_table);
        }
    )
}

exports.getbyid = (req,res) => {
    const params = req.url.split('/')[2];
    let getby = req.params.id;
    let sql;

    if(params == "user_id"){        
        sql = `SELECT * FROM projects WHERE user_id = ?`
    }else if(params == "project_id"){        
        sql = `SELECT * FROM projects WHERE id = ?`
    }else if(params == "due_date") {        
        sql = `SELECT * FROM tasks WHERE due_date = ?`
    }else if(params == "is_completed"){        
        sql = `SELECT * FROM tasks WHERE is_completed = ?`
    }else if(params == "created_at"){
        sql = `SELECT * FROM projects WHERE created_at = ?`
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

exports.patchisfavi = (req,res) => {
    const is_fav = req.params.id;
    
    const body = (req.body.is_favorite).toLowerCase() == "true" ? "TRUE" : "FALSE";
    db.run(
        "UPDATE projects SET is_favorite = ? WHERE id = ?",
        [body,is_fav],
        function (err,user_table) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({message : "project is-fav is updated"});
        }
    );
}

exports.deleteuser = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "user id is required" });

    db.run(
        "DELETE FROM users WHERE id = ?",
        [id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({message : `User with id ${id} is deleted`});
        }
    );
};

exports.addtasktouser = (req,res) => {
    const {user_id, project_id, task_id} = req.body;

    if(!user_id && !project_id && !task_id) return res.status(400).json({ error: "user id, project_id, task_id is required" });

    db.run(
        "INSERT INTO mapping_user_projects_tasks (project_id, user_id, task_id) VALUES (?, ?, ?)",
        [ project_id, user_id, task_id ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: user_id, project_id, task_id, message : 'user is added to task in project' });
        }
    );
}