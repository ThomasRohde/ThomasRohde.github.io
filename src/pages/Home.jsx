import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { keyframes, styled } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '50vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  position: 'relative',
  overflow: 'hidden',
}));

const AnimatedTypography = styled(Typography)(({ theme, delay }) => ({
  animation: `${fadeIn} 1s ease-out ${delay}s both`,
}));

const Particle = styled('div')(({ size, top, left }) => ({
  position: 'absolute',
  width: size,
  height: size,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '50%',
  top,
  left,
  transition: 'all 0.5s ease-out',
}));

const ContentSection = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const SkillItem = styled(Typography)(({ theme, delay }) => ({
  display: 'inline-block',
  margin: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  animation: `${fadeIn} 1s ease-out ${delay}s both`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

function Home() {
  const theme = useTheme();
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    const particleCount = Math.floor(dimensions.width * dimensions.height / 5000);
    const newParticles = Array(particleCount).fill().map(() => ({
      id: Math.random(),
      size: Math.random() * 4 + 2,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    setParticles(newParticles);
  }, [dimensions]);

  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;

    const animate = (time) => {
      if (lastTime !== 0) {
        const deltaTime = time - lastTime;
        setParticles(prevParticles => 
          prevParticles.map(particle => {
            let { x, y, vx, vy } = particle;
            
            // Apply "wind" effect
            vx += (Math.random() - 0.5) * 0.01;
            vy += (Math.random() - 0.5) * 0.01;
            
            // Update position
            x += vx * deltaTime * 0.05;
            y += vy * deltaTime * 0.05;
            
            // Wrap around edges
            if (x < 0) x = dimensions.width;
            if (x > dimensions.width) x = 0;
            if (y < 0) y = dimensions.height;
            if (y > dimensions.height) y = 0;
            
            return { ...particle, x, y, vx, vy };
          })
        );
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <Box>
      <HeroSection>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            size={`${particle.size}px`}
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
            }}
          />
        ))}
        <AnimatedTypography variant="h1" component="h1" gutterBottom delay={0.2}>
          Thomas Klok Rohde
        </AnimatedTypography>
        <AnimatedTypography variant="h4" component="h2" gutterBottom delay={0.4}>
          Enterprise Architect
        </AnimatedTypography>
        <AnimatedTypography variant="h6" delay={0.6}>
          Bridging the gap between technology and business
        </AnimatedTypography>
      </HeroSection>

      <ContentSection maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <AnimatedTypography variant="h3" component="h2" gutterBottom delay={0.8}>
              About Me
            </AnimatedTypography>
            <AnimatedTypography variant="body1" paragraph delay={1}>
              I am a Computer Scientist with a master's degree in Artificial Intelligence and Voice Recognition. With over 30 years of experience, I've evolved into an Enterprise Architect, bridging the gap between cutting-edge technology and business needs.
            </AnimatedTypography>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimatedTypography variant="h3" component="h2" gutterBottom delay={1}>
              My Skills
            </AnimatedTypography>
            <Box>
              {['ArchiMate', 'Archi', 'Python', 'JavaScript', 'Excel', 'Power Query', 'AI', 'Enterprise Architecture'].map((skill, index) => (
                <SkillItem key={skill} variant="body2" component="span" delay={1.2 + index * 0.1}>
                  {skill}
                </SkillItem>
              ))}
            </Box>
          </Grid>
        </Grid>
      </ContentSection>
    </Box>
  );
}

export default Home;