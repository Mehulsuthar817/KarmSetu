import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { useAuth } from "../context/Authcontext.jsx";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", duration: 1.2, bounce: 0.25, delay },
});

const STATUSES = ["pending", "reviewed", "accepted", "rejected"];

const STATUS_STYLES = {
  pending:  { pill: "bg-amber-500/20 border-amber-400/30 text-amber-200",  dot: "bg-amber-400" },
  reviewed: { pill: "bg-blue-500/20 border-blue-400/30 text-blue-200",    dot: "bg-blue-400" },
  accepted: { pill: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200", dot: "bg-emerald-400" },
  rejected: { pill: "bg-red-500/20 border-red-400/30 text-red-300",       dot: "bg-red-400" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold uppercase tracking-widest ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status || "Pending"}
    </span>
  );
}

function ApplicantDrawer({ app, onClose, onStatusChange }) {
  const [status, setStatus] = useState(app.status || "pending");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const {user} = useAuth();

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(`/applications/${app._id}`, { status });
      onStatusChange(app._id, status);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if(user.role === "candidate"){
    navigate("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
        className="relative z-10 w-full max-w-md h-full bg-[#1e2630] border-l border-white/10 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7">
          {/* Close */}
          <button onClick={onClose}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm font-medium mb-8 transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>

          {/* Candidate info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-xl shrink-0">
              {app.candidateName?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="text-white font-bold text-xl tracking-tight">{app.candidateName || "Candidate"}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{app.candidateEmail || "—"}</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5 mb-8">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">Applied</p>
              <p className="text-gray-200 text-sm font-medium">
                {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">Current Status</p>
              <StatusBadge status={app.status} />
            </div>

            {app.resume?.url && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Resume</p>
                <a href={app.resume.url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/15 hover:border-indigo-400/40 text-indigo-300 hover:text-indigo-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Download Resume
                </a>
              </div>
            )}
          </div>

          {/* Status update */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Update Status</p>
            <div className="flex flex-col gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    status === s
                      ? `${STATUS_STYLES[s].pill} border-opacity-100`
                      : "bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${status === s ? STATUS_STYLES[s].dot : "bg-white/20"}`} />
                  <span className="capitalize">{s}</span>
                  {status === s && <span className="ml-auto text-xs opacity-70">✓ Selected</span>}
                </button>
              ))}
            </div>

            <button onClick={handleSave} disabled={saving || status === app.status}
              className="w-full mt-4 bg-indigo-300 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300">
              {saving ? "Saving…" : "Save Status"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setApplicants(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [jobId]);

  const handleStatusChange = (appId, newStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );
  };

  const filtered = filter === "all"
    ? applicants
    : applicants.filter((a) => a.status?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen"
        style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-white/70 text-xl font-semibold tracking-widest uppercase">Loading…</motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full"
      style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Drawer */}
      <AnimatePresence>
        {selected && (
          <ApplicantDrawer
            app={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Back */}
        <motion.button {...fadeUp(0)} onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-8 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        {/* Header */}
        <motion.div {...fadeUp(0.04)} className="mb-8">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            Employer Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            <span className="text-indigo-300">{applicants.length}</span> Applicants
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">
            Click on any applicant to review their profile and update their status.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {STATUSES.map((s) => {
            const count = applicants.filter(a => a.status?.toLowerCase() === s).length;
            const style = STATUS_STYLES[s];
            return (
              <button key={s} onClick={() => setFilter(filter === s ? "all" : s)}
                className={`rounded-2xl p-4 border text-left transition-all duration-200 ${
                  filter === s
                    ? `${style.pill}`
                    : "bg-white/10 backdrop-blur-md border-white/15 hover:border-white/25"
                }`}>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1 capitalize">{s}</p>
                <p className="text-3xl font-bold text-white">{count}</p>
              </button>
            );
          })}
        </motion.div>

        {/* Filter pills */}
        <motion.div {...fadeUp(0.11)} className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === "all"
                ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-200"
                : "bg-white/5 border-white/15 text-gray-500 hover:text-gray-300"
            }`}>
            All ({applicants.length})
          </button>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(filter === s ? "all" : s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all duration-200 ${
                filter === s
                  ? `${STATUS_STYLES[s].pill}`
                  : "bg-white/5 border-white/15 text-gray-500 hover:text-gray-300"
              }`}>
              {s} ({applicants.filter(a => a.status?.toLowerCase() === s).length})
            </button>
          ))}
        </motion.div>

        {/* Applicant list */}
        {filtered.length === 0 ? (
          <motion.div {...fadeUp(0.14)} className="text-center py-20 text-gray-500 font-medium">
            No applicants with this status yet.
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app, i) => (
              <motion.button key={app._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: "spring", duration: 0.8 }}
                onClick={() => setSelected(app)}
                className="bg-white/10 hover:bg-white/[0.14] backdrop-blur-md border border-white/15 hover:border-indigo-400/30 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group w-full">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center text-indigo-300 font-bold shrink-0 group-hover:border-indigo-400/40 transition-colors">
                    {app.candidateName?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm tracking-tight truncate group-hover:text-indigo-200 transition-colors">
                      {app.candidateName || "Candidate"}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{app.candidateEmail || "—"}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={app.status} />
                    <p className="text-gray-600 text-xs hidden sm:block">
                      {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 group-hover:text-indigo-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}