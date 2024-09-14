import { useState, useEffect } from "react";
import axios from "axios";

const useQuotaData = () => {
  const [capacity, setCapacity] = useState(0);
  const [quota, setQuota] = useState(0);
  const [today, setToday] = useState(0);
  const [tomorrow, setTomorrow] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotaData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/quotas");
        const { capacity, quota, today, tomorrow } = response.data;

        setCapacity(capacity);
        setQuota(quota);
        setToday(today);
        setTomorrow(tomorrow);
      } catch (error) {
        setError("Error fetching quota data");
        console.error("Error fetching quota data:", error);
      }
    };

    fetchQuotaData();
  }, []);

  return { capacity, quota, today, tomorrow, error };
};

export default useQuotaData;
