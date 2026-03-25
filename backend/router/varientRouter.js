import express from "express";

import {
    createVariant,
    getVariantsByProduct,
    updateVariant,
    deleteVariant,
    updateStock,
    getTopDiscountVariants
} from "../controllers/varientController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();
// PUBLIC
router.get("/discount", getTopDiscountVariants);
router.get("/product/:productId", getVariantsByProduct);

// ADMIN
router.post("/", isAuthenticated, isAdmin, createVariant);
router.put("/:id", isAuthenticated, isAdmin, updateVariant);
router.delete("/:id", isAuthenticated, isAdmin, deleteVariant);
router.put("/:id/stock", isAuthenticated, isAdmin, updateStock);
export default router;