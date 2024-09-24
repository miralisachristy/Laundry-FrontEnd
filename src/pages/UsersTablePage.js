import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
import AddUserForm from "../components/AddUserForm";
import UpdateUserForm from "../components/UpdateUserForm";
import "../styles/csspages.css";

const UsersTablePage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // State for selected user IDs
  const [selectAll, setSelectAll] = useState(false); // State for 'Select All' checkbox

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        const usersData = response.data.data;
        if (Array.isArray(usersData)) {
          const sortedUsers = usersData.sort((a, b) => {
            // Move SuperAdmin to the top
            if (a.role === "SuperAdmin" && b.role !== "SuperAdmin") {
              return -1;
            }
            if (a.role !== "SuperAdmin" && b.role === "SuperAdmin") {
              return 1;
            }
            // Otherwise, sort alphabetically by name
            return a.name.localeCompare(b.name);
          });

          setUsers(sortedUsers);
        } else {
          console.error("Expected an array but got:", usersData);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching the users data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    [user.name, user.username, user.role, user.phone, user.email].some(
      (field) => field && field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, newUser];
      return updatedUsers.sort((a, b) => a.name.localeCompare(b.name));
    });
    setShowAddUserForm(false);
  };

  const handleUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers
        .map((user) =>
          user.id_user === updatedUser.id_user ? updatedUser : user
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setShowUpdateUserForm(false);
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateUserForm(true);
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/delete",
        { ids: selectedIds }
      );
      console.log("Deleted users:", response.data.deletedUsers);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedIds.includes(user.id_user))
      );
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error deleting selected users:", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredUsers.map((user) => user.id_user));
    } else {
      setSelectedIds([]);
    }
    setSelectAll(event.target.checked);
  };

  const handleSelectUser = (userId) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(userId)
        ? prevSelectedIds.filter((id) => id !== userId)
        : [...prevSelectedIds, userId]
    );
  };

  return (
    <div className="container">
      <Navigation />
      <div className="content">
        <h2>Users Table</h2>
        <div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, username, role, phone, email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="add-button"
            onClick={() => setShowAddUserForm(true)}
          >
            Add User
          </button>
          {selectedIds.length > 0 && (
            <button className="delete-button" onClick={handleDeleteSelected}>
              Delete
            </button>
          )}
        </div>
        {showAddUserForm && (
          <AddUserForm
            setShowAddUserForm={setShowAddUserForm}
            onAddUser={handleAddUser}
          />
        )}
        {showUpdateUserForm && (
          <UpdateUserForm
            setShowUpdateUserForm={setShowUpdateUserForm}
            user={selectedUser}
            onUpdate={handleUpdate}
          />
        )}
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
              <th>Role</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id_user}>
                  <td>
                    {user.role !== "SuperAdmin" ? (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id_user)}
                        onChange={() => handleSelectUser(user.id_user)}
                      />
                    ) : (
                      <span>--</span> // Display a placeholder like a dash or empty cell
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>{user.role}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td style={{ textAlign: "center" }}>{user.phone}</td>
                  <td style={{ textAlign: "center" }}>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {user.updated_at
                      ? new Date(user.updated_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="update-button"
                      onClick={() => handleUpdateClick(user)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTablePage;
