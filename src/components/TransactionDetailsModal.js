// src/components/TransactionDetailsModal.js
import React from "react";
import Modal from "react-modal";
import "../styles/csspages.css"; // Import the global CSS file for styling the modal

const TransactionDetailsModal = ({ isOpen, closeModal, transaction }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Transaction Details"
      className="transaction-modal"
      overlayClassName="transaction-modal-overlay"
    >
      <button
        className="close-button"
        type="button"
        aria-label="Close"
        onClick={closeModal}
      >
        &times;
      </button>
      <div>
        <h2>Transaction Details</h2>
        <p>
          <strong>Invoice Code:</strong> {transaction.invoice_code}
        </p>
        <p>
          <strong>Outlet Name:</strong> {transaction.outlet_name}
        </p>
        <p>
          <strong>User Name:</strong> {transaction.user_name}
        </p>
        <p>
          <strong>Customer Name:</strong>{" "}
          {transaction.selectedCustomer?.name || "N/A"}
        </p>
        <p>
          <strong>Customer Phone:</strong>{" "}
          {transaction.selectedCustomer?.phone || "N/A"}
        </p>
        <p>
          <strong>Total Amount:</strong> Rp {transaction.totalAfterDiscount}
        </p>
        <p>
          <strong>Discount:</strong> Rp {transaction.discountAmount}
        </p>
        <p>
          <strong>Payment Status:</strong> {transaction.paymentStatus}
        </p>
        <p>
          <strong>Payment Method:</strong> {transaction.paymentMethod}
        </p>
        <p>
          <strong>Order Details:</strong>{" "}
          {JSON.stringify(transaction.orderDetails) || "N/A"}
        </p>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
