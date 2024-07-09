import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code'; // Add this line
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import WorkIcon from '@mui/icons-material/Work';
import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          { text: 'Home', icon: <HomeIcon />, path: '/' },
          { text: 'Projects', icon: <WorkIcon />, path: '/projects' },
          { text: 'Artifacts', icon: <CodeIcon />, path: '/artifacts' },
          { text: 'Blog', icon: <ArticleIcon />, path: '/blog' },
        ].map((item) => (
          <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Thomas Klok Rohde
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <main style={{ flexGrow: 1, padding: theme.spacing(3) }}>
        <Toolbar /> {/* This toolbar is for spacing */}
        {children}
      </main>
    </div>
  );
}

export default Layout;