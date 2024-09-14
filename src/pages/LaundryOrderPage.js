import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import "./LaundryOrderPage.css";

const LaundryOrderPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [remark, setRemark] = useState("");
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);
  const [isServiceSelected, setIsServiceSelected] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showServiceSelection, setShowServiceSelection] = useState(true);
  const [showCustomerSelection, setShowCustomerSelection] = useState(true);
  const [quantityLimits, setQuantityLimits] = useState({ min: 1, max: 100 });
  const [capacity, setCapacity] = useState(0);
  const [quota, setQuota] = useState(0);
  const [quotaUsedToday, setQuotaUsedToday] = useState(0);

  const [currentUser, setCurrentUser] = useState("");
  const [outlet_name, setOutletName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotaData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/quotas");
        const quotaData = response.data.data[0];
        const { capacity, quota, today } = quotaData;

        const user = localStorage.getItem("user_name");
        setCurrentUser(user || "Unknown User");

        setCapacity(capacity);
        setQuota(quota);
        setQuotaUsedToday(today);
      } catch (error) {
        console.error("Error fetching quota data:", error);
      }
    };

    const fetchOutletData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/outlets");
        const outletData = response.data.data[0];
        const { outlet_name, address, phone } = outletData;

        setOutletName(outlet_name);
        setAddress(address);
        setPhone(phone);
      } catch (error) {
        console.error("Error fetching outlet data:", error);
      }
    };

    fetchQuotaData();
    fetchOutletData();
  }, [orderDetails]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerSelected(true);
    setShowCustomerSelection(false);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setQuantity("");
    setRemark("");
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
        remark: remark,
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
      setRemark("");
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
    setRemark(serviceToEdit.remark || "");
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

  const handleNavigateToTransactionDetail = () => {
    navigate("/transaction-detail", {
      state: {
        orderDetails,
        selectedCustomer,
        currentUser,
        address,
        outlet_name,
        phone,
        capacity,
        quota,
      },
    });
  };

  const calculateTotal = () => {
    return orderDetails.reduce((sum, item) => sum + item.total, 0);
  };

  // Calculate remaining capacity and quota used for today
  const remainingCapacity = capacity - quotaUsedToday;
  const quotaUsedTodayTotal = orderDetails.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

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
          <div className="order-summary-outlet">
            <h3>Outlet Details</h3>
            <p>Outlet Name: {outlet_name}</p>
            <p>Address: {address}</p>
            <p>Phone: {phone}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.service_name}</td>
                  <td>
                    {detail.quantity} {detail.unit}
                  </td>
                  <td>{detail.total}</td>
                  <td>{detail.remark}</td>
                  <td>
                    <button
                      onClick={() => handleEditService(index)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(index)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="order-summary-total">
            <h3>Total: {calculateTotal()}</h3>
          </div>
          <button
            onClick={handleNavigateToTransactionDetail}
            className="confirm-order-button"
          >
            Confirm Order
          </button>
        </div>
      )}

      <div className="section service-actions">
        <button
          onClick={handleAddMoreServices}
          className="add-more-services-button"
        >
          {showServiceSelection
            ? "Add More Services"
            : "Back to Service Selection"}
        </button>
      </div>

      <div className="section capacity-info">
        <h3>Remaining Capacity for Today: {remainingCapacity}</h3>
        <h3>Quota Used Today: {quotaUsedToday + quotaUsedTodayTotal}</h3>
      </div>
    </div>
  );
};

export default LaundryOrderPage;
