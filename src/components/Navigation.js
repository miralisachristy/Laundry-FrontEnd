import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navigation.css";

const Navigation = () => {
  const [outletName, setOutletName] = useState("My Laundry");
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // To store user role
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the outlet name
    axios
      .get("http://localhost:3000/api/outlets/outlet/1")
      .then((response) => {
        console.log("Fetched Outlet Name:", response.data.data.outlet_name); // Debugging line
        if (response.status === 200) {
          setOutletName(response.data.data.outlet_name);
        }
      })
      .catch((error) => {
        console.error("Error fetching outlet data:", error);
        setError("Failed to load outlet name");
      });

    // Fetch the user role from sessionStorage
    const userRole = localStorage.getItem("role");
    console.log("User Role from localStorage:", userRole); // Should print the role
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    // // Clear the localStorage
    // localStorage.removeItem("outlet address");
    // localStorage.removeItem("outlet phone");
    // localStorage.removeItem("outlet capacity");
    // localStorage.removeItem("outlet quota");
    localStorage.clear();

    // Redirect to login page
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">{error ? error : outletName}</div>
        <ul className="navbar-menu">
          {/* Check if role exists before rendering dashboard link */}
          {role && (
            <li>
              <Link to={`/dashboard/${role.toLowerCase()}`}>Dashboard</Link>
            </li>
          )}

          {/* Role-based Links */}
          {role === "SuperAdmin" && (
            <>
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
            </>
          )}

          {role === "Admin" && (
            <>
              <li>
                <Link to="/service-table">Service</Link>
              </li>
              <li>
                <Link to="/order-table">Order</Link>
              </li>
              <li>
                <Link to="/customer-table">Customer</Link>
              </li>
            </>
          )}

          {role === "Kasir" && (
            <>
              <li>
                <Link to="/laundry-order">New Transaction</Link>
              </li>
              <li>
                <Link to="/order-table">Transaction List</Link>
              </li>
            </>
          )}

          {/* Logout Link */}
          <li>
            <Link to="/" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
