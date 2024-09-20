const isConfirmButtonDisabled = (quantity, errors) => {
  return errors.min || errors.max || quantity === "";
};

export default isConfirmButtonDisabled;
