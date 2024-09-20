const handleSelectService = (
  service,
  setSelectedService,
  setShowServiceSelection,
  setQuantity,
  setDescription,
  setErrors
) => {
  setSelectedService(service);
  setShowServiceSelection(false);
  setQuantity("");
  setDescription("");
  setErrors({});
};

export default handleSelectService;
