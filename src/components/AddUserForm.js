import React, { useState } from "react";
import axios from "axios";
import "../styles/csspages.css"; // Import the global CSS file

const AddUserForm = ({ setShowAddUserForm, onAddUser }) => {
  const [newUser, setNewUser] = useState({
    role: "",
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/api/users", newUser)
      .then((response) => {
        // Directly handle the success case
        onAddUser(response.data.data); // Update the user list
        setNewUser({
          role: "",
          name: "",
          username: "",
          password: "",
          email: "",
          phone: "",
        });
        setShowAddUserForm(false); // Close the form
        setSuccess("User created successfully!"); // Set success message
      })
      .catch((error) => {
        // Handle errors with fallback
        setError(
          "Error adding new user: " +
            (error.response?.data?.message || error.message)
        );
      });
  };

  return (
    <div className="add-user-box">
      <h3>Add New User</h3>
      <button
        className="close-button"
        type="button"
        onClick={() => setShowAddUserForm(false)} // Close the form
        aria-label="Close"
      >
        &times;
      </button>
      <form onSubmit={handleAddUser}>
        <div className="select-container">
          <label>Role:</label>
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a role</option>
            <option value="Admin">Admin</option>
            <option value="Kasir">Kasir</option>
          </select>
        </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={newUser.phone}
            onChange={handleInputChange}
            required
            autoComplete="tel"
          />
        </div>
        <button type="submit" className="save-button">
          Submit
        </button>
      </form>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddUserForm;
