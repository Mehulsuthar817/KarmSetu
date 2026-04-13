import { useEffect } from "react";
import { useState } from "react";
import API from "../api/axios.js";
import JobsCard from "../components/JobsCard.jsx";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  const getjobs = async () => {
    try {
      const res = await API.get("/jobs/advanced");
      setJobs(res.data.data);
      console.log(jobs);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    getjobs();
  }, []);
  return (
    <>
      <h2>Jobs</h2>

        {JobsCard(jobs)}
    </>
  );
}
