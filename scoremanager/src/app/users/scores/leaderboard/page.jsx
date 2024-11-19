"use client"

import React from 'react';
import { useGetLeaderboardQuery } from "../../../../store/services/scores.api"
import { Table, Spinner, Alert } from 'react-bootstrap'; // Importing required components from react-bootstrap
import NavbarHome from "../../../../components/shared/navbar-home/page";

const ScorePage = () => {
  // Fetch leaderboard scores
  const { data: leaderboard, error, isLoading } = useGetLeaderboardQuery();

  // Show loading spinner, error message, or leaderboard table
  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" /> {/* Loading spinner */}
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert variant="danger">Error: {error.message}</Alert> {/* Error message */}
      </div>
    );
  }

  return (
    
    <div>
      <NavbarHome/> {/* Pass userId as a prop */}
      <h1>Leaderboard</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Game</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map((score) => (
            <tr key={score.scoreId}>
              <td>{score.userId}</td>
              <td>{score.game}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ScorePage;
