// src/components/common/Sidebar.tsx
import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { NavLink } from 'react-router-dom';

// The props interface for the component (for mobile state)
interface SidebarProps {
  isOpen: boolean;
  onLogoutClick: () => void;
}

// This container now matches the floating panel design from your Flutter code
const SidebarContainer = styled.aside<{ isOpen: boolean; }>`
  width: 255px;
  flex-shrink: 0; 
  margin: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); // Exact shadow from Flutter
  border: 1.2px solid ${({ theme }) => theme.colors.lightGrey};
  padding: 8px;
  
  // This makes it a self-contained scrolling panel on desktop
  align-self: flex-start;
  position: sticky;
  top: 24px;
  
  // Responsive logic for mobile/tablet view
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 280px;
    margin: 0;
    border-radius: 0;
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    box-shadow: none;
    padding: 0;
    background-color: ${({ theme }) => theme.colors.surface};
    border: none;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;

  /* Remove border from the last item in the list */
  > *:last-child {
    border-bottom: none;
  }
`;

// Base styles for both NavLink and Button to ensure they look the same
const navItemStyles = ({ theme }: { theme: DefaultTheme }) => `
  display: block;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.22s ease-in-out;
  border-bottom: 1px solid #f0f0f0; /* The Divider */

  /* Default (inactive) state styles */
  color: rgba(28, 36, 75, 0.85); /* textPrimary with opacity */
  font-weight: 500;
  padding: 13px 22px;
  border-radius: 13px;
  border-left: 1.3px solid transparent;
  border-right: 1.3px solid transparent;
  border-top: 1.3px solid transparent;
  margin: 3px 0;

  &:hover {
    background-color: ${theme.colors.background};
  }

  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    padding: 16px 24px;
  }
`;

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => navItemStyles({ theme })}

  /* --- Styles for the ACTIVE link, matching Flutter's AnimatedContainer --- */
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(45, 22, 132, 0.09); // themeBlue.withOpacity(0.09)
    font-weight: 600;
    margin: 3px 6px; // Inset margin for active state
    border: 1.3px solid rgba(45, 22, 132, 0.21); // Active border
  }

  @media (max-width: 768px) {
    &.active {
      margin: 0;
      border-left: 1.3px solid transparent;
      border-right: 1.3px solid transparent;
      border-top: 1.3px solid transparent;
      background-color: ${({ theme }) => theme.colors.button};
    }
  }
`;

const LogoutButton = styled.button`
  ${({ theme }) => navItemStyles({ theme })}
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
  border-top: 1.3px solid transparent;
  border-left: 1.3px solid transparent;
  border-right: 1.3px solid transparent;
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLogoutClick }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <NavList>
        <StyledNavLink to="/" end>Dashboard</StyledNavLink>
        <StyledNavLink to="/orders">Orders</StyledNavLink>
        <StyledNavLink to="/downloads">Downloads</StyledNavLink>
        <StyledNavLink to="/addresses">Addresses</StyledNavLink>
        <StyledNavLink to="/account-details">Account Details</StyledNavLink>
        <LogoutButton onClick={onLogoutClick}>Log out</LogoutButton>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
