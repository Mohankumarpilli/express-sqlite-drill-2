const db = require('./database/database');

const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

const execAsync = (sql) => {
    return new Promise((resolve, reject) => {
        db.exec(sql, function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
};

const generateUsers = (count) => {
    const users = [];
    for (let i = 1; i <= count; i++) {
        users.push({
            name: `user_${i}`,
            email: `user${i}@example.com`,
        });
    }
    return users;
};

const insertUsers = async (records, batchSize = 50) => {
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        
        try {
            await execAsync("BEGIN TRANSACTION");
            
            const insertPromises = batch.map(record => {
                return runAsync(
                    "INSERT INTO users (name, email) VALUES (?, ?)",
                    [record.name, record.email]
                );
            });
            
            await Promise.all(insertPromises);
            await execAsync("COMMIT");
            
            console.log(`Inserted ${i + batch.length} users...`);
        } catch (err) {
            await execAsync("ROLLBACK");
            console.error("Error inserting user batch:", err);
        }
    }
};

const generateAndInsertProjects = async (totalProjects, userCount, batchSize = 10000) => {
    for (let i = 1; i <= totalProjects; i += batchSize) {
        const projectBatch = [];
        const endIndex = Math.min(i + batchSize - 1, totalProjects);
        
        for (let j = i; j <= endIndex; j++) {
            projectBatch.push({
                name: `Project ${j}`,
                user_id: Math.floor(Math.random() * userCount) + 1,
                color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
                is_favorite: Math.random() < 0.2 ? 1 : 0,
            });
        }
        
        try {
            await execAsync("BEGIN TRANSACTION");
            
            const stmt = db.prepare("INSERT INTO projects (name, user_id, color, is_favorite) VALUES (?, ?, ?, ?)");
            
            for (const project of projectBatch) {
                stmt.run(project.name, project.user_id, project.color, project.is_favorite);
            }
            
            stmt.finalize();
            await execAsync("COMMIT");
            
            console.log(`Inserted projects ${i} to ${endIndex}...`);
        } catch (err) {
            await execAsync("ROLLBACK");
            console.error("Error inserting project batch:", err);
        }
    }
};

const generateAndInsertTasks = async (projectCount, tasksPerProject, batchSize = 100000) => {
    const dueDates = [
        '2025-03-12', '2025-03-15', '2025-03-20', 
        '2025-04-01', '2025-04-15', '2025-05-01'
    ];
    
    for (let projectId = 1; projectId <= projectCount; projectId += Math.ceil(batchSize / tasksPerProject)) {
        const taskBatch = [];
        const endProjectId = Math.min(projectId + Math.ceil(batchSize / tasksPerProject) - 1, projectCount);
        
        for (let currProjectId = projectId; currProjectId <= endProjectId; currProjectId++) {
            for (let taskNum = 1; taskNum <= tasksPerProject; taskNum++) {
                taskBatch.push({
                    project_id: currProjectId,
                    content: `project${currProjectId}_task${taskNum}`,
                    description: `This is task ${taskNum} from project ${currProjectId}`,
                    due_date: dueDates[Math.floor(Math.random() * dueDates.length)],
                    is_completed: Math.random() < 0.3 ? 1 : 0
                });
            }
        }
        
        try {
            await execAsync("BEGIN TRANSACTION");
            
            const stmt = db.prepare("INSERT INTO tasks (project_id, content, description, due_date, is_completed) VALUES (?, ?, ?, ?, ?)");
            
            for (const task of taskBatch) {
                stmt.run(
                    task.project_id,
                    task.content,
                    task.description,
                    task.due_date,
                    task.is_completed
                );
            }
            
            stmt.finalize();
            await execAsync("COMMIT");
            
            console.log(`Inserted tasks for projects ${projectId} to ${endProjectId}...`);
        } catch (err) {
            await execAsync("ROLLBACK");
            console.error("Error inserting task batch:", err);
        }
    }
};

const populateDatabase = async () => {
    try {
        console.log("Starting database population...");
        
        const USER_COUNT = 100;
        const PROJECT_COUNT = 1000000;
        const TASKS_PER_PROJECT = 10;
        
        const users = generateUsers(USER_COUNT);
        await insertUsers(users, 50);
        
        await generateAndInsertProjects(PROJECT_COUNT, USER_COUNT, 10000);
        
        await generateAndInsertTasks(PROJECT_COUNT, TASKS_PER_PROJECT, 100000);
        
        console.log("Database population completed successfully.");
    } catch (err) {
        console.error("Error populating database:", err);
    }
};

populateDatabase().then(() => {
    console.log("Script execution complete.");
}).catch(err => {
    console.error("Script execution failed:", err);
});