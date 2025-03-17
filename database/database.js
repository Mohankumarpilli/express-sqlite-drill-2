const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.exec('PRAGMA foreign_keys = ON');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            user_id INTEGER NOT NULL,
            color TEXT,
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            content TEXT NOT NULL UNIQUE,
            description TEXT,
            due_date DATETIME,
            is_completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            posted_at DATETIME DEFAULT (CURRENT_TIMESTAMP),
            task_id INTEGER NULL,
            project_id INTEGER NULL,
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        );
    `);

    db.run(`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks(is_completed);`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);`);
});

module.exports = db;