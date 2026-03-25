import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true },

    slug: { type: String, unique: true },

    parent: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },

    level: { type: Number, default: 0 }, // 0 = root

    image: {
        public_id: String,
        url: String
    },

    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;