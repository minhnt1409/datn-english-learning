import mongoose, { Schema } from "mongoose";

const cardSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },

  value: {
    type: String,
    required: true
  },

  image: {
    type: String,
  },

  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
  }
}, { timestamps: true });

const Card = mongoose.model("card", cardSchema);
export default Card;