import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CustomerSelection.css";

const CustomerSelection = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        const customerData = response.data.data;
        setCustomers(customerData);
        setFilteredCustomers(customerData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    setIsDropdownOpen(true);
  };

  const handleCustomerSelect = (customer) => {
    setSearchTerm(`${customer.name} - ${customer.phone}`);
    setIsDropdownOpen(false);
    onSelectCustomer(customer);
  };

  return (
    <div className="customer-selection-container" ref={dropdownRef}>
      <h3>Select Customer</h3>

      <div className="custom-dropdown">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          className="search-input"
        />

        {isDropdownOpen && (
          <ul className="dropdown-list">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className="dropdown-item"
                >
                  {customer.name} - {customer.phone}
                </li>
              ))
            ) : (
              <div className="dropdown-item no-results">No results found</div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerSelection;
