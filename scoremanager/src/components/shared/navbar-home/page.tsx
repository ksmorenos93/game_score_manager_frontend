import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";

// Define the type for the props of NavbarHome
interface NavbarHomeProps {
  userId: string;
}

export default function NavbarHome({ userId }: NavbarHomeProps) {
  const router = useRouter();

  const handleUserProfile = () => {
    router.push(`/users/profile/${userId}`); // Redirect to user profile page with userId
  };

  const handleScoreProfile = () => {
    router.push('/users/scores/leaderboard'); // Redirect to scores page
  };

  const handleAdminUserProfile = () => {
    router.push('/users/admin'); // Redirect to admin user profile page
  };

  const handleAdmin = () => {
    router.push('/users/admin'); // Redirect to admin panel
  };

  const handleLogout = () => {
    router.push('/auth/login'); // Redirect to login page (no token management)
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Score Manager System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {/* Direct routing to user profile */}
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
            {/* Dropdown for Admin options */}
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
