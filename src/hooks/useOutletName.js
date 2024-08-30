import { useState, useEffect } from "react";
import axios from "axios";

const useOutletName = () => {
  const [outletName, setOutletName] = useState("My Laundry"); // Default value
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch outlet name from API when component mounts
    axios
      .get("http://localhost:5000/api/laundry/outlets/1")
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setOutletName(response.data.nama_outlet); // Set the fetched outlet name
        }
      })
      .catch((error) => {
        console.error("Error fetching outlet data:", error);
        setError("Failed to load outlet name"); // Set error message
      });
  }, []);

  return { outletName, error };
};

export default useOutletName;
