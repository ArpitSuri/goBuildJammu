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
            attributes = [],
            sku,
            price,
            discountPrice,
            stock,
            bulkPricing
        } = req.body;

        if (!product || !price) {
            return res.status(400).json({
                message: "Product and price are required"
            });
        }

        // ✅ Check product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return res.status(400).json({ message: "Invalid product" });
        }

        // 🔥 CASE 1: NO ATTRIBUTES (Simple Product)
        if (!attributes || attributes.length === 0) {

            // ❌ Prevent multiple variants for simple product
            const existing = await Variant.findOne({ product });

            if (existing) {
                return res.status(400).json({
                    message: "Simple product can only have one variant"
                });
            }

            const variant = await Variant.create({
                product,
                attributes: [],
                sku,
                price,
                discountPrice,
                stock: stock || 0,
                bulkPricing: bulkPricing || []
            });

            return res.status(201).json({
                message: "Variant created (simple product)",
                variant
            });
        }

        // 🔥 CASE 2: WITH ATTRIBUTES (Variable Product)

        const normalizedAttributes = attributes
            .map(a => ({
                attribute: a.attribute.toString(),
                value: a.value
            }))
            .sort((a, b) => a.attribute.localeCompare(b.attribute));

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

export const getTopDiscountVariants = async () => {
    try {
        const variants = await Variant.aggregate([
            {
                // Only valid discounted variants
                $match: {
                    discountPrice: { $exists: true, $ne: null },
                    isActive: true
                }
            },
            {
                // Calculate discount percentage
                $addFields: {
                    discountPercent: {
                        $multiply: [
                            {
                                $divide: [
                                    { $subtract: ["$price", "$discountPrice"] },
                                    "$price"
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            {
                // Sort highest discount first
                $sort: { discountPercent: -1 }
            },
            {
                // Limit to 10
                $limit: 10
            },
            {
                // Optional: populate product
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            }
        ]);

        return variants;
    } catch (error) {
        throw error;
    }
};