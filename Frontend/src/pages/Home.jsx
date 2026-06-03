// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Prism from "../components/Prism";
import { Link } from "react-router-dom";

export default function Home() {
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

      {/* MAIN CONTENT - Centered with Padding */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 md:p-12 box-border">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.3 }}
          className="w-full max-w-4xl flex flex-col items-center text-center"
        >
          {/* FLOATING BADGE */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide shadow-sm mb-8">
            Welcome to the future of hiring
          </div>

          {/* CREATIVE TYPOGRAPHY HEADING */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
            Find Your Next <br className="hidden md:block" />
               Career Opportunity
          </h1>

          <p className="text-gray-300 mt-6 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl font-medium">
            Connect with top companies and discover opportunities that perfectly match
            your skills, passions, and ambitions.
          </p>

          {/* AUTH SECTION (LOGIN / NEW HERE) - FILLED STYLE */}
          <div className="mt-12 flex flex-col items-center gap-5 w-full max-w-md mx-auto">
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Sign Up Button */}
              <button className="flex-1 bg-indigo-300 hover:bg-indigo-400 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Link to="/register" >
                Create Account
                </Link>
              </button>
              
              {/* Login Button */}
              <button className="flex-1 bg-white/10 border-white/20 text-gray-500 hover:text-gray-500 hover:bg-gray-100 py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Link to="/login" >
              Log In
              </Link>
                
              </button>
            </div>

            {/* NEW HERE TYPOGRAPHY */}
            {/* <p className="text-sm md:text-base text-gray-400 font-medium tracking-wide mt-4">
              New here?{" "}
              <a href="#" className="text-white font-semibold cursor-pointer hover:text-indigo-400 hover:underline transition-colors duration-200">
                Start your journey today.
              </a>
            </p> */}
            
          </div>
        </motion.div>
      </div>
      
    </div>
  );
}