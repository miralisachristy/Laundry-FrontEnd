import React, { useState } from "react";
import CustomerSelection from "../components/CustomerSelection";
import ServiceSelection from "../components/ServiceSelection";
import Cart from "../components/Cart";
import TransactionDetails from "../components/TransactionDetails";

const LaundryOrderPage = () => {
  const [customer, setCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isTransactionDetailVisible, setIsTransactionDetailVisible] =
    useState(false);

  const handleAddToCart = (service) => {
    setCartItems([...cartItems, service]);
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const handleTransactionSubmit = (transaction) => {
    console.log("Final Transaction:", transaction);
    // You can send the transaction data to your backend here
  };

  return (
    <div>
      {!isTransactionDetailVisible ? (
        <>
          <CustomerSelection onSelectCustomer={setCustomer} />
          {customer && (
            <>
              <ServiceSelection onAddToCart={handleAddToCart} />
              <Cart cartItems={cartItems} onRemove={handleRemoveFromCart} />
              {cartItems.length > 0 && (
                <button onClick={() => setIsTransactionDetailVisible(true)}>
                  Proceed to Transaction Details
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <TransactionDetails
          cartItems={cartItems}
          customer={customer}
          onSubmit={handleTransactionSubmit}
        />
      )}
    </div>
  );
};

export default LaundryOrderPage;
