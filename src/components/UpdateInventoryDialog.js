import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UpdateInventoryDialog.css"; // Adjust the path as necessary

const UpdateInventoryDialog = ({ onClose, onUpdate }) => {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState(""); // New state for action
  const [quantity, setQuantity] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/inventory");
        setInventory(response.data.data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };
    fetchInventory();
  }, []);

  const handleItemChange = (event) => {
    const selectedId = event.target.value;
    const item = inventory.find((inv) => inv.id === selectedId);
    setSelectedItem(item);
    if (item) {
      setQuantity(item.quantity);
      setRemark(item.remark);
    }
  };

  const handleUpdate = () => {
    if (selectedItem) {
      const updatedQuantity =
        action === "add"
          ? parseInt(selectedItem.quantity) + parseInt(quantity)
          : parseInt(selectedItem.quantity) - parseInt(quantity);

      const updatedData = {
        id: selectedItem.id,
        quantity: updatedQuantity,
        remark,
      };
      onUpdate(updatedData);
      onClose();
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Ensure quantity is not below 0
    if (value >= 0 && value <= 999999999) {
      setQuantity(value);
    }
  };

  return (
    <div className="update-dialog">
      <div className="dialog-content">
        <h3>Update Inventory</h3>
        <form>
          <label>Item Name:</label>
          <select className="item-select" onChange={handleItemChange}>
            <option value="">Select an item</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                [{item.item_code}] {item.item_name} - {item.item_type}
              </option>
            ))}
          </select>

          <label>Action:</label>
          <select
            className="action-select"
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="">Select an action</option>
            <option value="add">Add</option>
            <option value="reduce">Reduce</option>
          </select>

          {action && (
            <>
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                min="0" // Batas minimal 0
                max="999999999" // Batas maksimal 999999999
                className="input-field"
                onChange={handleQuantityChange} // Use the new handler here
              />
            </>
          )}

          <label>Remark:</label>
          <input
            type="text"
            value={remark}
            placeholder="Remark"
            maxLength={40}
            className="remark-field"
            onChange={(e) => setRemark(e.target.value)}
          />

          <div className="button-group">
            <button
              type="button"
              className="save-button"
              onClick={handleUpdate}
              disabled={!action || quantity <= 0 || selectedItem === null} // Disable button if action not selected or quantity is invalid
              style={{
                backgroundColor:
                  !action || quantity <= 0 ? "lightgray" : "blue", // Change button color based on state
              }}
            >
              Save
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventoryDialog;
