import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import "./LaundryOrderPage.css";
import { formatDate } from "../utils/dateHelper";

const LaundryOrderPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [remark, setRemark] = useState("");
  const [showServiceSelection, setShowServiceSelection] = useState(true);
  const [showCustomerSelection, setShowCustomerSelection] = useState(true);
  const [quota, setQuota] = useState({
    max_quota: 0,
    qty_satuan_per_quota: 1,
    qty_kiloan_per_quota: 1,
  });
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [errors, setErrors] = useState({});
  const [quotaDailyHistoryState, setQuotaDailyHistoryState] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Fetch quota data
    const fetchQuotaData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/quotas");
        const quotaData = response.data.data[0];
        setQuota({
          max_quota: quotaData.max_quota,
          qty_satuan_per_quota: quotaData.qty_satuan_per_quota,
          qty_kiloan_per_quota: quotaData.qty_kiloan_per_quota,
        });
      } catch (error) {
        console.error("Error fetching quota data:", error);
      }
    };

    fetchQuotaData();
  }, []);

  useEffect(() => {
    // Fetch quota daily history from today onwards
    const fetchQuotaDailyHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/quotas-daily-history/from-today"
        );
        const data = response.data.data;

        if (data.length > 0) {
          setQuotaDailyHistoryState(data);
        } else {
          // No data found, create new record for today
          const today = new Date().toISOString().split("T")[0];
          const newHistory = {
            date: today,
            used: 0,
            remaining: quota.max_quota,
          };
          setQuotaDailyHistoryState([newHistory]);
        }
      } catch (error) {
        console.error("Error fetching quota daily history:", error);
      }
    };

    fetchQuotaDailyHistory();
  }, [quota]);

  useEffect(() => {
    // Calculate quota used based on selected service and quantity
    if (selectedService) {
      let usedQuota = 0;
      if (selectedService.service_type === "Kiloan") {
        usedQuota = quantity / quota.qty_kiloan_per_quota;
      } else if (selectedService.service_type === "Satuan") {
        usedQuota = quantity / quota.qty_satuan_per_quota;
      }
      setQuotaUsed(Math.ceil(usedQuota)); // Round up the quota used
    } else {
      setQuotaUsed(0);
    }
  }, [quantity, selectedService, quota]);

  useEffect(() => {
    // Validate input quantity when service is selected
    if (selectedService) {
      const minQty = selectedService.service_type === "Kiloan" ? 3 : 1;
      const maxQty =
        selectedService.service_type === "Kiloan"
          ? quota.max_quota * quota.qty_kiloan_per_quota
          : quota.max_quota * quota.qty_satuan_per_quota;
      const errors = {};

      if (quantity === "") {
        setSelectedDate(null); // Clear selectedDate if quantity is empty
        return; // Do not show errors initially
      }

      if (quantity < minQty) {
        errors.min = `Minimum quantity is ${minQty} ${
          selectedService.service_type === "Kiloan" ? "kg" : "pcs"
        }`;
        setSelectedDate(null); // Clear selectedDate if quantity is invalid
      }
      if (quantity > maxQty) {
        errors.max = `Maximum quantity is ${maxQty} ${
          selectedService.service_type === "Kiloan" ? "kg" : "pcs"
        }`;
        setSelectedDate(null); // Clear selectedDate if quantity is invalid
      }

      setErrors(errors);
    }
  }, [quantity, selectedService, quota]);

  useEffect(() => {
    // Check quotaDailyHistoryState for a date with enough remaining quota
    if (quotaUsed > 0 && Object.keys(errors).length === 0) {
      let availableDate = null;

      for (let history of quotaDailyHistoryState) {
        if (history.remaining >= quotaUsed) {
          availableDate = history.date;
          break;
        }
      }

      // If no available date, create a new entry for the next date
      if (!availableDate) {
        const nextDate = getNextDate(quotaDailyHistoryState);
        const newHistory = {
          date: nextDate,
          used: 0,
          remaining: quota.max_quota,
        };
        setQuotaDailyHistoryState((prevState) => [...prevState, newHistory]);
        availableDate = nextDate;
      }

      setSelectedDate(availableDate);
    } else {
      setSelectedDate(null); // Clear selectedDate if errors exist
    }
  }, [quotaUsed, quotaDailyHistoryState, errors]);

  const getNextDate = (history) => {
    const lastDate = new Date(history[history.length - 1].date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    return nextDate.toISOString().split("T")[0];
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSelection(false);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setShowServiceSelection(false);
    setQuantity(""); // Reset quantity
    setRemark(""); // Reset remark
    setErrors({}); // Reset errors
  };

  const handleChangeCustomer = () => {
    setSelectedCustomer(null);
    setShowCustomerSelection(true);
  };

  const handleConfirmService = () => {
    if (selectedService && quantity) {
      // Update quotaDailyHistoryState for the selected date
      const updatedQuotaHistory = quotaDailyHistoryState.map((history) => {
        if (history.date === selectedDate) {
          // Reduce the remaining quota for the selected date
          return {
            ...history,
            remaining: history.remaining - quotaUsed,
          };
        }
        return history;
      });

      setQuotaDailyHistoryState(updatedQuotaHistory); // Update the state with the new history

      // Add the new service to the orderDetails, including the selected date
      const newOrderDetail = {
        ...selectedService,
        quantity: parseInt(quantity, 10),
        total: selectedService.price * parseInt(quantity, 10),
        remark: remark,
        date: selectedDate, // Save the selected date (quota date)
      };
      setOrderDetails((prevDetails) => [...prevDetails, newOrderDetail]);

      // Reset form for the next service
      setSelectedService(null);
      setQuantity("");
      setRemark("");
      setShowServiceSelection(true); // Back to service selection
    }
  };

  const getUnitLabel = () => {
    if (!selectedService) return "";
    return selectedService.service_type === "Kiloan" ? "kg" : "pcs";
  };

  const isConfirmButtonDisabled = () => {
    return !quantity || Object.keys(errors).length > 0;
  };

  return (
    <div className="laundry-order-page">
      <div className="section customer-selection">
        {!selectedCustomer && showCustomerSelection && (
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
              Change Customer
            </button>
          </div>
        )}
      </div>

      <div className="section service-selection">
        {showServiceSelection && !selectedService && (
          <ServiceSelection onSelectService={handleSelectService} />
        )}
        {selectedService && (
          <div className="service-detail">
            <h3 style={{ marginLeft: "10px" }}>Add Service</h3>
            <p>Service: {selectedService.service_name}</p>
            <p>Price: {selectedService.price}</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity-input"
              min="1"
              placeholder="Enter quantity"
            />
            <span>{getUnitLabel()}</span>
            <br />
            {errors.min && (
              <p className="error-message" style={{ fontSize: "12px" }}>
                {errors.min}
              </p>
            )}
            {errors.max && (
              <p className="error-message" style={{ fontSize: "12px" }}>
                {errors.max}
              </p>
            )}
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="remark-input"
              placeholder="Add a remark for this service"
            />
            <br />
            <p>Quota Used: {quotaUsed}</p>
            {selectedDate && (
              <p>Date for Quota Usage: {formatDate(selectedDate)}</p>
            )}

            <button
              onClick={handleConfirmService}
              className="confirm-service-button"
              disabled={isConfirmButtonDisabled()}
              style={{
                backgroundColor: isConfirmButtonDisabled() ? "#ccc" : "#28a745",
              }}
            >
              Confirm
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
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.service_name}</td>
                  <td>
                    {detail.quantity}{" "}
                    {detail.service_type === "Kiloan" ? "kg" : "pcs"}
                  </td>
                  <td>{detail.total}</td>
                  <td>{detail.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LaundryOrderPage;
