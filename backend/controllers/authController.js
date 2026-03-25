// import User from "../model/userModel.js";
// import jwt from "jsonwebtoken";

// /* ---------------- GENERATE OTP ---------------- */
// const generateOTP = () =>
//     Math.floor(100000 + Math.random() * 900000).toString();

// /* ---------------- SEND OTP ---------------- */
// export const sendOTP = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         if (!phone) {
//             return res.status(400).json({ message: "Phone number required" });
//         }

//         const otp = generateOTP();
//         const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//         let user = await User.findOne({ phone });

//         if (!user) {
//             user = new User({
//                 phone,
//                 roles: ["customer"]
//             });
//         }

//         user.otp = otp;
//         user.otpExpiry = expiry;

//         await user.save();

//         // TODO: Replace with SMS API
//         console.log("OTP:", otp);

//         res.status(200).json({
//             message: "OTP sent successfully"
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /* ---------------- VERIFY OTP (LOGIN + SIGNUP) ---------------- */
// export const verifyOTP = async (req, res) => {
//     try {
//         const { phone, otp, name } = req.body;

//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         if (user.otp !== otp) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         if (user.otpExpiry < new Date()) {
//             return res.status(400).json({ message: "OTP expired" });
//         }

//         // If new user → complete signup
//         if (!user.name && name) {
//             user.name = name;
//         }

//         user.otp = null;
//         user.otpExpiry = null;

//         await user.save();

//         const token = jwt.sign(
//             { userId: user._id, roles: user.roles },
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

// /* ---------------- SIGNUP (OPTIONAL WRAPPER) ---------------- */
// export const signup = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         const user = await User.findOne({ phone });

//         if (user && user.name) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // Just trigger OTP
//         return sendOTP(req, res);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// /* ---------------- LOGIN (OPTIONAL WRAPPER) ---------------- */
// export const login = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         const user = await User.findOne({ phone });

//         if (!user) {
//             return res.status(400).json({ message: "User not registered" });
//         }

//         // Just trigger OTP
//         return sendOTP(req, res);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

/* ---------------- TEMP OTP STORE (Replace with Redis in production) ---------------- */
const otpStore = new Map();

/* ---------------- GENERATE OTP ---------------- */
const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

/* ---------------- SEND OTP ---------------- */
export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone number required" });
        }

        const otp = generateOTP();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 min

        // Store OTP separately (NOT in User DB)
        otpStore.set(phone, { otp, expiry });

        console.log("OTP:", otp);

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- VERIFY OTP ---------------- */
export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp, name } = req.body;

        const record = otpStore.get(phone);

        if (!record) {
            return res.status(400).json({ message: "OTP not found. Request again." });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (record.expiry < Date.now()) {
            otpStore.delete(phone);
            return res.status(400).json({ message: "OTP expired" });
        }

        let user = await User.findOne({ phone });

        // CREATE USER ONLY AFTER SUCCESSFUL OTP
        if (!user) {
            if (!name) {
                return res.status(400).json({ message: "Name required for signup" });
            }

            user = new User({
                phone,
                name,
                role: ["customer"]
            });

            await user.save();
        }

        // Clean OTP
        otpStore.delete(phone);

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Authentication successful",
            token,
            user
        });

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