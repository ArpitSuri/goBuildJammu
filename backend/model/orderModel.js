import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
        {
            product: mongoose.Schema.Types.ObjectId,
            variant: mongoose.Schema.Types.ObjectId,
            image: String, // <--- ADD THIS FIELD
            name: String,
            attributes: Object,
            quantity: Number,
            price: Number
        }
    ],

    totalAmount: Number,

    status: {
        type: String,
        enum: ["pending", "confirmed", "assigned", "picked", "shipped", "delivered", "cancelled"],
        default: "pending"
    },

    // ✅ ADDED THIS FIELD
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        required: true
    },

    address: Object,

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    // ✅ NEW: Delivery Assignment
    deliveryAgent: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    // ✅ Track assignment lifecycle
    assignedAt: Date,
    pickedAt: Date,
    deliveredAt: Date

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;