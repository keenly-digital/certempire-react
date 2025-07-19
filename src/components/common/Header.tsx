// src/components/common/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logoWhite from '../../assets/images/logo-white.png';

// The props interface now includes a function for the menu click
interface HeaderProps {
  onMenuClick: () => void;
}

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 70px;
  /* Responsive padding for different screen sizes */
  padding: 0 32px;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.textOnPrimary};
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 24px;
  }

  @media (max-width: 650px) {
    padding: 0 16px;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Logo = styled.img`
  /* Using max-height and object-fit to prevent distortion and pixelation */
  max-height: 38px;
  width: auto;
  object-fit: contain;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 650px) {
    max-height: 34px;
  }
`;

const WebsiteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.button};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e8d9f5; /* A slightly darker shade for hover */
  }
  
  /* Hide button on tablets and phones */
  @media (max-width: 768px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  /* Hide by default */
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textOnPrimary};
  cursor: pointer;
  padding: 0;
  
  /* Show only on tablets and phones */
  @media (max-width: 768px) {
    display: block;
    z-index: 1100; /* Ensure it's on top of the overlay */
  }
`;

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <HeaderContainer>
      {/* The logo is now wrapped in a Link component */}
      <LogoLink to="/">
        <Logo src={logoWhite} alt="Cert Empire Home" />
      </LogoLink>

      <WebsiteButton>
        &larr; Main Website
      </WebsiteButton>

      <HamburgerButton onClick={onMenuClick}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HamburgerButton>
    </HeaderContainer>
  );
};

export default Header;
