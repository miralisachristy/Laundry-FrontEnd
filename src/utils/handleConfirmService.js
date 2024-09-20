const handleConfirmService = (
  selectedService,
  quantity,
  description,
  quota,
  quotaDailyHistoryState,
  setOrderDetails,
  setSelectedService,
  setQuantity,
  setDescription,
  setShowServiceSelection
) => {
  const newOrder = {
    service_name: selectedService.service_name,
    quantity: quantity,
    description: description,
    price: selectedService.price,
  };
  setOrderDetails((prev) => [...prev, newOrder]);
  setSelectedService(null);
  setQuantity("");
  setDescription("");
  setShowServiceSelection(true);
};

export default handleConfirmService;
