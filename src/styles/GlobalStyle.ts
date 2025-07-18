// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* A more robust reset and foundation */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-family: ${({ theme }) => theme.fonts.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

   &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    }
  }

  /* Set a default color for all heading levels */
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }
`;
