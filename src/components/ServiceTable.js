/* src/components/ServiceTable.css */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceTable.css"; // Import CSS for styling

const ServiceTablePage = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch service data from API
    axios
      .get("http://localhost:5000/api/services")
      .then((response) => {
        if (response.status === 200) {
          setServices(response.data); // Set the fetched services
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Failed to load services"); // Set error message
      });
  }, []);

  return (
    <div className="content">
      <h1>Services Table</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID Service</th>
            <th>ID Outlet</th>
            <th>Image</th>
            <th>Service Name</th>
            <th>Service Type</th>
            <th>Processing Time</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {services.map((services) => (
            <tr key={services.id_service}>
              <td>{services.id_service}</td>
              <td>{services.id_outlet}</td>
              <td>
                <img
                  src={services.image}
                  alt={services.service_name}
                  style={{ width: "100px" }}
                />
              </td>
              <td>{services.service_name}</td>
              <td>{services.service_type}</td>
              <td>{services.processing_time}</td>
              <td>{services.price}</td>
              <td>{new Date(services.created_at).toLocaleString()}</td>
              <td>{new Date(services.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTablePage;
