import React, { useState, useEffect } from "react";
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
  const [logoUrl, setLogoUrl] = useState(null); // State untuk menyimpan URL logo
  //   const { outletName, error } = useOutletName(); // Call custom hook here

  const handleBackToLoginClick = () => {
    navigate("/"); // Navigate to the Forgot Password page
  };

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/outlets");
        const outletData = response.data.data[0]; // Assuming first element has the needed data
        const logoPath = outletData?.logo; // Check if logo path exists

        if (logoPath) {
          setLogoUrl(`http://localhost:3000${logoPath}`);
        } else {
          console.error("Logo not found in outlet data");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, []); // No dependencies needed, as we only want to fetch this once on mount

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
            <img src={logoUrl} alt="Laundry Logo" className="logo" />
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
