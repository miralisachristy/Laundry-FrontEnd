import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SuperAdminDashboard from "./pages/Dashboard.js";
import AdminDashboard from "./pages/Dashboard.js";
import KasirDashboard from "./pages/Dashboard.js";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CustomerTablePage from "./pages/CustomerTablePage";
import OutletTablePage from "./pages/OutletTablePage"; // Ensure this path is correct
import UserTablePage from "./pages/UsersTablePage"; // Ensure this path is correct
import OrderTablePage from "./pages/TransactionsTablePage"; // Ensure this path is correct
import ServiceTablePage from "./pages/ServiceTablePage"; // Ensure this path is correct
import LaundryOrderPage from "./pages/LaundryOrderPage.js";
import TransactionDetailPage from "./pages/TransactionDetailPage.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/kasir"
          element={
            <ProtectedRoute>
              <KasirDashboard />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/laundry-order" element={<LaundryOrderPage />} />
        <Route path="/customer-table" element={<CustomerTablePage />} />
        <Route path="/outlet-table" element={<OutletTablePage />} />
        <Route path="/users-table" element={<UserTablePage />} />
        <Route path="/order-table" element={<OrderTablePage />} />
        <Route path="/service-table" element={<ServiceTablePage />} />
        <Route path="/transaction-detail" component={TransactionDetailPage} />
      </Routes>
    </Router>
  );
};

export default App;
