import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {

  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail ] = useState("")
  const [password , setPassword ] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({email,password})
    if (success) {
      navigate("/")
    }
  };

  if(loading){
    return (
      <main>
        <div className="loading-container">
          <div className="spinner"></div>
          <h1>Authenticating...</h1>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>Welcome Back</h1>
        <p>Sign in to access your interview plans.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              onChange={(e) => {setEmail(e.target.value)}}
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {setPassword(e.target.value)}}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="button primary-button">Sign In</button>
        </form>

        <p>Don't have an account? <Link to={"/register"}>Create one</Link></p>
      </div>
    </main>
  );
};

export default Login;
