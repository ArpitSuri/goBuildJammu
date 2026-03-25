// import { Schema } from "mongoose";

import mongoose, { Schema } from "mongoose";

// const supplierSchema = new Schema({
//     name: String,

//     phone: String,
//     email: String,

//     address: String,

//     gstNumber: String,

//     isActive: { type: Boolean, default: true }
// });
// const Supplier = mongoose.model("Supplier", supplierSchema);
// export default Supplier;

// const supplierSchema = new Schema({
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },

//     businessName: String,
//     gstNumber: String,

//     address: String,
//     city: String,
//     state: String,
//     pinCode: String,

//     isApproved: { type: Boolean, default: false }
// });
// const Supplier = mongoose.model("Supplier", supplierSchema);
// export default Supplier;

const supplierSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    businessName: String,
    gstNumber: String,

    address: String,
    city: String,
    state: String,
    pinCode: String,

    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true } // ✅ REQUIRED
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;