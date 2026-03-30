import Order from "../model/orderModel.js";
import Cart from "../model/cartModel.js";
import Variant from "../model/varientModel.js";
import Delivery from "../model/deliveryModel.js";
import User from "../model/userModel.js";

/* ---------------- CREATE ORDER ---------------- */
// export const createOrder = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { address } = req.body;

//         if (!address) {
//             return res.status(400).json({ message: "Address required" });
//         }

//         const cart = await Cart.findOne({ user: userId });

//         if (!cart || cart.items.length === 0) {
//             return res.status(400).json({ message: "Cart is empty" });
//         }

//         let totalAmount = 0;
//         const orderItems = [];

//         // 🔥 STEP 1: VALIDATE + RESERVE STOCK (ATOMIC)
//         for (const item of cart.items) {
//             const variant = await Variant.findById(item.variant)
//                 .populate("product", "name");

//             if (!variant || !variant.isActive) {
//                 return res.status(400).json({ message: "Invalid variant in cart" });
//             }

//             const quantity = item.quantity;

//             // 🔥 ATOMIC STOCK RESERVATION
//             const updated = await Variant.findOneAndUpdate(
//                 {
//                     _id: variant._id,
//                     $expr: {
//                         $gte: [
//                             { $subtract: ["$stock", "$reservedStock"] },
//                             quantity
//                         ]
//                     }
//                 },
//                 {
//                     $inc: { reservedStock: quantity }
//                 },
//                 { new: true }
//             );

//             if (!updated) {
//                 return res.status(400).json({
//                     message: `Insufficient stock for ${variant.product.name}`
//                 });
//             }

//             // 🔥 PRICE RECALCULATION (never trust cart)
//             let price = variant.discountPrice || variant.price;

//             if (variant.bulkPricing && variant.bulkPricing.length > 0) {
//                 const applicable = variant.bulkPricing
//                     .filter(b => quantity >= b.minQty)
//                     .sort((a, b) => b.minQty - a.minQty)[0];

//                 if (applicable) {
//                     price = applicable.price;
//                 }
//             }

//             totalAmount += price * quantity;

//             orderItems.push({
//                 product: variant.product._id,
//                 variant: variant._id,
//                 name: variant.product.name,
//                 attributes: variant.attributes,
//                 quantity,
//                 price
//             });
//         }

//         // 🔥 STEP 2: CREATE ORDER
//         const order = await Order.create({
//             user: userId,
//             items: orderItems,
//             totalAmount,
//             status: "pending",
//             paymentStatus: "pending",
//             address
//         });

//         // 🔥 STEP 3: CLEAR CART
//         cart.items = [];
//         await cart.save();

