// src/pages/TransactionsTablePage.js
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
        console.log(response);
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
    // Fetch specific transaction details
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

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Transactions Table</h2>
        <table>
          <thead>
            <tr>
              <th>Transaction Code</th>
              <th>Outlet Name</th>
              <th>User Name</th>
              <th>Customer Name</th>
              <th>Customer Phone</th>
              <th>Customer Address</th>
              <th>Total Amount</th>
              <th>Discount</th>
              <th>Payment Amount</th>
              <th>Payment Status</th>
              <th>Payment Method</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Action</th> {/* Added Action column */}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id_transaction}>
                  <td>{transaction.transaction_code}</td>
                  <td>{transaction.outlet_name}</td>
                  <td>{transaction.user_name}</td>
                  <td>{transaction.customer_name}</td>
                  <td>{transaction.customer_phone}</td>
                  <td>{transaction.customer_address}</td>
                  <td>{transaction.total_amount}</td>
                  <td>{transaction.discount}</td>
                  <td>{transaction.payment_amount}</td>
                  <td>{transaction.payment_status}</td>
                  <td>{transaction.payment_method}</td>
                  <td>{transaction.transaction_remarks}</td>
                  <td>{transaction.transaction_status}</td>
                  <td>
                    <button
                      className="add-button" // Optional: add a class for styling
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
                <td colSpan="14">No transactions found.</td>{" "}
                {/* Adjusted colSpan */}
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal for displaying transaction details */}
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
