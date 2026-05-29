import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "not authorised, no token",
      });
    }
    // token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // puting user details in req user so we can get it anywhere in single https req
    // and .select("-password") means give me user details except password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    // it is green light in express js told move tp next function in line
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
