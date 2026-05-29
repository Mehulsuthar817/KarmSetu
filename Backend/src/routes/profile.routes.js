import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMyprofile, upsertProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.put("/",protect,upsertProfile);
router.get("/",protect,getMyprofile);

export default router;