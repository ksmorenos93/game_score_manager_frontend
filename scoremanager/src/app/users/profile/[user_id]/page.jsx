"use client";

import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "scoremanager/hoc/with-auth";
import NavbarHome from "scoremanager/components/shared/navbar-home/page"; // Import the NavbarHome component

function UserProfile({ params }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userId = params.user_id; // Get user_id from route parameters

    const foundUser = users.find(u => u.id === parseInt(userId)); // Assuming user.id is a number

    if (foundUser) {
      setUser(foundUser);
    } else {
      setError('User not found');
      router.push('/login'); // Redirect if user is not found
    }
  }, [params.user_id, router]);

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear the token from sessionStorage
    router.push('/login'); // Redirect to the login page
  };

  return (
    <>
      <NavbarHome userId={params.user_id} /> {/* Pass userId as a prop */}
      <Container className="mt-5">
        <Row>
          <Col md={6} className="mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
            {user ? (
              <Card>
                <Card.Body>
                  <Card.Title>Perfil de Usuario</Card.Title>
                  <Card.Text>
                    <strong>Nombre de usuario:</strong> {user.username}
                  </Card.Text>
                  <Card.Text>
                    <strong>Correo electrónico:</strong> {user.email}
                  </Card.Text>
                  <Card.Text>
                    <strong>Rol:</strong> {user.role}
                  </Card.Text>
                  <Button variant="danger" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <p>Cargando perfil...</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withAuth(UserProfile);
