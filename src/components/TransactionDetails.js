import React, { useState } from "react";

const TransactionDetails = ({ cartItems, customer, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const handleSubmit = () => {
    const transaction = {
      customer,
      services: cartItems,
      total: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      paymentMethod,
      paymentStatus,
      date: new Date(),
    };
    onSubmit(transaction);
  };

  return (
    <div>
      <h3>Transaction Details</h3>
      <p>Customer: {customer.name}</p>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.service_name} - {item.quantity} x {item.price}
          </li>
        ))}
      </ul>
      <p>
        Total:{" "}
        {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
      </p>

      <div>
        <label>Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="Qris">Qris</option>
          <option value="Transfer">Transfer</option>
        </select>
      </div>

      <div>
        <label>Payment Status:</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option value="">Select Payment Status</option>
          <option value="Lunas">Lunas</option>
          <option value="Belum Bayar">Belum Bayar</option>
        </select>
      </div>

      <button onClick={handleSubmit}>Submit Transaction</button>
    </div>
  );
};

export default TransactionDetails;
