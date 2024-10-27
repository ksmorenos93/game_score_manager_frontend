"use client";

import { Container, Row, Col, Card } from "react-bootstrap";
import NavbarHome from "scoremanager/components/shared/navbar-home/page"; // Assuming NavbarHome is common for navigation

function Leaderboard() {
  return (
    <>
      <NavbarHome /> {/* Assuming NavbarHome doesn't need userId for this page */}
      <Container className="mt-5">
        <Row>
          <Col md={6} className="mx-auto">
            <Card>
              <Card.Body>
                <Card.Title>Leaderboard</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Leaderboard;
