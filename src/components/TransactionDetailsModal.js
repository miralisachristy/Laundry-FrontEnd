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
      <div>
        <h2>Transaction Details</h2>
        <p>
          <strong>Transaction Code:</strong> {transaction.transaction_code}
        </p>
        <p>
          <strong>Outlet Name:</strong> {transaction.nama_outlet}
        </p>
        <p>
          <strong>User Name:</strong> {transaction.user_name}
        </p>
        <p>
          <strong>Customer Name:</strong> {transaction.customer_name}
        </p>
        <p>
          <strong>Customer Phone:</strong> {transaction.customer_phone}
        </p>
        <p>
          <strong>Customer Address:</strong> {transaction.customer_address}
        </p>
        <p>
          <strong>Total Amount:</strong> {transaction.total_amount}
        </p>
        <p>
          <strong>Discount:</strong> {transaction.discount}
        </p>
        <p>
          <strong>Payment Amount:</strong> {transaction.payment_amount}
        </p>
        <p>
          <strong>Payment Status:</strong> {transaction.payment_status}
        </p>
        <p>
          <strong>Payment Method:</strong> {transaction.payment_method}
        </p>
        <p>
          <strong>Remarks:</strong> {transaction.remarks}
        </p>
        <p>
          <strong>Status:</strong> {transaction.status}
        </p>
        <button onClick={closeModal}>Close</button>
      </div>
    </Modal>
  );
};

export default TransactionDetailsModal;
