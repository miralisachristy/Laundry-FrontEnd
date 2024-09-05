import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation"; // Adjust this path if needed
import "../styles/csspages.css"; // Import the global CSS file

const OutletTablePage = () => {
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:5000/api/outlets")
      .then((response) => {
        setOutlets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the outlet data:", error);
      });
  }, []);

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
                      src={`http://localhost:3000/images/${outlet.logo}`} // Ensure this path is correct
                      alt={`${outlet.nama_outlet} logo`}
                      className="outlet-image"
                    />
                  ) : (
                    <p>No Logo</p>
                  )}
                </div>
                <div className="outlet-info-box">
                  <h3>Nama Outlet</h3>
                  <p>{outlet.nama_outlet}</p>

                  <h3>Alamat</h3>
                  <p>{outlet.alamat}</p>

                  <h3>Telepon</h3>
                  <p>{outlet.telp}</p>

                  <h3>Deskripsi</h3>
                  <p>{outlet.deskripsi}</p>
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
