export const getNextDate = (quotaDailyHistoryState) => {
  // Implement your logic to get the next date
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split("T")[0];
};
