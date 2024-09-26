// src/pages/CustomerTablePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import AddCustomerForm from "../components/AddCustomerForm";
import UpdateCustomerForm from "../components/UpdateCustomerForm";
import "../styles/csspages.css";

const CustomerTablePage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [showUpdateCustomerForm, setShowUpdateCustomerForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/customers");
      const customersData = response.data.data;
      if (Array.isArray(customersData)) {
        const sortedCustomers = customersData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCustomers(sortedCustomers);
      } else {
        console.error("Expected an array but got:", customersData);
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching the customer data:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.phone, customer.email, customer.address].some(
      (field) => field && field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      await axios.put(
        `http://localhost:3000/api/customers/${updatedCustomer.id_customer}`,
        updatedCustomer
      );
      fetchCustomers(); // Refresh the customer list
      // setShowUpdateCustomerForm(false);
      window.location.reload(); // This will reload the entire page
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setShowUpdateCustomerForm(true);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(customerId)
        ? prevSelectedIds.filter((id) => id !== customerId)
        : [...prevSelectedIds, customerId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredCustomers.map((customer) => customer.id_customer));
    } else {
      setSelectedIds([]);
    }
    setSelectAll(event.target.checked);
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.post("http://localhost:3000/api/customers/delete", {
        ids: selectedIds,
      });
      fetchCustomers(); // Refresh the customer list
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected customers:", error);
    }
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2 style={{ textAlign: "left", marginRight: "20px" }}>
          Customer List
        </h2>
        <div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, phone, email, address"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="add-button"
            onClick={() => setShowAddCustomerForm(true)}
          >
            Add Customer
          </button>
          {selectedIds.length > 0 && (
            <button className="delete-button" onClick={handleDeleteSelected}>
              Delete
            </button>
          )}
        </div>
        {showAddCustomerForm && (
          <AddCustomerForm
            setShowAddCustomerForm={setShowAddCustomerForm}
            setCustomers={setCustomers} // Pass setCustomers here
          />
        )}
        {showUpdateCustomerForm && (
          <UpdateCustomerForm
            setShowUpdateCustomerForm={setShowUpdateCustomerForm}
            customer={selectedCustomer}
            onUpdateCustomer={handleUpdateCustomer} // Update prop name to match expected name
          />
        )}
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id_customer}>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(customer.id_customer)}
                      onChange={() =>
                        handleSelectCustomer(customer.id_customer)
                      }
                    />
                  </td>
                  <td>{customer.name}</td>
                  <td style={{ textAlign: "center" }}>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td style={{ textAlign: "center" }}>
                    {new Date(customer.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    {new Date(customer.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: "2-digit",
                    })}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateClick(customer)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTablePage;
