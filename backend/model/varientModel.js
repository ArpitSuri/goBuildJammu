// import { Schema } from "mongoose";

// const variantSchema = new Schema({
//     product: {
//         type: Schema.Types.ObjectId,
//         ref: "Product",
//         index: true
//     },

//     attributes: {
//         type: Map,
//         of: String
//     },

//     sku: String,

//     price: Number,
//     discountPrice: Number,

//     stock: Number,
//     reservedStock: { type: Number, default: 0 },

//     bulkPricing: [
//         {
//             minQty: Number,
//             price: Number
//         }
//     ],

//     images: [imageSchema]
// }, { timestamps: true });
// const Variant = mongoose.model("Variant", variantSchema);
// export default Variant;


// const variantSchema = new Schema({
//     product: { type: ObjectId, ref: "Product" },

//     attributes: [
//         {
//             attribute: { type: ObjectId, ref: "Attribute" },
//             value: String
//         }
//     ],

//     sku: String
// });
// const Variant = mongoose.model("Variant", variantSchema);
// export default Variant;

import mongoose, { Schema } from "mongoose";
const variantSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    attributes: [
        {
            attribute: { type:mongoose.Schema.Types.ObjectId, ref: "Attribute" },
            value: String
        }
    ],

    sku: { type: String, unique: true },

    /* 🔥 CORE BUSINESS FIELDS */
    price: { type: Number, required: true },
    discountPrice: Number,

    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },

    bulkPricing: [
        {
            minQty: Number,
            price: Number
        }
    ],

    isActive: { type: Boolean, default: true }

}, { timestamps: true });

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;