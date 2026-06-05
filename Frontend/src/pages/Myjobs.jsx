import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
    red: "bg-red-500/20 border-red-400/30 text-red-300",
  };
  return (
    <span
      className={`px-2.5 py-1 border rounded-full text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/jobs/myjobs");
        setJobs(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
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
          Back 
        </motion.button>

        {/* ── HEADER ── */}
        <motion.div
          {...fadeUp(0)}
          className="flex items-start justify-between gap-4 mb-10 flex-wrap"
        >
          <div>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
              Employer Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              My <span className="text-indigo-300">Jobs</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
              {jobs.length > 0
                ? `You have posted ${jobs.length} job${jobs.length > 1 ? "s" : ""}.`
                : "You haven't posted any jobs yet."}
            </p>
          </div>

          <Link
            to="/create-job"
            className="shrink-0 self-end bg-indigo-300 hover:bg-indigo-400 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            + Post New Job
          </Link>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <motion.div
          {...fadeUp(0.06)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, rgba(129,140,248,0.1) 0%, transparent 70%)",
              }}
            />
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">
              Total Posted
            </p>
            <p className="text-4xl font-bold text-white">{jobs.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-md">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">
              Active
            </p>
            <p className="text-4xl font-bold text-white">
              {jobs.filter((j) => j.isActive !== false).length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-md col-span-2 sm:col-span-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">
              Inactive
            </p>
            <p className="text-4xl font-bold text-white">
              {jobs.filter((j) => j.isActive === false).length}
            </p>
          </div>
        </motion.div>

        {/* ── JOB LIST ── */}
        {jobs.length === 0 ? (
          <motion.div {...fadeUp(0.1)} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-base mb-5">
              No jobs posted yet.
            </p>
            <Link
              to="/create-job"
              className="inline-block bg-indigo-300 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              Post Your First Job →
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job, i) => {
              const salary =
                job.salary?.min && job.salary?.max
                  ? `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k`
                  : null;

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    type: "spring",
                    duration: 0.8,
                  }}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-white/25 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-bold text-base tracking-tight group-hover:text-indigo-200 transition-colors">
                          {job.title}
                        </h3>
                        {job.isActive === false && (
                          <span className="px-2 py-0.5 bg-red-500/15 border border-red-400/20 text-red-400 rounded-full text-[10px] font-semibold uppercase tracking-widest">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-300 text-sm font-semibold">
                        {job.companyName}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.location && (
                          <Badge color="indigo">📍 {job.location}</Badge>
                        )}
                        {job.workMode && (
                          <Badge color="emerald">{job.workMode}</Badge>
                        )}
                        {job.jobType && (
                          <Badge color="amber">{job.jobType}</Badge>
                        )}
                        {salary && (
                          <span className="text-gray-400 text-xs font-semibold self-center">
                            💰 {salary}
                          </span>
                        )}
                      </div>

                      {job.skillsRequired?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job.skillsRequired.slice(0, 5).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-full text-[11px] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                          {job.skillsRequired.length > 5 && (
                            <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-gray-500 rounded-full text-[11px] font-medium">
                              +{job.skillsRequired.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-gray-600 text-xs mt-3">
                        Posted{" "}
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        to={`/jobs/${job.slug}/${job._id}`}
                        className="text-center px-4 py-2 bg-white/5 hover:bg-indigo-500/20 border border-white/15 hover:border-indigo-400/30 text-gray-300 hover:text-indigo-200 rounded-xl text-xs font-semibold transition-all duration-200"
                      >
                        View Post
                      </Link>
                      <button
                        onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                        className="px-4 py-2 bg-indigo-300/20 hover:bg-indigo-300/30 border border-indigo-400/30 text-indigo-200 rounded-xl text-xs font-semibold transition-all duration-200"
                      >
                        View Applicants
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
