import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      skillsRequired,
      location,
      salary,
      jobType,
      workMode,
    } = req.body;


    const job = await Job.create({
      title,
      description,
      companyName,
      skillsRequired,
      location,
      salary,
      jobType,
      workMode,
      employerId: req.user._id,
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
    });

    res.status(201).json({
      success: true,
      data: job,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { skill, location, minSalary, workMode } = req.query;

    let filter = { isActive: true };

    if (skill) filter.skillsRequired = { $in: [skill] };
    if (location) filter.location = location;
    if (minSalary) filter["salary.min"] = { $gte: Number(minSalary) };
    if (workMode) filter.workMode = workMode;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    const formattedJobs = jobs.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.companyName,
      location: job.location,
      salary: job.salary,
      type: job.jobType,
      workMode:job.workMode
    }));

    res.json({
      success: true,
      count: jobs.length,
      data: formattedJobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSingleJob = async (req,res)=>{
    try{
        const {id} = req.params;

        const job = await Job.findById(id);

        if(!job){
            return res.status(404).json({
                success:false,
                message: "Job not found"
            });
        }

        res.json({
            succsess:true,
            data:job
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message: err.message
        });
    }
}
