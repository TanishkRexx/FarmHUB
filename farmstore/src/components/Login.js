import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Login.css";

export default function Login() {
  const [login, setLogin] = useState({
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const saveLogin = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8001/api/auth/login",
        login
      );
      if (response.status === 200) {
        alert(response.data.msg);
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            name: login.name,
            role: response.data.role,
            id: response.data._id,
          })
        );

        if (response.data.role === "buyer") navigate("/");
        else navigate("/seller");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error("Error during login:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container animate-fade-in">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to continue to FarmHUB</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your username"
              value={login.name}
              onChange={saveLogin}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={login.password}
              onChange={saveLogin}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="register-link">
          <p>
            Don’t have an account?{" "}
            <Link to="/SignIN" className="highlight-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
