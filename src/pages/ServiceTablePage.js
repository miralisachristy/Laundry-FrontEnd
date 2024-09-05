import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import "../styles/csspages.css"; // Import the global CSS file
import AddServiceForm from "../components/AddServiceForm"; // Import the AddServiceForm component

const ServiceTablePage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);

  // Fetch services
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((response) => {
        if (response.status === 200) {
          setServices(response.data);
          setFilteredServices(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter services based on the search query
    const filtered = services.filter((service) =>
      service.service_name.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  };

  const handleOnAddFinished = (newService) => {
    // Add the new service to the services list
    const updatedServices = [...services, newService];

    // Update both services and filteredServices
    setServices(updatedServices);

    // Apply the current search filter to the updated services list
    const filtered = updatedServices.filter((service) =>
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);

    // Close the form
    setShowAddServiceForm(false);
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Service List</h2>
        {error && <p>{error}</p>}

        {/* Search input */}
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />

        <button
          className="add-button"
          onClick={() => setShowAddServiceForm(true)}
        >
          Add Service
        </button>

        {showAddServiceForm && (
          <AddServiceForm
            onClose={() => setShowAddServiceForm(false)}
            onAdd={handleOnAddFinished} // Pass the handler here
          />
        )}

        <ul className="service-icon-list">
          {filteredServices.map((service) => (
            <li key={service.id_service} className="service-icon-item">
              <div className="service-box">
                <div className="service-icon">
                  <img
                    src={`http://localhost:3000/images/${service.image}`} // Ensure this path is correct
                    alt={service.service_name}
                    className="icon-image"
                  />
                </div>
                <div className="service-info">
                  <h3>{service.service_name}</h3>
                  <p>Type: {service.service_type}</p>
                  <p>Processing Time: {service.processing_time}</p>
                  <p>Price: Rp {service.price}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceTablePage;
