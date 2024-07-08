import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

function Home() {
  return (
    <Container maxWidth={false} disableGutters>
      <HeroSection>
        <Typography variant="h1" component="h1" gutterBottom>
          Thomas Klok Rohde
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Enterprise Architect
        </Typography>
      </HeroSection>

      <Container maxWidth="md" sx={{ my: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom>
              About Me
            </Typography>
            <Typography variant="body1" paragraph>
              I'm a passionate full-stack developer with a keen eye for user experience. 
              With years of experience in building robust and scalable web applications, 
              I strive to create digital solutions that not only meet technical requirements 
              but also delight users.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom>
              My Skills
            </Typography>
            <Typography variant="body1" component="ul">
              <li>JavaScript (React, Node.js)</li>
              <li>Python (Django, Flask)</li>
              <li>Database Design (SQL, NoSQL)</li>
              <li>UI/UX Design</li>
              <li>DevOps & Cloud Services</li>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default Home;