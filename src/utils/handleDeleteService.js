const handleDeleteService = (index, orderDetails, setOrderDetails) => {
  // Periksa apakah index valid
  if (index < 0 || index >= orderDetails.length) {
    console.error("Invalid index for deletion.");
    return;
  }

  // Buat array baru dengan menghapus layanan di index yang diberikan
  const newOrderDetails = orderDetails.filter((_, i) => i !== index);

  // Perbarui state orderDetails dengan array baru
  setOrderDetails(newOrderDetails);
};

export default handleDeleteService;
