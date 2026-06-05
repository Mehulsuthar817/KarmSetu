import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/Authcontext";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", duration: 1.2, bounce: 0.25, delay },
});

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "bg-white/5 border border-white/15 hover:border-indigo-400/40 focus:border-indigo-400/70 focus:bg-white/10 text-gray-200 placeholder-gray-600 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 backdrop-blur-sm";

const selectClass =
  "bg-[#1e2630] border border-white/15 hover:border-indigo-400/40 focus:border-indigo-400/70 text-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 appearance-none cursor-pointer";

function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    workmode: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    skillRequired: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        salary: {
          min: Number(formData.minSalary),
          max: Number(formData.maxSalary),
        },
        skillRequired: formData.skillRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      delete payload.minSalary;
      delete payload.maxSalary;

      const res = await API.post("/jobs/create", payload);
      console.log(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect(()=>{
  //   if(loading){

  //   }
  //   console.log(user);

  // },[user])

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

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
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

        {/* Top badge */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm mb-6">
            Employer Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Post a <span className="text-indigo-300">New Job</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm md:text-base font-medium">
            Fill in the details below to reach the right candidates.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          {...fadeUp(0.08)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Row: Title + Company */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Job Title">
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Frontend Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Company Name">
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Job Description">
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and what makes it exciting…"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Row: Location + Work Mode */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Location">
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Work Mode">
                <select
                  name="workmode"
                  value={formData.workmode}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select mode
                  </option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </Field>
            </div>

            {/* Row: Job Type + Skills */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Job Type">
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="full-time">full-time</option>
                  <option value="part-time">part-time</option>
                  <option value="contract">contract</option>
                  <option value="internship">internship</option>
                </select>
              </Field>
              <Field label="Skills Required">
                <input
                  type="text"
                  name="skillRequired"
                  placeholder="react, node, mongodb"
                  value={formData.skillRequired}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Salary Range */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-3">
                Salary Range (per year)
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Min Salary ($)">
                  <input
                    type="number"
                    name="minSalary"
                    placeholder="e.g. 60000"
                    value={formData.minSalary}
                    onChange={handleChange}
                    min={0}
                    className={inputClass}
                  />
                </Field>
                <Field label="Max Salary ($)">
                  <input
                    type="number"
                    name="maxSalary"
                    placeholder="e.g. 120000"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    min={0}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-300 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-8 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {loading ? "Posting…" : "Post Job →"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-gray-300 hover:text-white py-3.5 px-8 rounded-2xl font-bold text-sm backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function CJ() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (user?.role === "candidate") {
    return <Navigate to="/dashboard" replace />;
  }

  return <CreateJob />;
}
