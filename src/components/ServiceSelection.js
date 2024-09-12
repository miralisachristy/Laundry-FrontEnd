import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceSelection.css";

const ServiceSelection = ({ onSelectService }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/services");
        const serviceData = response.data.data;
        setServices(serviceData);
        setFilteredServices(serviceData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = services.filter((service) =>
      service.service_name.toLowerCase().includes(searchValue)
    );
    setFilteredServices(filtered);
    setIsDropdownOpen(true);
  };

  const handleServiceSelect = (service) => {
    setSearchTerm(service.service_name);
    setIsDropdownOpen(false);
    onSelectService(service);
  };

  return (
    <div className="service-selection-container">
      <h3>Select Service</h3>

      <div className="custom-dropdown">
        <input
          type="text"
          placeholder="Search by service name"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          className="search-input"
        />

        {isDropdownOpen && (
          <ul className="dropdown-list">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <li
                  key={service.id_service}
                  onClick={() => handleServiceSelect(service)}
                  className="dropdown-item"
                >
                  {service.service_name} - {service.price}
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

export default ServiceSelection;
