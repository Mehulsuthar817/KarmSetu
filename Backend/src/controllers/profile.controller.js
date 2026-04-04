import CandidateProfile from "../models/CandidateProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";

export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let profile;
    console.log({userId,role,profile}); 
    if (role === "candidate") {
      profile = await CandidateProfile.findOneAndUpdate(
        { userId },
        { ...req.body },
        { upsert: true, returnDocument: "after" },
      );
    }

    if (role === "employer") {
      profile = await EmployerProfile.findOneAndUpdate(
        { userId },
        { ...req.body },
        { upsert: true, returnDocument: "after" },
      );
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: err.message,
    });
  }
};

export const getMyprofile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let profile;
    
    if (role === "candidate") {
      profile = await CandidateProfile.findOne({ userId });
    }
    if (role === "employer") {
      profile = await EmployerProfile.findOne({ userId });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
