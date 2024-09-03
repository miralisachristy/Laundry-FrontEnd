import React, { useState, useEffect } from "react"; // Ensure useState and useEffect are imported
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import axios from "axios"; // Import axios for making HTTP requests
import "./Navigation.css";

const Navigation = () => {
  const [outletName, setOutletName] = useState("My Laundry"); // Default value
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    // Fetch outlet name from API when component mounts
    axios
      .get("http://localhost:5000/api/laundry/outlets/1")
      .then((response) => {
        if (response.status === 200) {
          setOutletName(response.data.nama_outlet); // Set the fetched outlet name
        }
      })
      .catch((error) => {
        console.error("Error fetching outlet data:", error);
        setError("Failed to load outlet name"); // Set error message
      });
  }, []);

  const handleLogout = () => {
    // Clear authentication data (this could be a token or session)
    //localStorage.removeItem("authToken");

    // Redirect to login or home page
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">{error ? error : outletName}</div>
        <ul className="navbar-menu">
          <li>
            <Link to="/outlet-table">Outlet</Link>
          </li>
          <li>
            <Link to="/users-table">User</Link>
          </li>
          <li>
            <Link to="/service-table">Service</Link>
          </li>
          <li>
            <Link to="/order-table">Order</Link>
          </li>
          <li>
            <Link to="/customer-table">Customer</Link>
          </li>
          <li>
            <Link href="#" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
