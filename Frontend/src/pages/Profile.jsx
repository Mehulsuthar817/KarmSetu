import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    skills: "", experience: "", education: "", location: "",
    companyName: "", companyDescription: "", website: "",
  });


  const getProfile = async () => {
    try {
      const res = await API.get("/profile");
      const data = res.data.data;

      if (!data) {
        setProfile(null);
        return;
      }

      setProfile(data);
      setFormData({
        skills: data.skills?.join(", ") || "",
        experience: data.experience || "",
        education: data.education || "",
        location: data.location || "",
        companyName: data.companyName || "",
        companyDescription: data.companyDescription || "",
        website: data.website || "",
      });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  
// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  getProfile();
}, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(skill => skill.trim()),
      };

      const res = await API.put("/profile", payload);
      console.log(res.data);
      alert("Profile Updated");

      // 3. FIXED: Cleanly updates state and turns skills back into a clean string!
      getProfile(); 

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <h3>Name: {profile?.userId?.name}</h3>
      <h3>Email: {profile?.userId?.email}</h3>
      <h3>Role: {profile?.userId?.role}</h3>

      <form onSubmit={handleSubmit}>
        {profile?.userId?.role === "candidate" && (
          <>
            <input name="skills" value={formData.skills} onChange={handleChange} placeholder="react,node,mongodb" />
            <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" />
            <input name="education" value={formData.education} onChange={handleChange} placeholder="Education" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
          </>
        )}

        {profile?.userId?.role === "employer" && (
          <>
            <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Company Description" />
            <input name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
          </>
        )}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
