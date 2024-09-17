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
  const [selectedIds, setSelectedIds] = useState([]); // State for selected customer IDs
  const [selectAll, setSelectAll] = useState(false); // State for 'Select All' checkbox

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:3000/api/customers")
      .then((response) => {
        const customersData = response.data.data; // Access the nested data array
        if (Array.isArray(customersData)) {
          // Sort customers by name A-Z only if there is more than one customer
          const sortedCustomers =
            customersData.length > 1
              ? customersData.sort((a, b) => a.name.localeCompare(b.name))
              : customersData;
          setCustomers(sortedCustomers);
        } else {
          console.error("Expected an array but got:", customersData);
          setCustomers([]); // Set an empty array or handle this case as needed
        }
      })
      .catch((error) => {
        console.error("Error fetching the customer data:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.phone, customer.email, customer.address].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers, newCustomer];
      // Sort the updated list
      return updatedCustomers.sort((a, b) => a.name.localeCompare(b.name));
    });
    setShowAddCustomerForm(false); // Close the form
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
      const response = await axios.post(
        "http://localhost:3000/api/customers/delete",
        { ids: selectedIds }
      );
      console.log("Deleted customers:", response.data.deletedCustomers);
      setCustomers((prevCustomers) =>
        prevCustomers.filter(
          (customer) => !selectedIds.includes(customer.id_customer)
        )
      );
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
        <h2>Customer Table</h2>
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
            <button className="add-button" onClick={handleDeleteSelected}>
              Delete
            </button>
          )}
        </div>
        {showAddCustomerForm && (
          <AddCustomerForm
            setShowAddCustomerForm={setShowAddCustomerForm}
            setCustomers={handleAddCustomer} // Pass handleAddCustomer function
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
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id_customer}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(customer.id_customer)}
                      onChange={() =>
                        handleSelectCustomer(customer.id_customer)
                      }
                    />
                  </td>
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
                      hour12: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTablePage;
