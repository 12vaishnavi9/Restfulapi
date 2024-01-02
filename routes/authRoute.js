import express from "express";
import { registerController,loginController,forgotPasswordController} from "../controllers/authController.js";

const router=express.Router();

router.post('/register',registerController)
router.post('/login',loginController)
router.post('/forgot-password',forgotPasswordController)


export default router;