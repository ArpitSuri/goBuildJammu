import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import Delivery from "../model/deliveryModel.js";

/* ---------------- TEMP OTP STORE (Replace with Redis in production) ---------------- */
const otpStore = new Map();

/* ---------------- GENERATE OTP ---------------- */
const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

/* ---------------- SEND OTP ---------------- */
import axios from 'axios';

// Replace these with your actual Airtel IQ credentials/details
// const AIRTEL_CONFIG = {
//     url: 'https://iqsms.airtel.in/api/v1/send-prepaid-sms',
//     authToken: process.env.AIRTEL_AUTH_TOKEN,
//     customerId: process.env.AIRTEL_CUSTOMER_ID,
//     entityId: process.env.AIRTEL_ENTITY_ID,
//     sourceAddress: process.env.AIRTEL_SOURCE_ADDR, // Usually your approved Sender ID
//     dltTemplateId: process.env.AIRTEL_TEMPLATE_ID
// };

//     export const sendOTP = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         if (!phone) {
//             return res.status(400).json({ message: "Phone number required" });
//         }

//         const otp = generateOTP();
//         const expiry = Date.now() + 5 * 60 * 1000;

//         // 1. Prepare the SMS Content (Must match your DLT approved template exactly)
//         const messageText = `Your OTP for Login is ${otp}. Valid for 5 minutes.`;

//         // 2. Call Airtel IQ API
//         const response = await axios.post(AIRTEL_CONFIG.url, {
//             customerId: AIRTEL_CONFIG.customerId,
//             destinationAddress: [phone], // API expects an array
//             dltTemplateId: AIRTEL_CONFIG.dltTemplateId,
//             entityId: AIRTEL_CONFIG.entityId,
//             message: messageText,
//             messageType: "SERVICE_IMPLICIT", // Common for OTPs
//             sourceAddress: AIRTEL_CONFIG.sourceAddress
//         }, {
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'Authorization': AIRTEL_CONFIG.authToken
//             }
//         });

//         // 3. Store OTP only if SMS was accepted by the gateway
//         if (response.status === 200 || response.status === 201) {
//             otpStore.set(phone, { otp, expiry });

//             res.status(200).json({
//                 message: "OTP sent successfully"
//             });
//         } else {
//             throw new Error("Failed to send SMS through provider");
//         }

//     } catch (err) {
//         console.error("SMS Gateway Error:", err.response?.data || err.message);
//         res.status(500).json({ message: "Failed to send OTP. Please try again." });
//     }
// };

// /* ---------------- VERIFY OTP ---------------- */
// export const verifyOTP = async (req, res) => {
//     try {
//         const { phone, otp, name } = req.body;

//         const record = otpStore.get(phone);

//         if (!record) {
//             return res.status(400).json({ message: "OTP not found. Request again." });
//         }

//         if (record.otp !== otp) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         if (record.expiry < Date.now()) {
//             otpStore.delete(phone);
//             return res.status(400).json({ message: "OTP expired" });
//         }

//         let user = await User.findOne({ phone });

//         // CREATE USER ONLY AFTER SUCCESSFUL OTP
//         if (!user) {
//             if (!name) {
//                 return res.status(400).json({ message: "Name required for signup" });
//             }

//             user = new User({
//                 phone,
//                 name,
//                 role: ["customer"]
//             });

//             await user.save();
//         }

//         // Clean OTP
//         otpStore.delete(phone);

//         const token = jwt.sign(
//             { userId: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         res.status(200).json({
//             message: "Authentication successful",
//             token,
//             user
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


// Helper to generate Basic Auth header
const getAirtelAuth = () => {
    const credentials = `${process.env.AIRTEL_USERNAME}:${process.env.AIRTEL_PASSWORD}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

/* ---------------- SEND OTP ---------------- */
export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: "Phone number required" });

        // Clean phone number (last 10 digits)
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Airtel Payload - EXACTLY matching your DLT template
        const smsPayload = {
            customerId: process.env.AIRTEL_CUSTOMER_ID,
            destinationAddress: [`91${cleanPhone}`],
            dltTemplateId: process.env.AIRTEL_TEMPLATE_ID,
            entityId: process.env.AIRTEL_ENTITY_ID,
            messageType: "SERVICE_IMPLICIT",
            sourceAddress: process.env.AIRTEL_SOURCE_ADDR,
            message: `Your OTP is ${otp} to login into GoBuild Platform Services Pvt Ltd. This OTP is valid for 10 minutes. - GoBuild`
        };

        // Send to Airtel
        await axios.post('https://iqsms.airtel.in/api/v1/send-prepaid-sms', smsPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAirtelAuth()
            }
        });

        // Store OTP in memory (Valid for 10 mins)
        otpStore.set(cleanPhone, {
            otp,
            expiry: Date.now() + 10 * 60 * 1000
        });

        res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (err) {
        console.error("Airtel Error:", err.response?.data || err.message);
        res.status(500).json({ message: "Failed to send SMS" });
    }
};

/* ---------------- VERIFY OTP ---------------- */
export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const cleanPhone = phone.replace(/\D/g, "").slice(-10);

        const record = otpStore.get(cleanPhone);

        // console.log("--- DEBUG VERIFY ---");
        // console.log("Searching for Phone:", cleanPhone);
        // console.log("Record Found in Map:", record);
        // console.log("User Sent OTP:", otp);
        // console.log("--------------------");

        if (!record) {
            return res.status(400).json({ message: "OTP not found in memory" });
        }
        if (record.expiry < Date.now()) {
            otpStore.delete(cleanPhone);
            return res.status(400).json({ message: "OTP expired" });
        }

        // MERN Logic: Check/Create User in MongoDB
        let user = await User.findOne({ phone: cleanPhone });

        if (!user) {
            if (!name) return res.status(400).json({ message: "Name required for signup" });
            user = await User.create({ phone: cleanPhone, name, role: ["customer"] });
        }

        otpStore.delete(cleanPhone);

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ success: true, token, user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
    try {
        const { phone, name } = req.body;

        if (!phone || !name) {
            return res.status(400).json({ message: "Phone and name are required" });
        }

        const user = await User.findOne({ phone });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        return sendOTP(req, res);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone required" });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }

        return sendOTP(req, res);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        // Always fetch base user
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let deliveryProfile = null;

        // If user is delivery → attach delivery data
        if (user.role.includes("delivery")) {
            deliveryProfile = await Delivery.findOne({ user: userId });
        }

        return res.status(200).json({
            success: true,
            user,
            delivery: deliveryProfile // null if not delivery
        });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};