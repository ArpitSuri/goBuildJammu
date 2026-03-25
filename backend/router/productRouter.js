import express from "express";
import {
    createProduct,
    getProducts,
    deleteProduct,
    updateProduct
} from "../controllers/productController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();

/* -------- PUBLIC -------- */
router.get("/", getProducts);

/* -------- ADMIN -------- */
router.post("/", isAuthenticated, isAdmin, createProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);
router.put("/:id", isAuthenticated, isAdmin, updateProduct);

export default router;