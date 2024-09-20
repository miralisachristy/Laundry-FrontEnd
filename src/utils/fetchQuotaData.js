import axios from "axios";

const fetchQuotaData = async (setQuota) => {
  try {
    const response = await axios.get("http://localhost:3000/api/quota");
    setQuota(response.data);
  } catch (error) {
    console.error("Error fetching quota data:", error);
  }
};

export default fetchQuotaData;
