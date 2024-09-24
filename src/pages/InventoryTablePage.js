import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import AddInventoryForm from "../components/AddInventoryForm"; // Ensure this component exists
import "../styles/csspages.css";

const InventoryTablePage = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/inventory");
      const inventoryData = response.data.data;
      if (Array.isArray(inventoryData)) {
        const sortedInventory = inventoryData.sort((a, b) =>
          a.item_name.localeCompare(b.item_name)
        );
        setInventory(sortedInventory);
      } else {
        console.error("Expected an array but got:", inventoryData);
        setInventory([]);
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    [item.item_name, item.item_type, item.supplier_name].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSelectItem = (itemId) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(itemId)
        ? prevSelectedIds.filter((id) => id !== itemId)
        : [...prevSelectedIds, itemId]
    );
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setSelectedIds(checked ? filteredInventory.map((item) => item.id) : []);
  };

  const handleDeleteSelected = async () => {
    if (window.confirm("Are you sure you want to delete the selected items?")) {
      try {
        await axios.post("http://localhost:3000/api/inventory/delete", {
          ids: selectedIds,
        });
        fetchInventory(); // Refresh the inventory list
        setSelectedIds([]);
        setSelectAll(false);
      } catch (error) {
        console.error("Error deleting selected inventory items:", error);
      }
    }
  };

  const handleOnAddFinished = (newInventory) => {
    setInventory((prevInventory) => [...prevInventory, newInventory]);
    setShowAddInventoryForm(false);
    window.location.reload(); // This will reload the entire page
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Inventory Table</h2>
        <div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, type, supplier"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="add-button"
            onClick={() => setShowAddInventoryForm(true)}
          >
            Add Inventory Item
          </button>

          {showAddInventoryForm && (
            <AddInventoryForm
              setInventories={setInventories}
              setShowAddInventoryForm={setShowAddInventoryForm}
              onClose={() => setShowAddInventoryForm(false)}
              onAdd={handleOnAddFinished}
            />
          )}
          {selectedIds.length > 0 && (
            <button className="delete-button" onClick={handleDeleteSelected}>
              Delete
            </button>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Item Type</th>
              <th>Supplier Name</th>
              <th>Quantity</th>
              <th>Remark</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>{item.item_code}</td>
                  <td>{item.item_name}</td>
                  <td>{item.item_type}</td>
                  <td>{item.supplier_name}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td>{item.remark}</td>
                  <td style={{ textAlign: "center" }}>
                    {new Date(item.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    {new Date(item.updated_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No inventory items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTablePage;
