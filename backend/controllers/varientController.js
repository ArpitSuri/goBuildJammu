// import Variant from "../model/varientModel.js";

// /* ---------------- CREATE VARIANT ---------------- */
// export const createVariant = async (req, res) => {
//     try {
//         const { product, attributes, sku } = req.body;

//         if (!product || !attributes || attributes.length === 0) {
//             return res.status(400).json({ message: "Invalid data" });
//         }

//         // prevent duplicate combinations
//         const existing = await Variant.findOne({
//             product,
//             attributes
//         });

//         if (existing) {
//             return res.status(400).json({ message: "Variant already exists" });
//         }

//         const variant = await Variant.create({
//             product,
//             attributes,
//             sku
//         });

//         res.status(201).json({ message: "Variant created", variant });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// export const getVariantsByProduct = async (req, res) => {
//     try {
//         const { productId } = req.params;

//         const variants = await Variant.find({ product: productId });

//         res.json({ count: variants.length, variants });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


import Variant from "../model/varientModel.js";
import Product from "../model/productModel.js";

/* ---------------- CREATE VARIANT ---------------- */
export const createVariant = async (req, res) => {
    try {
        const {
            product,
            attributes,
            sku,
            price,
            discountPrice,
            stock,
            bulkPricing
        } = req.body;

        if (!product || !attributes || attributes.length === 0 || !price) {
            return res.status(400).json({
                message: "Product, attributes, and price are required"
            });
        }

        // ✅ Check product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(400).json({ message: "Invalid product" });
        }

        // ✅ Normalize attributes (IMPORTANT for duplicate check)
        const normalizedAttributes = attributes
            .map(a => ({
                attribute: a.attribute.toString(),
                value: a.value
            }))
            .sort((a, b) => a.attribute.localeCompare(b.attribute));

        // ✅ Prevent duplicate variant combinations
        const existing = await Variant.findOne({
            product,
            attributes: normalizedAttributes
        });

        if (existing) {
            return res.status(400).json({
                message: "Variant with same attributes already exists"
            });
        }

        const variant = await Variant.create({
            product,
            attributes: normalizedAttributes,
            sku,
            price,
            discountPrice,
            stock: stock || 0,
            bulkPricing: bulkPricing || []
        });

        res.status(201).json({
            message: "Variant created",
            variant
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getVariantsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const variants = await Variant.find({
            product: productId,
            isActive: true
        })
            .populate("attributes.attribute", "name")
            .sort({ createdAt: -1 });

        res.json({
            count: variants.length,
            variants
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateVariant = async (req, res) => {
    try {
        const { id } = req.params;

        const variant = await Variant.findById(id);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        // Prevent direct overwrite of reservedStock
        const disallowedFields = ["reservedStock"];
        disallowedFields.forEach(field => delete req.body[field]);

        Object.assign(variant, req.body);

        await variant.save();

        res.json({
            message: "Variant updated",
            variant
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteVariant = async (req, res) => {
    try {
        const { id } = req.params;

        const variant = await Variant.findById(id);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        variant.isActive = false;
        await variant.save();

        res.json({ message: "Variant deactivated" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        const variant = await Variant.findById(id);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found" });
        }

        variant.stock += quantity;

        await variant.save();

        res.json({
            message: "Stock updated",
            stock: variant.stock
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};