const handleDiscountChange = (value, setDiscount) => {
  const discountValue = parseFloat(value);
  if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
    setDiscount(discountValue);
  }
};

export default handleDiscountChange;
