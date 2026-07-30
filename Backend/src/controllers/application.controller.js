import Application from "../models/Application.js";
import applyToJobService from "../services/application.service.js";

export const applyJob = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "Resume required",
      });
      
    }
    const application = await applyToJobService(
      req.body.jobId,
      req.user,
      req.file,
    );
    

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already applied for this job",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



export const getMyApplications = async (req, res) => {
  try {
    // application.controller.js
    const applications = await Application.find({ candidateId: req.user._id })
      .populate("jobId", "title companyName location workMode")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId });
    res.json({
      success: true,
      data: applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { returnDocument: "after" },
    );
    res.json({
      success: true,
      data: application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
