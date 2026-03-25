// import { Schema } from "mongoose";
// const productSchema = new Schema({
//     name: String,
//     slug: String,

//     description: String,
//     brand: String,

//     category: {
//         type: Schema.Types.ObjectId,
//         ref: "Category",
//         required: true
//     },

//     supplier: {
//         type: Schema.Types.ObjectId,
//         ref: "Supplier"
//     },

//     tags: [String],

//     unit: String, // kg, piece, meter

//     specifications: {
//         type: Map,
//         of: String
//     },

//     images: [imageSchema],

//     basePrice: Number,

//     isActive: { type: Boolean, default: true },
//     isFeatured: { type: Boolean, default: false }

// }, { timestamps: true });
// const Product = mongoose.model("Product", productSchema);
// export default Product;

import mongoose, { Schema } from "mongoose";

const imageSchema = new mongoose.Schema({
    public_id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
}, { _id: false });

const productSchema = new Schema({
    name: String,
    slug: String,

    description: String,

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    brand: String,

    unit: String,

    tags: [String],

    specifications: {
        type: Map,
        of: String
    },

    images: [imageSchema],

    attributes: [
        {
            attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute" },
            value: String
        }
    ],

    isActive: Boolean
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;