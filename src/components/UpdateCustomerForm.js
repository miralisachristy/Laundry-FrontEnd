import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/csspages.css";

const UpdateCustomerForm = ({
  setShowUpdateCustomerForm,
  customer,
  onUpdateCustomer, // Use onUpdateCustomer as the prop name
}) => {
  const [updatedCustomer, setUpdatedCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setUpdatedCustomer({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      });
    }
  }, [customer]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = `http://localhost:3000/api/customers/id/${customer.id_customer}`;
      console.log("Updating customer at:", url); // Log the URL
      const response = await axios.put(url, updatedCustomer);
      console.log("Customer updated successfully:", response.data.data);

      if (typeof onUpdateCustomer === "function") {
        onUpdateCustomer(response.data.data); // Pass the updated customer back to the parent
      } else {
        console.error("onUpdateCustomer is not a function");
      }
      // setShowUpdateCustomerForm(false); // Close the form after updating customer
      window.location.reload(); // This will reload the entire page
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  return (
    <div className="update-customer-box">
      <h3>Update Customer</h3>

      <button
        className="close-button"
        type="button"
        onClick={() => setShowUpdateCustomerForm(false)}
        aria-label="Close"
      >
        &times;
      </button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            maxLength={30}
            name="name"
            value={updatedCustomer.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            maxLength={15}
            value={updatedCustomer.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            maxLength={40}
            value={updatedCustomer.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            maxLength={40}
            value={updatedCustomer.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="update-button">
          Update
        </button>
        {/* <button
          type="button"
          className="cancel-button"
          onClick={() => setShowUpdateCustomerForm(false)}
        >
          Cancel
        </button> */}
      </form>
    </div>
  );
};

export default UpdateCustomerForm;
