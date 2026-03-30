import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { applyJob, getJobApplicants, getMyApplications, updateApplicationStatus } from "../controllers/application.controller.js";


const router = express.Router();

// candidate
router.post("/apply",protect,authorizeRoles("candidate"),applyJob);
router.get("/my",protect,authorizeRoles("candidate"),getMyApplications);


// employer
router.get("/job/:jobid",protect,authorizeRoles("employer"),getJobApplicants);
router.put("/applicationId",protect,authorizeRoles("employer"),updateApplicationStatus);

export default router;