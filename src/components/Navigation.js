import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const [outletName, setOutletName] = useState("...");
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // To store user role
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Get the outlet name from localStorage
    const storedOutletName = localStorage.getItem("outlet");
    if (storedOutletName) {
      setOutletName(storedOutletName);
    } else {
      setOutletName("Outlet not set"); // Default value if no outlet name is found
    }

    // Fetch the user role from localStorage
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    // Clear the localStorage
    localStorage.clear();
    // Redirect to login page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">{error ? error : outletName}</div>
      <ul className="navbar-menu">
        {role && (
          <li>
            <Link
              to={`/dashboard/${role.toLowerCase()}`}
              className={
                location.pathname === `/dashboard/${role.toLowerCase()}`
                  ? "active"
                  : ""
              }
            >
              Dashboard
            </Link>
          </li>
        )}

        {role === "SuperAdmin" && (
          <>
            <li>
              <Link
                to="/outlet-table"
                className={
                  location.pathname === "/outlet-table" ? "active" : ""
                }
              >
                Outlet
              </Link>
            </li>
            <li>
              <Link
                to="/users-table"
                className={location.pathname === "/users-table" ? "active" : ""}
              >
                User
              </Link>
            </li>
            <li>
              <Link
                to="/service-table"
                className={
                  location.pathname === "/service-table" ? "active" : ""
                }
              >
                Service
              </Link>
            </li>
            <li>
              <Link
                to="/order-table"
                className={location.pathname === "/order-table" ? "active" : ""}
              >
                Order
              </Link>
            </li>
            <li>
              <Link
                to="/customer-table"
                className={
                  location.pathname === "/customer-table" ? "active" : ""
                }
              >
                Customer
              </Link>
            </li>
          </>
        )}

        {role === "Admin" && (
          <>
            <li>
              <Link
                to="/service-table"
                className={
                  location.pathname === "/service-table" ? "active" : ""
                }
              >
                Service
              </Link>
            </li>
            <li>
              <Link
                to="/order-table"
                className={location.pathname === "/order-table" ? "active" : ""}
              >
                Order
              </Link>
            </li>
            <li>
              <Link
                to="/customer-table"
                className={
                  location.pathname === "/customer-table" ? "active" : ""
                }
              >
                Customer
              </Link>
            </li>
          </>
        )}

        {role === "Kasir" && (
          <>
            <li>
              <Link
                to="/laundry-order"
                className={
                  location.pathname === "/laundry-order" ? "active" : ""
                }
              >
                New Transaction
              </Link>
            </li>
            <li>
              <Link
                to="/order-table"
                className={location.pathname === "/order-table" ? "active" : ""}
              >
                Transaction List
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
