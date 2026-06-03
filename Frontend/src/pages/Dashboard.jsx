import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const res = await API.get("/profile");

      console.log(res.data);

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

  const calculateCompletion = () => {
    if (!user) return 0;

    let completed = 0;
    let total = 0;

    if (user?.userId?.role === "candidate") {
      total = 4;

      if (user.skills?.length > 0) completed++;
      if (user.experience > 0) completed++;
      if (user.education) completed++;
      if (user.location) completed++;
    }

    if (user?.userId?.role === "employer") {
      total = 4;

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
      return (
        user.skills?.length > 0 &&
        user.experience > 0 &&
        user.education &&
        user.location
      );
    }

    if (user?.userId?.role === "employer") {
      return (
        user.companyName &&
        user.companyDescription &&
        user.website &&
        user.location
      );
    }

    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  const profilePercentage = calculateCompletion();
  const profileComplete = isProfileComplete();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Welcome, {user?.userId?.name}</h1>

        <p className="text-gray-500 mt-2">
          Manage your profile and find your next opportunity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white shadow-md rounded-xl p-5">
          <h3 className="text-gray-500">Profile Completion</h3>
          <h2 className="text-3xl font-bold mt-2">{profilePercentage}%</h2>
        </div>

        {user?.userId?.role === "candidate" ? (
          <>
            <div className="bg-white shadow-md rounded-xl p-5">
              <h3 className="text-gray-500">Skills Added</h3>
              <h2 className="text-3xl font-bold mt-2">
                {user?.skills?.length || 0}
              </h2>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5">
              <h3 className="text-gray-500">Experience</h3>
              <h2 className="text-3xl font-bold mt-2">
                {user?.experience || 0} Years
              </h2>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-xl p-5">
              <h3 className="text-gray-500">Company Name</h3>
              <h2 className="text-xl font-bold mt-2">
                {user?.companyName || "Not Added"}
              </h2>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5">
              <h3 className="text-gray-500">Website</h3>
              <h2 className="text-lg font-bold mt-2 truncate">
                {user?.website || "Not Added"}
              </h2>
            </div>
          </>
        )}
      </div>

      {/* Profile Incomplete Banner */}
      {!profileComplete && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold">Complete Your Profile</h2>

          <p className="mt-2 text-gray-700">
            {user?.userId?.role === "candidate"
              ? "Employers are more likely to contact candidates with complete profiles."
              : "Complete your company profile before posting jobs."}
          </p>

          <Link
            to="/profile"
            className="inline-block mt-4 px-5 py-2 bg-black text-white rounded-lg"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* Profile Details */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Profile Overview</h2>

        {user?.userId?.role === "candidate" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Name:</span> {user?.userId?.name}
            </div>

            <div>
              <span className="font-semibold">Email:</span>{" "}
              {user?.userId?.email}
            </div>

            <div>
              <span className="font-semibold">Location:</span>{" "}
              {user?.location || "Not Added"}
            </div>

            <div>
              <span className="font-semibold">Education:</span>{" "}
              {user?.education || "Not Added"}
            </div>

            <div>
              <span className="font-semibold">Experience:</span>{" "}
              {user?.experience || 0} Years
            </div>
          </div>
        )}

        {user?.userId?.role === "employer" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Company Name:</span>{" "}
              {user?.companyName || "Not Added"}
            </div>

            <div>
              <span className="font-semibold">Website:</span>{" "}
              {user?.website || "Not Added"}
            </div>

            <div>
              <span className="font-semibold">Location:</span>{" "}
              {user?.location || "Not Added"}
            </div>

            <div>
              <span className="font-semibold">Description:</span>{" "}
              {user?.companyDescription || "Not Added"}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      {user?.userId?.role === "candidate" && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>

          {user?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>
      )}
      {user?.userId?.role === "employer" && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Company Details</h2>

          <div className="space-y-3">
            <p>
              <strong>Company Name:</strong> {user?.companyName || "Not Added"}
            </p>

            <p>
              <strong>Website:</strong> {user?.website || "Not Added"}
            </p>

            <p>
              <strong>Location:</strong> {user?.location || "Not Added"}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {user?.companyDescription || "Not Added"}
            </p>
          </div>

          <Link
            to="/jobs/create"
            className="inline-block mt-4 px-5 py-2 bg-black text-white rounded-lg"
          >
            Create Job
          </Link>
        </div>
      )}
    </div>
  );
}
