import React from "react";

const CustomerSection = ({
  selectedCustomer,
  onSelectCustomer,
  onChangeCustomer,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="customer-section">
      {/* Your customer selection UI */}
      {/* Example: */}
      <button onClick={onSelectCustomer}>Select Customer</button>
      {selectedCustomer && (
        <div>
          <h3>{selectedCustomer.name}</h3>
          <button onClick={onChangeCustomer}>Change Customer</button>
        </div>
      )}
    </div>
  );
};

export default CustomerSection;
