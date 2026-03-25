import express from "express";
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
} from "../controllers/categoryController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllCategories);

// ADMIN
router.post("/", isAuthenticated, isAdmin, createCategory);
router.put("/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;