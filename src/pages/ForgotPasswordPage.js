import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../components/PopupMessage";
import "./ForgotPasswordPage.css";
// import useOutletName from "../hooks/useOutletName";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State to control popup visibility
  const [popupType, setPopupType] = useState(""); // State to determine the type of popup message (error or success)
  //   const { outletName, error } = useOutletName(); // Call custom hook here

  const handleBackToLoginClick = () => {
    navigate("/"); // Navigate to the Forgot Password page
  };

  const navigate = useNavigate(); // Initialize useNavigate

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/forgot-password`,
        { email }
      );
      setPopupMessage(
        `Password reset link sent to ${response.data.data.email}`
      );
      setPopupType("success");
      setIsPopupVisible(true);

      // Navigate to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setPopupMessage("Error sending reset link. Please try again.");
      setPopupType("error");
      setIsPopupVisible(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); // Hide the popup message
  };

  return (
    <div className="forgot-password-page">
      <form onSubmit={handleForgotPassword}>
        <div className="form-group">
          <div className="logo-container">
            <img src="/images/logo.png" alt="Laundry Logo" className="logo" />
          </div>
          {/* <h2>{outletName}</h2> */}
          {/* {error && <p className="error-message">{error}</p>} */}
          <h2>Forgot Password</h2>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="submit-button-container">
          <button type="submit" className="submit-button">
            Send Reset Link
          </button>
        </div>

        <div className="back-login-container">
          <button
            type="button"
            className="back-login-link"
            onClick={handleBackToLoginClick}
          >
            Back to Login
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

export default ForgotPasswordPage;
