// src/pages/DashboardPage.tsx
import React from 'react';
import styled from 'styled-components';
//import { PiBell, PiEnvelope, PiFlag } from 'react-icons/pi'; // Using placeholder icons for now

// --- Styled Components ---

const WelcomeHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

// This main container will use CSS Grid for the two-column layout
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* Left column is twice as wide as the right */
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr; /* Stack columns on smaller screens */
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// --- The "Continue Studying" Card ---
const StudyCard = styled.div`
  background: linear-gradient(105deg, #4e54c8, #8f94fb); /* A nice blue/purple gradient */
  color: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const StudySubHeader = styled.p`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const StudyCourseTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ProgressBarContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  height: 12px;
  margin-bottom: 8px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: white;
  border-radius: 8px;
`;

const ProgressText = styled.p`
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 24px;
`;

const StudyButton = styled.button`
  background-color: white;
  color: #2c2c54;
  border: none;
  border-radius: 10px;
  padding: 14px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

// --- The Dashboard Page Component ---

const DashboardPage = () => {
  const userName = "Zohaib Khalid"; 
  const progress = (35 / 150) * 100; // Calculate progress percentage

  return (
    <div>
      <WelcomeHeader>Welcome back, {userName}</WelcomeHeader>
      <DashboardGrid>
        <MainColumn>
          {/* The new "Continue Studying" card */}
          <StudyCard>
            <StudySubHeader>CONTINUE WHERE YOU LEFT OFF</StudySubHeader>
            <StudyCourseTitle>MB-330: Microsoft Dynamics 365 Supply Chain Management</StudyCourseTitle>
            <ProgressBarContainer>
              <ProgressBarFill progress={progress} />
            </ProgressBarContainer>
            <ProgressText>35/150</ProgressText>
            <StudyButton>Continue Studying</StudyButton>
          </StudyCard>

          {/* Placeholders for the smaller cards below */}
        </MainColumn>

        <RightColumn>
          {/* Placeholder for the "Updates & Notifications" card */}
        </RightColumn>
      </DashboardGrid>
    </div>
  );
};

export default DashboardPage;