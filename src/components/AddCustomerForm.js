import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/csspages.css";

const AddCustomerForm = ({ setShowAddCustomerForm, setCustomers }) => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState(""); // State to hold error messages
  const [existingCustomers, setExistingCustomers] = useState([]); // State to hold existing customers

  useEffect(() => {
    // Fetch existing customers on component mount
    const fetchExistingCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        setExistingCustomers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching existing customers:", error);
      }
    };

    fetchExistingCustomers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (phone) => {
    // Regular expression for Indonesian phone number validation
    const phoneRegex = /^(?:\+62|0)8[1-9]\d{7,12}$/;
    return phoneRegex.test(phone);
  };

  const handleAddCustomer = async (event) => {
    event.preventDefault();

    // Check for phone number validity
    if (!validatePhoneNumber(newCustomer.phone)) {
      setError(
        "Invalid phone number. Please enter a valid Indonesian phone number."
      );
      return;
    }

    // Check for duplicates
    const isEmailDuplicate = existingCustomers.some(
      (customer) => customer.email === newCustomer.email
    );
    const isPhoneDuplicate = existingCustomers.some(
      (customer) => customer.phone === newCustomer.phone
    );

    if (isEmailDuplicate) {
      setError("Email is already registered.");
      return;
    }
    if (isPhoneDuplicate) {
      setError("Phone number is already registered.");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://localhost:3000/api/customers",
        newCustomer
      );
      setCustomers((prevCustomers) => [...prevCustomers, response.data.data]);
      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
      setShowAddCustomerForm(false); // Close the form
      window.location.reload(); // This will reload the entire page
    } catch (error) {
      console.error("Error adding new customer:", error);
    }
  };

  return (
    <div className="add-customer-box">
      <h3>Add New Customer</h3>
      <button
        className="close-button"
        type="button"
        onClick={() => setShowAddCustomerForm(false)}
        aria-label="Close"
      >
        &times;
      </button>
      <form onSubmit={handleAddCustomer}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newCustomer.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={newCustomer.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={newCustomer.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={newCustomer.address}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message */}
        <button type="submit" className="save-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
