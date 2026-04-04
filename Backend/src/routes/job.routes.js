import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getJobs ,createJob, getSingleJob, getJobsadvanced } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/create",protect,authorizeRoles("employer"),createJob)

router.get("/",getJobs);
router.get("/advanced",getJobsadvanced);

router.get("/:slug/:id",getSingleJob);

export default router