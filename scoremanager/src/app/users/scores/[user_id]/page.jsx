"use client";

import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "scoremanager/hoc/with-auth";
import NavbarHome from "scoremanager/components/shared/navbar-home/page"; // Import the NavbarHome component

function UserScore({ params }) {
  const [userScore, setUserScore] = useState(null); // State to store userScore
  const [error, setError] = useState(''); // State for error handling
  const router = useRouter();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userId = params.user_id; // Get user_id from route parameters

    const foundUser = users.find(u => u.id === parseInt(userId)); // Assuming user.id is a number

    if (foundUser) {
      setUserScore(foundUser.score); // Set the score instead of user details
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
            {userScore !== null ? (
              <Card>
                <Card.Body>
                  <Card.Title>Puntuación del Usuario</Card.Title> {/* Title for user score */}
                  <Card.Text>
                    <strong>Puntuación:</strong> {userScore} {/* Display the user's score */}
                  </Card.Text>
                  <Button variant="danger" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <p>Cargando puntuación...</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default withAuth(UserScore);
