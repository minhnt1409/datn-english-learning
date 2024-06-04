import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Folder from "../models/folder.model.js";

const getAll = async (req, res) => {
  try {
    const Users = await User.find();
    return res.status(200).json(Users);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("courses").populate("folders");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const create = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    const User = await newUser.save();
    return res.status(201).json(User);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const updateUser = await User.findByIdAndUpdate(id, req.body);

    if (!updateUser) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Update successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.payload.role === "admin") {
      const foundUser = await User.findByIdAndDelete(id);

      if (!foundUser) return res.status(404).json({ message: "User not found" });

      // delete all courses of user
      await Course.deleteMany({ _id: { $in: foundUser.courses } });

      // delete all folders of user
      await Folder.deleteMany({ _id: { $in: foundUser.folders } });

      return res.status(200).json({ message: "Delete successfully!" });
    } else return res.status(403).json({ message: "Only admin can delete user!" })
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default {
  getAll,
  getOne,
  create,
  update,
  deleteUser,
}