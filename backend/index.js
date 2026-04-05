import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./utils/dbConnection.js";

// Routes
import authRoutes from "./router/authRouter.js";
import categoryRoutes from "./router/categoryRouter.js";
import attributeRoutes from "./router/attributeRouter.js";
import productRoutes from "./router/productRouter.js";
import variantRoutes from "./router/varientRouter.js";
import cartRoutes from "./router/cartRouter.js";
import orderRoutes from "./router/orderRouter.js";
import deliveryRoutes from "./router/deliveryRouter.js"
import supplierRoutes from "./router/supplierRouter.js"
import { getSitemap } from "./utils/sitemapConnection.js";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery",deliveryRoutes);
app.use("/api/suppliers",supplierRoutes )
app.get("/sitemap.xml", getSitemap);


/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
    res.send("API Running...");
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});