// src/pages/DashboardPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';

// --- SVG Icons (replaces the react-icons library) ---
const IconMedal = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>;
const IconListChecks = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-2h-2v2h2zm0-4h-2v2h2V6.5zm0-4h-2v2h2V3.5zM2 16h8v-2H2v2z" /></svg>;
const IconFlag = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" /></svg>;
const IconShoppingBag = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2h8V8h2v12z" /></svg>;
const IconCheckCircle = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>;
const IconEnvelope = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>;


// --- Styled Components ---
const WelcomeHeader = styled.h2` font-size: 24px; font-weight: 600; color: #333; margin-bottom: 24px; `;
const DashboardLayout = styled.div` display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: flex-start; @media (max-width: 950px) { grid-template-columns: 1fr; } `;
const MainColumn = styled.div` display: flex; flex-direction: column; gap: 24px; `;
const RightColumn = styled.div``;
const StudyCard = styled.div` background: #2c2c54; color: white; padding: 32px; border-radius: 16px; `;
const StudySubHeader = styled.p` color: rgba(255, 255, 255, 0.7); font-size: 12px; font-weight: bold; letter-spacing: 1.2px; margin-bottom: 8px; `;
const StudyCourseTitle = styled.h3` color: white; font-size: 22px; font-weight: bold; margin-bottom: 24px; `;
const ProgressWrapper = styled.div` display: flex; align-items: center; gap: 16px; margin-bottom: 24px; `;
const ProgressBarContainer = styled.div` flex-grow: 1; background-color: rgba(255, 255, 255, 0.2); border-radius: 10px; height: 10px; overflow: hidden; `;
const ProgressBarFill = styled.div<{ $progress: number }>` width: ${({ $progress }) => $progress}%; height: 100%; background-color: white; border-radius: 10px; `;
const StudyButton = styled.button` background-color: white; color: #2c2c54; border: none; border-radius: 10px; padding: 14px 24px; font-weight: bold; font-size: 16px; cursor: pointer; `;
const SummaryGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 20px; `;
const SummaryCard = styled.div` padding: 20px; background-color: white; border-radius: 16px; border: 1px solid #EAEAEA; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; .top-row { display: flex; justify-content: space-between; align-items: flex-start; } .title { color: #757575; font-size: 16px; font-weight: 500; } .value { font-size: 24px; font-weight: bold; color: #424242; } .icon { font-size: 24px; } `;
const UpdatesCard = styled.div` padding: 20px; background-color: white; border-radius: 16px; border: 1px solid #EAEAEA; `;
const UpdatesHeader = styled.h3` font-size: 18px; font-weight: bold; margin-bottom: 8px; `;
const UpdateItem = styled.div<{ $isUnread?: boolean }>` display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: none; } .icon { font-size: 24px; } .title { font-weight: ${({ $isUnread }) => ($isUnread ? 'bold' : '500')}; font-size: 15px; } .subtitle { color: #757575; font-size: 13px; margin-top: 4px; } .unread-dot { height: 8px; width: 8px; background-color: #2c2c54; border-radius: 50%; margin-left: auto; } `;

// --- The Main Page Component ---
const DashboardPage = () => {
  const { user } = useUser();
  const progress = (35 / 150) * 100;

  return (
    <div>
      <WelcomeHeader>Welcome back, {user?.name || 'there'}!</WelcomeHeader>
      
      <DashboardLayout>
        <MainColumn>
          <StudyCard>
            <StudySubHeader>CONTINUE WHERE YOU LEFT OFF</StudySubHeader>
            <StudyCourseTitle>MB-330: Microsoft Dynamics 365 Supply Chain Management</StudyCourseTitle>
            <ProgressWrapper>
              <ProgressBarContainer>
                <ProgressBarFill $progress={progress} />
              </ProgressBarContainer>
              <p>35/150</p>
            </ProgressWrapper>
            <StudyButton>Continue Studying</StudyButton>
          </StudyCard>

          <SummaryGrid>
            <SummaryCard>
              <div className="top-row"><span className="title">My Rewards</span><IconMedal color="#FFC107" /></div>
              <span className="value">2,500 Pts</span>
            </SummaryCard>
            <SummaryCard>
              <div className="top-row"><span className="title">Pending Tasks</span><IconListChecks color="#F44336" /></div>
              <span className="value">3 Tasks</span>
            </SummaryCard>
             <SummaryCard>
              <div className="top-row"><span className="title">Open Reports</span><IconFlag color="#FF9800" /></div>
              <span className="value">1 Report</span>
            </SummaryCard>
            <SummaryCard>
              <div className="top-row"><span className="title">Recent Purchase</span><IconShoppingBag color="#2196F3" /></div>
              <span className="value">DP-203</span>
            </SummaryCard>
          </SummaryGrid>
        </MainColumn>

        <RightColumn>
          <UpdatesCard>
            <UpdatesHeader>Updates & Notifications</UpdatesHeader>
            <UpdateItem $isUnread>
              <IconCheckCircle color="green" />
              <div>
                <p className="title">New Task Assigned</p>
                <p className="subtitle">Review "AZ-104" feedback</p>
              </div>
              <div className="unread-dot"></div>
            </UpdateItem>
            <UpdateItem>
              <IconEnvelope color="blue" />
              <div>
                <p className="title">Password Reset Successful</p>
                <p className="subtitle">Your password was changed</p>
              </div>
            </UpdateItem>
            <UpdateItem>
              <IconFlag color="red" />
              <div>
                <p className="title">Report #452 Resolved</p>
                <p className="subtitle">Your report has been addressed</p>
              </div>
            </UpdateItem>
          </UpdatesCard>
        </RightColumn>
      </DashboardLayout>
    </div>
  );
};

export default DashboardPage;