import { Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material';
import React from 'react';

function Projects() {
    const projects = [
        { 
            id: 1, 
            title: 'Chess Anywhere', 
            url: 'https://tkrohde.github.io/', 
            description: 'Chess Anywhere has its roots in an old idea that had been brewing for years. The concept of a URL-encoded chess game had long been a fascinating thought experiment, but it needed the right technology and approach to become a reality.' },
        { 
            id: 2, 
            title: 'Personal Blog', 
            url: 'https://thomasrohde.github.io/', 
            description: 'This site! A React + Vite project for a personal landing page.' },
        {
            id: 3,
            title: 'Mood tracker',
            description: 'A simple test project integrated with my home page.',
            url: 'https://thomasrohde.github.io/mood-tracker'
          },
    ];

    const handleLearnMore = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
                Projects
            </Typography>
            <Grid container spacing={4}>
                {projects.map((project) => (
                    <Grid item key={project.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {project.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {project.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleLearnMore(project.url)}>
                                    Learn More
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Projects;