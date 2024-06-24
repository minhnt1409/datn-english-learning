import Course from "../models/course.model.js";
import Folder from "../models/folder.model.js";
import User from "../models/user.model.js";

const search = async (req, res, next) => {
  const { query } = req.params;

  try {
    const folders = await Folder.find({ title: new RegExp(query, "i") });
    const courses = await Course.find({ title: new RegExp(query, "i") });
    const users = await User.find({ username: new RegExp(query, "i") });

    const results = {
      folders,
      courses,
      users,
    };

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const updateCourseScore = async (req, res) => {
  const { courseId } = req.params;
  const { score, studyTime } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.latestScore = score;
    course.latestStudyTime = studyTime;
    course.studied = true;

    if (score > course.highestScore) {
      course.highestScore = score;
    }

    await course.save();

    return res.status(200).json({ message: "Course score updated successfully", course });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStatistics = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Number of folders created today
    const newFoldersToday = await Folder.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const totalFoldersCount = await Folder.countDocuments();

    // Number of courses created today
    const newCoursesToday = await Course.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const totalCoursesCount = await Course.countDocuments();

    // Number of courses studied and not studied
    const studiedCourses = await Course.countDocuments({ studied: true });
    const notStudiedCourses = await Course.countDocuments({ studied: false });

    // Count courses based on their scores
    const scoreRanges = [
      { range: "0-2", min: 0, max: 2 },
      { range: "2-4", min: 2, max: 4 },
      { range: "4-6", min: 4, max: 6 },
      { range: "6-8", min: 6, max: 8 },
      { range: "8-9", min: 8, max: 9 },
      { range: "9-10", min: 9, max: 10.1 },
    ];

    const courseScores = await Promise.all(
      scoreRanges.map(async ({ range, min, max }) => {
        const count = await Course.countDocuments({
          highestScore: { $gte: min, $lt: max },
        });
        return { range, count };
      })
    );

    const results = {
      newFoldersToday,
      totalFoldersCount,
      newCoursesToday,
      totalCoursesCount,
      studiedCourses,
      notStudiedCourses,
      courseScores,
    };

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  search,
  updateCourseScore,
  getStatistics,
};
