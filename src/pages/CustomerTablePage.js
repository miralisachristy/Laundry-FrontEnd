// src/pages/CustomerTablePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import AddCustomerForm from "../components/AddCustomerForm"; // Import the AddCustomerForm component
import "../styles/csspages.css"; // Import the global CSS file

const CustomerTablePage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:5000/api/customers")
      .then((response) => {
        // Sort customers by name A-Z
        const sortedCustomers = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCustomers(sortedCustomers);
      })
      .catch((error) => {
        console.error("Error fetching the customer data:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Customer Table</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="add-customer-button"
            onClick={() => setShowAddCustomerForm(true)}
          >
            Add Customer
          </button>
        </div>
        {showAddCustomerForm && (
          <AddCustomerForm
            setShowAddCustomerForm={setShowAddCustomerForm}
            setCustomers={setCustomers}
          />
        )}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id_customer}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>
                    {new Date(customer.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    {new Date(customer.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTablePage;
