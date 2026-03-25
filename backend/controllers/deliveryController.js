import Delivery from "../model/deliveryModel.js";
import User from "../model/userModel.js"
import Order from "../model/orderModel.js"

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

export const getMyDeliveryOrders = async (req, res) => {
    try {
        console.log("LOGGED IN USER:", req.user._id.toString());
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const orders = await Order.find({
            deliveryAgent: req.user._id,
            status: { $in: ["assigned", "picked", "shipped"] }
        })
            .populate("user", "name phone")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDeliveryOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const order = await Order.findOne({
            _id: orderId,
            deliveryAgent: req.user._id
        }).populate("user", "name phone");

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not assigned to you"
            });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const allowedFlow = ["picked", "shipped", "delivered"];

        if (!allowedFlow.includes(status)) {
            return res.status(400).json({ message: "Invalid delivery status" });
        }

        const order = await Order.findOne({
            _id: orderId,
            deliveryAgent: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not assigned to you"
            });
        }

        /* ---------------- STRICT FLOW CONTROL ---------------- */

        const flowMap = {
            assigned: "picked",
            picked: "shipped",
            shipped: "delivered"
        };

        if (flowMap[order.status] !== status) {
            return res.status(400).json({
                message: `Invalid transition from ${order.status} → ${status}`
            });
        }

        /* ---------------- TIMESTAMPS ---------------- */

        if (status === "picked") order.pickedAt = new Date();
        if (status === "delivered") order.deliveredAt = new Date();

        order.status = status;

        await order.save();

        res.json({
            message: "Delivery status updated",
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};