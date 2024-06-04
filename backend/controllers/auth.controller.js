import User from "../models/user.model.js";
import generateToken from "../helpers/generateToken.js";

// register
const register = async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = req.file ? req.file.filename : null;

  try {
    // check whether the current user have existed
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) return res.status(400).json({ error: { message: "User has been existed" } });

    const newUser = await new User({
      username,
      email,
      password,
      avatar
    });

    const user = await newUser.save();
    const token = generateToken.generateAccessToken(user);
    res.setHeader("Authorization", token);

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// login
const login = async (req, res, next) => {
  try {
    const token = generateToken.generateAccessToken(req.user);
    const userId = req.user._id; // Assuming req.user is populated with the user object

    // Return both token and userId
    return res.status(200).json({
      token,
      userId,
      role: req.user.role,
      avatar: req.user.avatar,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// log out
const logout = async (req, res) => {
  res.status(200).json({ message: "Logged out!" });
};

// login with google
const authGoogle = async (req, res, next) => {
  const token = generateToken.generateAccessToken(req.user);

  res.setHeader("Authorization", token);

  return res.status(200).json({ success: true });
}

export default {
  register,
  login,
  logout,
  authGoogle
}
