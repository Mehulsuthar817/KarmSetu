import { useState } from "react";
import API from "../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Prism from "../components/Prism.jsx";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const role = formData.role;

    if (!name || !email || !password || !role) {
      return alert("Please fill all fields");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration Successful");

      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#2D3742_0%,#1B2128_80%)]">
      {/* Prism Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-6">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            duration: 1.2,
            bounce: 0.3,
          }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Create your
              <span className="block text-indigo-300">Account</span>
            </h1>

            <p className="text-gray-400 mt-4">
              Start your journey and unlock new opportunities.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col gap-4"
          >
            {/* Name */}
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-2xl px-5 py-3.5 outline-none focus:border-indigo-400 transition"
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-2xl px-5 py-3.5 outline-none focus:border-indigo-400 transition"
            />

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/15 text-white rounded-2xl px-5 py-3.5 outline-none focus:border-indigo-400 transition"
            >
              <option value="" disabled className="text-black">
                Select Role
              </option>

              <option value="candidate" className="text-black">
                Candidate
              </option>

              <option value="employer" className="text-black">
                Employer
              </option>
            </select>

            {/* Password */}
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-2xl px-5 py-3.5 outline-none focus:border-indigo-400 transition"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
          <div className=" flex justify-center">
            <p className="text-sm md:text-base text-gray-400 font-medium tracking-wide mt-4">
              Already have an Account?
              <Link
                to="/login"
                className="text-white font-semibold cursor-pointer hover:text-indigo-400 hover:underline transition-colors duration-200 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
