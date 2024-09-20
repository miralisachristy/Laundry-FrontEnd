const getNextDate = (currentDate) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

export default getNextDate;
