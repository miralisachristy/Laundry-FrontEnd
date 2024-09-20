import axios from "axios";

const fetchQuotaDailyHistory = async (quota, setQuotaDailyHistoryState) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/quotas-daily-history/from-today"
    );
    const data = response.data;
    if (data.length === 0) {
      const today = new Date().toISOString().split("T")[0];
      await axios.post("http://localhost:3000/api/quotas-daily-history", {
        date: today,
        used: quota.max_quota,
        remaining: quota.max_quota,
      });
      setQuotaDailyHistoryState([
        { date: today, used: quota.max_quota, remaining: quota.max_quota },
      ]);
    } else {
      setQuotaDailyHistoryState(data);
    }
  } catch (error) {
    console.error("Error fetching quota daily history:", error);
  }
};

export default fetchQuotaDailyHistory;
