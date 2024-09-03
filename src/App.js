import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ServiceTablePage from "./pages/ServiceTablePage"; // Import ServiceTablePage
import CustomerTablePage from "./pages/CustomerTablePage"; // Import CustomerTablePage
import OutletTablePage from "./pages/OutletTablePage"; // Import CustomerTablePage
import UsersTablePage from "./pages/UsersTablePage"; // Import CustomerTablePage
import TransactionsTablePage from "./pages/TransactionsTablePage"; // Import CustomerTablePage
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/service-table" element={<ServiceTablePage />} />{" "}
          <Route path="/customer-table" element={<CustomerTablePage />} />{" "}
          <Route path="/outlet-table" element={<OutletTablePage />} />{" "}
          <Route path="/users-table" element={<UsersTablePage />} />{" "}
          <Route path="/order-table" element={<TransactionsTablePage />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
