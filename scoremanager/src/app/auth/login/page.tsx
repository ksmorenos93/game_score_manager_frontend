"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from "../../../store/services/auth.api"; // Import from auth.api
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [login, { isLoading }] = useLoginMutation(); // Hook for login mutation
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear error before attempting login
    setMessage('');

    try {
      // Call the API login function
      const { token } = await login({ email, password }).unwrap(); // Extract token from API response

      // Save the token in sessionStorage
      sessionStorage.setItem('token', token);

      // Decode the token to extract the userId (Assuming JWT and it contains the userId as 'sub')
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to extract userId
      const userId = decodedToken.user.sub; // Assuming 'sub' is the userId in your JWT

      // Redirect to the user profile page with userId from the token
      router.push(`/users/profile/${userId}`);
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'Error connecting to the server.');
    }
  };

  // Redirect to register page
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
              {message && <Alert variant="success">{message}</Alert>}

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
                </div>
              </Form>

              {/* Add a button for redirecting to the registration page */}
              <div className="mt-3 text-center">
                <Button variant="link" onClick={handleRegisterRedirect}>
                  ¿No tienes cuenta? Registrarse
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
