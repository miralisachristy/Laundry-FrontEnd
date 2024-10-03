import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/csspages.css"; // Import the global CSS file

const AddInventoryForm = ({ setShowAddInventoryForm, setInventories }) => {
  const [newInventory, setNewInventory] = useState({
    item_code: "", // Item code will be generated automatically
    item_name: "",
    item_type: "",
    supplier_name: "",
    remark: "",
    quantity: "",
  });

  const [error, setError] = useState(""); // State to hold error messages
  const [existingInventories, setExistingInventories] = useState([]); // State to hold existing inventories

  useEffect(() => {
    // Fetch existing inventories on component mount
    const fetchExistingInventories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/inventory");
        setExistingInventories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching existing inventories:", error);
      }
    };

    fetchExistingInventories();
    generateItemCode(); // Generate the item code on component mount
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewInventory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateItemCode = () => {
    // Simple item code generation logic (e.g., using a timestamp)
    const timestamp = Date.now(); // Get the current timestamp
    const itemCode = `ITEM-${timestamp}`; // Create a unique item code
    setNewInventory((prev) => ({
      ...prev,
      item_code: itemCode, // Set the generated item code
    }));
  };

  const handleAddInventory = async (event) => {
    event.preventDefault();

    // Optional: Check for duplicates based on item name or code
    const isDuplicate = existingInventories.some(
      (inventory) => inventory.item_code === newInventory.item_code
    );

    if (isDuplicate) {
      setError("This item already exists in the inventory.");
      return; // Exit if there is a duplicate
    }

    setError(""); // Clear any previous errors

    try {
      const response = await axios.post(
        "http://localhost:3000/api/inventory",
        newInventory
      );

      if (response.status === 201) {
        // Successfully added inventory
        setInventories((prevInventories) => [
          ...prevInventories,
          response.data.data,
        ]);
        setNewInventory({
          item_code: "", // Reset item_code to ensure it gets generated again
          item_name: "",
          item_type: "",
          supplier_name: "",
          remark: "",
          quantity: "",
        });
        setShowAddInventoryForm(false); // Close the form
        window.location.reload(); // This will reload the entire page
      } else {
        // Handle any non-201 status codes
        setError("Failed to add inventory. Please try again.");
      }
    } catch (error) {
      console.error("Error adding new inventory:", error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to add inventory. Please try again."
      );
    }
  };

  return (
    <div className="add-inventory-box">
      <h3>Add New Inventory Item</h3>

      <form onSubmit={handleAddInventory}>
        <div>
          <label>Item Code:</label>
          <input
            type="text"
            name="item_code"
            value={newInventory.item_code}
            disabled // Make the input read-only
            required
          />
        </div>
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            name="item_name"
            maxLength={30}
            placeholder="Input name"
            value={newInventory.item_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Item Type:</label>
          <input
            type="text"
            name="item_type"
            maxLength={20}
            placeholder="Input type"
            value={newInventory.item_type}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Supplier Name:</label>
          <input
            type="text"
            name="supplier_name"
            maxLength={50}
            placeholder="Example: Supplier Name - Phone"
            value={newInventory.supplier_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Remark:</label>
          <input
            type="text"
            name="remark"
            maxLength={40}
            placeholder="Input remark"
            value={newInventory.remark}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            placeholder="Input quantity"
            value={newInventory.quantity}
            onChange={handleInputChange}
            required
            min="0" // Prevent negative numbers in the input field
          />
        </div>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message */}
        <button type="submit" className="save-button">
          Submit
        </button>
        <button
          className="cancel-button"
          type="button"
          onClick={() => setShowAddInventoryForm(false)}
          aria-label="Close"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddInventoryForm;
