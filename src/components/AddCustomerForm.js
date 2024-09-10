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
      .post("http://localhost:3000/api/customers", newCustomer)
      .then((response) => {
        setCustomers(response.data.data); // Use the updated customer data directly
        setNewCustomer({
          name: "",
          phone: "",
          email: "",
          address: "",
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
        type="button"
        onClick={() => setShowAddCustomerForm(false)} // Correctly close the form
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

        <button type="submit" className="add-button">
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomerForm;
