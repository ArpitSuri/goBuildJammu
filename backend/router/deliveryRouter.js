import express from "express";
import {
    createDelivery,
    getAllDelivery,
    updateDelivery,
    deleteDelivery,
    getMyDeliveryOrders,
    getDeliveryOrderById,
    updateDeliveryStatus
} from "../controllers/deliveryController.js";

import { isAuthenticated, isAdmin , isDelivery } from "../middleWare/authMiddleware.js";

const router = express.Router();

// ✅ SPECIFIC routes FIRST
router.get("/my-orders", isAuthenticated, isDelivery, getMyDeliveryOrders);
router.get("/order/:orderId", isAuthenticated, isDelivery, getDeliveryOrderById);
router.put("/order/:orderId/status", isAuthenticated, isDelivery, updateDeliveryStatus);

// ✅ GENERIC routes AFTER
router.get("/", isAuthenticated, isAdmin, getAllDelivery);
router.post("/", isAuthenticated, isAdmin, createDelivery);
router.put("/:id", isAuthenticated, isAdmin, updateDelivery);
router.delete("/:id", isAuthenticated, isAdmin, deleteDelivery);

export default router;