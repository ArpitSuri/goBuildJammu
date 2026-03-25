import User from "../model/userModel.js";
import Supplier from "../model/supplierModel.js";

export const createSupplier = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            businessName,
            gstNumber,
            address,
            city,
            state,
            pinCode
        } = req.body;

        // check existing user
        let user = await User.findOne({ email });

        if (user) {
            if (!user.role.includes("supplier")) {
                user.role.push("supplier");
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                phone,
                password,
                role: ["supplier"]
            });
        }

        // prevent duplicate supplier
        const existingSupplier = await Supplier.findOne({ user: user._id });
        if (existingSupplier) {
            return res.status(400).json({ message: "Supplier already exists" });
        }

        const supplier = await Supplier.create({
            user: user._id,
            businessName,
            gstNumber,
            address,
            city,
            state,
            pinCode
        });

        res.status(201).json({ success: true, supplier });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ isActive: true })
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: suppliers.length,
            suppliers
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const supplier = await Supplier.findById(id);
        if (!supplier || !supplier.isActive) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const {
            name,
            email,
            phone,
            businessName,
            gstNumber,
            address,
            city,
            state,
            pinCode,
            isApproved
        } = req.body;

        // update supplier fields
        Object.assign(supplier, {
            businessName,
            gstNumber,
            address,
            city,
            state,
            pinCode,
            isApproved
        });

        await supplier.save();

        // update user
        await User.findByIdAndUpdate(supplier.user, {
            name,
            email,
            phone
        });

        res.status(200).json({
            success: true,
            supplier
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const supplier = await Supplier.findById(id);
        if (!supplier || !supplier.isActive) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        // soft delete supplier
        supplier.isActive = false;
        await supplier.save();

        // remove supplier role from user
        const user = await User.findById(supplier.user);
        if (user) {
            user.role = user.role.filter(r => r !== "supplier");
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Supplier removed (soft delete)"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};