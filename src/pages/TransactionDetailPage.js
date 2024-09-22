import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TransactionDetailPage.css"; // Ensure you have appropriate styling

const TransactionDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigation to handle redirection after confirmation

  const {
    selectedCustomer = {},
    orderDetails = [], // Renamed from 'detail' to 'orderDetails' for clarity
    discountAmount = 0,
    totalAfterDiscount = 0, // Use the passed value from state
    paymentMethod: initialPaymentMethod = "",
    paymentStatus: initialPaymentStatus = "Not paid",
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [status, setStatus] = useState(initialPaymentStatus);

  const generateInvoiceCode = () => {
    const now = new Date();
    return `INV-${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}-${now.getTime()}`;
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const handleConfirmOrder = () => {
    // Logic for confirming order (e.g., saving to backend, navigating to another page)
    console.log("Order Confirmed");
    navigate("/order-confirmation", {
      state: {
        invoiceCode: generateInvoiceCode(),
        paymentMethod,
        status,
        selectedCustomer,
        orderDetails,
        totalAfterDiscount,
      },
    });
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

        <div className="customer-details">
          <h3>Customer Details</h3>
          <p>Name: {selectedCustomer.name || "N/A"}</p>
          <p>Phone: {selectedCustomer.phone || "N/A"}</p>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {orderDetails.length > 0 ? (
              orderDetails.map((item, idx) => (
                <li key={idx}>
                  {item.service_name} - {item.quantity} {item.unit || "pcs"} x{" "}
                  {item.price} = {item.total}
                </li>
              ))
            ) : (
              <li>No order details available</li>
            )}
          </ul>
          <h4>
            Total Before Discount: Rp{" "}
            {orderDetails.reduce((sum, item) => sum + item.total, 0)}
          </h4>
          <h4>Discount: Rp {discountAmount}</h4>
          <h4>Total After Discount: Rp {totalAfterDiscount}</h4>
        </div>

        <div className="payment-method">
          <h3>Payment Method: {paymentMethod}</h3>
        </div>

        <div className="order-status">
          <h3>Payment Status : {paymentStatus}</h3>
        </div>

        <button
          className="confirm-order-button"
          onClick={handleConfirmOrder}
          disabled={!paymentMethod || status === "Not paid"}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
