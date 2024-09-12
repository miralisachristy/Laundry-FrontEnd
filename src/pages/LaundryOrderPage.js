import React, { useState } from "react";
// import axios from "axios";
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

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerSelected(true); // Close customer dropdown
  };

  // Handle service selection
  const handleSelectService = (service) => {
    setSelectedService(service);
    setQuantity(""); // Reset quantity when a new service is selected
    setIsServiceSelected(true); // Close service dropdown
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

      setOrderDetails((prevDetails) => [...prevDetails, newOrderDetail]);
      // Reset selected service and quantity
      setSelectedService(null);
      setQuantity("");
      setIsServiceSelected(false); // Allow adding more services
    } else {
      // Show error message or handle invalid input
    }
  };

  // Calculate the total amount
  const calculateTotal = () => {
    return orderDetails.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="laundry-order-page">
      <div className="section customer-selection">
        {/* <h2>Select Customer</h2> */}
        {!isCustomerSelected && (
          <CustomerSelection onSelectCustomer={handleSelectCustomer} />
        )}
        {selectedCustomer && (
          <div className="customer-detail">
            <h3>Selected Customer</h3>
            <p>Name: {selectedCustomer.name}</p>
            <p>Phone: {selectedCustomer.phone}</p>
            <button
              onClick={() => setIsCustomerSelected(false)}
              className="change-customer-button"
            >
              Change Customer
            </button>
          </div>
        )}
      </div>

      <div className="section service-selection">
        {/* <h2>Select Service</h2> */}
        {!isServiceSelected && (
          <ServiceSelection onSelectService={handleSelectService} />
        )}
        {selectedService && (
          <div className="service-detail">
            <h3>Selected Service</h3>
            <p>Service: {selectedService.service_name}</p>
            <p>Price: {selectedService.price}</p>
            <input
              type="number"
              placeholder="Enter quantity"
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
                  onClick={() => {
                    setSelectedService(item);
                    setIsServiceSelected(true);
                  }}
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
            onClick={() => setIsServiceSelected(false)}
            className="add-more-services-button"
          >
            Add More Services
          </button>
        </div>
      )}
    </div>
  );
};

export default LaundryOrderPage;
