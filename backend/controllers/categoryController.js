import Category from "../model/categoryModel.js";
import slugify from "slugify";

/* ---------------- CREATE CATEGORY (ADMIN) ---------------- */
export const createCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;
        console.log(req.body)

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Generate slug
        let slug = slugify(name, { lower: true });

        // Prevent duplicate slug
        const existing = await Category.findOne({ slug });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        let level = 0;

        // If parent exists → calculate level
        if (parent) {
            const parentCategory = await Category.findById(parent);

            if (!parentCategory) {
                return res.status(400).json({ message: "Invalid parent category" });
            }

            level = parentCategory.level + 1;
        }

        const category = await Category.create({
            name,
            slug,
            parent: parent || null,
            level
        });

        res.status(201).json({
            message: "Category created",
            category
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }
};


export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parent, isActive } = req.body;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (name) {
            category.name = name;
            category.slug = slugify(name, { lower: true });
        }

        if (typeof isActive !== "undefined") {
            category.isActive = isActive;
        }

        if (parent) {
            const parentCategory = await Category.findById(parent);

            if (!parentCategory) {
                return res.status(400).json({ message: "Invalid parent category" });
            }

            category.parent = parent;
            category.level = parentCategory.level + 1;
        }

        await category.save();

        res.json({
            message: "Category updated",
            category
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Prevent deleting if it has children
        const hasChildren = await Category.findOne({ parent: id });

        if (hasChildren) {
            return res.status(400).json({
                message: "Cannot delete category with subcategories"
            });
        }

        await category.deleteOne();

        res.json({ message: "Category deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate("parent", "name slug")
            .sort({ level: 1, createdAt: -1 });

        res.json({
            count: categories.length,
            categories
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};