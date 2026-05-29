import CandidateProfile from "../models/CandidateProfile.js";
import EmployerProfile from "../models/EmployerProfile.js";

export const upsertProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let profile;
    
    if (role === "candidate") {
      profile = await CandidateProfile.findOneAndUpdate(
        { userId },
        {
          ...req.body,
          userId,
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
        },
      );
    }

    if (role === "employer") {
      profile = await EmployerProfile.findOneAndUpdate(
        { userId },
        {
          ...req.body,
          userId,
        },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
        },
      );
    }
    console.log({ userId, role, profile });

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

  profile = await CandidateProfile.findOne({ userId })
    .populate("userId", "name email role");

}

if (role === "employer") {

  profile = await EmployerProfile.findOne({ userId })
    .populate("userId", "name email role");

}
    

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.response?.data?.message,
    });
  }
};
