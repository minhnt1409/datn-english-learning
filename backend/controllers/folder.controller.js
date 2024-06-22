import Folder from "../models/folder.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

const getAll = async (req, res) => {
  try {
    const folders = await Folder.find().populate("userId");
    return res.status(200).json(folders);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await Folder.findById(id).populate("courses");
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    return res.status(200).json(folder);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const create = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newFolder = await new Folder({
      title,
      description,
      userId: req.payload.id,
    });
    const folder = await newFolder.save();
    await User.findByIdAndUpdate(req.payload.id, { $push: { folders: folder._id } })
    return res.status(201).json(folder);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const foundFolder = await Folder.findById(id);

    if (!foundFolder) return res.status(404).json({ message: "Folder not found" });

    if (req.payload.id === foundFolder.userId.toString()) {

      await Folder.findByIdAndUpdate(id, req.body);

      return res.status(200).json({ message: "Update successfully!" });
    } else return res.status(403).json({ message: "You are not allow to edit other's folder!" })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    const foundFolder = await Folder.findById(id);

    if (!foundFolder) return res.status(404).json({ message: "Folder not found" });

    if (req.payload.id === foundFolder.userId.toString() || req.payload.role === "admin") {

      console.log("ok");
      await Folder.findByIdAndDelete(id);

      return res.status(200).json({ message: "Delete successfully!" });
    } else return res.status(403).json({ message: "You are not allowed to delete other's folder!" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const addCourse = async (req, res, next) => {
  const { folderId, courseId } = req.params;
  try {
    const foundFolder = await Folder.findById(folderId);

    if (!foundFolder) return res.status(404).json({ message: 'Folder not found!' });

    if (req.payload.id === foundFolder.userId.toString()) {

      if (foundFolder.courses.includes(courseId)) {
        return res.status(400).json({ message: "Course has been added to this folder!" });
      } else {
        const folder = await Folder.findByIdAndUpdate(folderId, { $push: { courses: courseId } }, { new: true });
        return res.status(200).json(folder);
      }

    } else return res.status(403).json({ message: "You are not allowed to add course to other's folder!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  };
};

const deleteCourse = async (req, res, next) => {
  const { folderId, courseId } = req.params;
  try {
    const foundFolder = await Folder.findById(folderId);

    if (!foundFolder) return res.status(404).json({ message: 'Folder not found!' });

    if (req.payload.id === foundFolder.userId.toString()) {

      const folder = await Folder.findByIdAndUpdate(folderId, { $pull: { courses: courseId } }, { new: true });

      return res.status(200).json({ message: "Delete course successfully!", folder });

    } else return res.status(403).json({ message: "You are not allowed to delete course in other's folder!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  };
};

const getList = async (req, res) => {
  const { limit } = req.query;

  try {
    const folders = await Folder.aggregate([
      { $sample: { size: parseInt(limit, 10) || 10 } }
    ]);
    const populatedFolders = await Promise.all(
      folders.map(folder => Folder.populate(folder, { path: "userId" }))
    );
    return res.status(200).json(populatedFolders);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default {
  getAll,
  create,
  getOne,
  update,
  deleteFolder,
  addCourse,
  deleteCourse,
  getList,
}