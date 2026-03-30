import express from "express";
import {
    sendOTP,
    verifyOTP,
    signup,
    login,
    getMyProfile
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleWare/authMiddleware.js";

const router = express.Router();

// Core
router.get("/me", isAuthenticated, getMyProfile);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Optional (for cleaner frontend separation)
router.post("/signup", signup);
router.post("/login", login);

export default router;