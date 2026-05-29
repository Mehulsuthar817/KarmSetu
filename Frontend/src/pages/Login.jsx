import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() { // 1. Capitalize component names
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // 2. Prevent the page from refreshing
    try {
      await API.post("/auth/login", { email, password });
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <>
      {/* 3. Move handleLogin to the form's onSubmit */}
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail((e.target.value).toLowerCase())} // 4. Use e.target.value
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 4. Use e.target.value
        />

        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;