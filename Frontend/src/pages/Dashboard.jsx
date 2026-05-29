import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Dashboard() {
  
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      name: 'Find Work',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      name: 'Applications',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]
  return (
    <>
      <div className=" md:p-20 bg-[#f3f2ef] ">
        
        <div className="min-h-screen bg-[#f3f2ef] px-8 py-6">
          {/* HERO SECTION */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT */}
            <motion.div
              initial={{ transform: "translateX(-400px)" }}
              animate={{ transform: "translateX(0px)" }}
              transition={{ type: "spring", duration: 1.5 }}
              className="w-full lg:w-1/2 bg-white rounded-3xl p-10 shadow-sm border border-gray-200"
            >
              <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full w-fit text-xs md:text-sm font-medium">
                Find the right job faster
              </div>

              <h1 className=" text-2xl md:text-3xl lg::text-5xl font-bold mt-6 leading-tight text-gray-900">
                Find Your Next <br />
                Career Opportunity
              </h1>

              <p className="text-gray-500 mt-6 text-sm md:text-md lg:text-lg leading-relaxed">
                Connect with top companies and discover opportunities that match
                your skills and ambitions.
              </p>

              {/* SEARCH BAR */}
              <div className="flex mt-8 w-full box-content text-sm bg-[#f3f2ef] rounded-2xl overflow-hidden border border-gray-200">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="flex-1 ps-5 min-w-0
               px-2 py-3 bg-transparent outline-none shrink-0"
                />

                <input
                  type="text"
                  placeholder="Location"
                  className=" hidden md:block flex-1 min-w-0 px-2 py-4 bg-transparent outline-none border-l border-gray-300"
                />

                <button className="bg-blue-600  hover:bg-blue-700 transition text-white px-8 font-semibold">
                  <span className=" ">Search</span>
                </button>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  "UI/UX Designer",
                  "Frontend Developer",
                  "Backend Engineer",
                  "Data Scientist",
                ].map((tag) => (
                  <div
                    key={tag}
                    className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ transform: "translateX(-800px)" }}
              animate={{ transform: "translateX(0px)" }}
              transition={{ type: "spring", duration: 3 }}
              className="w-full lg:w-1/2 bg-white rounded-3xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt=""
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* FLOATING CARD */}
              <div className="absolute box-border bottom-10 right-8 bg-white shadow-xl border border-gray-200 rounded-2xl px-6 py-4">
                <h2 className="text-md font-bold text-gray-900">150K+</h2>
                <p className="text-gray-500 text-[15px] mt-1">
                  Opportunities waiting for you
                </p>
              </div>
            </motion.div>
          </div>

          {/* FEATURED JOBS */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Opportunities
              </h2>

              <button className="text-blue-600 font-semibold">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                {
                  role: "Frontend Developer",
                  company: "Google",
                  salary: "$120k - $160k",
                },
                {
                  role: "Backend Engineer",
                  company: "Microsoft",
                  salary: "$110k - $145k",
                },
                {
                  role: "UI/UX Designer",
                  company: "Airbnb",
                  salary: "$90k - $120k",
                },
                {
                  role: "DevOps Engineer",
                  company: "Amazon",
                  salary: "$115k - $150k",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-bold">
                      {job.company[0]}
                    </div>

                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                      Full Time
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mt-5 text-gray-900">
                    {job.role}
                  </h3>

                  <p className="text-gray-500 mt-2">{job.company}</p>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-blue-600 font-semibold">{job.salary}</p>

                    <button className="text-sm bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-xl">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
