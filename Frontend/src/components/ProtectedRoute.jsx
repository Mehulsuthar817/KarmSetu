import { useAuth } from "../context/Authcontext";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({children}){


    const {user,loading} = useAuth();
    console.log(user);
    if(loading) return null;
    return user?children:<Navigate to="/login"/> ;
}