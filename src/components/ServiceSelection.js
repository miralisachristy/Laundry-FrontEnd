import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceSelection = ({ onAddToCart }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleAddToCart = () => {
    if (selectedService && quantity > 0) {
      onAddToCart({ ...selectedService, quantity });
      setQuantity(1);
    }
  };

  return (
    <div>
      <h3>Select Service</h3>
      <select
        value={selectedService?.id || ""}
        onChange={(e) =>
          setSelectedService(
            services.find((s) => s.id === parseInt(e.target.value))
          )
        }
      >
        <option value="" disabled>
          Select a service
        </option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.service_name} - {service.price} per {service.unit}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        min="1"
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ServiceSelection;
