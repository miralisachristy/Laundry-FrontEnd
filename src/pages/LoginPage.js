import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../components/PopupMessage";
import "./LoginPage.css";
import useOutletName from "../hooks/useOutletName";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("");
  const { outletName, error } = useOutletName();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/login`,
        { username, password }
      );

      const { role, name, token } = response.data.data;

      // Store role and token in localStorage or sessionStorage
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);

      setPopupMessage(`Login successful! Welcome ${role} ${name}`);
      setPopupType("success");
      setIsPopupVisible(true);

      // Navigate based on user role
      setTimeout(() => {
        if (role === "SuperAdmin") {
          navigate("/dashboard/superadmin"); // Replace with your SuperAdmin dashboard route
        } else if (role === "Admin") {
          navigate("/dashboard/admin"); // Replace with your Admin dashboard route
        } else if (role === "Kasir") {
          navigate("/dashboard/kasir"); // Replace with your Kasir dashboard route
        } else {
          navigate("/home"); // Default route
        }
      }, 1500);
    } catch (error) {
      console.error("Error logging in:", error);
      setPopupMessage("Username/Password incorrect");
      setPopupType("error");
      setIsPopupVisible(true);
    }
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <div className="logo-container">
            <img src="/images/logo.png" alt="Laundry Logo" className="logo" />
          </div>
          <h2>{outletName}</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="submit-button-container">
          <button type="submit" className="submit-button">
            Login
          </button>
        </div>

        <div className="forgot-password-container">
          <button
            type="button"
            className="forgot-password-link"
            onClick={handleForgotPasswordClick}
          >
            Forgot Password?
          </button>
        </div>
      </form>
      {isPopupVisible && (
        <PopupMessage
          message={popupMessage}
          onClose={handleClosePopup}
          type={popupType}
        />
      )}
    </div>
  );
};

export default LoginPage;
