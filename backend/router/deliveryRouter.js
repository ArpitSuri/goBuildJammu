import express from "express";
import {
    createDelivery,
    getAllDelivery,
    updateDelivery,
    deleteDelivery
} from "../controllers/deliveryController.js";

import { isAuthenticated, isAdmin } from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, isAdmin, createDelivery);
router.get("/", isAuthenticated, isAdmin, getAllDelivery);
router.put("/:id", isAuthenticated, isAdmin, updateDelivery);
router.delete("/:id", isAuthenticated, isAdmin, deleteDelivery);

export default router;