// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

type File = {
  id: string;
  filename: string;
};

// --- Styled Components ---
const PageHeader = styled.h2` font-size: 24px; font-weight: 600; margin-bottom: 24px; `;
const DownloadsTable = styled.div` background-color: white; border-radius: 16px; border: 1px solid #EAEAEA; overflow: hidden; `;
const Row = styled.div` display: grid; grid-template-columns: 3fr 2fr; align-items: center; padding: 16px 24px; border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: none; } `;
const HeaderRow = styled(Row)` background-color: #fafafa; font-weight: 600; color: #333; `;
const DataCell = styled.div` color: #555; `;
const ButtonContainer = styled.div` display: flex; gap: 12px; justify-content: flex-end; `;
const PrimaryButton = styled(Link)` display: inline-block; background-color: #2c2c54; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; `;
const SecondaryButton = styled(Link)` display: inline-block; background-color: white; color: #2c2c54; border: 1px solid #2c2c54; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;`;
const MessageContainer = styled.div` padding: 40px; text-align: center; color: #757575; background-color: white; border-radius: 12px; border: 1px solid #EAEAEA; `;

const DownloadsPage = () => {
  // We now get both the user and the isLoading status from our context
  const { user, isLoading: isUserLoading } = useUser();
  const [files, setFiles] = useState<File[]>([]);
  const [isPageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const getPurchasedFiles = async () => {
      // We must have a user and their Supabase ID to continue
      if (!user || !user.simulation_user_id) {
        setPageLoading(false);
        return;
      }
      
      try {
        const { data: purchases, error: purchaseError } = await supabase
          .from('user_purchases')
          .select('file_id')
          .eq('user_id', user.simulation_user_id);

        if (purchaseError) throw purchaseError;
        if (!purchases || purchases.length === 0) {
          setFiles([]);
          return;
        }

        const fileIds = purchases.map(p => p.file_id);
        
        const { data: fileData, error: fileError } = await supabase
          .from('files')
          .select('id, filename')
          .in('id', fileIds);

        if (fileError) throw fileError;
        
        setFiles(fileData || []);

      } catch (error) {
        console.error('Error fetching purchased files:', error);
        setFiles([]);
      } finally {
        setPageLoading(false);
      }
    };

    // This is the key change: We wait for the User Context to finish loading.
    // Once isUserLoading is false, we know if we have a user or not, and we can proceed.
    if (!isUserLoading) {
      getPurchasedFiles();
    }
  }, [isUserLoading, user]); // The effect re-runs if the loading status or user changes

  // Show a generic loading message while the context is loading or the page is fetching
  if (isUserLoading || isPageLoading) return <MessageContainer>Loading your downloads...</MessageContainer>;
  
  // Show this if the context has loaded but there is no user
  if (!user) return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  
  return (
    <div>
      <PageHeader>Downloads</PageHeader>
      <DownloadsTable>
        <HeaderRow>
          <DataCell>Product</DataCell>
          <DataCell style={{ textAlign: 'right' }}>Actions</DataCell>
        </HeaderRow>
        {files.length > 0 ? files.map((file) => (
          <Row key={file.id}>
            <DataCell>{file.filename}</DataCell>
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