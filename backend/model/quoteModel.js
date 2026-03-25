import { Schema } from "mongoose";

const quoteSchema = new Schema({
    user: { type: ObjectId, ref: "User" },

    items: [
        {
            variant: ObjectId,
            quantity: Number
        }
    ],

    status: {
        type: String,
        enum: ["requested", "responded", "accepted", "rejected"]
    },

    adminResponse: {
        price: Number,
        message: String
    }
}, { timestamps: true });
const Quote = mongoose.model("Quote", quoteSchema);
export default Quote;