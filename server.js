const express = require("express");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require('./routes/commentRoutes');

const app = express();
app.use(express.json());

app.use("/api", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api", userRoutes);
app.use("/api",commentRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
