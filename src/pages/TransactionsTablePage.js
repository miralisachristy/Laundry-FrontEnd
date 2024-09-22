import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import "../styles/csspages.css";
import TransactionDetailsModal from "../components/TransactionDetailsModal"; // Import the modal component

const TransactionsTablePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:3000/api/transactions")
      .then((response) => {
        const transactionsData = response.data.data; // Access the nested data array
        if (Array.isArray(transactionsData)) {
          // Sort transactions by created_at, descending order
          const sortedTransactions =
            transactionsData.length > 1
              ? transactionsData.sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )
              : transactionsData;
          setTransactions(sortedTransactions);
        } else {
          console.error("Expected an array but got:", transactionsData);
          setTransactions([]); // Set an empty array or handle this case as needed
        }
      })
      .catch((error) => {
        console.error("Error fetching the transactions data:", error);
      });
  }, []);

  const handleDetailClick = (id_transaction) => {
    console.log("Transaction ID:", id_transaction); // Debugging line
    axios
      .get(`http://localhost:3000/api/transactions/id/${id_transaction}`)
      .then((response) => {
        setSelectedTransaction(response.data.data);
        setModalIsOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching the transaction details:", error);
      });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTransaction(null);
  };

  const renderCustomerDetails = (customerData) => {
    if (!customerData) return <p>No Customer Details</p>;

    if (typeof customerData === "string") {
      try {
        const customer = JSON.parse(customerData);
        return (
          <div className="customer-details" key={customer.id_customer}>
            <h4>Customer Details</h4>
            <p>
              <strong>ID Customer:</strong> {customer.id_customer}
            </p>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Address:</strong> {customer.address}
            </p>
          </div>
        );
      } catch (error) {
        console.error("Error parsing selected_customer:", error);
        return <p>Error parsing customer data</p>;
      }
    } else if (typeof customerData === "object" && customerData !== null) {
      return (
        <div className="customer-details" key={customerData.id_customer}>
          <h4>Customer Details</h4>
          <p>
            <strong>ID Customer:</strong> {customerData.id_customer}
          </p>
          <p>
            <strong>Name:</strong> {customerData.name}
          </p>
          <p>
            <strong>Phone:</strong> {customerData.phone}
          </p>
          <p>
            <strong>Email:</strong> {customerData.email}
          </p>
          <p>
            <strong>Address:</strong> {customerData.address}
          </p>
        </div>
      );
    } else {
      return <p>Invalid customer data</p>;
    }
  };

  const renderOrderDetails = (orderDetails) => {
    if (!orderDetails) {
      return <p>No Order Details</p>;
    }

    if (typeof orderDetails === "string") {
      try {
        orderDetails = JSON.parse(orderDetails);
      } catch (error) {
        console.error("Error parsing order details:", error);
        return <p>Invalid order details data</p>;
      }
    }

    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      return <p>No Order Details</p>;
    }

    return (
      <div className="order-details">
        <h4>Order Details</h4>
        <ul>
          {orderDetails.map((order) => (
            <li key={order.id_service} className="order-item">
              <strong>Service:</strong> {order.service_name} |
              <strong> Quantity:</strong> {order.quantity} |
              <strong> Price:</strong> Rp {order.price} |
              <strong> Total:</strong> Rp {order.total} |
              <strong> Estimated Completion:</strong>{" "}
              {new Date(order.estimatedCompletionDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Transactions Table</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice Code</th>
              <th>Transaction Date</th>
              <th>Outlet Name</th>
              <th>Customer Details</th>
              <th>Order Details</th>
              <th>Total Before Discount</th>
              <th>Discount Amount</th>
              <th>Total After Discount</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Payment Proof</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id_transaction}>
                  <td>{transaction.invoice_code}</td>
                  <td>
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </td>
                  <td>{transaction.outlet_name}</td>
                  <td>
                    {renderCustomerDetails(transaction.selected_customer)}
                  </td>
                  <td>{renderOrderDetails(transaction.order_details)}</td>
                  <td>{transaction.total_before_discount}</td>
                  <td>{transaction.discount_amount}</td>
                  <td>{transaction.total_after_discount}</td>
                  <td>{transaction.payment_method}</td>
                  <td>{transaction.payment_status}</td>
                  <td>
                    {transaction.payment_proof ? (
                      <a
                        href={`http://localhost:3000${transaction.payment_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Proof
                      </a>
                    ) : (
                      "No Proof"
                    )}
                  </td>
                  <td>
                    <button
                      className="add-button"
                      onClick={() =>
                        handleDetailClick(transaction.id_transaction)
                      }
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedTransaction && (
          <TransactionDetailsModal
            isOpen={modalIsOpen}
            closeModal={closeModal}
            transaction={selectedTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsTablePage;
