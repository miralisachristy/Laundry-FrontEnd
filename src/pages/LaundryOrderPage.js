import React, { useState } from "react";
import CustomerSelection from "../components/CustomerSelection"; // Adjust the path if necessary
import ServiceSelection from "../components/ServiceSelection"; // Adjust the path if necessary

const LaundryOrderPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
  };

  return (
    <div>
      <h1>Create Laundry Order</h1>

      <CustomerSelection onSelectCustomer={handleSelectCustomer} />

      {selectedCustomer && (
        <div>
          <h2>Selected Customer</h2>
          <p>Name: {selectedCustomer.name}</p>
          <p>Phone: {selectedCustomer.phone}</p>
        </div>
      )}

      <ServiceSelection onSelectService={handleSelectService} />

      {selectedService && (
        <div>
          <h2>Selected Service</h2>
          <p>Name: {selectedService.service_name}</p>
          <p>Price: {selectedService.price}</p>
        </div>
      )}

      {/* Additional logic for order creation */}
    </div>
  );
};

export default LaundryOrderPage;
