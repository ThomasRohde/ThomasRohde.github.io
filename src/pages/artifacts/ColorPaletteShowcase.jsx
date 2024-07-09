import React from 'react';

const colorPalettes = [
  { name: 'Ocean Breeze', primary: '#3498db', secondary: '#2ecc71' },
  { name: 'Sunset Glow', primary: '#e74c3c', secondary: '#f39c12' },
  { name: 'Lavender Dream', primary: '#9b59b6', secondary: '#3498db' },
  { name: 'Forest Depths', primary: '#27ae60', secondary: '#2c3e50' },
  { name: 'Cherry Blossom', primary: '#e91e63', secondary: '#ff4081' },
  { name: 'Autumn Leaves', primary: '#d35400', secondary: '#c0392b' },
  { name: 'Cool Mint', primary: '#1abc9c', secondary: '#16a085' },
  { name: 'Royal Elegance', primary: '#8e44ad', secondary: '#2c3e50' },
];

const ColorPaletteShowcase = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px' }}>Color Palette Showcase</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {colorPalettes.map((palette, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            width: 'calc(50% - 10px)',
            minWidth: '200px'
          }}>
            <div style={{ 
              height: '100px', 
              background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 100%)`
            }} />
            <div style={{ padding: '16px' }}>
              <h3 style={{ marginTop: 0 }}>{palette.name}</h3>
              <p>Primary: {palette.primary}</p>
              <p>Secondary: {palette.secondary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteShowcase;