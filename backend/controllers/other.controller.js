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

    // Number of courses grouped by highest score ranges
    const coursesByScoreRange = await Course.aggregate([
      {
        $bucket: {
          groupBy: "$highestScore",
          boundaries: [0, 2, 4, 6, 8, 9, 10],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          range: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-2" },
                { case: { $eq: ["$_id", 2] }, then: "2-4" },
                { case: { $eq: ["$_id", 4] }, then: "4-6" },
                { case: { $eq: ["$_id", 6] }, then: "6-8" },
                { case: { $eq: ["$_id", 8] }, then: "8-9" },
                { case: { $eq: ["$_id", 9] }, then: "9-10" },
              ],
              default: "Other",
            },
          },
          count: 1,
        },
      },
    ]);

    // Convert the result to the requested format
    const scoreRanges = {
      '0-2': 0,
      '2-4': 0,
      '4-6': 0,
      '6-8': 0,
      '8-9': 0,
      '9-10': 0,
    };

    coursesByScoreRange.forEach(range => {
      if (scoreRanges.hasOwnProperty(range.range)) {
        scoreRanges[range.range] = range.count;
      }
    });

    const results = {
      newFoldersToday,
      totalFoldersCount,
      newCoursesToday,
      totalCoursesCount,
      studiedCourses,
      notStudiedCourses,
      scoreRanges,
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
