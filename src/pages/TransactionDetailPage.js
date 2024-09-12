import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./TransactionDetailPage.css"; // Ensure you have appropriate styling

const TransactionDetailPage = () => {
  const location = useLocation();
  const { orderDetails, selectedCustomer } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("Not paid");

  const generateInvoiceCode = () => {
    // Generate a unique invoice code (e.g., timestamp or UUID)
    const now = new Date();
    return `INV-${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}-${now.getTime()}`;
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div className="transaction-detail-page">
      <h2>Transaction Details</h2>

      <div className="invoice-details">
        <h3>Invoice Details</h3>
        <p>Invoice Code: {generateInvoiceCode()}</p>
        <p>Date: {new Date().toLocaleString()}</p>
        <p>Outlet Name: Your Outlet Name</p>{" "}
        {/* Replace with actual outlet name */}
      </div>

      <div className="customer-details">
        <h3>Customer Details</h3>
        <p>Name: {selectedCustomer.name}</p>
        <p>Phone: {selectedCustomer.phone}</p>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {orderDetails.map((item, index) => (
            <li key={index}>
              {item.service_name} - {item.quantity} {item.unit} x {item.price} ={" "}
              {item.total}
            </li>
          ))}
        </ul>
        <h4>
          Total Amount:{" "}
          {orderDetails.reduce((sum, item) => sum + item.total, 0)}
        </h4>
      </div>

      <div className="payment-method">
        <h3>Payment Method</h3>
        <select value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="Transfer">Transfer</option>
          <option value="QRIS">QRIS</option>
        </select>
      </div>

      <div className="order-status">
        <h3>Order Status</h3>
        <select value={status} onChange={handleStatusChange}>
          <option value="Paid">Paid</option>
          <option value="Not paid">Not paid</option>
        </select>
      </div>

      <button className="confirm-order-button">Confirm Order</button>
    </div>
  );
};

export default TransactionDetailPage;
