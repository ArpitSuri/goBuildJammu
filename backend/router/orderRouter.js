import express from "express";

import {
    createOrder,
    confirmOrder,
    failOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getAllOrders,
    getOrderDetailsAdmin,
    assignDeliveryAgent
} from "../controllers/orderController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();

/* ---------- USER ROUTES ---------- */

// Create order (checkout)
router.post("/", isAuthenticated, createOrder);

router.get("/", isAuthenticated, isAdmin, getAllOrders);

// Get logged-in user's orders
router.get("/my", isAuthenticated, getMyOrders);

// Get single order (user can view own order)
router.get("/:id", isAuthenticated, getOrderById);


/* ---------- ADMIN ROUTES ---------- */



// Confirm order (after payment success)
router.put("/:orderId/confirm", isAuthenticated, isAdmin, confirmOrder);

// Mark order as failed (payment failure)
router.put("/:orderId/fail", isAuthenticated, isAdmin, failOrder);

router.put("/:orderId/status", isAuthenticated, isAdmin, updateOrderStatus);

router.put("/:orderId/payment", isAuthenticated, isAdmin, updatePaymentStatus);

router.get("/admin/:id", isAuthenticated, isAdmin, getOrderDetailsAdmin);

router.put(
    "/assign-delivery/:orderId", isAuthenticated, isAdmin, assignDeliveryAgent);

export default router;