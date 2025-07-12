// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#0057FF',
    primaryDark: '#00369F',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#757575',
    success: '#4CAF50',
    error: '#F44336',
    grey: '#BDBDBD',
    lightGrey: '#EEEEEE',
    darkGrey: '#616161',
  },
  fonts: {
    primary: "'Poppins', sans-serif",
  },
};

export type AppTheme = typeof theme;