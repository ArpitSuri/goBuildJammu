import express from "express";

import {
    addToCart,
    updateCartItem,
    removeCartItem,
    getCart,
    clearCart
} from "../controllers/cartController.js";

import { isAuthenticated } from "../middleWare/authMiddleware.js";

const router = express.Router();

/* ---------- USER ONLY (AUTH REQUIRED) ---------- */

// Get user's cart
router.get("/", isAuthenticated, getCart);

// Add item to cart
router.post("/", isAuthenticated, addToCart);

// Update quantity
router.put("/", isAuthenticated, updateCartItem);

// Remove specific item
router.delete("/:variantId", isAuthenticated, removeCartItem);

// Clear entire cart
router.delete("/", isAuthenticated, clearCart);

export default router;