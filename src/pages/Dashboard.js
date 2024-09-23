import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions");
        // Ensure response.data.data contains the array
        setRecentTransactions(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setRecentTransactions([]); // Default to empty array on error
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <div key={transaction.id}>
              <p>Customer: {transaction.customerName}</p>
              <p>Total Amount: {transaction.totalAmount}</p>
              <p>
                Date: {new Date(transaction.transactionDate).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No recent transactions available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
