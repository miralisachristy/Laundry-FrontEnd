import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import "./LaundryOrderPage.css";
import AddCustomerForm from "../components/AddCustomerForm";
import { formatDate } from "../utils/dateHelper";
import Navigation from "../components/Navigation";

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
        remainingQuota -= serviceQuotaUsed;
      });

      // Menghitung kuota yang digunakan untuk layanan baru
      let newQuotaUsed = 0;
      if (selectedService.service_type === "Kiloan") {
        newQuotaUsed = quantity / quota.qty_kiloan_per_quota;
      } else if (selectedService.service_type === "Satuan") {
        newQuotaUsed = quantity / quota.qty_satuan_per_quota;
      }
      newQuotaUsed = Math.ceil(newQuotaUsed); // Pembulatan ke atas

      // Cek apakah kuota pada tanggal yang dipilih mencukupi
      let availableDate = selectedDate;
      let historyForSelectedDate = quotaDailyHistoryState.find(
        (history) => history.date === selectedDate
      );

      if (
        historyForSelectedDate &&
        historyForSelectedDate.remaining >= newQuotaUsed
      ) {
        // Update kuota pada tanggal yang sudah ada
        const updatedQuotaHistory = quotaDailyHistoryState.map((history) => {
          if (history.date === selectedDate) {
            return {
              ...history,
              remaining: history.remaining - newQuotaUsed,
            };
          }
          return history;
        });

        setQuotaDailyHistoryState(updatedQuotaHistory); // Update state dengan data kuota yang diperbarui
      } else {
        // Jika tidak ada kuota yang mencukupi, buat entri untuk tanggal berikutnya
        if (
          !availableDate ||
          !historyForSelectedDate ||
          historyForSelectedDate.remaining < newQuotaUsed
        ) {
          const nextDate = getNextDate(quotaDailyHistoryState); // Mendapatkan tanggal berikutnya
          const newHistory = {
            date: nextDate,
            used: 0,
            remaining: quota.max_quota,
          };

          setQuotaDailyHistoryState((prevState) => [...prevState, newHistory]);
          availableDate = nextDate;
        }

        // Set remaining untuk kuota baru yang digunakan
        const updatedQuotaHistory = quotaDailyHistoryState.map((history) => {
          if (history.date === availableDate) {
            return {
              ...history,
              remaining: history.remaining - newQuotaUsed,
            };
          }
          return history;
        });

        setQuotaDailyHistoryState(updatedQuotaHistory); // Update dengan entri baru
      }

      // Hitung estimasi tanggal selesai berdasarkan processing_time (dalam jam)
      const selectedDateObj = new Date(availableDate);
      const estimatedCompletionDate = new Date(
        selectedDateObj.getTime() +
          selectedService.processing_time * 60 * 60 * 1000
      );
      const formattedCompletionDate = estimatedCompletionDate
        .toISOString()
        .split("T")[0];

      // Tambahkan layanan baru ke orderDetails
      const newOrderDetail = {
        ...selectedService,
        quantity: parseInt(quantity, 10),
        total: selectedService.price * parseInt(quantity, 10),
        description: description,
        date: availableDate, // Simpan tanggal yang dipilih atau yang baru dibuat
        estimatedCompletionDate: formattedCompletionDate, // Tambahkan estimasi tanggal selesai
      };

      setOrderDetails((prevDetails) => [...prevDetails, newOrderDetail]);

      // Reset form untuk layanan berikutnya
      setSelectedService(null);
      setQuantity("");
      setDescription("");
      setShowServiceSelection(true); // Kembali ke pemilihan layanan
    } else {
      // Jika kuota tidak mencukupi, peringatkan pengguna
      alert("Kuota tidak mencukupi untuk layanan yang dipilih.");
    }
  };

  const getUnitLabel = () => {
    if (!selectedService) return "";
    return selectedService.service_type === "Kiloan" ? "kg" : "pcs";
  };

  const isConfirmButtonDisabled = () => {
    return !quantity || Object.keys(errors).length > 0;
  };

  const handleDeleteService = (index) => {
    const deletedService = orderDetails[index];

    // Restore the quota used by the deleted service
    let deletedQuotaUsed = 0;
    if (deletedService.service_type === "Kiloan") {
      deletedQuotaUsed = deletedService.quantity / quota.qty_kiloan_per_quota;
    } else if (deletedService.service_type === "Satuan") {
      deletedQuotaUsed = deletedService.quantity / quota.qty_satuan_per_quota;
    }
    deletedQuotaUsed = Math.ceil(deletedQuotaUsed);

    // Update quotaDailyHistoryState for the date the service was assigned
    const updatedQuotaHistory = quotaDailyHistoryState.map((history) => {
      if (history.date === deletedService.date) {
        return {
          ...history,
          remaining: history.remaining + deletedQuotaUsed,
        };
      }
      return history;
    });

    // Remove the service from the orderDetails array
    const updatedOrderDetails = orderDetails.filter(
      (detail, idx) => idx !== index
    );

    // Update state
    setOrderDetails(updatedOrderDetails);
    setQuotaDailyHistoryState(updatedQuotaHistory);
  };

  return (
    <div className="laundry-order-page">
      <Navigation />
      <div className="section customer-selection">
        {!selectedCustomer && showCustomerSelection && (
          <>
            <CustomerSelection onSelectCustomer={handleSelectCustomer} />
            <div>
              <p>---- OR ----</p>
              <button
                className="add-button"
                onClick={() => setShowAddCustomerForm(true)}
              >
                Add Customer
              </button>
            </div>
          </>
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
      {showAddCustomerForm && (
        <AddCustomerForm
          setShowAddCustomerForm={setShowAddCustomerForm}
          setCustomers={setCustomers} // Pass setCustomers here
        />
      )}

      <div className="section service-selection">
        {showServiceSelection && !selectedService && (
          <ServiceSelection onSelectService={handleSelectService} />
        )}
        {selectedService && (
          <div className="service-detail">
            <h3 style={{ marginLeft: "10px" }}>Add Service</h3>
            {/* Tambahkan informasi tentang Quota yang tersisa */}
            {selectedDate && (
              <p>Date for Quota Usage: {formatDate(selectedDate)}</p>
            )}
            {selectedDate && (
              <p>
                Available Quota:{" "}
                {
                  quotaDailyHistoryState.find(
                    (history) => history.date === selectedDate
                  )?.remaining
                }{" "}
                / {quota.max_quota}
              </p>
            )}

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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="description-input"
              placeholder="Add description"
            />
            <br />
            <p>Quota Used: {quotaUsed}</p>

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
                <th>Description</th>
                <th>Date Quota</th>
                <th>Actions</th> {/* Add Actions column */}
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
                  <td>{detail.description}</td>
                  <td>
                    {detail.date ? formatDate(detail.date) : ""} <br />
                    {detail.estimatedCompletionDate
                      ? formatDate(detail.estimatedCompletionDate)
                      : ""}
                  </td>
                  <td>
                    <button
                      className="delete-service-button"
                      onClick={() => handleDeleteService(index)}
                    >
                      Delete
                    </button>
                  </td>
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
