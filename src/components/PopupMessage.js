// src/components/PopupMessage.js
import React, { useEffect } from "react";
import "./PopupMessage.css"; // Import CSS for styling

const PopupMessage = ({ message, onClose, type }) => {
  useEffect(() => {
    // Automatically close the popup after 1500 milliseconds
    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [onClose]);

  return <div className={`popup-message ${type}`}>{message}</div>;
};

export default PopupMessage;
