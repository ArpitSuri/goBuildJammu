import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        items: [
            {
                variant: {
                    type: Schema.Types.ObjectId,
                    ref: "Variant",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: Number,
                name: String,

                // ✅ FIXED: make it array
                attributes: [
                    {
                        name: String,
                        value: String
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);