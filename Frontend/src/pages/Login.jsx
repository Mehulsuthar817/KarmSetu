import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import API from "../api/axios";
import Prism from "../components/Prism";
import { useAuth } from "../context/Authcontext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {getme} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/login", { email, password });
      await getme();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#2D3742_0%,#1B2128_80%)]">

      {/* BACKGROUND ANIMATION */}
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

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.3 }}
          className="w-full max-w-md flex flex-col items-center text-center"
        >

          {/* FLOATING BADGE */}
          {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-sm mb-8">
            Welcome back to KarmSetu
          </div> */}

          {/* HEADING */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white tracking-tight">
            Sign in to your <br />
            <span className="text-indigo-300">Account</span>
          </h1>

          <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed max-w-sm">
            Your next opportunity is waiting. Log in to continue your journey.
          </p>

          {/* FORM CARD */}
          <form
            onSubmit={handleLogin}
            className="mt-10 w-full flex flex-col gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl"
          >
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-indigo-400 focus:bg-white/15 transition-all duration-200"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-indigo-400 focus:bg-white/15 transition-all duration-200"
            />

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-400 hover:text-indigo-300 transition-colors duration-200 no-underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-400 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-2"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="text-sm text-gray-400 font-medium tracking-wide mt-6">
            New here?{" "}
            <Link
              to="/register"
              className="text-white font-semibold hover:text-indigo-300 hover:underline transition-colors duration-200 no-underline"
            >
              Start your journey today.
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}