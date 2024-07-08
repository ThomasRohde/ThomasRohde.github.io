import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';

function Blog() {
  const posts = [
    { id: 1, title: 'First Blog Post', date: '2023-07-08' },
    { id: 2, title: 'Second Blog Post', date: '2023-07-15' },
    // Add more blog posts as needed
  ];

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        My Blog
      </Typography>
      <List>
        {posts.map((post) => (
          <ListItem key={post.id}>
            <ListItemText 
              primary={post.title}
              secondary={post.date}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Blog;