const db = require('../database/database');

exports.createcomment = (req,res) => {
    const {content, task_id, project_id} = req.body;
    let stmt;
    let values = [];
    values.push(content);
    if(task_id && project_id){
        stmt = `INSERT INTO comments (content,task_id,project_id) VALUES (?, ?, ?);`
        values.push(task_id);
        values.push(project_id);
    }else if(task_id){
        stmt = `INSERT INTO comments (content,task_id) VALUES (?, ?);`
        values.push(task_id);
    }else if(project_id){
        stmt = `INSERT INTO comments (content,project_id) VALUES (?, ?);`
        values.push(project_id);
    }else {
        return res.status(500).json({ error: "need any of this project_id, task_id to create comment" });
    }
    db.run(
        stmt,
        [...values],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message : "ROW INSERTED" });
        }
    )
}

exports.deletecomment = (req,res) => {
    const id = req.params.id;
    const url = req.url.split("/")[2];
    let stmt;
    if(url == "comment-id"){
        stmt = `DELETE FROM comments WHERE id = ?`
    }else if(url == "project-id"){
        stmt = `DELETE FROM comments WHERE project_id = ?`
    }else if(url == "task-id"){
        stmt = `DELETE FROM comments WHERE task_id = ?`
    }else{
        return res.status(500).json({ error: "need id to delete comment" });
    }
    db.run(
        stmt,
        [id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ no_of: this.changes, message : "ROW DELTED" });
        }
    )
}

exports.getallcomments = (req,res) => {
    const stmt = "SELECT * FROM comments;"
    db.all(
        stmt,
        [],
        function (err,table_data) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(table_data);
    })
}

exports.getbytaskid = (req,res) => {
    const id = req.params.id;
    const stmt = "SELECT * FROM comments WHERE task_id = ?;"
    db.all(
        stmt,
        [id],
        function (err,table_data) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(table_data);
    })
}
exports.getbyprojectid = (req,res) => {
    const id = req.params.id;
    const stmt = "SELECT * FROM comments WHERE project_id = ?;"
    db.all(
        stmt,
        [id],
        function (err,table_data) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(table_data);
    })
}