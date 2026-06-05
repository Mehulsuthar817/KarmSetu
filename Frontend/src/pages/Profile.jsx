import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";

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
  "bg-white/5 border border-white/15 hover:border-indigo-400/40 focus:border-indigo-400/70 focus:bg-white/10 text-gray-200 placeholder-gray-600 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 backdrop-blur-sm w-full";

const InfoRow = ({ label, value, isLink }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
      {label}
    </span>
    {isLink && value !== "Not Uploaded" ? (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-indigo-300 font-medium text-sm hover:text-indigo-200 transition-colors"
      >
        View Resume ↗
      </a>
    ) : (
      <span className="text-gray-200 font-medium text-sm">{value}</span>
    )}
  </div>
);

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    skills: "",
    experience: "",
    education: "",
    location: "",
    companyName: "",
    companyDescription: "",
    website: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const getProfile = async () => {
    try {
      const res = await API.get("/profile");
      const d = res.data.data;
      setProfile(d);
      setFormData({
        skills: d.skills?.join(", ") || "",
        experience: d.experience || "",
        education: d.education || "",
        location: d.location || "",
        companyName: d.companyName || "",
        companyDescription: d.companyDescription || "",
        website: d.website || "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCancel = () => {
    if (profile) {
      setFormData({
        skills: profile.skills?.join(", ") || "",
        experience: profile.experience || "",
        education: profile.education || "",
        location: profile.location || "",
        companyName: profile.companyName || "",
        companyDescription: profile.companyDescription || "",
        website: profile.website || "",
      });
    }
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let payload = {};
      if (profile?.userId?.role === "candidate") {
        payload = {
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          experience: Number(formData.experience),
          education: formData.education,
          location: formData.location,
        };
      } else {
        payload = {
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          website: formData.website,
          location: formData.location,
        };
      }
      await API.put("/profile", payload);
      await getProfile();
      setEditMode(false);
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
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
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/70 text-xl font-semibold tracking-widest uppercase"
        >
          Loading…
        </motion.div>
      </div>
    );
  }

  const role = profile?.userId?.role;

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

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-indigo-200 px-6 py-3 rounded-2xl text-sm font-semibold shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
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

        {/* Header card */}
        <motion.div
          {...fadeUp(0)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 mb-6 shadow-xl relative overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 90% 10%, rgba(129,140,248,0.12) 0%, transparent 60%)",
            }}
          />
          <div className="flex items-start justify-between gap-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-xl">
                {profile?.userId?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {profile?.userId?.name}
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {profile?.userId?.email}
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-semibold uppercase tracking-widest">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* View / Edit card */}
        <motion.div
          {...fadeUp(0.08)}
          className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-7 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-md md:text:xl font-bold text-white tracking-tight">
              {editMode ? "Edit Profile" : "Profile Information"}
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-indigo-300 hover:bg-indigo-400 text-white px-5 py-2 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!editMode ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {role === "candidate" && (
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InfoRow
                      label="Location"
                      value={profile?.location || "Not Added"}
                    />
                    <InfoRow
                      label="Education"
                      value={profile?.education || "Not Added"}
                    />
                    <InfoRow
                      label="Experience"
                      value={`${profile?.experience || 0} Years`}
                    />
                    <InfoRow
                      label="Resume"
                      value={profile?.resume?.url || "Not Uploaded"}
                      isLink={!!profile?.resume?.url}
                    />
                    {/* Skills full width */}
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                        Skills
                      </span>
                      {profile?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Not Added</span>
                      )}
                    </div>
                  </div>
                )}
                {role === "employer" && (
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InfoRow
                      label="Company Name"
                      value={profile?.companyName || "Not Added"}
                    />
                    <InfoRow
                      label="Website"
                      value={profile?.website || "Not Added"}
                    />
                    <InfoRow
                      label="Location"
                      value={profile?.location || "Not Added"}
                    />
                    <div className="sm:col-span-2 flex flex-col gap-0.5">
                      <span className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                        Description
                      </span>
                      <span className="text-gray-200 font-medium text-sm leading-relaxed">
                        {profile?.companyDescription || "Not Added"}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                {role === "candidate" && (
                  <>
                    <Field label="Skills (comma separated)">
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node, MongoDB"
                        className={inputClass}
                      />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Years of Experience">
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="e.g. 3"
                          min={0}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai, India"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                    <Field label="Education">
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="e.g. B.Tech Computer Science"
                        className={inputClass}
                      />
                    </Field>
                  </>
                )}
                {role === "employer" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Company Name">
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Website">
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://acme.com"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                    <Field label="Location">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bengaluru, India"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Company Description">
                      <textarea
                        name="companyDescription"
                        value={formData.companyDescription}
                        onChange={handleChange}
                        placeholder="Tell candidates about your company…"
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </>
                )}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-indigo-300 hover:bg-indigo-400 disabled:opacity-50 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-gray-300 hover:text-white py-3 rounded-2xl font-bold text-sm backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
