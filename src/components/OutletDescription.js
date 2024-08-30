// src/components/OutletDescription.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const OutletDescription = () => {
  const [outlets, setOutlets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await axios.get("/api/laundry/outlets");
        setOutlets(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchOutlets();
  }, []);

  if (error) {
    return <div>Error fetching outlets: {error.message}</div>;
  }

  return (
    <div className="outlet-description">
      <h1>Outlet Descriptions</h1>
      {outlets.length === 0 ? (
        <p>No outlets available.</p>
      ) : (
        <ul>
          {outlets.map((outlet) => (
            <li key={outlet.id_outlet}>
              <h2>{outlet.nama_outlet}</h2>
              <p>
                <strong>Address:</strong> {outlet.alamat}
              </p>
              <p>
                <strong>Phone:</strong> {outlet.telp}
              </p>
              <p>
                <strong>Description:</strong> {outlet.deskripsi}
              </p>
              {outlet.logo && (
                <img src={outlet.logo} alt={`${outlet.nama_outlet} logo`} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OutletDescription;
