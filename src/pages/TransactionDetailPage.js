import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./TransactionDetailPage.css"; // Ensure you have appropriate styling

const TransactionDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedCustomer = {},
    discountAmount = 0,
    totalAfterDiscount = 0,
    paymentMethod: initialPaymentMethod = "",
    paymentStatus: initialPaymentStatus = "Not paid",
    orderDetails = [], // Adjusted to match the new model
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [paymentProof, setPaymentProof] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const generateInvoiceCode = () => {
    const now = new Date();
    return `INV-${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}-${now.getTime()}`;
  };

  const handleConfirmOrderClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationDialog(false);
  };

  const handleOkConfirmation = async () => {
    const formData = new FormData();
    formData.append("paymentProof", paymentProof);
    formData.append("invoiceCode", generateInvoiceCode());
    formData.append("selectedCustomer", JSON.stringify(selectedCustomer));
    formData.append("orderDetails", JSON.stringify(orderDetails)); // Store the order details as JSON
    formData.append("discountAmount", discountAmount);
    formData.append("totalAfterDiscount", totalAfterDiscount);
    formData.append("paymentMethod", paymentMethod);
    formData.append("paymentStatus", paymentStatus);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/transactions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Transaction saved:", response.data);

      navigate("/order-confirmation", {
        state: {
          invoiceCode: generateInvoiceCode(),
          selectedCustomer,
          totalAfterDiscount,
          paymentMethod,
          paymentStatus,
        },
      });
    } catch (error) {
      console.error(
        "Failed to save transaction:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response
          ? error.response.data.message
          : "Failed to save transaction. Please try again."
      );
    }

    setShowConfirmationDialog(false);
  };

  const renderCustomerDetails = () => {
    return (
      <div className="customer-details">
        <h3>Customer Details</h3>
        <p>Name: {selectedCustomer.name || "N/A"}</p>
        <p>Phone: {selectedCustomer.phone || "N/A"}</p>
      </div>
    );
  };

  const renderOrderDetails = () => {
    if (!orderDetails || orderDetails.length === 0) {
      return <p>No order details available</p>;
    }

    return (
      <ul>
        {orderDetails.map((item, idx) => (
          <li key={idx}>
            {item.service_name} - {item.quantity} {item.unit || "pcs"} x{" "}
            {item.price} = {item.total}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="transaction-detail-container">
      <div className="transaction-detail-box">
        <h2>Transaction Details</h2>

        <div className="invoice-details">
          <p>Invoice Code: {generateInvoiceCode()}</p>
          <p>Date: {new Date().toLocaleString()}</p>
          <p>Outlet Name: Your Outlet Name</p>
        </div>

        {renderCustomerDetails()}

        <div className="order-summary">
          <h3>Order Summary</h3>
          {renderOrderDetails()}
          <h4>
            Total Before Discount: Rp{" "}
            {orderDetails.reduce((sum, item) => sum + item.total, 0)}
          </h4>
          <h4>Discount: Rp {discountAmount}</h4>
          <h4>Total After Discount: Rp {totalAfterDiscount}</h4>
        </div>

        <div className="payment-method">
          <h3>Payment Method</h3>
          <select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="E-wallet">E-wallet</option>
          </select>
        </div>

        <div className="order-status">
          <h3>Payment Status</h3>
          <select value={paymentStatus} onChange={handleStatusChange}>
            <option value="Not paid">Not paid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {paymentStatus === "Paid" && (
          <div className="payment-proof">
            <label htmlFor="paymentProof">Upload Payment Proof:</label>
            <input
              type="file"
              id="paymentProof"
              name="paymentProof"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        <button
          className="confirm-order-button"
          onClick={handleConfirmOrderClick}
          disabled={!paymentMethod || paymentStatus === "Not paid"}
        >
          Confirm Order
        </button>

        {error && <p className="error-message">{error}</p>}

        {showConfirmationDialog && (
          <div className="confirmation-dialog">
            <div className="confirmation-dialog-content">
              <h4>Are you sure the transaction details are correct?</h4>
              <button onClick={handleOkConfirmation}>OK</button>
              <button onClick={handleCancelConfirmation}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailPage;
