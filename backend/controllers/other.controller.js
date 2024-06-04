import Course from "../models/course.model.js";
import Folder from "../models/folder.model.js";
import User from "../models/user.model.js";

const search = async (req, res, next) => {
  const { query } = req.params;

  try {
    // tìm folder theo title
    const folders = await Folder.find({ title: new RegExp(query, "i") });

    // tìm course theo title
    const courses = await Course.find({ title: new RegExp(query, "i") });

    // tìm user theo username
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
}

export {
  search,
}