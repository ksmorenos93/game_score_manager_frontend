import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavbarHome() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve and decode token from sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token)); // Decode the base64 token
      setUserId(decodedToken.id); // Set userId from decoded token
    }
  }, []);

  const handleUserProfile = () => {
    if (userId) {
      router.push(`/users/profile/${userId}`);
    } else {
      router.push('/login');
    }
  };

  const handleScoreProfile = () => {
    if (userId) {
      router.push(`/users/scores/${userId}`); // Redirect to the user's score profile
    } else {
      router.push('/login');
    }
  };

  const handleAdminUserProfile = () => {
    if (userId) {
      router.push(`/users/admin/${userId}`); // Redirect to the admin user profile
    } else {
      router.push('/login');
    }
  };

  const handleAdmin = () => {
    if (userId) {
      router.push(`/users/admin`); // Redirect to the admin user profile
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear the session token
    router.push('/login'); // Redirect to the login page
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Score Manager System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {/* Dynamically redirect to user profile */}
            <Nav.Link onClick={handleUserProfile}>My Profile</Nav.Link>
            {/* Dropdown for scores */}
            <NavDropdown title="Scores" id="basic-nav-dropdown">
              <NavDropdown.Item href="/users/scores/leaderboard">
                Leaderboard
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleScoreProfile}>
                My Score Profile
              </NavDropdown.Item>
            </NavDropdown>
            {/* New Dropdown for Admin options */}
            <NavDropdown title="Admin" id="admin-nav-dropdown">
              <NavDropdown.Item onClick={handleAdminUserProfile}>
                Manage User Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleAdmin}>
                Gestionar Jugadores
              </NavDropdown.Item>
            </NavDropdown>
            {/* Logout link */}
            <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
