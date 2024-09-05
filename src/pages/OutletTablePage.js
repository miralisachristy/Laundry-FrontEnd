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
        <h2>Outlet Table</h2>
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Nama Outlet</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Deskripsi</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {outlets.length > 0 ? (
              outlets.map((outlet) => (
                <tr key={outlet.id_outlet}>
                  <td>
                    {outlet.logo ? (
                      <img
                        src={`http://localhost:3000/images/${outlet.logo}`} // Ensure this path is correct
                        alt={`${outlet.nama_outlet} logo`}
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td>{outlet.nama_outlet}</td>
                  <td>{outlet.alamat}</td>
                  <td>{outlet.telp}</td>
                  <td>{outlet.deskripsi}</td>
                  <td>
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
                  </td>
                  <td>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No outlets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutletTablePage;
