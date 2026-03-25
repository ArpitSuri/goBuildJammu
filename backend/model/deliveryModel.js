import mongoose, { Schema } from "mongoose";

const deliverySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true},

    vehicleType: String,
    licenseNumber: String,

    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true } // ✅ REQUIRED
}, { timestamps: true });

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
