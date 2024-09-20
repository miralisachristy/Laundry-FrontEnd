import React from "react";

const OrderSummary = ({
  orderDetails,
  discount,
  paymentMethod,
  paymentStatus,
  onDiscountChange,
  onPaymentMethodChange,
  onPaymentStatusChange,
  onConfirmService,
  onContinue,
  isContinueDisabled,
}) => {
  return (
    <div className="order-summary">
      {/* Your order summary UI */}
      {/* Example: */}
      <h2>Order Summary</h2>
      {orderDetails.map((detail, index) => (
        <div key={index}>
          <h3>{detail.service.name}</h3>
          <p>Quantity: {detail.quantity}</p>
          <p>Description: {detail.description}</p>
        </div>
      ))}
      <input
        type="number"
        value={discount}
        onChange={onDiscountChange}
        min={0}
        max={100}
        placeholder="Discount"
      />
      <select value={paymentMethod} onChange={onPaymentMethodChange}>
        {/* Payment method options */}
      </select>
      <select value={paymentStatus} onChange={onPaymentStatusChange}>
        {/* Payment status options */}
      </select>
      <button onClick={onConfirmService}>Confirm Service</button>
      <button onClick={onContinue} disabled={isContinueDisabled}>
        Continue
      </button>
    </div>
  );
};

export default OrderSummary;
