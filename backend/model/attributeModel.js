// import { Schema } from "mongoose";

// const attributeSchema = new Schema({
//     name: { type: String, required: true }, // Size, Finish

//     slug: { type: String },

//     type: {
//         type: String,
//         enum: ["select", "text", "number"]
//     },

//     options: [String], // only for select

//     category: {
//         type: Schema.Types.ObjectId,
//         ref: "Category",
//         required: true
//     },

//     isFilterable: { type: Boolean, default: true }
// });
// const Attribute = mongoose.model("Attribute", attributeSchema);
// export default Attribute;
import mongoose, { Schema } from "mongoose";
const attributeSchema = new Schema({
    name: { type: String, required: true },

    slug: { type: String },

    type: {
        type: String,
        enum: ["select", "text", "number"],
        required: true
    },

    options: [String],

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    isFilterable: { type: Boolean, default: true },

    /* ADD THESE */
    isVariant: { type: Boolean, default: false },
    unit: String,

    position: { type: Number, default: 0 }

}, { timestamps: true });
const Attribute = mongoose.model("Attribute", attributeSchema);
export default Attribute;