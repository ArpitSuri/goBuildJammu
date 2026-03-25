import Delivery from "../model/deliveryModel.js";
import User from "../model/userModel.js"

export const createDelivery = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            vehicleType,
            licenseNumber
        } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.role.includes("delivery")) {
                user.role.push("delivery");
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                phone,
                password,
                role: ["delivery"]
            });
        }

        const existingDelivery = await Delivery.findOne({ user: user._id });
        if (existingDelivery) {
            return res.status(400).json({ message: "Delivery person already exists" });
        }

        const delivery = await Delivery.create({
            user: user._id,
            vehicleType,
            licenseNumber
        });

        res.status(201).json({ success: true, delivery });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getAllDelivery = async (req, res) => {
    try {
        const deliveryList = await Delivery.find({ isActive: true })
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: deliveryList.length,
            delivery: deliveryList
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await Delivery.findById(id);
        if (!delivery || !delivery.isActive) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        const {
            name,
            email,
            phone,
            vehicleType,
            licenseNumber,
            isAvailable
        } = req.body;

        // update delivery
        Object.assign(delivery, {
            vehicleType,
            licenseNumber,
            isAvailable
        });

        await delivery.save();

        // update user
        await User.findByIdAndUpdate(delivery.user, {
            name,
            email,
            phone
        });

        res.status(200).json({
            success: true,
            delivery
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const deleteDelivery = async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await Delivery.findById(id);
        if (!delivery || !delivery.isActive) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        // soft delete
        delivery.isActive = false;
        await delivery.save();

        // remove role
        const user = await User.findById(delivery.user);
        if (user) {
            user.role = user.role.filter(r => r !== "delivery");
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Delivery removed"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};