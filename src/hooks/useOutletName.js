import { useState, useEffect } from "react";
import axios from "axios";

const useOutletName = () => {
  const [outletName, setOutletName] = useState("My Laundry"); // Default value
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch outlet name from API when component mounts
    axios
      .get("http://localhost:3000/api/outlets/outlet/1")
      .then((response) => {
        if (response.status === 200) {
          setOutletName(response.data.data.outlet_name); // Set the fetched outlet name
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
