import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// login,register
app.use("/api/auth", authRoutes);

// view jobs, view singlejob, createjob
app.use("/api/jobs", jobRoutes);

// application ,view my application...
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
