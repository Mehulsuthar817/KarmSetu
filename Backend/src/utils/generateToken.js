import jwt from "jsonwebtoken";

const generateToken = (res,user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,//true in production      
    sameSite: "lax",    
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;