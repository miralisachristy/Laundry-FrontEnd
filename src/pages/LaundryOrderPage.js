import React, { useState } from "react";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import "./LaundryOrderPage.css"; // Ensure you have appropriate styling

const LaundryOrderPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [isServiceSelected, setIsServiceSelected] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the service being edited
  const [showServiceSelection, setShowServiceSelection] = useState(true);
  const [showCustomerSelection, setShowCustomerSelection] = useState(true);

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerSelected(true);
    setShowCustomerSelection(false);
  };

  // Handle service selection
  const handleSelectService = (service) => {
    setSelectedService(service);
    setQuantity("");
    setIsServiceSelected(true);
    setShowServiceSelection(false);
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Add selected service to the order details
  const handleAddToOrder = () => {
    if (selectedService && quantity) {
      const newOrderDetail = {
        ...selectedService,
        quantity: parseInt(quantity, 10),
        total: selectedService.price * parseInt(quantity, 10),
      };

      if (editingIndex !== null) {
        // Update the existing service in orderDetails
        const updatedOrderDetails = [...orderDetails];
        updatedOrderDetails[editingIndex] = newOrderDetail;
        setOrderDetails(updatedOrderDetails);
        setEditingIndex(null); // Clear editing index after update
      } else {
        // Add new service to orderDetails
        setOrderDetails((prevDetails) => [...prevDetails, newOrderDetail]);
      }

      setSelectedService(null);
      setQuantity("");
      setIsServiceSelected(false);
      setShowServiceSelection(false);
    }
  };

  // Toggle service selection visibility
  const handleAddMoreServices = () => {
    setShowServiceSelection((prev) => !prev);
  };

  // Toggle customer selection visibility
  const handleChangeCustomer = () => {
    if (isCustomerSelected) {
      setSelectedCustomer(null);
      setIsCustomerSelected(false);
    }
    setShowCustomerSelection((prev) => !prev);
  };

  // Handle editing an existing service
  const handleEditService = (index) => {
    const serviceToEdit = orderDetails[index];
    setSelectedService(serviceToEdit);
    setQuantity(serviceToEdit.quantity);
    setEditingIndex(index); // Set the index for editing
    setIsServiceSelected(true);
    setShowServiceSelection(false);
  };

  // Calculate the total amount
  const calculateTotal = () => {
    return orderDetails.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="laundry-order-page">
      <div className="section customer-selection">
        {!isCustomerSelected && showCustomerSelection && (
          <CustomerSelection onSelectCustomer={handleSelectCustomer} />
        )}
        {selectedCustomer && (
          <div className="customer-detail">
            <h3>Selected Customer</h3>
            <p>Name: {selectedCustomer.name}</p>
            <p>Phone: {selectedCustomer.phone}</p>
            <button
              onClick={handleChangeCustomer}
              className="change-customer-button"
            >
              {showCustomerSelection ? "Cancel" : "Change Customer"}
            </button>
          </div>
        )}
      </div>

      <div className="section service-selection">
        {showServiceSelection && !isServiceSelected && (
          <ServiceSelection onSelectService={handleSelectService} />
        )}
        {selectedService && (
          <div className="service-detail">
            <h3>Selected Service</h3>
            <p>Service: {selectedService.service_name}</p>
            <p>Price: {selectedService.price}</p>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input"
            />
            <button onClick={handleAddToOrder} className="add-to-order-button">
              Add to Order
            </button>
          </div>
        )}
      </div>

      {orderDetails.length > 0 && (
        <div className="section order-summary">
          <h2>Order Summary</h2>
          {selectedCustomer && (
            <div className="order-summary-customer">
              <h3>Customer Details</h3>
              <p>Name: {selectedCustomer.name}</p>
              <p>Phone: {selectedCustomer.phone}</p>
            </div>
          )}
          <ul>
            {orderDetails.map((item, index) => (
              <li key={index} className="order-summary-item">
                {item.service_name} - {item.quantity} x {item.price} ={" "}
                {item.total}
                <button
                  onClick={() => handleEditService(index)}
                  className="change-service-button"
                >
                  Change Service
                </button>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <h4>Total Amount: {calculateTotal()}</h4>
          </div>
          <button
            onClick={handleAddMoreServices}
            className="add-more-services-button"
          >
            {showServiceSelection ? "Cancel" : "Add More Services"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LaundryOrderPage;
