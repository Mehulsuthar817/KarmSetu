import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Jobs from "./pages/Job.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/PrismNav.jsx";
import PrismNavbar from "./components/PrismNav.jsx";


function App() {
  // const location = useLocation();

  // // Define routes where Navbar should NOT appear
  // const hideNavbarOn = ["/login", "/register", "/"];

  // const showNavbar = !hideNavbarOn.includes(location.pathname);
  return (
    <BrowserRouter>
    {/* {showNavbar && <Navbar/>} */}
    <PrismNavbar/> 
      <Routes>
           
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="job/:slug/:id" element={<JobDetails />} />
        <Route path="/Create-job" element={<CreateJob />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
