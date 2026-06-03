import { useEffect, useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api/axios.js";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", duration: 1.2, bounce: 0.25, delay },
});

const inputClass =
  "bg-white/5 border border-white/15 hover:border-indigo-400/40 focus:border-indigo-400/70 focus:bg-white/10 text-gray-200 placeholder-gray-600 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 backdrop-blur-sm w-full";

const selectClass =
  "bg-[#1e2630] border border-white/15 hover:border-indigo-400/40 focus:border-indigo-400/70 text-gray-300 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 appearance-none cursor-pointer w-full";

const Badge = ({ children, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-500/20 border-indigo-400/30 text-indigo-200",
    emerald: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    amber: "bg-amber-500/20 border-amber-400/30 text-amber-200",
  };
  return (
    <span className={`px-2.5 py-1 border rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

function JobCard({ job, index }) {
  const salary = job.salary?.min && job.salary?.max
    ? `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", duration: 0.8 }}
    >
      <Link to={`/jobs/${job.slug}/${job._id}`}
        className="block bg-white/10 hover:bg-white/[0.14] backdrop-blur-md border border-white/15 hover:border-indigo-400/30 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base tracking-tight group-hover:text-indigo-200 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-indigo-300 text-sm font-semibold mt-0.5">{job.company}</p>
          </div>
          {salary && (
            <span className="shrink-0 text-gray-300 text-xs font-semibold bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              {salary}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {job.location && <Badge color="indigo">📍 {job.location}</Badge>}
          {job.workMode && <Badge color="emerald">{job.workMode}</Badge>}
          {job.jobType && <Badge color="amber">{job.jobType}</Badge>}
        </div>
      </Link>
    </motion.div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "", location: "", workMode: "", jobType: "", minSalary: "",
  });

  const getJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await API.get(`/jobs/advanced?${params.toString()}`);
      setJobs(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => { getJobs(); }, 400);
    return () => clearTimeout(timeout);
  }, [getJobs]);

  const handleFilter = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({ search: "", location: "", workMode: "", jobType: "", minSalary: "" });

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen w-full"
      style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* Heading */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            Opportunities
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Find Your Next <span className="text-indigo-300">Role</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm md:text-base font-medium">
            Browse {jobs.length > 0 ? `${jobs.length}+` : ""} open positions from top companies.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div {...fadeUp(0.08)} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 mb-8 shadow-xl">
          {/* Search bar */}
          <div className="relative mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input type="text" name="search" value={filters.search} onChange={handleFilter}
              placeholder="Search by title or company…"
              className={`${inputClass} pl-11`} />
          </div>

          {/* Filter row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input type="text" name="location" value={filters.location} onChange={handleFilter}
              placeholder="Location" className={inputClass} />

            <select name="workMode" value={filters.workMode} onChange={handleFilter} className={selectClass}>
              <option value="">Work Mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>

            <select name="jobType" value={filters.jobType} onChange={handleFilter} className={selectClass}>
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <input type="number" name="minSalary" value={filters.minSalary} onChange={handleFilter}
              placeholder="Min Salary ($)" min={0} className={inputClass} />
          </div>

          {hasFilters && (
            <button onClick={clearFilters}
              className="mt-3 text-xs text-gray-500 hover:text-indigo-300 font-semibold transition-colors duration-200">
              ✕ Clear all filters
            </button>
          )}
        </motion.div>

        {/* Job list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="text-white/60 text-sm font-semibold tracking-widest uppercase">
              Searching…
            </motion.div>
          </div>
        ) : jobs.length === 0 ? (
          <motion.div {...fadeUp(0.1)}
            className="text-center py-20 text-gray-500 font-medium">
            No jobs found. Try adjusting your filters.
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <JobCard key={job._id} job={job} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}