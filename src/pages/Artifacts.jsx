import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Button, Card, CardActions, CardContent, Container, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';

function Artifacts() {
  const [artifacts, setArtifacts] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
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
      {
        id: 'wordle-clone',
        title: 'Wordle clone',
        description: 'A clone of Wordle done in 5 prompts.',
        component: React.lazy(() => import('./artifacts/Wordle'))
      },
      // Add more artifacts here as you create them
    ]);
  }, []);
  

  const handleSelectArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    setIsFullscreen(false);
  };

  const handleBack = () => {
    setSelectedArtifact(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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

  const ArtifactDisplay = ({ artifact }) => (
    <Box
      sx={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : '60vh',
        zIndex: isFullscreen ? theme.zIndex.modal : 'auto',
        backgroundColor: 'white',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <artifact.component />
        </React.Suspense>
      </Box>
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton onClick={toggleFullscreen} color="primary">
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>
    </Box>
  );

  if (selectedArtifact) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
          Back to Artifacts
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          {selectedArtifact.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedArtifact.description}
        </Typography>
        <ArtifactDisplay artifact={selectedArtifact} />
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