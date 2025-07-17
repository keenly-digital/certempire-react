
import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ConfirmationDialog from './ConfirmationDialog';
import { useUser } from '../../context/UserContext';

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;

  @media (min-width: 769px) {
    padding-right: 24px;
  }
`;

const PageContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0; /* <-- THIS IS THE CRITICAL FIX FOR THE CONTAINER */
`;

const ContentContainer = styled.main`
  flex-grow: 1; 
  padding: 24px 32px;

  @media (max-width: 950px) {
    padding: 24px;
  }
  
  @media (max-width: 650px) {
    padding: 16px;
  }
`;

const Overlay = styled.div<{ isOpen: boolean; }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    z-index: 999;
  }
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { logout } = useUser();

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };
  
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    window.location.href = 'https://www.certempire.com';
  };

  return (
    <AppShell>
      <Header onMenuClick={handleMenuToggle} />
      <MainWrapper>
        <Sidebar isOpen={isMenuOpen} onLogoutClick={() => setLogoutDialogOpen(true)} />
        <Overlay isOpen={isMenuOpen} onClick={handleCloseMenu} />
        <PageContentWrapper>
          <ContentContainer>
            {children}
          </ContentContainer>
          <Footer />
        </PageContentWrapper>
      </MainWrapper>

      <ConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </AppShell>
  );
};

export default MainLayout;