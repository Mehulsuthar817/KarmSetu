import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js"
import jobRoutes from "./routes/job.routes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes)

app.get("/",(req,res)=>{
    res.send("API is running...");
})

export default app;