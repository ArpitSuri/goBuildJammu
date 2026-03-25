import { Schema } from "mongoose";

const reviewSchema = new Schema({
    user: ObjectId,
    product: ObjectId,

    rating: Number,
    comment: String
});
const Review = mongoose.model("Review", reviewSchema);
export default Review;