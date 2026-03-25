import jwt, { decode } from "jsonwebtoken";
import User from "../model/userModel.js";

/* ---------------- AUTHENTICATION ---------------- */
export const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await User.findById(decoded.userId).select("-otp -otpExpiry");


        if (!user || !user.isActive) {
            return res.status(401).json({ message: "User not found or inactive" });
        }

        req.user = user; // attach user to request

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

/* ---------------- ADMIN CHECK ---------------- */
export const isAdmin = (req, res, next) => {
    try {
        console.log("USER IN ADMIN CHECK:", req.user);

        if (!req.user || !Array.isArray(req.user.role)) {
            // console.log("❌ role missing or invalid");
            return res.status(403).json({ message: "Access denied - No role" });
        }

        if (!req.user.role.includes("admin")) {
            // console.log("❌ Not an admin:", req.user.role);
            return res.status(403).json({ message: "Access denied - Admin only" });
        }

        // console.log("✅ Admin verified");
        next();
    } catch (err) {
        console.log("ADMIN ERROR:", err.message);
        return res.status(500).json({ message: err.message });
    }
};

export const isSupplier = (req, res, next) => {
    if (!req.user.roles.includes("supplier")) {
        return res.status(403).json({ message: "Supplier only" });
    }
    next();
};
export const isDelivery = (req, res, next) => {
    if (!req.user.roles.includes("delivery")) {
        return res.status(403).json({ message: "Delivery only" });
    }
    next();
};