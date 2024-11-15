'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useCreateRegistrationMutation } from '../../../store/services/users.api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    avatar: '',
    roles: ['PLAYER'],
  });

  const [createRegistration, { isLoading }] = useCreateRegistrationMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string>('');

  const router = useRouter();

  // Handle form data changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend validation (name length validation)
    if (formData.name.length > 20) {
      setShowError('El nombre de usuario debe tener un máximo de 20 caracteres.');
      return;
    }

    const newUser = {
      email: formData.email,
      name: formData.name,
      password: formData.password,
      avatar: formData.avatar || null,
      roles: formData.roles,
    };

    try {
      // Attempt to create a new user
      const response = await createRegistration(newUser).unwrap();
      setShowSuccess(true);
      setShowError('');
    } catch (err: any) {
      // Handle error and show message to the user
      const errorMessage = err?.data?.message || err?.message || 'Hubo un error al registrar al usuario.';
      setShowError(errorMessage);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  // Handle role changes
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => {
      const updatedRoles = prev.roles.includes(value)
        ? prev.roles.filter(role => role !== value)
        : [...prev.roles, value];
      return { ...prev, roles: updatedRoles };
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Registrarse</h2>

              {showSuccess && (
                <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                  ¡Registro exitoso!
                </Alert>
              )}

              {showError && (
                <Alert variant="danger" onClose={() => setShowError('')} dismissible>
                  {showError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre de usuario"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAvatar">
                  <Form.Label>Avatar (URL o nombre del archivo)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la URL o nombre del archivo"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formRole">
                  <Form.Label>Rol</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="PLAYER"
                    value="PLAYER"
                    checked={formData.roles.includes('PLAYER')}
                    onChange={handleRoleChange}
                  />
                  <Form.Check
                    type="checkbox"
                    label="ADMIN"
                    value="ADMIN"
                    checked={formData.roles.includes('ADMIN')}
                    onChange={handleRoleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                  </Button>
                  <Button variant="secondary" onClick={handleLoginRedirect}>
                    Ir a Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
