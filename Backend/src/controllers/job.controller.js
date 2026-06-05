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
    console.log(req.user);
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
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
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
      workMode: job.workMode,
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

export const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      succsess: true,
      data: job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getJobsadvanced = async (req, res) => {
  try {
    const {
      skill,
      location,
      workMode,
      jobType,
      minSalary,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const pipeline = [];

    let match = { isActive: true };

    if (skill) {
      // $in -> if that skill exixts in skills array
      match.skillsRequired = { $in: [skill] };
    }
    if (location) {
      match.location = location;
    }
    if (workMode) {
      match.workMode = workMode;
    }
    if(jobType){
      match.jobType = jobType;
    }
    if (minSalary) {
      match["salary.min"] = { $gte: Number(minSalary) };
    }
    if (search) {
      match.$or = [
        // $regex -> search is "app", it will match "Apple", "WhatsApp", and "Application".
        // $options: "i" (Case Insensitivity)
        { title: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }
    pipeline.push({ $match: match });

    pipeline.push({ $sort: { createdAt: -1 } });

    const skip = (page - 1) * limit;
// $skip: Skips results from previous pages (e.g., on Page 2, it skips the first 10)
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });

    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        company: "$companyName",
        location: 1,
        workMode: 1,
        jobType: 1,
        salary: 1,
        slug: 1,
      },
    });

    const jobs = await Job.aggregate(pipeline);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const myJob = async (req , res) => {
  try{
    const jobs = await Job.find({ employerId: user._id });
    if (jobs.length === 0){
      return res.status(404).json({
        success: false,
        message: "Job not found",
      }); 
    }
    res.json({
      succsess: true,
      data: job,
    });


  }catch(err){
     res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
