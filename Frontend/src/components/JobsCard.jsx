export default function JobsCard(jobs){
    return(
        <>
        {jobs.map((job) => (
        <div key={job._id}>
          <h3> {job.title} </h3>
          <h3> {job.company} </h3>
          <h3> {job.location} </h3>
          <a href={`/job/${job.slug}/${job._id}`}>View Details</a>
        </div>
      ))}
        </>
    )
} 