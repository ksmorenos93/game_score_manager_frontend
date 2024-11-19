"use client";

import { Container, Row, Col, Table, Alert, Button, Spinner, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUsersQuery, useDeleteUserMutation, useChangeUserStatusMutation } from "../../../store/services/users.api";
import NavbarHome from "../../../components/shared/navbar-home/page";
import { Pencil, XCircle } from "react-bootstrap-icons"; // Import icons

function AdminPage() {
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const router = useRouter();

  // Fetch users
  const { data: responseData, error, isLoading, refetch } = useGetUsersQuery();

  // Delete user mutation
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Change user status mutation
  const [changeUserStatus] = useChangeUserStatusMutation();

  // Start editing a user
  const handleEditClick = (user) => {
    setEditingUserId(user.userId);
    setUpdatedUserData({ ...user });
  };

  // Handle changes to the editable fields
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prev) => ({
      ...prev,
      [name]: name === "roles" ? value.split(",").map((role) => role.trim()) : value, // Convert roles to array
    }));
  };

  // Submit the updated data
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    console.log("Update user data:", updatedUserData);
    // TODO: Add PATCH API logic here
    setEditingUserId(null); // Exit edit mode
  };

  // Toggle user status
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await changeUserStatus(userId).unwrap(); // Unwraps the result or throws an error
      console.log("Status updated successfully");

      // Optimistically update the status to avoid waiting for refetch
      refetch(); // Refetch users after status update, this will re-render the table with the updated data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete a user
  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        console.log("User deleted successfully");
        refetch();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  // Ensure that users is an array before sorting
  const users = responseData?.users || [];

  const sortedUsers = Array.isArray(users) ? [...users].sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <>
      <NavbarHome />
      <Container className="mt-5">
        <Row>
          <Col md={8} className="mx-auto">
            {error && <Alert variant="danger">Error fetching users: {error.message}</Alert>}
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" />
                <p>Loading users...</p>
              </div>
            ) : (
              <Table striped bordered hover responsive className="custom-table">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Status</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers?.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>
                        {editingUserId === user.userId ? (
                          <Form.Control
                            type="text"
                            name="name"
                            value={updatedUserData.name || ""}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          <span
                            style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                            onClick={() => router.push(`/users/profile/${user.userId}`)}
                          >
                            {user.name}
                          </span>
                        )}
                      </td>
                      <td>
                        {editingUserId === user.userId ? (
                          <Form.Control
                            type="email"
                            name="email"
                            value={updatedUserData.email || ""}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td>
                        {editingUserId === user.userId ? (
                          <Form.Control
                            type="text"
                            name="avatar"
                            value={updatedUserData.avatar || ""}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          user.avatar || "No avatar"
                        )}
                      </td>
                      <td>
                        {editingUserId === user.userId ? (
                          <Form.Control
                            type="text"
                            name="status"
                            value={updatedUserData.status || ""}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          <Button
                            variant={user.status === "BLOCKED" ? "danger" : "success"} // Button color based on status
                            onClick={() => handleStatusToggle(user.userId, user.status)} // Trigger status change
                          >
                            {user.status === "BLOCKED" ? "BLOCKED" : "ACTIVATE"}  {/* Button text based on status */}
                          </Button>
                        )}
                      </td>
                      <td>
                        {editingUserId === user.userId ? (
                          <Form.Control
                            type="text"
                            name="roles"
                            value={updatedUserData.roles?.join(", ") || ""}
                            onChange={handleUpdateChange}
                          />
                        ) : (
                          user.roles.join(", ")
                        )}
                      </td>
                      <td>
                        {editingUserId === user.userId ? (
                          <Button variant="success" onClick={handleUpdateSubmit} className="me-2">
                            Save
                          </Button>
                        ) : (
                          <>
                            <Button variant="warning" onClick={() => handleEditClick(user)} className="me-2">
                              <Pencil /> {/* Pencil icon for Edit */}
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteClick(user.userId)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? <Spinner animation="border" size="sm" /> : <XCircle />} {/* Red X icon for Delete */}
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminPage;
