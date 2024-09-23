import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import AddServiceForm from "../components/AddServiceForm";
import "../styles/csspages.css";

const ServiceTablePage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showEditServiceForm, setShowEditServiceForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedServices, setSelectedServices] = useState([]);

  // Function to sort and group services
  const sortAndGroupServices = (services) => {
    const kiloanServices = services.filter(
      (service) => service.service_type.toLowerCase() === "kiloan"
    );
    const satuanServices = services.filter(
      (service) => service.service_type.toLowerCase() === "satuan"
    );

    const sortedKiloanServices = kiloanServices.sort((a, b) =>
      a.service_name.localeCompare(b.service_name)
    );
    const sortedSatuanServices = satuanServices.sort((a, b) =>
      a.service_name.localeCompare(b.service_name)
    );

    return [...sortedKiloanServices, ...sortedSatuanServices];
  };

  // Function to filter services based on selected category
  const filterByCategory = (services, category) => {
    if (category === "all") {
      return sortAndGroupServices(services);
    }
    return sortAndGroupServices(services).filter(
      (service) => service.service_type.toLowerCase() === category
    );
  };

  // Fetch services
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/services")
      .then((response) => {
        if (response.status === 200) {
          const fetchedServices = response.data.data;

          // Filter and sort services based on selected category
          const filteredGroupedServices = filterByCategory(
            fetchedServices,
            selectedCategory
          );

          setServices(fetchedServices);
          setFilteredServices(filteredGroupedServices);
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      });
  }, [selectedCategory]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter services based on the search query and selected category
    const filtered = filterByCategory(services, selectedCategory).filter(
      (service) => service.service_name.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
  };

  const handleOnAddFinished = (newService) => {
    // Add the new service to the services list
    const updatedServices = [...services, newService];

    // Filter and sort the updated services list
    const filteredGroupedServices = filterByCategory(
      updatedServices,
      selectedCategory
    );

    const filtered = filteredGroupedServices.filter((service) =>
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setServices(updatedServices);
    setFilteredServices(filtered);

    // Close the form
    setShowAddServiceForm(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleImageError = (e) => {
    e.target.src = "/images/logo.png"; // Default image path
  };

  const handleSelectService = (serviceId) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(serviceId)
        ? prevSelectedServices.filter((id) => id !== serviceId)
        : [...prevSelectedServices, serviceId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      // Send a request to delete the selected services
      await axios.post("http://localhost:3000/api/services/delete", {
        ids: selectedServices,
      });

      // Filter out the deleted services from the state
      const updatedServices = services.filter(
        (service) => !selectedServices.includes(service.id_service)
      );

      setServices(updatedServices);
      setFilteredServices(
        filterByCategory(updatedServices, selectedCategory).filter((service) =>
          service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSelectedServices([]);
    } catch (error) {
      console.error("Error deleting services:", error);
      setError("Failed to delete services");
    }
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Service List</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="filter-menu">
          <button
            className={`filter-button ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("all")}
          >
            All Services
          </button>
          <button
            className={`filter-button ${
              selectedCategory === "kiloan" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("kiloan")}
          >
            Kiloan
          </button>
          <button
            className={`filter-button ${
              selectedCategory === "satuan" ? "active" : ""
            }`}
            onClick={() => handleCategoryChange("satuan")}
          >
            Satuan
          </button>
        </div>

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
          <button
            className={`add-button ${
              selectedServices.length > 0 ? "active" : ""
            }`}
            onClick={() => setShowEditServiceForm(!showEditServiceForm)}
          >
            {showEditServiceForm ? "Hide" : "Select"}
          </button>
          {showEditServiceForm && selectedServices.length > 0 && (
            <button className="delete-button" onClick={handleDeleteSelected}>
              Delete Selected
            </button>
          )}
        </div>

        {showAddServiceForm && (
          <AddServiceForm
            onClose={() => setShowAddServiceForm(false)}
            onAdd={handleOnAddFinished}
          />
        )}

        <ul className="service-icon-list">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <li key={service.id_service}>
                <div className="service-box">
                  {showEditServiceForm && (
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id_service)}
                      onChange={() => handleSelectService(service.id_service)}
                      className="select-checkbox"
                    />
                  )}
                  <div className="service-icon">
                    <img
                      src={`http://localhost:3000/upload/services/${service.image}`} // Ensure this path is correct
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
