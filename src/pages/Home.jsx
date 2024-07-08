import { Container, Typography } from '@mui/material';
import React from 'react';

function Home() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to My Portfolio
      </Typography>
      <Typography variant="body1">
        This is the home page of my portfolio. Here you can add an introduction about yourself,
        your skills, or any other information you'd like visitors to see first.
      </Typography>
    </Container>
  );
}

export default Home;