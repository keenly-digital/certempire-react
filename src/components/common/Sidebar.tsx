// src/components/common/Sidebar.tsx
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

// The props interface for the component (for mobile state)
interface SidebarProps {
  isOpen: boolean;
}

// This container now matches the floating panel design from your Flutter code
const SidebarContainer = styled.aside<{ isOpen: boolean; }>`
  // This is the main container from your Flutter code's BoxDecoration
  width: 255px;
  margin: 24px; // Gives the "floating" effect
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); // The BoxShadow
  border: 1.2px solid #EAEAEA; // Border.all(color: Colors.grey.shade200)
  
  // This makes it a self-contained scrolling panel
  align-self: flex-start;
  position: sticky;
  top: 24px;
  
  // Responsive logic for mobile view
  @media (max-width: 650px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    margin: 0; // No margin on mobile
    border-radius: 0; // No rounded corners on mobile
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
  }
`;

// This acts as the ListView, holding the navigation items
const NavList = styled.nav`
  display: flex;
  flex-direction: column;
`;

// This combines the styles of the InkWell and AnimatedContainer
const StyledNavLink = styled(NavLink)`
  /* --- Base (inactive) item styles --- */
  color: rgba(0, 0, 0, 0.85);
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.14px;
  padding: 13px 22px;
  margin: 0;
  border: 1.3px solid transparent; // Reserve space for the active border
  border-bottom: 1px solid #f5f5f5; // The Divider between items
  position: relative; // For the click effect
  overflow: hidden; // For the click effect
  
  /* This replicates the AnimatedContainer properties */
  transition: all 0.22s ease-in-out;

  /* --- Styles for the ACTIVE link --- */
  &.active {
    background-color: rgba(44, 44, 84, 0.09); // themeBlue.withOpacity(0.09)
    color: #2c2c54; // themeBlue
    font-weight: 600;
    margin: 3px 6px; // The inset margin
    border: 1.3px solid rgba(44, 44, 84, 0.21); // The active border
    border-radius: 13px;
  }
  
  /* --- Replicating the InkWell click effect --- */
  &:active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 234, 254, 0.4); /* A light purple/pinkish ripple */
    animation: ripple 0.3s ease-in;
  }

  @keyframes ripple {
    from {
      opacity: 1;
      transform: scale(0);
    }
    to {
      opacity: 0;
      transform: scale(2);
    }
  }
`;

const LogoutButton = styled.button`
  /* Styling to match the inactive NavLink */
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  letter-spacing: 0.14px;
  padding: 13px 22px;
  font-size: 16px;
  font-family: inherit;
  background: none;
  border: none;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  text-align: left;
  width: 100%;
`;
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { logout } = useUser(); // <-- Get the logout function from our context

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <NavList>
        <StyledNavLink to="/" end>Dashboard</StyledNavLink>
        <StyledNavLink to="/orders">Orders</StyledNavLink>
        <StyledNavLink to="/downloads">Downloads</StyledNavLink>
        <StyledNavLink to="/addresses">Addresses</StyledNavLink>
        <StyledNavLink to="/account-details">Account Details</StyledNavLink>
        <LogoutButton onClick={() => alert('Logout clicked!')}>Log out</LogoutButton>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar