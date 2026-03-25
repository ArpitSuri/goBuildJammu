import express from "express";
import {
    createSupplier,
    getAllSuppliers,
    updateSupplier,
    deleteSupplier
} from "../controllers/supplierController.js";

import { isAuthenticated, isAdmin } from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, isAdmin, createSupplier);         // CREATE
router.get("/", isAuthenticated, isAdmin, getAllSuppliers);         // LIST
router.put("/:id", isAuthenticated, isAdmin, updateSupplier);       // UPDATE
router.delete("/:id", isAuthenticated, isAdmin, deleteSupplier);    // DELETE

export default router;