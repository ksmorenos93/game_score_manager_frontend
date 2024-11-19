import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarHomeProps {
  userId: string; // Accept userId as a prop, but we'll get it from the token instead
}

export default function NavbarHome({ userId }: NavbarHomeProps) {
  const router = useRouter();
  const [hasAdminRole, setHasAdminRole] = useState<boolean>(false);
  const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null); // Store the userId from the token

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("token");

      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userRoles = decodedToken.user?.roles || [];
        const userId = decodedToken.user?.sub || null; // Extract userId from token (assuming 'sub' is the userId)

        setUserIdFromToken(userId); // Save the userId from token
        setHasAdminRole(Array.isArray(userRoles) && userRoles.includes("ADMIN"));
      } else {
        console.error("Token not found in sessionStorage");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleUserProfile = () => {
    // Use the userId from token (if available)
    if (userIdFromToken) {
      router.push(`/users/profile/${userIdFromToken}`);
    } else {
      alert("User ID not available");
    }
  };

  const handleScoreProfile = () => {
    router.push("/users/scores/leaderboard");
  };

  const handleAdminUserProfile = () => {
    router.push("/users/admin");
  };

  const handleAdmin = () => {
    router.push("/users/admin");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Score Manager System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link onClick={handleUserProfile}>My Profile</Nav.Link>
            <NavDropdown title="Scores" id="basic-nav-dropdown">
              <NavDropdown.Item href="/users/scores/leaderboard">Leaderboard</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleScoreProfile}>My Score Profile</NavDropdown.Item>
            </NavDropdown>
            {hasAdminRole && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item onClick={handleAdminUserProfile}>Manage User Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleAdmin}>Gestionar Jugadores</NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
