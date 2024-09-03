import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import "../styles/csspages.css"; // Import the global CSS file

const ServiceIconPage = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((response) => {
        if (response.status === 200) {
          setServices(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      });
  }, []);

  return (
    <div className="container">
      <Navigation /> {/* Add Navigation here */}
      <div className="content">
        <h2>Service List</h2>
        {error && <p>{error}</p>}
        <ul className="service-icon-list">
          {services.map((service) => (
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

export default ServiceIconPage;
