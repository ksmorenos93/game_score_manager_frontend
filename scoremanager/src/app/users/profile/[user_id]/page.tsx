"use client";

import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../../../hoc/with-auth";
import NavbarHome from "../../../../components/shared/navbar-home/page";
import { useGetProfilesQuery } from "../../../../store/services/users.api";

// Define the type for the profile data structure.
interface UserProfileData {
  name: string;
  email: string;
  avatar: string | null;
  status: string;
  roles: string[];
}

// Define the type for the `params` prop
interface UserProfileProps {
  params: {
    user_id: string;
  };
}

function UserProfile({ params }: UserProfileProps) {
  const [error, setError] = useState<string>(''); // Set type for error
  const router = useRouter();

  // Use the useGetProfilesQuery hook to fetch the user profile
  const { data: user, error: apiError, isLoading } = useGetProfilesQuery(params.user_id);

  useEffect(() => {
    // Handle redirection or error when fetching data
    if (apiError) {
      setError('Error fetching user data');
      router.push("/auth/login");
    }
  }, [apiError, router]);

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
            {isLoading ? (
              <p>Cargando perfil...</p>
            ) : (
              user && (
                <Card>
                  <Card.Body>
                    <Card.Title>Perfil de Usuario</Card.Title>
                    <Card.Text>
                      <strong>Nombre de usuario:</strong> {user.name}
                    </Card.Text>
                    <Card.Text>
                      <strong>Correo electrónico:</strong> {user.email}
                    </Card.Text>
                    <Card.Text>
                      <strong>Avatar:</strong> {user.avatar || "No disponible"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> {user.status}
                    </Card.Text>
                    <Card.Text>
                      <strong>Roles:</strong> {user.roles.join(', ')}
                    </Card.Text>
                    <Button variant="danger" onClick={handleLogout}>
                      Cerrar sesión
                    </Button>
                  </Card.Body>
                </Card>
              )
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserProfile;
