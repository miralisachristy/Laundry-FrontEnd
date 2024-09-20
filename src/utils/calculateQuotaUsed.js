const calculateQuotaUsed = (quantity, selectedService, quota) => {
  if (!selectedService) return 0;

  const quantityNumber = parseFloat(quantity);
  if (isNaN(quantityNumber)) return 0;

  if (selectedService.service_type === "Kiloan") {
    return Math.ceil(quantityNumber / quota.qty_kiloan_per_quota);
  } else if (selectedService.service_type === "Satuan") {
    return Math.ceil(quantityNumber / quota.qty_satuan_per_quota);
  }
  return 0;
};

export default calculateQuotaUsed;
