import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api/axios";
import { useAuth } from "../context/Authcontext";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", duration: 1.2, bounce: 0.25, delay },
});

const Badge = ({ children, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-500/20 border-indigo-400/30 text-indigo-200",
    emerald: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    amber: "bg-amber-500/20 border-amber-400/30 text-amber-200",
  };
  return (
    <span
      className={`px-3 py-1.5 border rounded-full text-xs font-semibold uppercase tracking-widest ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default function JobDetails() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getJob = async () => {
    try {
      const res = await API.get(`/jobs/${slug}/${id}`);
      console.log(res.data);
      setJob(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJob();
  }, []);

  const handleApply = async () => {
    if (!file) {
      setMessage("Please attach your resume before applying.");
      return;
    }
    setApplying(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("jobId", job._id);
      formData.append("resume", file);
      await API.post("/applications/apply", formData);
      setMessage("✓ Application submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)",
        }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-white/70 text-xl font-semibold tracking-widest uppercase"
        >
          Loading…
        </motion.div>
      </div>
    );
  }

  if (!job) return null;

  const salaryText =
    job.salary?.min && job.salary?.max
      ? `$${job.salary.min.toLocaleString()} – $${job.salary.max.toLocaleString()}`
      : "Not specified";

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <motion.button
          {...fadeUp(0)}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-8 transition-colors duration-200 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Jobs
        </motion.button>

        {/* Header card */}
        <motion.div
          {...fadeUp(0.05)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 mb-5 shadow-xl relative overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 90% 10%, rgba(129,140,248,0.12) 0%, transparent 60%)",
            }}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {job.title}
          </h1>
          <p className="text-indigo-300 font-semibold mt-1 text-lg">
            {job.companyName}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {job.location && <Badge color="indigo">📍 {job.location}</Badge>}
            {job.workMode && <Badge color="emerald">{job.workMode}</Badge>}
            {job.jobType && <Badge color="amber">{job.jobType}</Badge>}
          </div>
          <p className="text-gray-300 font-semibold mt-4 text-sm">
            💰 {salaryText}{" "}
            <span className="text-gray-500 font-normal">/ year</span>
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          {...fadeUp(0.1)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 mb-5 shadow-xl"
        >
          <h2 className="text-white font-bold text-lg mb-3 tracking-tight">
            Job Description
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </motion.div>

        {/* Skills */}
        {job.skillsRequired?.length > 0 && (
          <motion.div
            {...fadeUp(0.14)}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 mb-5 shadow-xl"
          >
            <h2 className="text-white font-bold text-lg mb-3 tracking-tight">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Apply */}
        <motion.div
          {...fadeUp(0.18)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 shadow-xl"
        >
          {user.role === "candidate" ? (
            <>
              <h2 className="text-white font-bold text-lg mb-4 tracking-tight">
                Apply for this Role
              </h2>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-indigo-400/50 rounded-xl p-8 cursor-pointer transition-all duration-300 group mb-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                {file ? (
                  <span className="text-indigo-300 text-sm font-semibold">
                    {file.name}
                  </span>
                ) : (
                  <>
                    <span className="text-gray-400 text-sm font-medium">
                      Click to upload your resume
                    </span>

                    <span className="text-gray-600 text-xs mt-1">
                      PDF, DOC, DOCX
                    </span>
                  </>
                )}
              </label>

              {message && <p className="text-sm text-white mb-4">{message}</p>}

              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-white font-bold text-lg mb-4 tracking-tight">
                Employer Actions
              </h2>

              <div className="flex gap-3">
                {job.employerId === user._id && (
                  <button
                    onClick={() => navigate(`/jobs/${job._id}/applicants/`)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                  >
                    View Applicants
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
