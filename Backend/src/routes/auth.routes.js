import express from "express";
import {register,login, getMe, logoutUser} from "../controllers/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register",register)
router.post("/login",login);
router.get("/test",protect,(req,res)=>{
    res.json({
        success:true,
        user:req.user
    });
});
router.get("/getme",protect,getMe);
router.post("/logout", logoutUser);

export default router;

