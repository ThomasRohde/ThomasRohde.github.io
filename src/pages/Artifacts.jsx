import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

function Artifacts() {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  useEffect(() => {
    // In a real application, you might fetch this data from an API
    // For now, we'll use a static list with dynamic imports
    setArtifacts([
      {
        id: 'color-palette-showcase',
        title: 'Color Palette Showcase',
        description: 'A component showcasing various color palettes.',
        component: React.lazy(() => import('./artifacts/ColorPaletteShowcase'))
      },
      {
        id: 'petri-dish',
        title: 'Simulation of organic life',
        description: 'What happens in a Petri dish, stays (hopefully) in the Petri dish.',
        component: React.lazy(() => import('./artifacts/PetriDish'))
      },
      // Add more artifacts here as you create them
    ]);
  }, []);

  const handleSelectArtifact = (artifact) => {
    setSelectedArtifact(artifact);
  };

  const handleBack = () => {
    setSelectedArtifact(null);
  };

  const ArtifactsDescription = () => (
    <Box my={4}>
      <Typography variant="body1" paragraph>
        Claude Artifacts are components, code snippets, or other digital creations generated during interactions with Claude, an AI assistant. These artifacts showcase the collaborative potential between humans and AI in creating functional and creative web elements.
      </Typography>
      <Typography variant="body1" paragraph>
        Each artifact is crafted based on user requests and Claude's interpretations, resulting in unique, reusable components that can be integrated into various web projects.
      </Typography>
    </Box>
  );

  if (selectedArtifact) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Artifacts
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          {selectedArtifact.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedArtifact.description}
        </Typography>
        <Box my={4}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <selectedArtifact.component />
          </React.Suspense>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Claude Artifacts
      </Typography>
      <ArtifactsDescription />
      <Grid container spacing={3}>
        {artifacts.map((artifact) => (
          <Grid item key={artifact.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {artifact.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {artifact.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleSelectArtifact(artifact)}>View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Artifacts;