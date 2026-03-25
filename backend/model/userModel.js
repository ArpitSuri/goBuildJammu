// import mongoose, { Schema } from "mongoose";
// const userSchema = new Schema({
//     name: String,
//     email: String,
//     phone: String,

import mongoose, { Schema } from "mongoose";

//     password: String,

//     role: [{
//         type: String,
//         enum: ["customer", "supplier", "admin", "delivery"]
//     }],

//     otp: String,
//     otpExpiry: Date,


//     addresses: [
//         {
//             fullAddress: { type: String, required: true },
//             city: { type: String, required: true },
//             state: { type: String, required: true },
//             pincode: { type: String, required: true },
//             isDefault: { type: Boolean, default: false }
//         }
//     ],

//     isActive: { type: Boolean, default: true },

//     createdAt: { type: Date, default: Date.now }
// });
// const User = mongoose.model("User", userSchema);
// export default User;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },

    password: String,

    role: [{
        type: String,
        enum: ["customer", "supplier", "admin", "delivery"],
        default: "customer"
    }],

    otp: String,
    otpExpiry: Date,

    addresses: [
        {
            fullAddress: String,
            city: String,
            state: String,
            pincode: String,
            isDefault: { type: Boolean, default: false }
        }
    ],

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model("User" , userSchema);
export default User;