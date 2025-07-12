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
  const { user } = useUser();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // This is the updated function declaration style
    const getPurchasedFiles = async () => {
      // This check now happens first, fixing the "possibly 'null'" error
      if (!user || !user.simulation_user_id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data: purchases, error: purchaseError } = await supabase
          .from('user_purchases')
          .select('file_id')
          .eq('user_id', user.simulation_user_id); // This is now safe to call

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
        
        const filesWithPlaceholders = (fileData || []).map(file => ({
          ...file,
          downloads_remaining: '∞',
          access_expires: 'Never',
        }));
        setFiles(filesWithPlaceholders);

      } catch (error) {
        console.error('Error fetching purchased files:', error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    getPurchasedFiles();
  }, [user]); // The effect correctly depends on the user object

  if (isLoading) return <MessageContainer>Loading your downloads...</MessageContainer>;
  if (!user) return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  
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