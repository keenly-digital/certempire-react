// src/components/common/Header.tsx
import React from 'react';
import styled from 'styled-components';
import logoWhite from '../../assets/images/logo-white.png';

// The props interface now includes a function for the menu click
interface HeaderProps {
  onMenuClick: () => void;
}

const HeaderContainer = styled.header`
  background-color: #2c2c54; 
  height: 80px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Logo = styled.img`
  height: 45px;
`;

const WebsiteButton = styled.button`
  background-color: #F7E5FF;
  color: #2c2c54;
  border: 1px solid #F7E5FF;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
  
  @media (max-width: 650px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  
  @media (max-width: 650px) {
    display: block;
    z-index: 1100; /* Ensure it's on top */
  }
`;

// The component now accepts the onMenuClick prop
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <HeaderContainer>
      <Logo src={logoWhite} alt="Cert Empire" />
      <WebsiteButton>
        &larr; Main Website
      </WebsiteButton>
      {/* The onClick now calls the function passed from the parent */}
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
            stroke="white" 
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