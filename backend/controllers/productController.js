// import Product from "../model/productModel.js";
// import slugify from "slugify";

// /* ---------------- CREATE PRODUCT (ADMIN) ---------------- */
// export const createProduct = async (req, res) => {
//     try {
//         const { name, description, category, brand, unit, tags, specifications } = req.body;

//         if (!name || !category) {
//             return res.status(400).json({ message: "Name and category required" });
//         }

//         let slug = slugify(name, { lower: true });

//         const product = await Product.create({
//             name,
//             slug,
//             description,
//             category,
//             brand,
//             unit,
//             tags,
//             specifications
//         });

//         res.status(201).json({ message: "Product created", product });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// export const getProducts = async (req, res) => {
//     try {
//         const { category, search } = req.query;

//         const filter = { isActive: true };

//         if (category) filter.category = category;
//         if (search) filter.name = { $regex: search, $options: "i" };

//         const products = await Product.find(filter)
//             .populate("category", "name slug")
//             .sort({ createdAt: -1 });

//         res.json({ count: products.length, products });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// export const deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params;

//         await Product.findByIdAndDelete(id);

//         res.json({ message: "Product deleted" });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


import Product from "../model/productModel.js";
import Category from "../model/categoryModel.js";
import slugify from "slugify";

// export const createProduct = async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             category,
//             brand,
//             unit,
//             tags,
//             specifications,
//             attributes
//         } = req.body;

//         if (!name || !category) {
//             return res.status(400).json({ message: "Name and category required" });
//         }

//         // ✅ Validate category
//         const categoryExists = await Category.findById(category);
//         if (!categoryExists) {
//             return res.status(400).json({ message: "Invalid category" });
//         }

//         // ✅ Slug with collision handling
//         let slug = slugify(name, { lower: true });
//         const existing = await Product.findOne({ slug });
//         if (existing) {
//             slug = `${slug}-${Date.now()}`;
//         }

//         const product = await Product.create({
//             name,
//             slug,
//             description,
//             category,
//             brand,
//             unit,
//             tags,
//             specifications,
//             attributes: attributes || [],
//             isActive: true
//         });

