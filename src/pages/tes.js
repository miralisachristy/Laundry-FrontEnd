import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import "./LaundryOrderPage.css";
import AddCustomerForm from "../components/AddCustomerForm";
import { formatDate } from "../utils/dateHelper";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LaundryOrderPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [description, setDescription] = useState("");
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
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const navigate = useNavigate(); // Initialize navigate

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

      // Loop through quotaDailyHistoryState to find a date with enough remaining quota
      for (let history of quotaDailyHistoryState) {
        if (history.remaining >= quotaUsed) {
          availableDate = history.date;
          break;
        }
      }

      // If no available date, create a new entry for the next date
      if (!availableDate) {
        const nextDate = getNextDate(quotaDailyHistoryState); // Mendapatkan tanggal berikutnya
        const newHistory = {
          date: nextDate,
          used: 0,
          remaining: quota.max_quota, // Set remaining to max_quota
        };

        // Update state quotaDailyHistoryState dengan tanggal baru
        setQuotaDailyHistoryState((prevState) => [...prevState, newHistory]);
        availableDate = nextDate; // Set availableDate ke tanggal baru yang dibuat
      }

      setSelectedDate(availableDate); // Simpan tanggal yang dipilih atau dibuat
    } else {
      setSelectedDate(null); // Clear selectedDate jika ada error
    }
  }, [quotaUsed, quotaDailyHistoryState, errors]);

  const getNextDate = (history) => {
    const lastDate = new Date(history[history.length - 1].date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    return nextDate.toISOString().split("T")[0];
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const calculateTotalAfterDiscount = () => {
    const totalBeforeDiscount = orderDetails.reduce(
      (sum, detail) => sum + detail.total,
      0
    );
    return totalBeforeDiscount - (totalBeforeDiscount * discount) / 100;
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSelection(false);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setShowServiceSelection(false);
    setQuantity(""); // Reset quantity
    setDescription(""); // Reset description
    setErrors({}); // Reset errors
  };

  const handleChangeCustomer = () => {
    setSelectedCustomer(null);
    setShowCustomerSelection(true);
  };

  const calculateDiscountAmount = () => {
    const totalBeforeDiscount = orderDetails.reduce(
      (sum, detail) => sum + detail.total,
      0
    );
    return (totalBeforeDiscount * discount) / 100;
  };

  const handleConfirmService = () => {
    if (selectedService && quantity) {
      // Menghitung sisa kuota dari orderDetails yang sudah ada
      let remainingQuota = quota.max_quota;

      // Loop untuk mengurangi sisa kuota berdasarkan layanan yang sudah ada
      orderDetails.forEach((detail) => {
        let serviceQuotaUsed = 0;
        if (detail.service_type === "Kiloan") {
          serviceQuotaUsed = detail.quantity / quota.qty_kiloan_per_quota;
        } else if (detail.service_type === "Satuan") {
          serviceQuotaUsed = detail.quantity / quota.qty_satuan_per_quota;
        }
        remainingQuota -= Math.ceil(serviceQuotaUsed); // Mengurangi kuota dengan pembulatan ke atas
      });

      // Update state orderDetails dengan layanan baru
      const newOrderDetails = [
        ...orderDetails,
        {
          service_name: selectedService.service_name,
          service_type: selectedService.service_type,
          quantity,
          description,
          total: selectedService.price * quantity,
        },
      ];

      setOrderDetails(newOrderDetails);

      // Update sisa kuota jika validasi berhasil
      if (selectedDate) {
        // Find the matching date entry
        const updatedQuotaDailyHistory = quotaDailyHistoryState.map((history) =>
          history.date === selectedDate
            ? {
                ...history,
                used: history.used + quotaUsed,
                remaining: history.remaining - quotaUsed,
              }
            : history
        );

        setQuotaDailyHistoryState(updatedQuotaDailyHistory);
      }
    }
  };

  const handleContinue = () => {
    // Navigate to TransactionDetailPage
    navigate("/transaction-detail");
  };

  const isButtonDisabled = () => {
    return (
      discount > 100 ||
      discount < 0 ||
      paymentStatus === "Belum Lunas" ||
      !selectedCustomer ||
      !selectedService ||
      quantity === "" ||
      Object.keys(errors).length > 0
    );
  };

  return (
    <div className="laundry-order-page">
      <Navigation />

      <h1>Order Summary</h1>

      <div className="order-summary">
        {selectedCustomer ? (
          <div>
            <h2>Customer: {selectedCustomer.name}</h2>
            <button onClick={handleChangeCustomer}>Change Customer</button>
          </div>
        ) : (
          <button onClick={() => setShowCustomerSelection(true)}>
            Select Customer
          </button>
        )}

        {selectedService ? (
          <div>
            <h3>Service: {selectedService.service_name}</h3>
            <p>Type: {selectedService.service_type}</p>
            <p>Price: {selectedService.price}</p>
            <input
              type="number"
              min="1"
              max="999"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
            />
            {errors.min && <p className="error">{errors.min}</p>}
            {errors.max && <p className="error">{errors.max}</p>}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <button onClick={handleConfirmService}>Confirm</button>
          </div>
        ) : (
          <button onClick={() => setShowServiceSelection(true)}>
            Select Service
          </button>
        )}

        {orderDetails.length > 0 && (
          <div className="order-details">
            <h3>Order Details</h3>
            <ul>
              {orderDetails.map((detail, index) => (
                <li key={index}>
                  {detail.service_name} ({detail.service_type}):{" "}
                  {detail.quantity} x {detail.total}
                </li>
              ))}
            </ul>
            <p>
              Total Before Discount:{" "}
              {orderDetails.reduce((sum, detail) => sum + detail.total, 0)}
            </p>
            <p>Discount: {calculateDiscountAmount()}</p>
            <p>Total After Discount: {calculateTotalAfterDiscount()}</p>
          </div>
        )}

        <div className="order-actions">
          <label>
            Discount:
            <input
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              min="0"
              max="100"
            />
          </label>

          <label>
            Payment Method:
            <input
              type="text"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              placeholder="Payment Method"
            />
          </label>

          <label>
            Payment Status:
            <select value={paymentStatus} onChange={handlePaymentStatusChange}>
              <option value="">Select Status</option>
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </label>

          <button
            className="continue-button"
            onClick={handleContinue}
            disabled={isButtonDisabled()}
          >
            Continue
          </button>
        </div>
      </div>

      {showCustomerSelection && (
        <CustomerSelection onSelect={handleSelectCustomer} />
      )}

      {showServiceSelection && (
        <ServiceSelection onSelect={handleSelectService} />
      )}

      {showAddCustomerForm && (
        <AddCustomerForm
          onClose={() => setShowAddCustomerForm(false)}
          onAdd={(customer) => {
            setCustomers([...customers, customer]);
            setShowAddCustomerForm(false);
          }}
        />
      )}
    </div>
  );
};

export default LaundryOrderPage;
