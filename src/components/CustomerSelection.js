import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CustomerSelection.css";

const CustomerSelection = ({ onSelectCustomer, onAddNewCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dropdownRef = useRef(null); // Reference for dropdown element

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        const customerData = response.data.data;
        setCustomers(customerData);
        setFilteredCustomers(customerData); // Initial value for filtered customers
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchValue) ||
        customer.phone.toLowerCase().includes(searchValue)
    );
    setFilteredCustomers(filtered);
    setIsDropdownOpen(true); // Open the dropdown when searching
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(`${customer.name} - ${customer.phone}`); // Set search input to selected customer
    setIsDropdownOpen(false); // Close dropdown after selection
    onSelectCustomer(customer); // Pass selected customer to parent
  };

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="customer-selection-container">
      <h3>Select Customer</h3>

      {/* Search and Dropdown */}
      <div className="custom-dropdown" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
          className="search-input"
        />

        {isDropdownOpen && filteredCustomers.length > 0 && (
          <ul className="dropdown-list">
            {filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                onClick={() => handleCustomerSelect(customer)}
                className="dropdown-item"
              >
                {customer.name} - {customer.phone}
              </li>
            ))}
          </ul>
        )}

        {/* If no results found */}
        {isDropdownOpen && filteredCustomers.length === 0 && (
          <div className="dropdown-item no-results">No results found</div>
        )}
      </div>

      <button onClick={onAddNewCustomer}>Add New Customer</button>
    </div>
  );
};

export default CustomerSelection;
