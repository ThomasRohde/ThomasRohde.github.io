import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { keyframes, styled } from '@mui/system';
import React, { useEffect, useRef } from 'react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
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

const Particle = styled('div')(({ theme, size, top, left, animationDuration }) => ({
  position: 'absolute',
  width: size,
  height: size,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '50%',
  top: top,
  left: left,
  animation: `${keyframes`
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100vh) rotate(360deg); }
  `} ${animationDuration}s linear infinite`,
}));

const ContentSection = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}));

const SkillItem = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  margin: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

function Home() {
  const theme = useTheme();
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current = Array(20).fill().map(() => ({
      size: `${Math.random() * 10 + 5}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 20 + 10}s`,
    }));
  }, []);

  return (
    <Box>
      <HeroSection>
        {particlesRef.current.map((particle, index) => (
          <Particle key={index} {...particle} />
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