//         res.status(201).json({
//             message: "Order created",
//             order
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(" from create order Router")
        console.log(req.user)
        console.log(userId)
        const { address, paymentMethod } = req.body; // ✅ Extract paymentMethod
        console.log(`address: ${address}`)
        console.log(`paymentMethod: ${paymentMethod}`)

        if (!address || !paymentMethod) {
            return res.status(400).json({ message: "Address and Payment Method are required" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const variant = await Variant.findById(item.variant).populate("product", "name");
            if (!variant || !variant.isActive) {
                return res.status(400).json({ message: "Invalid variant in cart" });
            }

            const quantity = item.quantity;

            // ATOMIC STOCK RESERVATION
            const updated = await Variant.findOneAndUpdate(
                {
                    _id: variant._id,
                    $expr: { $gte: [{ $subtract: ["$stock", "$reservedStock"] }, quantity] }
                },
                { $inc: { reservedStock: quantity } },
                { new: true }
            );

            if (!updated) {
                return res.status(400).json({ message: `Insufficient stock for ${variant.product.name}` });
            }

            let price = variant.discountPrice || variant.price;
            // ... bulk pricing logic ...
            totalAmount += price * quantity;

            orderItems.push({
                product: variant.product._id,
                variant: variant._id,
                name: variant.product.name,
                attributes: variant.attributes,
                quantity,
                price
            });
        }

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            address,
            paymentMethod, // ✅ Saved to DB
            status: "pending",
            paymentStatus: "pending"
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order created successfully", order });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- CONFIRM ORDER (AFTER PAYMENT) ---------------- */
export const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        for (const item of order.items) {
            const variant = await Variant.findById(item.variant);

            variant.stock -= item.quantity;
            variant.reservedStock -= item.quantity;

            await variant.save();
        }

        order.status = "confirmed";
        order.paymentStatus = "paid";

        await order.save();

        res.json({ message: "Order confirmed", order });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- FAIL ORDER ---------------- */
export const failOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        for (const item of order.items) {
            const variant = await Variant.findById(item.variant);

            variant.reservedStock -= item.quantity;

            await variant.save();
        }

        order.paymentStatus = "failed";

        await order.save();

        res.json({ message: "Order failed, stock released" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ---------------- GET MY ORDERS ---------------- */
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 });

        res.json({ count: orders.length, orders });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// export const getOrderById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const order = await Order.findById(id);

//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         res.json(order);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Use .populate to reach into the items array and get product images
        const order = await Order.findById(id).populate({
            path: 'items.product',
            select: 'images' // Only fetch the images field
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log(`Updating order ${orderId} with data:`, req.body);
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        /* ---------------- VALID STATUS ---------------- */
        const validStatus = ["pending", "confirmed", "assigned", "picked", "shipped", "delivered", "cancelled"];
        const validPayment = ["pending", "paid", "failed"];

        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        if (paymentStatus && !validPayment.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        /* ---------------- STOCK LOGIC ---------------- */

        // ✅ CASE 1: CONFIRM ORDER (deduct real stock)
        // if (status === "confirmed" && order.status !== "confirmed") {
        //     for (const item of order.items) {
        //         const variant = await Variant.findById(item.variant);

        //         variant.stock -= item.quantity;
        //         variant.reservedStock -= item.quantity;

        //         await variant.save();
        //     }
        // }

        // ❌ CASE 2: CANCEL / FAIL (release reserved stock)
        // if (
        //     (status === "cancelled" || paymentStatus === "failed") &&
        //     order.paymentStatus !== "failed"
        // ) {
        //     for (const item of order.items) {
        //         const variant = await Variant.findById(item.variant);

        //         variant.reservedStock -= item.quantity;

        //         await variant.save();
        //     }
        // }

        /* ---------------- UPDATE ORDER ---------------- */
        /* ---------------- UPDATE ORDER ---------------- */
        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        // This replaces: order.status = status; await order.save();
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: updateData },
            { new: true, runValidators: false }
        );

        res.json({
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log(`Updating payment for order ${orderId} with data:`, req.body);
        const { paymentStatus } = req.body;


        const validPayment = ["pending", "paid", "failed"];

        if (!validPayment.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        /* ---------------- PREVENT DOUBLE EXECUTION ---------------- */

        if (order.paymentStatus === paymentStatus) {
            return res.json({
                message: "Payment status already updated",
                order
            });
        }

        /* ---------------- STOCK LOGIC ---------------- */

        // ✅ PAYMENT SUCCESS → CONFIRM ORDER + DEDUCT STOCK
        if (paymentStatus === "paid") {
            for (const item of order.items) {
                const variant = await Variant.findById(item.variant);

                variant.stock -= item.quantity;
                variant.reservedStock -= item.quantity;

                await variant.save();
            }

            order.status = "confirmed";
        }

        // ❌ PAYMENT FAILED → RELEASE RESERVED STOCK
        if (paymentStatus === "failed") {
            for (const item of order.items) {
                const variant = await Variant.findById(item.variant);

                variant.reservedStock -= item.quantity;

                await variant.save();
            }

            order.status = "cancelled";
        }

        /* ---------------- UPDATE PAYMENT ---------------- */
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { paymentStatus, status: order.status } },
            { new: true, runValidators: false }
        );

        res.json({
            message: "Payment status updated",
            order: updatedOrder
        });
        res.json({
            message: "Payment status updated",
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json({
            count: orders.length,
            orders
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getOrderDetailsAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("user", "name email") // optional but useful
            .populate("items.product", "name");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// /* ---------------- ASSIGN DELIVERY AGENT (ADMIN) ---------------- */
export const assignDeliveryAgent = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryId } = req.body;

        console.log("Assigning:", { orderId, deliveryId });

        if (!deliveryId) {
            return res.status(400).json({ message: "Delivery agent ID required" });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (["cancelled", "delivered"].includes(order.status)) {
            return res.status(400).json({
                message: "Cannot assign delivery to this order"
            });
        }

        if (order.deliveryAgent) {
            return res.status(400).json({
                message: "Delivery agent already assigned"
            });
        }

        /* ---------------- FIX: DELIVERY → USER ---------------- */

        const delivery = await Delivery.findById(deliveryId).populate("user");

        if (!delivery) {
            return res.status(404).json({
                message: "Delivery not found"
            });
        }

        if (!delivery.isActive || !delivery.isAvailable) {
            return res.status(400).json({
                message: "Delivery agent not available"
            });
        }

        const user = delivery.user;

        console.log("Populated User Data:", user);

        if (!user || !user.isActive || !user.role.includes("delivery")) {
            return res.status(400).json({
                message: "Invalid delivery user"
            });
        }

        /* ---------------- ASSIGN ---------------- */

        order.deliveryAgent = user._id;
        order.status = "assigned";
        order.assignedAt = new Date();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    deliveryAgent: user._id,
                    status: "assigned",
                    assignedAt: new Date()
                }
            },
            { new: true, runValidators: false } // runValidators: false is the magic fix
        );

        res.json({
            message: "Delivery agent assigned successfully",
            order: updatedOrder
        });

    } catch (err) {
        console.error("ASSIGN DELIVERY ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};