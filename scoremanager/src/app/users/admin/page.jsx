"use client";

import { Container, Row, Col, Table, Alert, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "scoremanager/hoc/with-auth";
import NavbarHome from "scoremanager/components/shared/navbar-home/page"; // Import the NavbarHome component

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token is found
      return;
    }

    const decodedToken = JSON.parse(atob(token));
    const role = decodedToken.role;

    // Check if the user has the 'administrator' role
    if (role !== 'administrator') {
      const userId = decodedToken.id; // Get user ID from decoded token
      router.push(`/users/profile/${userId}`); // Redirect to user profile if not an admin
      return;
    }

    // Proceed to get user data if user is an admin
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    if (usersData.length > 0) {
      setUsers(usersData);
    } else {
      setError('No users found in local storage');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear the token from sessionStorage
    router.push('/login'); // Redirect to the login page
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setUpdatedUserData(user);
  };

  const handleDeleteClick = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(user =>
      user.id === editingUserId ? updatedUserData : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditingUserId(null); // Exit edit mode
  };

  return (
    <>
      <NavbarHome /> {/* No userId is passed, as it's not needed here */}
      <Container className="mt-5">
        <Row>
          <Col md={8} className="mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
            {users.length > 0 ? (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre de usuario</th>
                      <th>Correo electrónico</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          {editingUserId === user.id ? (
                            <Form.Control
                              type="text"
                              name="username"
                              value={updatedUserData.username}
                              onChange={handleUpdateChange}
                            />
                          ) : (
                            user.username
                          )}
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <Form.Control
                              type="email"
                              name="email"
                              value={updatedUserData.email}
                              onChange={handleUpdateChange}
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <Form.Control
                              type="text"
                              name="role"
                              value={updatedUserData.role}
                              onChange={handleUpdateChange}
                            />
                          ) : (
                            user.role
                          )}
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <Button variant="success" onClick={handleUpdateSubmit}>
                              Guardar
                            </Button>
                          ) : (
                            <>
                              <Button variant="warning" onClick={() => handleEditClick(user)}>
                                Editar
                              </Button>
                              <Button variant="danger" onClick={() => handleDeleteClick(user.id)}>
                                Eliminar
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <p>No users found.</p>
            )}
            <Button variant="danger" onClick={handleLogout} className="mt-3">
              Cerrar sesión
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withAuth(AdminPage);