//         res.status(201).json({
//             message: "Product created",
//             product
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            brand,
            unit,
            tags,
            specifications,
            attributes,
            images
        } = req.body;

        /* ---------------- BASIC VALIDATION ---------------- */

        if (!name || !category) {
            return res.status(400).json({ message: "Name and category required" });
        }

        // Validate category
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: "Invalid category" });
        }

        /* ---------------- IMAGE VALIDATION ---------------- */

        if (images && !Array.isArray(images)) {
            return res.status(400).json({ message: "Images must be an array" });
        }

        if (images && images.length > 5) {
            return res.status(400).json({ message: "Max 5 images allowed" });
        }

        let validImages = [];

        if (images) {
            validImages = images.filter(img =>
                img?.url && img?.public_id
            );
        }

        /* ---------------- SLUG ---------------- */

        let slug = slugify(name, { lower: true });
        const existing = await Product.findOne({ slug });

        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        /* ---------------- CREATE PRODUCT ---------------- */

        const product = await Product.create({
            name,
            slug,
            description,
            category,
            brand,
            unit,
            tags,
            specifications,
            attributes: attributes || [],
            images: validImages,
            isActive: true
        });

        res.status(201).json({
            message: "Product created",
            product
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// export const getProducts = async (req, res) => {
//     try {
//         const {
//             category,
//             search,
//             page = 1,
//             limit = 10
//         } = req.query;

//         const filter = { isActive: true };

//         if (category) filter.category = category;
//         if (search) filter.name = { $regex: search, $options: "i" };

//         const skip = (page - 1) * limit;

//         const products = await Product.find(filter)
//             .populate("category", "name slug")
//             .skip(skip)
//             .limit(Number(limit))
//             .sort({ createdAt: -1 });

//         const total = await Product.countDocuments(filter);

//         res.json({
//             total,
//             page: Number(page),
//             pages: Math.ceil(total / limit),
//             products
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// export const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         Object.assign(product, req.body);

//         if (req.body.name) {
//             product.slug = slugify(req.body.name, { lower: true });
//         }

//         await product.save();

//         res.json({
//             message: "Product updated",
//             product
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


    // export const getProducts = async (req, res) => {
    //     try {
    //         const { category, search, page = 1, limit = 10 } = req.query;

    //         const pageNum = Number(page);
    //         const limitNum = Number(limit);

    //         const filter = { isActive: true };

    //         if (category) {
    //             const cat = await Category.findById(category);

    //             if (cat.level === 0) {
    //                 // 🔥 Parent → get children
    //                 const children = await Category.find({ parent: category });

    //                 filter.category = {
    //                     $in: children.map(c => c._id)
    //                 };
    //             } else {
    //                 // Child category
    //                 filter.category = category;
    //             }
    //         }

    //         if (search) {
    //             filter.name = { $regex: search, $options: "i" };
    //         }

    //         const skip = (pageNum - 1) * limitNum;

    //         const products = await Product.find(filter)
    //             .populate("category", "name slug")
    //             .skip(skip)
    //             .limit(limitNum)
    //             .sort({ createdAt: -1 });

    //         const total = await Product.countDocuments(filter);

    //         res.json({
    //             total,
    //             page: pageNum,
    //             pages: Math.ceil(total / limitNum),
    //             products
    //         });

    //     } catch (err) {
    //         res.status(500).json({ message: err.message });
    //     }
    // };

import Variant from "../model/varientModel.js";

export const getProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (search) filter.name = { $regex: search, $options: "i" };

        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        // 🔥 attach min price
        const productsWithPrice = await Promise.all(
            products.map(async (p) => {
                const variants = await Variant.find({ product: p._id });

                let minPrice = null;

                if (variants.length > 0) {
                    minPrice = Math.min(
                        ...variants.map(v => v.discountPrice || v.price)
                    );
                }

                return {
                    ...p.toObject(),
                    minPrice
                };
            })
        );

        const total = await Product.countDocuments(filter);

        res.json({
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            products: productsWithPrice
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            category,
            brand,
            unit,
            tags,
            specifications,
            attributes,
            images
        } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        /* ---------------- CATEGORY VALIDATION ---------------- */

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ message: "Invalid category" });
            }
            product.category = category;
        }

        /* ---------------- IMAGE VALIDATION ---------------- */

        if (images !== undefined) {
            if (!Array.isArray(images)) {
                return res.status(400).json({ message: "Images must be an array" });
            }

            if (images.length > 5) {
                return res.status(400).json({ message: "Max 5 images allowed" });
            }

            for (const img of images) {
                if (!img?.url || !img?.public_id) {
                    return res.status(400).json({
                        message: "Invalid image format"
                    });
                }
            }

            product.images = images;
        }

        /* ---------------- ATTRIBUTE VALIDATION ---------------- */

        if (attributes !== undefined) {
            for (const attr of attributes) {
                const exists = await Attribute.findById(attr.attribute);

                if (!exists) {
                    return res.status(400).json({ message: "Invalid attribute" });
                }

                if (
                    product.category &&
                    exists.category.toString() !== product.category.toString()
                ) {
                    return res.status(400).json({
                        message: "Attribute does not belong to this category"
                    });
                }
            }

            product.attributes = attributes;
        }

        /* ---------------- BASIC FIELDS ---------------- */

        if (name) {
            product.name = name;

            let slug = slugify(name, { lower: true });
            const existing = await Product.findOne({
                slug,
                _id: { $ne: id }
            });

            if (existing) {
                slug = `${slug}-${Date.now()}`;
            }

            product.slug = slug;
        }

        if (description !== undefined) product.description = description;
        if (brand !== undefined) product.brand = brand;
        if (unit !== undefined) product.unit = unit;
        if (tags !== undefined) product.tags = tags;
        if (specifications !== undefined) product.specifications = specifications;

        /* ---------------- SAVE ---------------- */

        await product.save();

        res.json({
            message: "Product updated",
            product
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.isActive = false;
        await product.save();

        res.json({ message: "Product deactivated" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getSearchedProduct =async (req, res) => {
    try {
        const { q } = req.query; 
        if (!q) return res.json([]);

        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ]
        }).limit(10).populate("category");

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Search failed", error });
    }
}; async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) return res.status(200).json([]);

        // This performs a fuzzy search
        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } } // Assuming you have a brand field
            ]
        })
            .select('name images variants') // Only select needed fields for speed
            .limit(20);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

