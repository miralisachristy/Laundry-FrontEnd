// src/components/AddCustomerForm.js
import React, { useState } from "react";
import axios from "axios";
import "../styles/csspages.css"; // Import the global CSS file

const AddCustomerForm = ({ setShowAddCustomerForm, setCustomers }) => {
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    created_at: new Date().toISOString(),
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCustomer = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/api/customers", newCustomer)
      .then((response) => {
        setCustomers((prev) => [...prev, response.data]);
        setNewCustomer({
          name: "",
          phone: "",
          email: "",
          address: "",
          created_at: new Date().toISOString(),
        });
        setShowAddCustomerForm(false); // Close the form after adding customer
      })
      .catch((error) => {
        console.error("Error adding new customer:", error);
      });
  };

  return (
    <div className="add-customer-box">
      <h3>Add New Customer</h3>
      <button
        className="close-button"
        onClick={() => setShowAddCustomerForm(false)}
      >
        Close
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

        <button className="add-button" type="submit">
          Add Customer
        </button>
        <button
          className="close-button"
          onClick={() => setShowAddCustomerForm(false)}
        >
          Close
        </button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
