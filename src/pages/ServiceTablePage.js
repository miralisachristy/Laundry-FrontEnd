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
          const fetchedServices = response.data;
          setServices(fetchedServices);
          setFilteredServices(fetchedServices);
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

  const handleImageError = (e) => {
    e.target.src = "/images/logo.png"; // Default image path
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Service List</h2>
        {error && <p className="error-message">{error}</p>}

        <div>
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
        </div>

        {showAddServiceForm && (
          <AddServiceForm
            onClose={() => setShowAddServiceForm(false)}
            onAdd={handleOnAddFinished} // Pass the handler here
          />
        )}

        <ul className="service-icon-list">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <li key={service.id_service}>
                <div className="service-box">
                  <div className="service-icon">
                    <img
                      src={`http://localhost:5000/upload/services/${service.image}`} // Ensure this path is correct
                      alt={service.service_name}
                      className="icon-image"
                      onError={handleImageError} // Handle image error
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
            ))
          ) : (
            <li>No services found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ServiceTablePage;
