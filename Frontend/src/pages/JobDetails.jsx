import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useEffect, useState } from "react";

export default function JobDetails() {
  const { id, slug } = useParams();
  const [job, setJob] = useState([]);
  const [file,setFile] = useState(null);

  const handleApply = async ()=>{
    try{
        const formData = new FormData();

        formData.append("jobId",job._id);
        formData.append("resume", file);

        await API.post("/applications/apply", formData);
        alert("applied successfuly");
    }catch(err){
        alert(err.response?.data?.message);
        alert(err);
    }
  }

  const getJob =  async () => {
    try {
      const res = await API.get(`/jobs/${slug}/${id}`);
      setJob(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getJob();
  }, []);

  if (!job)
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  return (
    <>
      <div>
        <h2>{job.title}</h2>
        <p>{job.companyName}</p>
        <p>{job.location}</p>
        <p>{job.description}</p>
        <input type="file" onChange={(e)=>{setFile(e.target.files[0])}} />
        <button onClick={handleApply} >Apply</button>
      </div>
    </>
  );
}
