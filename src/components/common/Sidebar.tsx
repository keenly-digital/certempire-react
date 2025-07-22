// src/components/common/Sidebar.tsx
import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { NavLink } from 'react-router-dom';

// The props interface for the component (for mobile state)
interface SidebarProps {
  isOpen: boolean;
  onLogoutClick: () => void;
  onLinkClick: () => void; // Add this prop
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
  height: 93%;
  
  // This makes it a self-contained scrolling panel on desktop
  align-self: flex-start;
  position: sticky;
  top: 24px;
  
  // Responsive logic for mobile/tablet view
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    
    /* --- The Changes --- */
    top: 70px; /* 1. Start the sidebar 70px from the top (the header's height) */
    height: calc(100% - 70px); /* 2. Adjust height to fill the remaining screen */
    padding: 16px 0; /* 3. Use normal padding instead of the large top padding */
    /* --- End of Changes --- */
    
    width: 280px;
    margin: 0;
    border-radius: 0;
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    box-shadow: none;
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
  transition: all 0.10s ease-in-out;
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
    color: ${theme.colors.primary};
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
    background-color: ${({ theme }) => theme.colors.background};
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

// --- CORRECTED LOGOUT BUTTON ---
// It now correctly inherits all base styles from navItemStyles
const LogoutButton = styled.button`
  ${({ theme }) => navItemStyles({ theme })}
  
  // Add specific button resets
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
  background-color: transparent; // Ensure it starts transparent like NavLink
  border: none; // Reset default button border
`;

// 2. Accept the new prop in your component
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onLogoutClick, onLinkClick }) => {

  // 3. Create a new handler for the logout button
  const handleLogoutClick = () => {
    onLinkClick(); // Close the menu
    onLogoutClick(); // Open the dialog
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <NavList>
        {/* 4. Add the onClick handler to all NavLinks */}
        <StyledNavLink to="/" end onClick={onLinkClick}>Dashboard</StyledNavLink>
        <StyledNavLink to="/orders" onClick={onLinkClick}>Orders</StyledNavLink>
        <StyledNavLink to="/downloads" onClick={onLinkClick}>Downloads</StyledNavLink>
        <StyledNavLink to="/addresses" onClick={onLinkClick}>Addresses</StyledNavLink>
        <StyledNavLink to="/account-details" onClick={onLinkClick}>Account Details</StyledNavLink>

        {/* 5. Use the new combined handler for the logout button */}
        <LogoutButton onClick={handleLogoutClick}>Log out</LogoutButton>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;