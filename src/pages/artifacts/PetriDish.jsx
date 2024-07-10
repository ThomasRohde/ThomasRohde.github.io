import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Button, Grid, Paper, Slider, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const OrganicParticleSystem = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const organismsRef = useRef([]);
  const animationRef = useRef(null);

  const [speed, setSpeed] = useState(1);
  const [startingPopulation, setStartingPopulation] = useState(50);
  const [actualCount, setActualCount] = useState(0);
  const [spawnProbability, setSpawnProbability] = useState(0.01);
  const [maxPopulation, setMaxPopulation] = useState(500);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const maxSize = 12;
  const minSize = 4;
  const trailLength = 15;

  const organismTypes = useMemo(() => [
    { shape: 'circle', color: '#00a86b' },
    { shape: 'oval', color: '#7851a9' },
    { shape: 'rectangle', color: '#ff7f50' },
    { shape: 'triangle', color: '#20b2aa' }
  ], []);

  const createOrganism = useCallback((canvas, x = null, y = null, genetics = null) => {
    const type = genetics ? genetics.type : organismTypes[Math.floor(Math.random() * organismTypes.length)];
    return {
      x: x !== null ? x : Math.random() * canvas.width,
      y: y !== null ? y : Math.random() * canvas.height,
      size: genetics ? genetics.size : Math.random() * (maxSize - minSize) + minSize,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      trail: [],
      shape: type.shape,
      color: type.color,
      wiggleOffset: Math.random() * Math.PI * 2,
      generation: genetics ? genetics.generation + 1 : 1,
      isNew: true,
    };
  }, [organismTypes, speed]);

  const reproduce = useCallback((parent1, parent2, canvas) => {
    const childGenetics = {
      type: Math.random() < 0.5 ? parent1 : parent2,
      size: (parent1.size + parent2.size) / 2 + (Math.random() - 0.5),
      generation: Math.max(parent1.generation, parent2.generation),
    };

    if (Math.random() < 0.1) {
      childGenetics.type = organismTypes[Math.floor(Math.random() * organismTypes.length)];
    }

    return createOrganism(canvas, (parent1.x + parent2.x) / 2, (parent1.y + parent2.y) / 2, childGenetics);
  }, [createOrganism, organismTypes]);

  const initOrganisms = useCallback(() => {
    const canvas = canvasRef.current;
    organismsRef.current = Array(startingPopulation).fill().map(() => createOrganism(canvas));
    setActualCount(organismsRef.current.length);
  }, [startingPopulation, createOrganism]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    canvas.width = container.clientWidth;
    canvas.height = isFullscreen ? window.innerHeight : 400;
    initOrganisms();
  }, [isFullscreen, initOrganisms]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const updateOrganisms = (time) => {
      const newOrganisms = [];

      organismsRef.current.forEach(org => {
        org.x += org.speedX * speed;
        org.y += org.speedY * speed;

        if (org.x < 0 || org.x > canvas.width) org.speedX *= -1;
        if (org.y < 0 || org.y > canvas.height) org.speedY *= -1;

        const wiggle = Math.sin(time * 0.01 + org.wiggleOffset) * 2;
        org.trail.unshift({ x: org.x + wiggle, y: org.y });
        if (org.trail.length > trailLength) org.trail.pop();

        org.isNew = false;
      });

      // Spatial partitioning for collision detection
      const grid = {};
      const cellSize = maxSize * 2;

      organismsRef.current.forEach(org => {
        const cellX = Math.floor(org.x / cellSize);
        const cellY = Math.floor(org.y / cellSize);
        const cellKey = `${cellX},${cellY}`;
        if (!grid[cellKey]) grid[cellKey] = [];
        grid[cellKey].push(org);
      });

      organismsRef.current.forEach(org1 => {
        const cellX = Math.floor(org1.x / cellSize);
        const cellY = Math.floor(org1.y / cellSize);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const cellKey = `${cellX + dx},${cellY + dy}`;
            if (grid[cellKey]) {
              grid[cellKey].forEach(org2 => {
                if (org1 !== org2) {
                  const dx = org1.x - org2.x;
                  const dy = org1.y - org2.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  if (distance < org1.size + org2.size) {
                    // Simple collision response
                    [org1.speedX, org2.speedX] = [org2.speedX, org1.speedX];
                    [org1.speedY, org2.speedY] = [org2.speedY, org1.speedY];

                    if (Math.random() < spawnProbability && organismsRef.current.length < maxPopulation) {
                      newOrganisms.push(reproduce(org1, org2, canvas));
                    }
                  }
                }
              });
            }
          }
        }
      });

      organismsRef.current = [...organismsRef.current, ...newOrganisms];
      setActualCount(organismsRef.current.length);
    };

    const drawOrganism = (ctx, org) => {
      ctx.beginPath();
      ctx.moveTo(org.x, org.y);
      org.trail.forEach((pos, i) => {
        ctx.lineTo(pos.x, pos.y);
      });
      ctx.strokeStyle = org.color + '80';
      ctx.lineWidth = org.size / 3;
      ctx.stroke();

      ctx.fillStyle = org.isNew ? '#FFD700' : org.color;
      ctx.beginPath();
      switch (org.shape) {
        case 'circle':
          ctx.arc(org.x, org.y, org.size / 2, 0, Math.PI * 2);
          break;
        case 'oval':
          ctx.ellipse(org.x, org.y, org.size / 2, org.size / 3, 0, 0, Math.PI * 2);
          break;
        case 'rectangle':
          ctx.rect(org.x - org.size / 2, org.y - org.size / 3, org.size, org.size / 1.5);
          break;
        case 'triangle':
          ctx.moveTo(org.x, org.y - org.size / 2);
          ctx.lineTo(org.x - org.size / 2, org.y + org.size / 2);
          ctx.lineTo(org.x + org.size / 2, org.y + org.size / 2);
          ctx.closePath();
          break;
      }
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = `${org.size / 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(org.generation.toString(), org.x, org.y);
    };

    const drawOrganisms = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      organismsRef.current.forEach(org => drawOrganism(ctx, org));
    };

    const animate = (time) => {
      updateOrganisms(time);
      drawOrganisms();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [speed, spawnProbability, maxPopulation, reproduce, resizeCanvas]);

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (organismsRef.current.length < maxPopulation) {
      organismsRef.current.push(createOrganism(canvas, x, y));
      setActualCount(prev => prev + 1);
    }
  }, [createOrganism, maxPopulation]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) { // Firefox
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <Paper ref={containerRef} elevation={3} style={{ padding: '20px', maxWidth: '800px', margin: 'auto', height: isFullscreen ? '100vh' : 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Petri Dish
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>
              Animation Speed: {speed.toFixed(2)}
            </Typography>
            <Slider
              value={speed}
              onChange={(_, value) => setSpeed(value)}
              min={0.1}
              max={5}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>
              Starting Population: {startingPopulation}
            </Typography>
            <Slider
              value={startingPopulation}
              onChange={(_, value) => {
                setStartingPopulation(value);
                initOrganisms();
              }}
              min={10}
              max={200}
              step={1}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>
              Spawn Probability: {spawnProbability.toFixed(3)}
            </Typography>
            <Slider
              value={spawnProbability}
              onChange={(_, value) => setSpawnProbability(value)}
              min={0.001}
              max={0.1}
              step={0.001}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>
              Max Population: {maxPopulation}
            </Typography>
            <Slider
              value={maxPopulation}
              onChange={(_, value) => setMaxPopulation(value)}
              min={100}
              max={2000}
              step={100}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
        <Typography variant="body1" style={{ marginTop: '20px', marginBottom: '10px' }}>
          Actual Count: {actualCount}
        </Typography>
        <div style={{ flex: 1, width: '100%', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
            onClick={handleCanvasClick}
          />
        </div>
        <Typography variant="body2" style={{ marginTop: '10px', color: 'rgba(0, 0, 0, 0.6)' }}>
          Click on the canvas to add new organisms (up to max population)!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          onClick={toggleFullscreen}
          style={{ marginTop: '10px' }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>
    </Paper>
  );
};

export default OrganicParticleSystem;