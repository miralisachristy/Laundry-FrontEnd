import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import "../styles/csspages.css"; // Import the global CSS file

const OutletTablePage = () => {
  const [outlets, setOutlets] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // Object to track files for each outlet

  useEffect(() => {
    // Function to fetch the outlet data
    const fetchOutlets = () => {
      axios
        .get("http://localhost:3000/api/outlets")
        .then((response) => {
          setOutlets(response.data.data); // Ensure this is an array of outlet objects
        })
        .catch((error) => {
          console.error("Error fetching the outlet data:", error);
        });
    };

    fetchOutlets(); // Fetch the data initially
  }, []);

  const handleFileChange = (event, outletId) => {
    setSelectedFiles((prevSelectedFiles) => ({
      ...prevSelectedFiles,
      [outletId]: event.target.files[0],
    }));
  };

  const handleLogoUpload = (outletId) => {
    const selectedFile = selectedFiles[outletId]; // Get the file for the specific outlet
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);
    axios
      .put(
        `http://localhost:3000/api/outlets/update-logo/${outletId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // Clear the selected file for this outlet
        setSelectedFiles((prevSelectedFiles) => ({
          ...prevSelectedFiles,
          [outletId]: null,
        }));
        // Re-fetch the latest outlet data after successful upload
        return axios.get("http://localhost:3000/api/outlets");
      })
      .then((response) => {
        setOutlets(response.data.data); // Update outlets with the latest data
        alert("Logo updated successfully!");
      })
      .catch((error) => {
        console.error("Error uploading the logo:", error);
        alert("Error uploading the logo.");
      });
  };

  return (
    <div className="container">
      <Navigation /> {/* Add Navigation here */}
      <div className="content">
        <h2>Outlet List</h2>
        <div className="outlet-list">
          {outlets.length > 0 ? (
            outlets.map((outlet) => (
              <div className="outlet-card" key={outlet.id_outlet}>
                <div className="outlet-box">
                  <h3>Logo</h3>
                  {outlet.logo ? (
                    <img
                      src={`http://localhost:3000${outlet.logo}`} // Correct string interpolation
                      alt={`${outlet.outlet_name} logo`} // Correct string interpolation
                      className="outlet-image"
                    />
                  ) : (
                    <p>No Logo</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleFileChange(event, outlet.id_outlet)
                    } // Pass outlet ID
                  />
                  <button
                    className="add-button"
                    onClick={() => handleLogoUpload(outlet.id_outlet)} // Pass outlet ID
                  >
                    Update Logo
                  </button>
                </div>
                <div className="outlet-info-box">
                  <h3>Outlet Name</h3>
                  <p>{outlet.outlet_name}</p>
                  <h3>Address</h3>
                  <p>{outlet.address}</p>
                  <h3>Phone</h3>
                  <p>{outlet.phone}</p>
                  <h3>Description</h3>
                  <p>{outlet.describ}</p>{" "}
                  {/* Ensure the description field is `describ` as per your table */}
                </div>
                <div className="outlet-box no-border">
                  <div className="outlet-box">
                    <h3>Created At</h3>
                    <p>
                      {new Date(outlet.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {new Date(outlet.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="outlet-box">
                    <h3>Updated At</h3>
                    <p>
                      {new Date(outlet.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {new Date(outlet.updated_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No outlets found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletTablePage;
