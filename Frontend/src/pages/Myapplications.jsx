import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/Authcontext";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", duration: 1.2, bounce: 0.25, delay },
});

const STATUS_STYLES = {
  pending:  { pill: "bg-amber-500/20 border-amber-400/30 text-amber-200",  dot: "bg-amber-400",  label: "Pending" },
  reviewed: { pill: "bg-blue-500/20 border-blue-400/30 text-blue-200",    dot: "bg-blue-400",   label: "Reviewed" },
  accepted: { pill: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200", dot: "bg-emerald-400", label: "Accepted" },
  rejected: { pill: "bg-red-500/20 border-red-400/30 text-red-300",       dot: "bg-red-400",    label: "Rejected" },
};

// Safely pull job title from populated or flat data
const getTitle    = (app) => app.jobId?.title    || app.jobTitle    || "Job Application";
const getCompany  = (app) => app.jobId?.companyName || app.companyName || "—";
const getLocation = (app) => app.jobId?.location || app.location    || null;
const getWorkMode = (app) => app.jobId?.workMode || app.workMode    || null;

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold uppercase tracking-widest ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const STEPS = ["pending", "reviewed", "accepted"];
const STATUS_ORDER = ["pending", "reviewed", "accepted", "rejected"];

function ProgressTrack({ status }) {
  const lower = status?.toLowerCase() || "pending";
  const currentIdx = STATUS_ORDER.indexOf(lower);
  const isRejected = lower === "rejected";
  const isAccepted = lower === "accepted";

  return (
    <div className="mt-5 flex items-center">
      {STEPS.map((step, idx) => {
        const stepIdx = STATUS_ORDER.indexOf(step);
        const active = isRejected ? stepIdx === 0 : stepIdx <= currentIdx;
        const isLast = idx === STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
                isRejected && stepIdx === 0
                  ? "border-red-400 bg-red-400"
                  : active
                    ? "border-indigo-400 bg-indigo-400"
                    : "border-white/20 bg-transparent"
              }`} />
              <span className="text-gray-600 text-[10px] font-medium capitalize hidden sm:block">{step}</span>
            </div>
            {!isLast && (
              <div className={`h-px flex-1 mx-1 transition-all duration-500 ${
                !isRejected && stepIdx < currentIdx ? "bg-indigo-400/60" : "bg-white/10"
              }`} />
            )}
          </div>
        );
      })}
      {/* Final node — accepted or rejected */}
      <div className="flex items-center flex-1">
        <div className={`h-px flex-1 mx-1 transition-all duration-500 ${
          isAccepted ? "bg-emerald-400/60" : "bg-white/10"
        }`} />
        <div className="flex flex-col items-center gap-1">
          <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
            isRejected
              ? "border-red-400 bg-red-400"
              : isAccepted
                ? "border-emerald-400 bg-emerald-400"
                : "border-white/20 bg-transparent"
          }`} />
          <span className="text-gray-600 text-[10px] font-medium hidden sm:block">
            {isRejected ? "rejected" : "accepted"}
          </span>
        </div>
      </div>
    </div>
  );
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");


  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/applications/my");
        setApplications(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = activeFilter === "all"
    ? applications
    : applications.filter(a => a.status?.toLowerCase() === activeFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen"
        style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-white/70 text-xl font-semibold tracking-widest uppercase">
          Loading…
        </motion.div>
      </div>
    );
  }

 

  return (
    <div className="min-h-screen w-full"
      style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* ── HEADER ── */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm mb-5">
            Candidate Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            My <span className="text-indigo-300">Applications</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm md:text-base font-medium">
            Track the status of every role you've applied to.
          </p>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <motion.div {...fadeUp(0.06)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(STATUS_STYLES).map(([key, val]) => {
            const count = applications.filter(a => a.status?.toLowerCase() === key).length;
            return (
              <button key={key} onClick={() => setActiveFilter(activeFilter === key ? "all" : key)}
                className={`rounded-2xl p-4 border text-left transition-all duration-200 ${
                  activeFilter === key
                    ? val.pill
                    : "bg-white/10 backdrop-blur-md border-white/15 hover:border-white/25"
                }`}>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">{val.label}</p>
                <p className="text-3xl font-bold text-white">{count}</p>
              </button>
            );
          })}
        </motion.div>

        {/* ── FILTER PILLS ── */}
        <motion.div {...fadeUp(0.09)} className="flex gap-2 flex-wrap mb-6">
          <button onClick={() => setActiveFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeFilter === "all"
                ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-200"
                : "bg-white/5 border-white/15 text-gray-500 hover:text-gray-300"
            }`}>
            All ({applications.length})
          </button>
          {Object.entries(STATUS_STYLES).map(([key, val]) => (
            <button key={key} onClick={() => setActiveFilter(activeFilter === key ? "all" : key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all duration-200 ${
                activeFilter === key
                  ? val.pill
                  : "bg-white/5 border-white/15 text-gray-500 hover:text-gray-300"
              }`}>
              {val.label} ({applications.filter(a => a.status?.toLowerCase() === key).length})
            </button>
          ))}
        </motion.div>

        {/* ── LIST ── */}
        {filtered.length === 0 ? (
          <motion.div {...fadeUp(0.12)} className="text-center py-24">
            {applications.length === 0 ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-base">You haven't applied to any jobs yet.</p>
                <Link to="/jobs"
                  className="inline-block mt-5 bg-indigo-300 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  Browse Jobs →
                </Link>
              </>
            ) : (
              <p className="text-gray-500 font-medium">No applications with this status.</p>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((app, i) => (
              <motion.div key={app._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", duration: 0.8 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-white/25 transition-all duration-300">

                {/* Top row */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base tracking-tight truncate">
                      {getTitle(app)}
                    </h3>
                    <p className="text-indigo-300 text-sm font-semibold mt-0.5">
                      {getCompany(app)}
                    </p>
                    {/* Meta badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {getLocation(app) && (
                        <span className="px-2.5 py-1 bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 rounded-full text-xs font-medium">
                          📍 {getLocation(app)}
                        </span>
                      )}
                      {getWorkMode(app) && (
                        <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 rounded-full text-xs font-medium">
                          {getWorkMode(app)}
                        </span>
                      )}
                      <span className="text-gray-500 text-xs font-medium self-center">
                        Applied {new Date(app.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status + resume */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <StatusBadge status={app.status} />
                    {app.resume?.url && (
                      <a href={app.resume.url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-300 font-medium transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        Resume
                      </a>
                    )}
                  </div>
                </div>

                {/* Progress tracker */}
                <ProgressTrack status={app.status} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MA(){
      const { user, loading } = useAuth();
    
      if (loading) {
        return <h1 className="text-black" >Loading...</h1>;
      }
    
      if (user?.role === "employer") {
        return <Navigate to="/dashboard" replace />;
      }
    
      return <MyApplications/>;
    }