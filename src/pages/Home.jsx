import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '300px',
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
              I am a Computer Scientist, with a master degree in Artifical Intelligence and Voice Recognition (although it is 30+ years old). My day job is Enterprise Architect.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom>
              My Skills
            </Typography>
            <Typography variant="body1" component="ul">
              <li>ArchiMate and the Archi tool</li>
              <li>Python, JavaScript, Excel, Power Query</li>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default Home;