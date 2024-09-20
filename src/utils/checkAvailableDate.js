const checkAvailableDate = (
  quotaUsed,
  errors,
  quotaDailyHistoryState,
  setSelectedDate,
  setQuotaDailyHistoryState
) => {
  if (errors.min || errors.max) return;

  const today = new Date().toISOString().split("T")[0];
  let availableDate = quotaDailyHistoryState.find(
    (history) => history.remaining >= quotaUsed
  );

  if (!availableDate) {
    availableDate = {
      date: today,
      used: quotaUsed,
      remaining: quota.max_quota - quotaUsed,
    };
    setQuotaDailyHistoryState([...quotaDailyHistoryState, availableDate]);
  }
  setSelectedDate(availableDate.date);
};

export default checkAvailableDate;
