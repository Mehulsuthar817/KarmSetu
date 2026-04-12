import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const applyToJobService = async (jobId, user, file) => {
  const job = await Job.findById(jobId);
    
  if (!job) throw new Error("Job not Found");

  const application = await Application.create({
    jobId,
    candidateId: user._id,
    jobTitle: job.title,
    companyName: job.companyName,
    candidateName: user.name,
    resume: {
      url: file?.path,
      public_id: file?.filename,
    },

  });

  const employer = await User.findById(job.employerId);

  await sendEmail(employer.email, "New Application", `${user.name} applied`);

  return application;
};

export default applyToJobService;
