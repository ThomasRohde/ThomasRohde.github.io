import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import your page components here
import Blog from './pages/Blog';
import Home from './pages/Home';
import Projects from './pages/Projects';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            My Portfolio
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/projects">Projects</Button>
          <Button color="inherit" component={Link} to="/blog">Blog</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;