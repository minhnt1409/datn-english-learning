import Card from "../models/card.model.js";
import Course from "../models/course.model.js";
import Folder from "../models/folder.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const getAll = async (req, res) => {
  try {
    const courses = await Course.find().populate("userId").populate("folders").populate("cards");
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id).populate("cards");
    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const create = async (req, res) => {
  const { title, description, listCards, folderId } = req.body;
  try {

    const newCourse = await Course.create({
      title,
      description,
      userId: req.payload.id,
    });

    const _folderId = new mongoose.Types.ObjectId(folderId);

    if (folderId !== null && folderId !== undefined) {
      await Course.findByIdAndUpdate(newCourse._id, { $push: { folders: _folderId } });

      await Folder.findByIdAndUpdate(_folderId, { $push: { courses: newCourse._id } });
    };

    await User.findByIdAndUpdate(req.payload.id, { $push: { courses: newCourse._id } })

    const cardIds = [];
    for (let card of listCards) {
      const { key, value } = card;
      const newCard = await Card.create({
        key,
        value,
        courseId: newCourse._id,
      });

      cardIds.push(newCard._id);
    };

    newCourse.cards = cardIds;
    await newCourse.save();

    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { title, description, listCards } = req.body;
  try {
    const foundCourse = await Course.findById(id);

    if (!foundCourse) return res.status(404).json({ message: 'course not found!' });

    if (req.payload.id === foundCourse.userId.toString()) {

      await Card.deleteMany({ courseId: id });

      const updatedCourse = await Course.findByIdAndUpdate(id, {
        title,
        description,
        userId: req.payload.id,
      });

      const cardIds = [];
      for (let card of listCards) {
        const { key, value } = card;
        const newCard = await Card.create({
          key,
          value,
          courseId: updatedCourse._id,
        });

        cardIds.push(newCard._id);
      };

      updatedCourse.cards = cardIds;
      await updatedCourse.save();

      return res.status(200).json({ message: "Update successfully!", updatedCourse });
    } else return res.status(403).json({ message: "You're not allowed to edit other's course!" })
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const foundCourse = await Course.findById(id);

    if (!foundCourse) return res.status(404).json({ message: "Course not found" });

    if (req.payload.id === foundCourse.userId.toString() || req.payload.role === "admin") {

      const cards = foundCourse.cards;

      for (let card of cards) {
        await Card.findByIdAndDelete(card);
      }

      await Folder.updateMany({ courses: id }, { $pull: { courses: id } });

      const course = await Course.findByIdAndDelete(id);

      if (!course) return res.status(404).json({ message: "Course not found" });

      return res.status(200).json({ message: "Delete successfully!" });
    } else return res.status(403).json({ message: "You are not allowed to delete other's course!" })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getList = async (req, res) => {
  const { limit } = req.query;

  try {
    const courses = await Course.aggregate([
      { $sample: { size: parseInt(limit, 10) || 10 } }
    ]);
    const populatedCourses = await Promise.all(
      courses.map(course => Course.populate(course, { path: "userId" }))
    );
    return res.status(200).json(populatedCourses);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default {
  getAll,
  getOne,
  create,
  update,
  deleteCourse,
  getList,
}