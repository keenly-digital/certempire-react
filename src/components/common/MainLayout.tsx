// src/components/common/MainLayout.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

const PageContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.main`
  flex-grow: 1; 
  padding: 24px 32px;
  background-color: #f8f9fd;
  
  @media (max-width: 650px) {
    padding: 16px;
  }
`;

const Overlay = styled.div<{ isOpen: boolean; }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 999;
  
  @media (min-width: 651px) {
    display: none;
  }
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // This state now controls the mobile menu
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <AppShell>
      {/* 1. Pass the toggle function to the Header */}
      <Header onMenuClick={handleMenuToggle} />
      <MainWrapper>
        {/* 2. Pass the open/closed state to the Sidebar */}
        <Sidebar isOpen={isMenuOpen} />
        <Overlay isOpen={isMenuOpen} onClick={handleMenuToggle} />
        <PageContentWrapper>
          <ContentContainer>
            {children}
          </ContentContainer>
          <Footer />
        </PageContentWrapper>
      </MainWrapper>
    </AppShell>
  );
};

export default MainLayout;