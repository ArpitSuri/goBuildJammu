import express from "express";
import {
    createAttribute,
    updateAttribute,
    deleteAttribute,
    getAttributes
} from "../controllers/attributeController.js";

import {
    isAuthenticated,
    isAdmin
} from "../middleWare/authMiddleware.js";

const router = express.Router();

// PUBLIC / FILTER USE
router.get("/", getAttributes);

// ADMIN
router.post("/", isAuthenticated, isAdmin, createAttribute);
router.put("/:id", isAuthenticated, isAdmin, updateAttribute);
router.delete("/:id", isAuthenticated, isAdmin, deleteAttribute);

export default router;