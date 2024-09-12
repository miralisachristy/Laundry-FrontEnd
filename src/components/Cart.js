import React from "react";

const Cart = ({ cartItems, onRemove }) => {
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h3>Cart</h3>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.service_name} - {item.quantity} x {item.price} ={" "}
            {item.quantity * item.price}
            <button onClick={() => onRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: {total}</p>
    </div>
  );
};

export default Cart;
