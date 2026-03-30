import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job Not found",
      });
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      jobTitle: job.title,
      companyName: job.companyName,
      candidateName: req.user.name,
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
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
    const applications = await Application.find({
      candidateId: req.user._id,
    }).sort({ createdAt: -1 });

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


export const updateApplicationStatus = async (req, res)=>{
    try{
        const {applicationId} = req.params;
        const {status} = req.body;
        
        const application = await Application.findByIdAndUpdate(applicationId,{status},
            {new:true}
        );
        res.json({
            success:true,
            data:application
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};