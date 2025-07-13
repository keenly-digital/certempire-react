// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PageHeader = styled.h2` font-size: 24px; font-weight: 600; margin-bottom: 24px; `;
const DownloadsTable = styled.div` background-color: white; border-radius: 16px; border: 1px solid #EAEAEA; overflow: hidden; `;
const Row = styled.div` display: grid; grid-template-columns: 3fr 1fr 1fr 2fr; align-items: center; padding: 16px 24px; border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: none; } `;
const HeaderRow = styled(Row)` background-color: #fafafa; font-weight: 600; color: #333; `;
const DataCell = styled.div` color: #555; `;
const ButtonContainer = styled.div` display: flex; gap: 12px; justify-content: flex-end; `;
const PrimaryButton = styled(Link)` display: inline-block; background-color: #2c2c54; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; `;
const SecondaryButton = styled(Link)` display: inline-block; background-color: white; color: #2c2c54; border: 1px solid #2c2c54; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;`;
const MessageContainer = styled.div` padding: 40px; text-align: center; color: #757575; background-color: white; border-radius: 12px; border: 1px solid #EAEAEA; `;

const DownloadsPage = () => {
  const { user } = useUser();

  // LOG 1: Log user object every render
  console.log('[DownloadsPage] Rendered. user:', user);

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // LOG 2: useEffect triggered
    console.log('[DownloadsPage] useEffect triggered. user:', user);

    if (!user || !user.id) {
      // LOG 3: No user, skipping API call
      console.log('[DownloadsPage] No user or user.id, skipping fetch.');
      setIsLoading(false);
      return;
    }

    const fetchDownloads = async () => {
      // LOG 4: About to fetch downloads
      console.log('[DownloadsPage] Fetching downloads for user:', user.id);

      setIsLoading(true);

      try {
        const url = 'https://kxbjsyuhceggsyvxdkof.supabase.co/functions/v1/get-wc-data';
        const body = {
          endpoint: 'downloads',
          user_id: user.id,
        };
        // LOG 5: Outbound fetch details
        console.log('[DownloadsPage] Fetch POST:', url, body);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        // LOG 6: Raw response status
        console.log('[DownloadsPage] Fetch response status:', response.status);

        const data = await response.json();

        // LOG 7: Raw data from API
        console.log('[DownloadsPage] Data from API:', data);

        setFiles(data || []);
        // LOG 8: setFiles called with:', data || []
      } catch (error) {
        // LOG 9: Fetch error
        console.error('[DownloadsPage] Fetch ERROR:', error);
        setFiles([]);
      } finally {
        setIsLoading(false);
        // LOG 10: Fetch completed, isLoading false
        console.log('[DownloadsPage] Fetch completed, isLoading:', false);
      }
    };

    fetchDownloads();
  }, [user]);

  // LOG 11: Current files state before render
  console.log('[DownloadsPage] Current files before render:', files);

  if (isLoading) {
    // LOG 12: Show loading
    console.log('[DownloadsPage] RENDER: Loading...');
    return <MessageContainer>Loading your downloads...</MessageContainer>;
  }
  if (!user) {
    // LOG 13: Show login message
    console.log('[DownloadsPage] RENDER: Not logged in.');
    return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  }
  if (!files.length) {
    // LOG 14: No downloads
    console.log('[DownloadsPage] RENDER: No files to show.');
    return (
      <MessageContainer style={{ border: 'none', borderRadius: 0 }}>
        You have no available downloads.
      </MessageContainer>
    );
  }

  // LOG 15: Rendering downloads table
  console.log('[DownloadsPage] RENDER: Rendering downloads table, files:', files);

  return (
    <div>
      <PageHeader>Downloads</PageHeader>
      <DownloadsTable>
        <HeaderRow>
          <DataCell>Product</DataCell>
          <DataCell>Downloads Remaining</DataCell>
          <DataCell>Expires</DataCell>
          <DataCell style={{ textAlign: 'right' }}>Actions</DataCell>
        </HeaderRow>
        {files.map((file: any) => (
          <Row key={file.id}>
            <DataCell>{file.filename || file.name}</DataCell>
            <DataCell>{file.downloads_remaining || '∞'}</DataCell>
            <DataCell>{file.access_expires || 'Never'}</DataCell>
            <DataCell>
              <ButtonContainer>
                <PrimaryButton to="#">Download</PrimaryButton>
                <SecondaryButton to={`/practice/${file.id}`}>Practice</SecondaryButton>
              </ButtonContainer>
            </DataCell>
          </Row>
        ))}
      </DownloadsTable>
    </div>
  );
};

export default DownloadsPage;