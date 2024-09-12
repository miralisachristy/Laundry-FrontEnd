import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/csspages.css";

const UpdateUserForm = ({ setShowUpdateUserForm, user, onUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState({
    role: "",
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setUpdatedUser(user); // Preload user data into the form
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:3000/api/users/id/${user.id_user}`, updatedUser)
      .then((response) => {
        console.log("User updated successfully:", response.data);
        onUpdate(response.data.data); // Notify parent about the update
        setShowUpdateUserForm(false); // Close the form after updating user
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="update-user-box">
      <h3>Update User</h3>

      <button
        className="close-button"
        type="button"
        onClick={() => setShowUpdateUserForm(false)}
        aria-label="Close"
      >
        &times;
      </button>

      <form onSubmit={handleUpdateUser}>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={updatedUser.role}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={updatedUser.phone}
            onChange={handleInputChange}
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

export default UpdateUserForm;
