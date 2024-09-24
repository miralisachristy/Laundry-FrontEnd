import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/csspages.css"; // Import the global CSS file
import Navigation from "../components/Navigation";

const Dashboard = () => {
  const [todayNewCustomers, setTodayNewCustomers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });
  const [serviceRequestData, setServiceRequestData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    // Dummy data for demonstration
    const dummyNewCustomersToday = 5;
    const dummyTotalCustomers = 120;
    const dummyMonthlyRevenue = 5000000; // Rp 5,000,000

    const dummyRevenueData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Revenue (Rp)",
          data: [1000000, 1500000, 1200000, 1300000],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const dummyServiceRequestData = {
      labels: ["Kiloan", "Satuan", "Dry Clean", "Ironing"],
      datasets: [
        {
          label: "Service Requests",
          data: [30, 20, 15, 10],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    setTodayNewCustomers(dummyNewCustomersToday);
    setTotalCustomers(dummyTotalCustomers);
    setMonthlyRevenue(dummyMonthlyRevenue);
    setRevenueData(dummyRevenueData);
    setServiceRequestData(dummyServiceRequestData);
  }, []);

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="content">
        <h1 className="dashboard-header">Dashboard</h1>

        <div className="stat-container">
          <div className="stat-box">
            <h3>New Customers Today</h3>
            <p>{todayNewCustomers}</p>
          </div>
          <div className="stat-box">
            <h3>Total Customers</h3>
            <p>{totalCustomers}</p>
          </div>
          <div className="stat-box">
            <h3>Monthly Revenue</h3>
            <p>Rp {monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Revenue (Per Week)</h3>
          <div className="chart">
            {revenueData.labels.length > 0 ? (
              <Line data={revenueData} />
            ) : (
              <p className="loading-message">Loading data...</p>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Most Requested Services (Last Week)</h3>
          <div className="chart">
            {serviceRequestData.labels.length > 0 ? (
              <Bar data={serviceRequestData} />
            ) : (
              <p className="loading-message">Loading data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
