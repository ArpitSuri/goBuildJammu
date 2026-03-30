import express from "express";
import {
    createProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getSearchedProduct
} from "../controllers/productController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();

/* -------- PUBLIC -------- */
router.get("/", getProducts);
router.get("/search", getSearchedProduct);

/* -------- ADMIN -------- */
router.post("/", isAuthenticated, isAdmin, createProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);
router.put("/:id", isAuthenticated, isAdmin, updateProduct);

export default router;