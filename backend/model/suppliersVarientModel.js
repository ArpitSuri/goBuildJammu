import { Schema } from "mongoose";

const supplierVariantSchema = new Schema({
    supplier: {
        type: ObjectId,
        ref: "User" // supplier role
    },

    variant: {
        type: ObjectId,
        ref: "Variant"
    },

    price: Number,
    discountPrice: Number,

    stock: Number,
    reservedStock: { type: Number, default: 0 },

    bulkPricing: [
        {
            minQty: Number,
            price: Number
        }
    ],

    leadTime: Number, // days

    isActive: { type: Boolean, default: true }
});
const SupplierVariant = mongoose.model("SupplierVariant", supplierVariantSchema);
export default SupplierVariant;