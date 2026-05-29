import { useState } from "react";
import API from "../api/axios";

export default function CreateJob() {
  const [formData, setformData] = useState({
    title: "",
    companyName:"",
    desciption: "",
    location: "",
    Workmode: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    skillRequired: "",
  });

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary: {
          min: Number(formData.minSalary),
          max: Number(formData.maxSalary),
        },
        SkillRequired: formData.skillRequired
          .split(",")
          .map((skill) => skill.trim()),
      };
      delete payload.minSalary;
      delete payload.maxSalary;

      const res = await API.post("/jobs/create", payload);

      alert("job creaeted");

      console.log(res.data);
    } catch {
      e;
    }
    {
      alert(e.response?.data?.message);
    }
  };

  return (
    <>
      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />
        <input
          type="text"
          name="companyName"
          placeholder="CompanyName"
          onChange={handleChange}
        />

        <textarea
          name="decription"
          placeholder="Description"
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />

        <input
          type="text"
          name="workmode"
          placeholder="Remote/Hybrid/onsite"
          onChange={handleChange}
        />
        <input
          type="text"
          name="jobType"
          placeholder="full-time/part-time"
          onChange={handleChange}
        />

        <input
          type="text"
          name="minSalary"
          placeholder="MaxSalary"
          onChange={handleChange}
        />

        <input
          type="text"
          name="maxSalary"
          placeholder="MinSalary"
          onChange={handleChange}
        />

        <input
          type="text"
          name="skillRequired"
          placeholder="react,node,mongodb"
          onChange={handleChange}
        />

        <button type="submit">Create job</button>
      </form>
    </>
  );
}
