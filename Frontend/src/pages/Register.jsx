import { useState } from "react";
import API from "../api/axios.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    
    try{
        if(!role) alert("role is empty");
        e.preventDefault();
        await API.post("auth/register",{name , email , role , password});
        alert("Register Successfully");
        navigate("/login");
    }catch(err){
        console.log(err);
        
        alert("Login failed "+err.response?.data?.message);
    }
  };
  return (
    <>
      <form onSubmit={handleRegister}>
        <label htmlFor="name" >Name</label>
        <input
          autoComplete="name"
          id="name"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)} // 4. Use e.target.value
        />
        <label htmlFor="email" >Email</label>
        <input
          autoComplete="email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 4. Use e.target.value
        />

        <label htmlFor="role-select">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            id="role-select"
            required
          >
            <option value=""
            
            disabled >Select role</option>
            <option value="candidate">candidate</option>
            <option value="employer">employer</option>
          </select>
        </label>

        <label htmlFor="pass" >Password</label>
        <input
          autoComplete="new-password"
          id="pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />

        <button type="submit">Register</button>
      </form>
    </>
  );
}
