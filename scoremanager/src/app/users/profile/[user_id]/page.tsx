'use client'; // Ensure this is a Client Component

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use useParams for route params and useRouter for navigation
import { useGetProfilesQuery } from '../../../../store/services/users.api';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import NavbarHome from '../../../../components/shared/navbar-home/page';

function UserProfile() {
  const params = useParams(); // Use useParams to get dynamic route params
  const userId = Array.isArray(params?.user_id) ? params.user_id[0] : params.user_id; // Ensure userId is a string
  const router = useRouter(); // Use useRouter for navigation
  const [error, setError] = useState<string>('');

  // Fetch user data based on userId with polling enabled
  const { data: user, error: apiError, isLoading } = useGetProfilesQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
    pollingInterval: 1000, // Poll every 1 second
  });

  useEffect(() => {
    if (apiError) {
      console.error(apiError); // Log the API error for debugging
      setError('Error fetching user data');
    }
  }, [apiError]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    router.push('/login'); // Redirect to login page
  };

  return (
    <>
      <NavbarHome userId={userId || ''} />
      <Container className="mt-5">
        <Row>
          <Col md={6} className="mx-auto">
            {error && <Alert variant="danger">{error}</Alert>}
            {isLoading ? (
              <p>Loading profile...</p>
            ) : (
              user ? (
                <Card>
                  <Card.Body>
                    <Card.Title>User Profile</Card.Title>
                    <Card.Text>
                      <strong>Username:</strong> {user.name}
                    </Card.Text>
                    <Card.Text>
                      <strong>Email:</strong> {user.email}
                    </Card.Text>
                    <Card.Text>
                      <strong>Avatar:</strong> {user.avatar || 'Not available'}
                    </Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> {user.status}
                    </Card.Text>
                    <Card.Text>
                      <strong>Roles:</strong> {user.roles.join(', ')}
                    </Card.Text>
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="warning">User data not found</Alert>
              )
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserProfile;
