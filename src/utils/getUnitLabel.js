const getUnitLabel = (selectedService) => {
  return selectedService?.service_type === "Kiloan" ? "kg" : "item";
};

export default getUnitLabel;
