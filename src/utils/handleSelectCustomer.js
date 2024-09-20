const handleSelectCustomer = (
  customer,
  setSelectedCustomer,
  setShowCustomerSelection
) => {
  setSelectedCustomer(customer);
  setShowCustomerSelection(false);
};

export default handleSelectCustomer;
