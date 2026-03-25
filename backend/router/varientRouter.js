import express from "express";

import {
    createVariant,
    getVariantsByProduct,
    updateVariant,
    deleteVariant,
    updateStock
} from "../controllers/varientController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();

/* ---------- PUBLIC ---------- */

// Get all variants for a product
router.get("/product/:productId", getVariantsByProduct);


/* ---------- ADMIN ---------- */

// Create variant
router.post("/", isAuthenticated, isAdmin, createVariant);

// Update variant details (price, bulk pricing, etc.)
router.put("/:id", isAuthenticated, isAdmin, updateVariant);

// Soft delete variant
router.delete("/:id", isAuthenticated, isAdmin, deleteVariant);

// Update stock (purchase/inventory)
router.put("/:id/stock", isAuthenticated, isAdmin, updateStock);


export default router;