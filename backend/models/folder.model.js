import mongoose, { Schema } from "mongoose";

const folderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  courses: [{
    type: Schema.Types.ObjectId,
    ref: "course"
  }],

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }
}, { timestamps: true });

const Folder = mongoose.model("folder", folderSchema);
export default Folder;