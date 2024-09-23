// src/components/TransactionDetailsModal.js
import React from "react";
import Modal from "react-modal";
import "../styles/csspages.css"; // Import the global CSS file for styling the modal
const TransactionDetailsModal = ({ isOpen, closeModal, transaction }) => {
  const renderCustomerDetails = (customerData) => {
    if (!customerData) return <p>No Customer Details</p>;

    if (typeof customerData === "string") {
      try {
        const customer = JSON.parse(customerData);
        return (
          <div className="customer-details" key={customer.id_customer}>
            <h4>Customer Details</h4>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Address:</strong> {customer.address}
            </p>
          </div>
        );
      } catch (error) {
        console.error("Error parsing selected_customer:", error);
        return <p>Error parsing customer data</p>;
      }
    } else if (typeof customerData === "object" && customerData !== null) {
      return (
        <div className="customer-details" key={customerData.id_customer}>
          <h4>Customer Details</h4>
          <p>
            <strong>Name:</strong> {customerData.name}
          </p>
          <p>
            <strong>Phone:</strong> {customerData.phone}
          </p>
          <p>
            <strong>Email:</strong> {customerData.email}
          </p>
          <p>
            <strong>Address:</strong> {customerData.address}
          </p>
        </div>
      );
    } else {
      return <p>Invalid customer data</p>;
    }
  };

  const renderOrderDetails = (orderDetails) => {
    if (!orderDetails) {
      return <p>No Order Details</p>;
    }

    if (typeof orderDetails === "string") {
      try {
        orderDetails = JSON.parse(orderDetails);
      } catch (error) {
        console.error("Error parsing order details:", error);
        return <p>Invalid order details data</p>;
      }
    }

    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      return <p>No Order Details</p>;
    }

    return (
      <div className="order-details">
        <h4>Order Details</h4>
        <ul>
          {orderDetails.map((order) => (
            <li key={order.id_service} className="order-item">
              <strong>Service:</strong> {order.service_name} |
              <strong> Quantity:</strong> {order.quantity} |
              <strong> Price:</strong> Rp {order.price} |
              <strong> Total:</strong> Rp {order.total} |
              <strong> Estimated Completion:</strong>{" "}
              {new Date(order.estimatedCompletionDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Transaction Details"
      className="transaction-modal"
      overlayClassName="transaction-modal-overlay"
    >
      <button className="close-button" type="button" onClick={closeModal}>
        &times;
      </button>
      <h2>Transaction Details</h2>

      {renderCustomerDetails(transaction.selected_customer)}
      {renderOrderDetails(transaction.order_details)}
    </Modal>
  );
};

export default TransactionDetailsModal;
