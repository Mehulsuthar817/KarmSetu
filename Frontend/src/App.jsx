import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Jobs from "./pages/Job.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Home from "./pages/Home.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/PrismNav.jsx";
import PrismNavbar from "./components/PrismNav.jsx";
import { Children } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import JobApplicants from "./pages/Jobapplicants.jsx";
import MyApplications from "./pages/Myapplications.jsx";


function AppLayout({children}){
  return(
    <>
    <PrismNavbar/> 
    {children}
    </>
  )
}


function App() {
  // const location = useLocation();

  // // Define routes where Navbar should NOT appear
  // const hideNavbarOn = ["/login", "/register", "/"];

  // const showNavbar = !hideNavbarOn.includes(location.pathname);
  return (
    <BrowserRouter>
    {/* {showNavbar && <Navbar/>} */}
    
      <Routes>
           
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={ <Home /> } />
        <Route path="/dashboard" element={ <AppLayout> <ProtectedRoute> <Dashboard /> </ProtectedRoute> </AppLayout> } />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={ <ProtectedRoute> <AppLayout> <Jobs /> </AppLayout> </ProtectedRoute>   } />
        <Route path="jobs/:slug/:id" element={ <ProtectedRoute> <AppLayout> <JobDetails /> </AppLayout> </ProtectedRoute>   } />
        <Route path="/jobs/:jobId/applicants" element={ <ProtectedRoute> <AppLayout> <JobApplicants /> </AppLayout> </ProtectedRoute>   } />
        <Route path="/myapplication" element={ <ProtectedRoute> <AppLayout> <MyApplications/> </AppLayout> </ProtectedRoute> } >  </Route>
        <Route path="/create-job" element={ <ProtectedRoute> <AppLayout><CreateJob /></AppLayout> </ProtectedRoute> } />
        <Route path="/profile" element={ <ProtectedRoute> <AppLayout><Profile /></AppLayout> </ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
