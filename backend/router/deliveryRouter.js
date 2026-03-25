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

router.post("/", isAuthenticated, isAdmin, createDelivery);
router.get("/", isAuthenticated, isAdmin, getAllDelivery);
router.put("/:id", isAuthenticated, isAdmin, updateDelivery);
router.delete("/:id", isAuthenticated, isAdmin, deleteDelivery);

router.get("/my-orders", isAuthenticated, isDelivery, getMyDeliveryOrders);

router.get("/order/:orderId", isAuthenticated, isDelivery, getDeliveryOrderById);

router.put("/order/:orderId/status", isAuthenticated, isDelivery, updateDeliveryStatus);

export default router;