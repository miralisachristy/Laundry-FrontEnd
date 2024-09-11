import React from "react";
import Navigation from "../components/Navigation";
import "../styles/csspages.css"; // Import the global CSS file

const Dashboard = () => {
  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h1>Dashboard</h1>
        {/* Add content for Admin dashboard here */}
      </div>
    </div>
  );
};

export default Dashboard;
