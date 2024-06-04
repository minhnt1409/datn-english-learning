import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  avatar: {
    type: String,
    default: null
  },

  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters"]
  },

  authType: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  authGoogleId: {
    type: String,
    default: null,
  },

  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },

  folders: [{
    type: Schema.Types.ObjectId,
    ref: 'folder'
  }],

  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'course',
  }],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  try {
    if (this.authType !== "local") next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
}

const User = mongoose.model("user", userSchema);
export default User;