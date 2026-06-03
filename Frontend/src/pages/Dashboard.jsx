import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api/axios";

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { type: "spring", duration: 1.2, bounce: 0.25, delay },
});

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
    try{
        await API.post("/auth/logout");
        navigate("/login");
    }
    catch(err){
        console.log(err);
    }
  };

  const calculateCompletion = () => {
    if (!user) return 0;
    let completed = 0;
    const total = 4;
    if (user?.userId?.role === "candidate") {
      if (user.skills?.length > 0) completed++;
      if (user.experience > 0) completed++;
      if (user.education) completed++;
      if (user.location) completed++;
    }
    if (user?.userId?.role === "employer") {
      if (user.companyName) completed++;
      if (user.companyDescription) completed++;
      if (user.website) completed++;
      if (user.location) completed++;
    }
    return Math.round((completed / total) * 100);
  };

  const isProfileComplete = () => {
    if (!user) return false;
    if (user?.userId?.role === "candidate") {
      return user.skills?.length > 0 && user.experience > 0 && user.education && user.location;
    }
    if (user?.userId?.role === "employer") {
      return user.companyName && user.companyDescription && user.website && user.location;
    }
    return false;
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/70 text-xl font-semibold tracking-widest uppercase"
        >
          Loading…
        </motion.div>
      </div>
    );
  }

  const profilePercentage = calculateCompletion();
  const profileComplete = isProfileComplete();
  const role = user?.userId?.role;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "radial-gradient(circle at 50% 0%, #2D3742 0%, #1B2128 80%)" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* ── TOP NAV BAR ── */}
        <motion.div
          {...fadeUp(0)}
          className="flex items-center justify-between mb-12"
        >
          {/* Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm">
            {role === "candidate" ? "Candidate Dashboard" : "Employer Dashboard"}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/40 text-gray-300 hover:text-red-300 px-5 py-2 rounded-2xl text-sm font-semibold backdrop-blur-md transition-all duration-300 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </motion.div>

        {/* ── WELCOME ── */}
        <motion.div {...fadeUp(0.05)} className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Welcome back,<br />
            <span className="text-indigo-300">{user?.userId?.name}</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base md:text-lg font-medium">
            {role === "candidate"
              ? "Manage your profile and land your next opportunity."
              : "Manage your company profile and post new jobs."}
          </p>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* Completion card with ring */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 80% 20%, rgba(129,140,248,0.12) 0%, transparent 70%)",
              }}
            />
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Profile Completion</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{profilePercentage}%</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profilePercentage}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-indigo-400"
              />
            </div>
          </div>

          {role === "candidate" ? (
            <>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(circle at 80% 20%, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Skills Added</p>
                <span className="text-4xl font-bold text-white">{user?.skills?.length || 0}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(circle at 80% 20%, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Experience</p>
                <span className="text-4xl font-bold text-white">{user?.experience || 0}</span>
                <span className="text-gray-400 text-sm ml-1">yrs</span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(circle at 80% 20%, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Company</p>
                <p className="text-xl font-bold text-white truncate">{user?.companyName || "—"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(circle at 80% 20%, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Website</p>
                <p className="text-base font-bold text-indigo-300 truncate">{user?.website || "Not Added"}</p>
              </div>
            </>
          )}
        </motion.div>

        {/* ── INCOMPLETE BANNER ── */}
        {!profileComplete && (
          <motion.div
            {...fadeUp(0.18)}
            className="bg-amber-400/10 border border-amber-400/30 backdrop-blur-md rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg"
          >
            <div>
              <h2 className="text-white font-bold text-lg">Complete Your Profile</h2>
              <p className="text-gray-400 text-sm mt-1">
                {role === "candidate"
                  ? "Employers are more likely to contact candidates with complete profiles."
                  : "Complete your company profile before posting jobs."}
              </p>
            </div>
            <Link
              to="/profile"
              className="shrink-0 bg-indigo-300 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
            >
              Complete Profile →
            </Link>
          </motion.div>
        )}

        {/* ── PROFILE OVERVIEW ── */}
        <motion.div
          {...fadeUp(0.22)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 mb-6 shadow-lg"
        >
          <h2 className="text-white font-bold text-xl mb-5 tracking-tight">Profile Overview</h2>

          {role === "candidate" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Name", user?.userId?.name],
                ["Email", user?.userId?.email],
                ["Location", user?.location || "Not Added"],
                ["Education", user?.education || "Not Added"],
                ["Experience", `${user?.experience || 0} Years`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{label}</span>
                  <span className="text-gray-200 font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {role === "employer" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Company Name", user?.companyName || "Not Added"],
                ["Website", user?.website || "Not Added"],
                ["Location", user?.location || "Not Added"],
                ["Description", user?.companyDescription || "Not Added"],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{label}</span>
                  <span className="text-gray-200 font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── SKILLS / COMPANY DETAILS ── */}
        {role === "candidate" && (
          <motion.div
            {...fadeUp(0.28)}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 shadow-lg"
          >
            <h2 className="text-white font-bold text-xl mb-5 tracking-tight">Skills</h2>
            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-sm font-semibold backdrop-blur-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet.</p>
            )}
          </motion.div>
        )}

        {role === "employer" && (
          <motion.div
            {...fadeUp(0.28)}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 shadow-lg"
          >
            <h2 className="text-white font-bold text-xl mb-5 tracking-tight">Company Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                ["Company Name", user?.companyName || "Not Added"],
                ["Website", user?.website || "Not Added"],
                ["Location", user?.location || "Not Added"],
                ["Description", user?.companyDescription || "Not Added"],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{label}</span>
                  <span className="text-gray-200 font-medium">{value}</span>
                </div>
              ))}
            </div>
            <Link
              to="/create-job"
              className="inline-block bg-indigo-300 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              + Create Job
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}