import React, { useState } from "react";
import axios from "axios";
import "../styles/csspages.css"; // Import the global CSS file

const AddInventoryForm = ({ onClose, onAdd }) => {
  const [newInventory, setNewInventory] = useState({
    item_name: "",
    quantity: "",
    unit: "",
    price: "",
    image: "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newInventory).forEach((key) =>
      formData.append(key, newInventory[key])
    );

    try {
      const response = await axios.post(
        "http://localhost:3000/api/inventory",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onAdd(response.data.data);
      onClose();
      setNewInventory({
        item_name: "",
        quantity: "",
        unit: "",
        price: "",
        image: "",
      });
    } catch (error) {
      console.error("Failed to add inventory:", error);
      setError(
        error.response
          ? error.response.data.message
          : "Failed to add inventory. Please try again."
      );
    }
  };

  return (
    <div className="add-inventory-box">
      <button
        className="close-button"
        type="button"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <h3>Add New Inventory Item</h3>
      <form onSubmit={handleAddInventory}>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label htmlFor="item_name">Item Name:</label>
          <input
            id="item_name"
            type="text"
            name="item_name"
            value={newInventory.item_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={newInventory.quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="unit">Unit:</label>
          <select
            id="unit"
            name="unit"
            value={newInventory.unit}
            onChange={handleInputChange}
            required
          >
            <option value="">Select unit</option>
            <option value="kg">kg</option>
            <option value="pcs">pcs</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            name="price"
            value={newInventory.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={(e) =>
              setNewInventory((prev) => ({ ...prev, image: e.target.files[0] }))
            }
            required
          />
        </div>
        <button type="submit" className="save-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddInventoryForm;
