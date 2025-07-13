// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

type File = {
  id: string;
  filename: string;
  downloads_remaining: string | number; 
  access_expires: string;
};

// --- Styled Components ---
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
  console.log('--- DownloadsPage component re-rendered ---');

  const { user, isLoading: isUserLoading } = useUser();
  const [files, setFiles] = useState<File[]>([]);
  const [isPageLoading, setPageLoading] = useState(true);

  // Log current state values on each render
  console.log('Current State:', { user, isUserLoading, files, isPageLoading });

  useEffect(() => {
    console.log('EFFECT: Triggered. Dependencies changed.', { isUserLoading, user });

    const getPurchasedFiles = async () => {
      console.log('EFFECT -> getPurchasedFiles: Starting fetch...');

      if (!user || !user.simulation_user_id) {
        console.log('EFFECT -> getPurchasedFiles: Aborting fetch, no user or user ID found.');
        setPageLoading(false);
        return;
      }
      
      setPageLoading(true);
      try {
        console.log(`EFFECT -> getPurchasedFiles: Querying 'user_purchases' for user_id: ${user.simulation_user_id}`);
        const { data: purchases, error: purchaseError } = await supabase
          .from('user_purchases')
          .select('file_id')
          .eq('user_id', user.simulation_user_id);

        if (purchaseError) throw purchaseError;
        
        console.log('EFFECT -> getPurchasedFiles: Received purchase data:', purchases);

        if (!purchases || purchases.length === 0) {
          console.log('EFFECT -> getPurchasedFiles: No purchases found for this user.');
          setFiles([]);
          return;
        }

        const fileIds = purchases.map(p => p.file_id);
        console.log('EFFECT -> getPurchasedFiles: Extracted file IDs:', fileIds);
        
        console.log(`EFFECT -> getPurchasedFiles: Querying 'files' table for ${fileIds.length} ID(s).`);
        const { data: fileData, error: fileError } = await supabase
          .from('files')
          .select('id, filename')
          .in('id', fileIds);

        if (fileError) throw fileError;
        
        console.log('EFFECT -> getPurchasedFiles: Received file data:', fileData);

        const filesWithPlaceholders = (fileData || []).map(file => ({
          ...file,
          downloads_remaining: '∞',
          access_expires: 'Never',
        }));
        
        console.log('EFFECT -> getPurchasedFiles: Setting final files state:', filesWithPlaceholders);
        setFiles(filesWithPlaceholders);

      } catch (error) {
        console.error('EFFECT -> getPurchasedFiles: An error occurred during fetch:', error);
        setFiles([]);
      } finally {
        console.log('EFFECT -> getPurchasedFiles: Fetch process finished.');
        setPageLoading(false);
      }
    };

    if (!isUserLoading) {
      console.log('EFFECT: User context is loaded. Calling getPurchasedFiles.');
      getPurchasedFiles();
    } else {
      console.log('EFFECT: User context is still loading. Waiting...');
    }
  }, [isUserLoading, user]);

  if (isUserLoading || isPageLoading) {
    console.log('RENDER: Showing "Loading your downloads..." message.');
    return <MessageContainer>Loading your downloads...</MessageContainer>;
  }
  
  if (!user) {
    console.log('RENDER: Showing "Please log in" message.');
    return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  }
  
  console.log(`RENDER: Preparing to display ${files.length} file(s).`);
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
        {files.length > 0 ? files.map((file) => (
          <Row key={file.id}>
            <DataCell>{file.filename}</DataCell>
            <DataCell>{file.downloads_remaining}</DataCell>
            <DataCell>{file.access_expires}</DataCell>
            <DataCell>
              <ButtonContainer>
                <PrimaryButton to="#">Download</PrimaryButton>
                <SecondaryButton to={`/practice/${file.id}`}>
                  Practice
                </SecondaryButton>
              </ButtonContainer>
            </DataCell>
          </Row>
        )) : (
            <MessageContainer style={{border: 'none', borderRadius: 0}}>You have no available downloads.</MessageContainer>
        )}
      </DownloadsTable>
    </div>
  );
};

export default DownloadsPage;