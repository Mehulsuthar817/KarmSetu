import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    skills: "",
    experience: "",
    education: "",
    location: "",
    companyName: "",
    companyDescription: "",
    website: "",
  });

  const getProfile = async () => {
    try {
      const res = await API.get("/profile");

      const profileData = res.data.data;

      setProfile(profileData);

      if (profileData) {
        setFormData({
          skills: profileData.skills?.join(", ") || "",
          experience: profileData.experience || "",
          education: profileData.education || "",
          location: profileData.location || "",
          companyName: profileData.companyName || "",
          companyDescription: profileData.companyDescription || "",
          website: profileData.website || "",
        });
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

    try {
      let payload = {};

      if (profile?.userId?.role === "candidate") {
        payload = {
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

          experience: Number(formData.experience),

          education: formData.education,

          location: formData.location,
        };
      }

      if (profile?.userId?.role === "employer") {
        payload = {
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          website: formData.website,
          location: formData.location,
        };
      }

      await API.put("/profile", payload);

      alert("Profile Updated Successfully");

      await getProfile();

      setEditMode(false);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold">
          {profile?.userId?.name}
        </h1>

        <p className="text-gray-600">
          {profile?.userId?.email}
        </p>

        <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          {profile?.userId?.role}
        </span>
      </div>

      {/* VIEW MODE */}

      {!editMode && (
        <div className="bg-white shadow rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Profile Information
            </h2>

            <button
              onClick={() => setEditMode(true)}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          </div>

          {profile?.userId?.role === "candidate" && (
            <div className="space-y-4">
              <p>
                <strong>Skills:</strong>{" "}
                {profile?.skills?.length
                  ? profile.skills.join(", ")
                  : "Not Added"}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {profile?.experience || 0} Years
              </p>

              <p>
                <strong>Education:</strong>{" "}
                {profile?.education || "Not Added"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {profile?.location || "Not Added"}
              </p>

              <p>
                <strong>Resume:</strong>{" "}
                {profile?.resume?.url ? (
                  <a
                    href={profile.resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </p>
            </div>
          )}

          {profile?.userId?.role === "employer" && (
            <div className="space-y-4">
              <p>
                <strong>Company Name:</strong>{" "}
                {profile?.companyName || "Not Added"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {profile?.companyDescription || "Not Added"}
              </p>

              <p>
                <strong>Website:</strong>{" "}
                {profile?.website || "Not Added"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {profile?.location || "Not Added"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* EDIT MODE */}

      {editMode && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">
            Edit Profile
          </h2>

          {profile?.userId?.role === "candidate" && (
            <div className="space-y-4">
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node, MongoDB"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of Experience"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Education"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full border rounded-lg p-3"
              />
            </div>
          )}

          {profile?.userId?.role === "employer" && (
            <div className="space-y-4">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full border rounded-lg p-3"
              />

              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                placeholder="Company Description"
                rows={5}
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website"
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full border rounded-lg p-3"
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}