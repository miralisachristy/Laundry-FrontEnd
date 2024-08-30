import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import "./ServiceTablePage.css";

const ServiceTablePage = () => {
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
        <h1>Service Table</h1>
        {error && <p>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>No</th> {/* Added column for No */}
              <th>Image</th>
              <th>Service Name</th>
              <th>Service Type</th>
              <th>Processing Time</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service.id_service}>
                <td>{index + 1}</td> {/* Renders the row number */}
                <td>
                  <img
                    src={`http://localhost:3000/images/${service.image}`} // Ensure this path is correct
                    alt={service.service_name}
                    style={{ width: "100px" }}
                  />
                </td>
                <td>{service.service_name}</td>
                <td>{service.service_type}</td>
                <td>{service.processing_time}</td>
                <td>{service.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTablePage;
