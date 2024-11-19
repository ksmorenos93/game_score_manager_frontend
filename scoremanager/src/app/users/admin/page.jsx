"use client";

import { Container, Row, Col, Table, Alert, Button, Spinner, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUsersQuery, useDeleteUserMutation, useChangeUserStatusMutation } from "../../../store/services/users.api";
import NavbarHome from "../../../components/shared/navbar-home/page";

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
      [name]: name === "roles" ? value.split(",").map((role) => role.trim()) : value,
    }));
  };

  // Submit the updated data
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    console.log("Update user data:", updatedUserData);
    setEditingUserId(null); // Exit edit mode
  };

  // Toggle user status
  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await changeUserStatus(userId).unwrap();
      console.log("Status updated successfully");
      refetch(); // Refetch users
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
              <Table striped bordered hover>
                <thead>
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
                        <span
                          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                          onClick={() => router.push(`/users/profile/${user.userId}`)}
                        >
                          {user.name}
                        </span>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.avatar || "No avatar"}</td>
                      <td>
                        <Button
                          variant={user.status === "BLOCKED" ? "danger" : "success"}
                          onClick={() => handleStatusToggle(user.userId, user.status)}
                        >
                          {user.status === "BLOCKED" ? "BLOCKED" : "ACTIVATE"}
                        </Button>
                      </td>
                      <td>{user.roles.join(", ")}</td>
                      <td>
                        <Button variant="primary" onClick={() => handleEditClick(user)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteClick(user.userId)}>
                          {isDeleting ? <Spinner animation="border" size="sm" /> : "Delete"}
                        </Button>
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
