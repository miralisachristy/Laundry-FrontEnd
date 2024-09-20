const calculateTotalAfterDiscount = (orderDetails, discount) => {
  const total = orderDetails.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0
  );
  return total - total * (discount / 100);
};

export default calculateTotalAfterDiscount;
