import express from "express";
import {
    sendOTP,
    verifyOTP,
    signup,
    login
} from "../controllers/authController.js";

const router = express.Router();

// Core
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Optional (for cleaner frontend separation)
router.post("/signup", signup);
router.post("/login", login);

export default router;