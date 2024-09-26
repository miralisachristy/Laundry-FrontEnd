import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import "../styles/csspages.css";
import { formatDate } from "../utils/dateHelper";
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

  const handleDetailClick = (id) => {
    if (!id) {
      console.error("Invalid transaction ID");
      return;
    }

    console.log("Transaction ID:", id);
    axios
      .get(`http://localhost:3000/api/transactions/id/${id}`)
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

  // const renderCustomerDetails = (customerData) => {
  //   if (!customerData) return <p>No Customer Details</p>;

  //   if (typeof customerData === "string") {
  //     try {
  //       const customer = JSON.parse(customerData);
  //       return (
  //         <div className="customer-details" key={customer.id_customer}>
  //           <h4>Customer Details</h4>
  //           <p>
  //             <strong>ID Customer:</strong> {customer.id_customer}
  //           </p>
  //           <p>
  //             <strong>Name:</strong> {customer.name}
  //           </p>
  //           <p>
  //             <strong>Phone:</strong> {customer.phone}
  //           </p>
  //           <p>
  //             <strong>Email:</strong> {customer.email}
  //           </p>
  //           <p>
  //             <strong>Address:</strong> {customer.address}
  //           </p>
  //         </div>
  //       );
  //     } catch (error) {
  //       console.error("Error parsing selected_customer:", error);
  //       return <p>Error parsing customer data</p>;
  //     }
  //   } else if (typeof customerData === "object" && customerData !== null) {
  //     return (
  //       <div className="customer-details" key={customerData.id_customer}>
  //         <h4>Customer Details</h4>
  //         <p>
  //           <strong>ID Customer:</strong> {customerData.id_customer}
  //         </p>
  //         <p>
  //           <strong>Name:</strong> {customerData.name}
  //         </p>
  //         <p>
  //           <strong>Phone:</strong> {customerData.phone}
  //         </p>
  //         <p>
  //           <strong>Email:</strong> {customerData.email}
  //         </p>
  //         <p>
  //           <strong>Address:</strong> {customerData.address}
  //         </p>
  //       </div>
  //     );
  //   } else {
  //     return <p>Invalid customer data</p>;
  //   }
  // };

  // const renderOrderDetails = (orderDetails) => {
  //   if (!orderDetails) {
  //     return <p>No Order Details</p>;
  //   }

  //   if (typeof orderDetails === "string") {
  //     try {
  //       orderDetails = JSON.parse(orderDetails);
  //     } catch (error) {
  //       console.error("Error parsing order details:", error);
  //       return <p>Invalid order details data</p>;
  //     }
  //   }

  //   if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
  //     return <p>No Order Details</p>;
  //   }

  //   return (
  //     <div className="order-details">
  //       <h4>Order Details</h4>
  //       <ul>
  //         {orderDetails.map((order) => (
  //           <li key={order.id_service} className="order-item">
  //             <strong>Service:</strong> {order.service_name} |
  //             <strong> Quantity:</strong> {order.quantity} |
  //             <strong> Price:</strong> Rp {order.price} |
  //             <strong> Total:</strong> Rp {order.total} |
  //             <strong> Estimated Completion:</strong>{" "}
  //             {new Date(order.estimatedCompletionDate).toLocaleDateString()}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // };

  // Function to handle printing the transaction details
  const handlePrintClick = (transaction) => {
    const printWindow = window.open("", "Print", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Transaction</title>");
    printWindow.document.write("</head><body>");

    // Transaction Header and Invoice
    printWindow.document.write(
      `<h3>Invoice Code: ${transaction.invoice_code}</h3>`
    );
    printWindow.document.write(
      `<p>Transaction Date: ${formatDate(transaction.transaction_date)}</p>`
    );

    // Customer Details
    printWindow.document.write(`<h4>Customer Details</h4>`);
    const customer = JSON.parse(transaction.selected_customer);
    printWindow.document.write(`<p>Name: ${customer.name}</p>`);
    printWindow.document.write(`<p>Phone: ${customer.phone}</p>`);
    printWindow.document.write(`<p>Email: ${customer.email}</p>`);
    printWindow.document.write(`<p>Address: ${customer.address}</p>`);

    // Order Details
    printWindow.document.write(`<h4>Order Details</h4>`);
    const orders = JSON.parse(transaction.order_details);
    orders.forEach((order) => {
      printWindow.document.write(`<p>Service: ${order.service_name}</p>`);
      printWindow.document.write(`<p>Quantity: ${order.quantity}</p>`);
      printWindow.document.write(`<p>Unit: ${order.unit}</p>`);
      printWindow.document.write(`<p>Total: Rp ${order.total}</p>`);
      printWindow.document.write(
        `<p>Estimated Completion Date: ${formatDate(
          order.estimatedCompletionDate
        )}</p>`
      );
    });

    // Payment and Discount Details
    printWindow.document.write(`<h4>Payment Details</h4>`);
    printWindow.document.write(
      `<p>Payment Method: ${transaction.payment_method}</p>`
    );
    printWindow.document.write(
      `<p>Payment Status: ${transaction.payment_status}</p>`
    );

    if (transaction.discount_amount) {
      printWindow.document.write(
        `<p>Discount Amount: Rp ${transaction.discount_amount}</p>`
      );
    }

    printWindow.document.write(
      `<p>Total After Discount: Rp ${transaction.total_after_discount}</p>`
    );

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2 style={{ textAlign: "left", marginRight: "20px" }}>
          Transaction List
        </h2>
        <table>
          <thead>
            <tr>
              <th>Invoice Code</th>
              <th>Transaction Date</th>
              {/* <th>Outlet Name</th> */}
              {/* <th>Customer Details</th>
              <th>Order Details</th> */}
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
                  <td style={{ textAlign: "center" }}>
                    {transaction.invoice_code}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {new Date(transaction.transaction_date).toLocaleDateString(
                      "id-ID",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}{" "}
                    {new Date(transaction.transaction_date).toLocaleTimeString(
                      "id-ID",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                    {/* {formatDate(transaction.transaction_date)} */}
                    {/* {new Date(transaction.transaction_date).toLocaleString()} */}
                  </td>
                  {/* <td>{transaction.outlet_name}</td> */}
                  {/* <td>
                    {console.log(transactions)}
                    {renderCustomerDetails(transaction.selected_customer)}
                  </td>
                  <td>{renderOrderDetails(transaction.order_details)}</td> */}
                  <td style={{ textAlign: "center" }}>
                    {transaction.total_before_discount}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    Rp{" "}
                    {Number(transaction.discount_amount).toLocaleString(
                      "id-ID",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    Rp{" "}
                    {Number(transaction.total_after_discount).toLocaleString(
                      "id-ID",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td style={{ textAlign: "center" }}>
                    {transaction.payment_method}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {transaction.payment_status}
                  </td>
                  <td style={{ textAlign: "center" }}>
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
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="update-button"
                      style={{ marginBottom: "10px" }} // Margin-left
                      onClick={() => handleDetailClick(transaction.id)}
                    >
                      Detail
                    </button>
                    <button
                      className="add-button"
                      onClick={() => handlePrintClick(transaction)}
                    >
                      Print
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
