import { Link } from "react-router-dom";

export default function JobsCard({ jobs = [] }) {
  if (!jobs.length) {
    return <p className="text-sm text-slate-400">No jobs available yet.</p>;
  }

  return (
    <>
      {jobs.map((job) => (
        <div key={job._id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-slate-950/20 mb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{job.title}</h3>
              <p className="text-sm text-slate-400">{job.companyName || job.company}</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              {job.location || "Remote"}
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-300">{job.description?.slice(0, 120) || "No description available."}</p>

          <Link
            to={`/job/${job.slug}/${job._id}`}
            className="mt-5 inline-flex items-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            View Details
          </Link>
        </div>
      ))}
    </>
  );
}
