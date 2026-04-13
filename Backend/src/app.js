import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import profileRoutes from "./routes/profile.routes.js";



const corsOptions = {
  origin: "http://localhost:5173", // No trailing slash
  credentials: true,               // Required for cookies/sessions
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// login,register
app.use("/api/auth", authRoutes);

// view jobs, view singlejob, createjob
app.use("/api/jobs", jobRoutes);

// application ,view my application...
app.use("/api/applications", applicationRoutes);

app.use("/api/profile",profileRoutes)

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
