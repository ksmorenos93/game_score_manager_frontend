'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useUserLoginMutation } from "scoremanager/store/services/scores.api";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // State for success message
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      try {
        // Call the API login function
        const response = await userLogin({ email, password }).unwrap();
        
        // If the API call was successful, set the message from the API response
        setMessage(response.username); // Adjust this based on your API response structure

        // Create a token based on API response
        const token = btoa(JSON.stringify({
          id: user.id, // Assuming user.id exists
          email: response.email, // or user.email based on your logic
          username: response.username,
          role: user.role, // Assuming user has a role
          exp: new Date().getTime() + 3600000 // 1 hour from now
        }));
        sessionStorage.setItem('token', token);
        router.push(`/users/profile/${user.id}`); // Redirect to user profile
      } catch (err) {
        setError('Error connecting to API or invalid credentials.');
      }
    } else {
      setError('Credenciales incorrectas');
    }
  };

  // Handle redirect to the register page
  const handleRegisterRedirect = () => {
    router.push('/auth/register');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>} {/* Display success message */}
              
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                  </Button>
                  <Button variant="secondary" onClick={handleRegisterRedirect}>
                    Registrarse
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
