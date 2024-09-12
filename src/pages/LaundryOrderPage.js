import React, { useState } from "react";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import "./LaundryOrderPage.css";

const LaundryOrderPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [remark, setRemark] = useState(""); // State for remarks
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [isServiceSelected, setIsServiceSelected] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showServiceSelection, setShowServiceSelection] = useState(true);
  const [showCustomerSelection, setShowCustomerSelection] = useState(true);
  const [quantityLimits, setQuantityLimits] = useState({ min: 1, max: 100 });

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerSelected(true);
    setShowCustomerSelection(false);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setQuantity("");
    setRemark(""); // Clear remark when a new service is selected
    setIsServiceSelected(true);
    setShowServiceSelection(false);

    let min, max;
    switch (service.unit) {
      case "kg":
        min = 3;
        max = 100;
        break;
      case "meter":
        min = 1;
        max = 100;
        break;
      case "piece":
        min = 1;
        max = 100;
        break;
      default:
        min = 1;
        max = 100;
    }
    setQuantityLimits({ min, max });
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value >= quantityLimits.min && value <= quantityLimits.max) {
      setQuantity(value);
    }
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleAddToOrder = () => {
    if (selectedService && quantity) {
      const newOrderDetail = {
        ...selectedService,
        quantity: parseInt(quantity, 10),
        total: selectedService.price * parseInt(quantity, 10),
        remark: remark, // Add remark to order detail
      };

      if (editingIndex !== null) {
        const updatedOrderDetails = [...orderDetails];
        updatedOrderDetails[editingIndex] = newOrderDetail;
        setOrderDetails(updatedOrderDetails);
        setEditingIndex(null);
      } else {
        setOrderDetails((prevDetails) => [...prevDetails, newOrderDetail]);
      }

      setSelectedService(null);
      setQuantity("");
      setRemark(""); // Clear remark
      setIsServiceSelected(false);
      setShowServiceSelection(false);
    }
  };

  const handleAddMoreServices = () => {
    setShowServiceSelection((prev) => !prev);
  };

  const handleChangeCustomer = () => {
    if (isCustomerSelected) {
      setSelectedCustomer(null);
      setIsCustomerSelected(false);
    }
    setShowCustomerSelection((prev) => !prev);
  };

  const handleEditService = (index) => {
    const serviceToEdit = orderDetails[index];
    setSelectedService(serviceToEdit);
    setQuantity(serviceToEdit.quantity);
    setRemark(serviceToEdit.remark || ""); // Set remark for editing
    setEditingIndex(index);
    setIsServiceSelected(true);
    setShowServiceSelection(false);
  };

  const handleDeleteService = (index) => {
    const updatedOrderDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(updatedOrderDetails);

    if (updatedOrderDetails.length === 0) {
      setShowServiceSelection(true);
    }
  };

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
            <h3 style={{ marginLeft: "10px" }}>Selected Customer</h3>
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
            <h3 style={{ marginLeft: "10px" }}>Selected Service</h3>
            <p>Service: {selectedService.service_name}</p>
            <p>Price: {selectedService.price}</p>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input"
              min={quantityLimits.min}
              max={quantityLimits.max}
            />
            {selectedService.unit}
            <br />
            <textarea
              value={remark}
              onChange={handleRemarkChange}
              className="remark-input"
              placeholder="Add a remark for this service"
              maxLength={30}
            />
            <br />
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
              <h3 style={{ marginLeft: "10px" }}>Customer Details</h3>
              <p>Name: {selectedCustomer.name}</p>
              <p>Phone: {selectedCustomer.phone}</p>
            </div>
          )}
          <ul style={{ marginLeft: "50px" }}>
            {orderDetails.map((item, index) => (
              <li key={index} className="order-summary-item">
                {item.service_name} - {item.quantity} {item.unit} x {item.price}{" "}
                = {item.total}
                <p>Remark: {item.remark}</p> {/* Display the remark */}
                <div className="order-summary-buttons">
                  <button
                    onClick={() => handleEditService(index)}
                    className="change-service-button"
                  >
                    Change Service
                  </button>
                  <button
                    onClick={() => handleDeleteService(index)}
                    className="delete-service-button"
                  >
                    Delete Service
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="order-total">
            <h4 className="total-amount">Total Amount: {calculateTotal()}</h4>
          </div>
          <button
            style={{ marginLeft: "20px" }}
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
