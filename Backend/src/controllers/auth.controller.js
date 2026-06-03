import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import CandidateProfile from "../models/CandidateProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const ExistingUser = await User.findOne({ email });

    // to check if user already exists
    if (ExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    if (role == "candidate") {
      const candi = await CandidateProfile.create({
        userId: user._id,
      });
    }
    if (role === "employer") {
      await EmployerProfile.create({
        userId: user._id,
        companyName: "My Company",
      });
    }

    res.status(201).json({
      success: true,
      message: "user registered successfuly",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    //to check if user exists or not
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exists",
      });
    }

    //checks entered credentials are valid or not
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid Credentials",
      });
    }
    //token for user
    generateToken(res, user);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({ message: "server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.json({ message: " Logged Out " });
  } catch (err) {
    console.log("LOGOUT ERROR:", err);
    return res.status(500).json({ message: "server error" });
  }
};