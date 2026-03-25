import Attribute from "../model/attributeModel.js";
import Category from "../model/categoryModel.js";
import slugify from "slugify";

/* ---------------- CREATE ATTRIBUTE ---------------- */
export const createAttribute = async (req, res) => {
    try {
        let { name, type, options, category, isVariant, unit } = req.body;

        if (!name || !type || !category) {
            return res.status(400).json({
                message: "Name, type, category required"
            });
        }

        // ✅ Validate category
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: "Invalid category" });
        }

        // ✅ Normalize options
        if (type === "select") {
            if (!options || options.length === 0) {
                return res.status(400).json({
                    message: "Options required for select type"
                });
            }

            options = [...new Set(options.map(o => o.trim()))];
        } else {
            options = [];
        }

        // ✅ Slug handling
        let slug = slugify(name, { lower: true });

        const existing = await Attribute.findOne({ slug, category });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        const attribute = await Attribute.create({
            name,
            slug,
            type,
            options,
            category,
            isVariant: isVariant || false,
            unit: unit || null
        });

        res.status(201).json({
            message: "Attribute created",
            attribute
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Attribute already exists for this category"
            });
        }
        res.status(500).json({ message: err.message });
    }
};


export const updateAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, type, options, isVariant, unit, isFilterable } = req.body;

        const attribute = await Attribute.findById(id);

        if (!attribute) {
            return res.status(404).json({ message: "Attribute not found" });
        }

        // ✅ Determine final values (IMPORTANT FIX)
        const finalType = type || attribute.type;

        let finalOptions = options !== undefined ? options : attribute.options;

        // ✅ Normalize options
        if (finalType === "select") {
            if (!finalOptions || finalOptions.length === 0) {
                return res.status(400).json({
                    message: "Options required for select type"
                });
            }

            finalOptions = [...new Set(finalOptions.map(o => o.trim()))];
        } else {
            finalOptions = [];
        }

        // ✅ Apply updates
        if (name) {
            attribute.name = name;

            let slug = slugify(name, { lower: true });

            const existing = await Attribute.findOne({
                slug,
                category: attribute.category,
                _id: { $ne: id }
            });

            if (existing) {
                slug = `${slug}-${Date.now()}`;
            }

            attribute.slug = slug;
        }

        attribute.type = finalType;
        attribute.options = finalOptions;

        if (typeof isVariant !== "undefined") {
            attribute.isVariant = isVariant;
        }

        if (typeof isFilterable !== "undefined") {
            attribute.isFilterable = isFilterable;
        }

        if (unit !== undefined) {
            attribute.unit = unit;
        }

        await attribute.save();

        res.json({
            message: "Attribute updated",
            attribute
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteAttribute = async (req, res) => {
    try {
        const { id } = req.params;

        const attribute = await Attribute.findById(id);

        if (!attribute) {
            return res.status(404).json({ message: "Attribute not found" });
        }

        // ✅ Soft disable instead of delete
        attribute.isFilterable = false;
        await attribute.save();

        res.json({ message: "Attribute disabled" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAttributes = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        const attributes = await Attribute.find(filter)
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        res.json({
            count: attributes.length,
            attributes
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};