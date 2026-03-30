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

// export const getMyDeliveryOrders = async (req, res) => {
//     try {
//         console.log("LOGGED IN USER:", req.user._id.toString());
//         if (!req.user) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const orders = await Order.find({
//             deliveryAgent: req.user._id,
//             status: { $in: ["assigned", "picked", "shipped"] }
//         })
//             .populate("user", "name phone")
//             .sort({ createdAt: -1 });

//         console.log("REQ USER ID:", req.user._id);
//         console.log("TYPE:", typeof req.user._id);



//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const getMyDeliveryOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 1. Find the delivery profile associated with this user
        const deliveryProfile = await Delivery.findOne({ user: req.user._id });

        if (!deliveryProfile) {
            return res.status(404).json({ message: "Delivery profile not found" });
        }

        // 2. Query orders using the DELIVERY profile ID, not the USER ID
        const orders = await Order.find({
            deliveryAgent: deliveryProfile._id, // Use the delivery profile ID here
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

        // 1. Fetch the delivery profile linked to this user
        const deliveryProfile = await Delivery.findOne({ user: req.user._id });

        if (!deliveryProfile) {
            return res.status(404).json({ message: "Delivery profile not found" });
        }

        // 2. Query using the Delivery Profile ID (_id from the delivery collection)
        const order = await Order.findOne({
            _id: orderId,
            deliveryAgent: deliveryProfile._id
        }).populate("user", "name phone");

        // Debugging logs to confirm the IDs match now
        console.log("Searching for Delivery Profile ID:", deliveryProfile._id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not assigned to your delivery profile"
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

        // 1. Get the Delivery Profile ID first
        const deliveryProfile = await Delivery.findOne({ user: req.user._id });

        if (!deliveryProfile) {
            return res.status(404).json({ message: "Delivery profile not found" });
        }

        const allowedFlow = ["picked", "shipped", "delivered"];

        if (!allowedFlow.includes(status)) {
            return res.status(400).json({ message: "Invalid delivery status" });
        }

        // 2. Query using deliveryProfile._id
        const order = await Order.findOne({
            _id: orderId,
            deliveryAgent: deliveryProfile._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or not assigned to your delivery profile"
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
                message: `Invalid transition from ${order.status} to ${status}`
            });
        }

        /* ---------------- TIMESTAMPS & LOGIC ---------------- */

        // Replace your order.save() block with this:
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, deliveryAgent: deliveryProfile._id },
            {
                $set: {
                    status: status,
                    pickedAt: status === "picked" ? new Date() : order.pickedAt,
                    deliveredAt: status === "delivered" ? new Date() : order.deliveredAt
                }
            },
            { new: true } // returns the updated document
        );

        if (status === "delivered") {
            await Delivery.findByIdAndUpdate(deliveryProfile._id, { isAvailable: true });
        }

        res.json({
            success: true,
            message: "Delivery status updated",
            order: updatedOrder
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};