import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({children}){

    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    
    const getme = async ()=>{
        try{
            const res = await API.get("/auth/getme");
            
            setUser(res.data);
        }catch(err){
            console.log(err);
            setUser(null);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getme();
    },[]);

 
    return(
        <AuthContext.Provider
            value={{
                user,
                loading,
                getme
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext);
}