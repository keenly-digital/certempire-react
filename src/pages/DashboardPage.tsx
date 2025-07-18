// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';


type ProgressRecord = {
  last_viewed_file_id: string;
  product_name: string;
  last_viewed_question_index: number;
  total_questions: number;
};

// --- SVG Icons (Business logic untouched) ---
const IconMedal = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>;
const IconListChecks = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-2h-2v2h2zm0-4h-2v2h2V6.5zm0-4h-2v2h2V3.5zM2 16h8v-2H2v2z" /></svg>;
const IconFlag = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" /></svg>;
const IconShoppingBag = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2h8V8h2v12z" /></svg>;
const IconCheckCircle = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>;
const IconEnvelope = ({ color = 'currentColor' }) => <svg width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>;

// --- Styled Components (UI/UX Updated) ---
const WelcomeHeader = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 24px;
`;

const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: flex-start;
  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div``;


const StudyCard = styled.div`
  background: ${({ theme }) => theme.gradients.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.button};
`;


const StudySubHeader = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const StudyCourseTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ProgressBarContainer = styled.div`
  flex-grow: 1;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.textOnPrimary};
  border-radius: 10px;
`;

const StudyButton = styled.button`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 14px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .title {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 15px;
    font-weight: 500;
  }
  .value {
    font-size: 28px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  .icon {
    font-size: 24px;
  }
`;

const UpdatesCard = styled(SummaryCard)`
  /* Inherits styles from SummaryCard */
`;

const UpdatesHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const UpdateItem = styled.div<{ $isUnread?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  &:last-child {
    border-bottom: none;
  }
  .icon {
    font-size: 24px;
  }
  .title {
    font-weight: ${({ $isUnread }) => ($isUnread ? '600' : '500')};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 15px;
  }
  .subtitle {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 13px;
    margin-top: 4px;
  }
  .unread-dot {
    height: 8px;
    width: 8px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    margin-left: auto;
  }
`;


const DashboardPage = () => {
  // --- Business Logic (Untouched) ---
  const { user } = useUser();
  const [displayName, setDisplayName] = useState('there');
const [lastStudySession, setLastStudySession] = useState<ProgressRecord | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserName = async () => {
      try {
        const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
          body: { 
            method: 'GET', 
            endpoint: `cwc/customer/${user.id}`, 
            user_id: user.id 
          },
        });
        if (error) throw error;
        if (apiResponse && apiResponse.Success && apiResponse.Data.first_name) {
          setDisplayName(apiResponse.Data.first_name);
        }
      } catch (err) {
        console.error("Error fetching user name for dashboard:", err);
      }
    };
    fetchUserName();
  }, [user]);

  // --- This entire block is new ---
useEffect(() => {
  if (!user) return;

  const fetchProgress = async () => {
    // Fetches the most recently updated progress record for the user
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single(); // .single() returns one object or null

    if (data) {
      setLastStudySession(data);
    }

    // Ignore the error when no row is found, as that's expected for new users
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user progress:", error);
    }
  };

  fetchProgress();
}, [user]); // Re-run when the user object is available

  // --- JSX (Untouched) ---
  return (
    <div>
      <WelcomeHeader>Welcome back, {displayName}!</WelcomeHeader>
      
      <DashboardLayout>
        <MainColumn>
          <StudyCard>
            <StudySubHeader>CONTINUE WHERE YOU LEFT OFF</StudySubHeader>
{lastStudySession && lastStudySession.total_questions > 0 ? (
  <>
    <StudyCourseTitle>{lastStudySession.product_name}</StudyCourseTitle>
    <ProgressWrapper>
      <ProgressBarContainer>
        <ProgressBarFill $progress={((lastStudySession.last_viewed_question_index + 1) / lastStudySession.total_questions) * 100} />
      </ProgressBarContainer>
      <p>
        {Math.round(((lastStudySession.last_viewed_question_index + 1) / lastStudySession.total_questions) * 100)}%
      </p>
    </ProgressWrapper>
    <StudyButton
      as={Link}
      to={`/practice/${lastStudySession.last_viewed_file_id}`}
      state={{ startIndex: lastStudySession.last_viewed_question_index }}
    >
      Continue Studying
    </StudyButton>
  </>
) : (
  <>
    <StudyCourseTitle>No recent activity</StudyCourseTitle>
    <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '16px' }}>
      Your progress will appear here once you start a practice session.
    </p>
  </>
)}
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
