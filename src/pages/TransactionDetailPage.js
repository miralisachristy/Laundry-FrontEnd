import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./TransactionDetailPage.css"; // Ensure you have appropriate styling

const TransactionDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedCustomer = {},
    orderDetails = [],
    discountAmount = 0,
    totalAfterDiscount = 0,
    totalOrder = 0,
    paymentMethod: initialPaymentMethod = "",
    paymentStatus: initialPaymentStatus = "Not paid",
    usedQuota = 0,
    selectedDate, // Date for quota usage
    remainingQuota = 0, // Max available quota
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [paymentProof, setPaymentProof] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const outletName = localStorage.getItem("outlet");

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setUploadError(null);
  };

  const handleStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
    setUploadError(null);
  };

  const generateInvoiceCode = () => {
    const now = new Date();
    return `INV-${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}-${now.getTime()}`;
  };

  const [invoiceCode] = useState(generateInvoiceCode());

  const handleConfirmOrderClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationDialog(false);
  };

  const calculateQuotaUsed = () => {
    return usedQuota; // Directly using passed quotaUsed
  };

  const handleOkConfirmation = async () => {
    // Check if payment method is Transfer or QRIS and no payment proof is provided
    if (
      (paymentMethod === "Transfer" || paymentMethod === "QRIS") &&
      !paymentProof
    ) {
      setUploadError("Please upload the payment proof.");
      return; // Stop the function execution
    }

    const formData = new FormData();
    formData.append("paymentProof", paymentProof);
    formData.append("invoiceCode", invoiceCode);
    formData.append("selectedCustomer", JSON.stringify(selectedCustomer));
    formData.append("orderDetails", JSON.stringify(orderDetails));
    formData.append("totalBeforeDiscount", totalOrder);
    formData.append("discountAmount", discountAmount);
    formData.append("totalAfterDiscount", totalAfterDiscount);
    formData.append("paymentMethod", paymentMethod);
    formData.append("paymentStatus", paymentStatus);

    // Calculate quota used and available quota
    const quotaUsed = calculateQuotaUsed(orderDetails);
    const quotaDate = new Date().toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    console.log("Posting quota data:", {
      date: selectedDate,
      used: usedQuota,
      remaining: remainingQuota,
    });

    try {
      // Save transaction first
      const response = await axios.post(
        "http://localhost:3000/api/transactions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Ensure response is in baseResponse format
      if (response.data.data && response.data.code === 201) {
        console.log("Transaction saved:", response.data.data);

        // // Check if quota for the selectedDate already exists
        // const getQuotaResponse = await axios.get(
        //   `http://localhost:3000/api/quotas-daily-history/from-today`
        // );

        // const existingQuota = getQuotaResponse.data.data.find(
        //   (quota) => quota.date === selectedDate
        // );

        // if (existingQuota) {
        //   // If quota exists, update it using PUT
        //   const updateQuotaResponse = await axios.put(
        //     `http://localhost:3000/api/quotas-daily-history/id/${existingQuota.id}`,
        //     {
        //       date: selectedDate,
        //       used: usedQuota,
        //       remaining: remainingQuota,
        //     }
        //   );

        //   if (
        //     updateQuotaResponse.data &&
        //     updateQuotaResponse.data.code === 200
        //   ) {
        //     console.log("Quota updated for date:", selectedDate);
        //   }
        // } else {
        //   // Create a new quota if not found
        //   const createQuotaResponse = await axios.post(
        //     "http://localhost:3000/api/quotas-daily-history",
        //     {
        //       date: selectedDate,
        //       used: usedQuota,
        //       remaining: remainingQuota,
        //     }
        //   );

        //   if (
        //     createQuotaResponse.data &&
        //     createQuotaResponse.data.code === 200
        //   ) {
        //     console.log("New quota created for date:", selectedDate);
        //   }
        // }

        // Navigate to order table
        navigate("/order-table");
      } else {
        setError(response.data.message || "Failed to save transaction.");
      }
    } catch (error) {
      console.log("apa so tu error : ", error);

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

  const renderCustomerDetails = () => (
    <div className="customer-details">
      <h3>Customer Details</h3>
      <p>Name: {selectedCustomer.name || "N/A"}</p>
      <p>Phone: {selectedCustomer.phone || "N/A"}</p>
    </div>
  );

  const renderOrderDetails = () => {
    if (!orderDetails.length) {
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
          <p>Invoice Code: {invoiceCode}</p>
          <p>
            Date:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            {new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, // Ubah ke false jika ingin format 24 jam
            })}
          </p>
          <p>
            Outlet Name: {outletName ? outletName : "Outlet tidak ditemukan"}
          </p>
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
            <option value="Transfer">Transfer</option>
            <option value="Cash">Cash</option>
            <option value="QRIS">QRIS</option>
          </select>
        </div>

        <div className="order-status">
          <h3>Payment Status</h3>
          <select value={paymentStatus} onChange={handleStatusChange}>
            <option value="Not paid">Not paid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {paymentStatus === "Paid" && paymentMethod !== "Cash" && (
          <div className="payment-proof">
            <label htmlFor="paymentProof">Upload Payment Proof:</label>
            <input
              type="file"
              id="paymentProof"
              name="paymentProof"
              onChange={handleFileChange}
              required
            />
            {uploadError && <p className="error-message">{uploadError}</p>}
          </div>
        )}

        <button
          className="confirm-order-button"
          onClick={handleConfirmOrderClick}
          disabled={
            !paymentMethod ||
            !paymentStatus ||
            (paymentStatus === "Not paid" &&
              paymentMethod !== "Cash" &&
              !paymentProof)
          }
          //jika metode pembayaran tdk ada |atau| status pembayaran = not paid |dan| metode pembayaran bukan Cash |dan| bukti transaksi tidak ada
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
