"use client";

import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "scoremanager/hoc/with-auth";
import NavbarHome from "scoremanager/components/shared/navbar-home/page"; // Import the NavbarHome component
import { useGetProfilesQuery } from "scoremanager/store/services/scores.api";

function UserProfile({ params }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch data from the API using the query hook
  const { data: apiUser, error: apiError, isLoading } = useGetProfilesQuery(params.user_id);

  useEffect(() => {
    // Fetch user data from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userId = params.user_id;

    const foundUser = users.find(u => u.id === parseInt(userId)); // Assuming user.id is a number

    if (foundUser) {
      setUser(foundUser);
    } else {
      setError('User not found');
      router.push('/auth/login'); // Redirect if user is not found
    }

    // Redirect to login if API returns an error
    if (apiError) {
      router.push("/auth/login");
    }
  }, [params.user_id, router, apiError]);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Clear the token from sessionStorage
    router.push("/auth/login"); // Redirect to the login page
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

            {/* API Response Section */}
            <div className="mt-4">
              <h5>API Response</h5>
              <Card>
                <Card.Body>
                  {isLoading ? (
                    <p>Cargando datos del API...</p>
                  ) : (
                    <Card.Text>
                      <strong>API Response:</strong> {apiUser?.username || "No disponible"}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withAuth(UserProfile);
