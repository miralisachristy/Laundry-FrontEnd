import React, { useState, useEffect } from "react";
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
  const [logoUrl, setLogoUrl] = useState(null); // State untuk menyimpan URL logo
  const { outletName, error } = useOutletName();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/outlets");

        // Ambil elemen pertama dari array data
        const outletData = response.data.data[0];

        // Asumsikan logo adalah bagian dari outletData
        const logoPath = outletData.logo; // Sesuaikan jika ada properti logo

        if (logoPath) {
          setLogoUrl(`http://localhost:3000${logoPath}`);
        } else {
          console.error("Logo tidak ditemukan dalam data outlet");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/login`,
        { username, password }
      );

      const { role, name, token } = response.data.data;

      localStorage.setItem("role", role);
      localStorage.setItem("user_name", name);
      localStorage.setItem("outlet", outletName);
      localStorage.setItem("token", token);

      setPopupMessage(`Login successful! Welcome ${role} ${name}`);
      setPopupType("success");
      setIsPopupVisible(true);

      setTimeout(() => {
        if (role === "SuperAdmin") {
          navigate("/dashboard/superadmin");
        } else if (role === "Admin") {
          navigate("/dashboard/admin");
        } else if (role === "Kasir") {
          navigate("/dashboard/kasir");
        } else {
          navigate("/home");
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
            <img src={logoUrl} alt="Laundry Logo" className="logo" />
          </div>

          <h2>{outletName}</h2>
          {/* {error && <p className="error-message">{error}</p>} */}
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
