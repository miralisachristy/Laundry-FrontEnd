import React from "react";
import Navigation from "../components/Navigation"; // Import Navigation component
//import ServiceTable from "../components/ServiceTable"; // Import ServiceTable component
import "./HomePage.css"; // Import HomePage CSS

const HomePage = () => {
  //   const [isServiceTableOpen, setServiceTableOpen] = useState(false);

  //   const toggleServiceTable = () => {
  //     setServiceTableOpen(!isServiceTableOpen);
  //   };

  return (
    <div className="homepage-container">
      <Navigation /> {/* Sidebar navigation */}
      <div className="homepage-content">
        <h1>Home Page</h1>
        {/* <button onClick={toggleServiceTable}>
          {isServiceTableOpen ? "Hide Services" : "Show Services"}
        </button>
        {isServiceTableOpen && <ServiceTable />} */}
      </div>
    </div>
  );
};

export default HomePage;
