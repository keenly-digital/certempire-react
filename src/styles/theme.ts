// src/styles/theme.ts

export const theme = {
  colors: {
    // Core Brand Colors
    primary: '#2D1684', // Main dark purple from header
    primaryLight: '#5F3DF2', // A slightly lighter purple for gradients/highlights
    accent: '#BA93FD', // Lighter purple for icons and accents
    
    // UI Colors
    background: '#FDFBFF', // The very light pinkish-white background
    surface: '#FFFFFF', // For cards and floating elements
    button: '#F7E6FF', // Pale lavender for secondary buttons

    // Text Colors
    textPrimary: '#1C244B', // Dark blue for headings
    textSecondary: 'rgba(28, 36, 75, 0.7)', // A slightly faded version for body text
    textOnPrimary: '#FFFFFF', // White text for use on dark backgrounds

    // Semantic Colors
    success: '#4CAF50',
    error: '#F44336',
    
    // Neutral Shades
    grey: '#BDBDBD',
    lightGrey: '#EEEEEE', // For borders
  },
  fonts: {
    primary: "'Poppins', sans-serif",
  },
  shadows: {
    card: '0 10px 25px -5px rgba(0, 0, 0, 0.07), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    button: '0 4px 14px 0 rgba(45, 22, 132, 0.39)',
  },
  gradients: {
    primary: 'linear-gradient(90deg, #5F3DF2 0%, #BA93FD 100%)',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
  }
};

export type AppTheme = typeof theme;
