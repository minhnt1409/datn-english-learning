import mongoose, { Schema } from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  folders: [{
    type: Schema.Types.ObjectId,
    ref: 'folder',
  }],

  cards: [{
    type: Schema.Types.ObjectId,
    ref: "card",
  }],

  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  highestScore: { type: Number, default: 0 },
  latestScore: { type: Number, default: 0 },
  latestStudyTime: { type: Date, default: null },
  studied: { type: Boolean, default: false },

}, { timestamps: true });

const Course = mongoose.model("course", courseSchema);
export default Course;