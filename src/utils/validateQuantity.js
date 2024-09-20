const validateQuantity = (
  quantity,
  selectedService,
  quota,
  setErrors,
  setSelectedDate
) => {
  let errors = {};
  const quantityNumber = parseFloat(quantity);
  if (isNaN(quantityNumber) || quantityNumber < 1) {
    errors.min = "Quantity must be at least 1.";
  }
  if (quantityNumber > 999) {
    errors.max = "Quantity cannot exceed 999.";
  }
  if (selectedService) {
    const quotaUsed = calculateQuotaUsed(quantity, selectedService, quota);
    if (quotaUsed > 0) {
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  }
  setErrors(errors);
};

export default validateQuantity;
