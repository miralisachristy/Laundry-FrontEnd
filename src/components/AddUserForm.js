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

  const handleAddUser = async (event) => {
    event.preventDefault();

    // Validate that username and password do not contain spaces
    if (/\s/.test(newUser.username)) {
      setError("Username cannot contain spaces.");
      return;
    }
    if (/\s/.test(newUser.password)) {
      setError("Password cannot contain spaces.");
      return;
    }

    try {
      // Check if phone number and email already exist
      const response = await axios.get("http://localhost:3000/api/users");
      const existingUsers = response.data.data;

      const isPhoneTaken = existingUsers.some(
        (user) => user.phone === newUser.phone
      );
      if (isPhoneTaken) {
        setError("Phone number is already registered.");
        return;
      }

      const isEmailTaken = existingUsers.some(
        (user) => user.email === newUser.email
      );
      if (isEmailTaken) {
        setError("Email is already registered.");
        return;
      }

      // Proceed to add the new user
      const addUserResponse = await axios.post(
        "http://localhost:3000/api/users",
        newUser
      );
      onAddUser(addUserResponse.data.data); // Update the user list
      setNewUser({
        role: "",
        name: "",
        username: "",
        password: "",
        email: "",
        phone: "",
      });
      // setShowAddUserForm(false); // Close the form
      window.location.reload(); // This will reload the entire page
      setSuccess("User created successfully!"); // Set success message
      setError(""); // Clear any previous error messages
    } catch (error) {
      // Handle errors with fallback
      setError(
        "Error adding new user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="add-user-box">
      <h3>Add New User</h3>

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
            maxLength={30}
            placeholder="Input name"
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
            maxLength={20}
            placeholder="Input username"
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
            placeholder="Input password max 8 character"
            maxLength={8}
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
            maxLength={40}
            placeholder="Input email"
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
            maxLength={15}
            placeholder="Example: 081234567899"
            value={newUser.phone}
            onChange={handleInputChange}
            required
            autoComplete="tel"
          />
        </div>
        <button type="submit" className="save-button">
          Submit
        </button>
        <button
          className="cancel-button"
          type="button"
          onClick={() => setShowAddUserForm(false)} // Close the form
          aria-label="Close"
        >
          Cancel
        </button>
      </form>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddUserForm;
