// src/components/RoleProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ roleRequired, children }) => {
  const role = localStorage.getItem("role");

  if (!role || role.toLowerCase() !== roleRequired.toLowerCase()) {
    // Redirect to unauthorized page if role does not match
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleProtectedRoute;
