// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// --- Styled Components ---
const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const DownloadsTable = styled.div`
  background-color: white;
  border-radius: 16px;
  border: 1px solid #EAEAEA;
  overflow: hidden;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 2fr;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
`;

const HeaderRow = styled(Row)`
  background-color: #fafafa;
  font-weight: 600;
  color: #333;
`;

const DataCell = styled.div`
  color: #555;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const PrimaryButton = styled.a`
  display: inline-block;
  background-color: #2c2c54;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: #2c2c54;
  border: 1px solid #2c2c54;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
`;

const MessageContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: #757575;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #EAEAEA;
`;

// --- The Page Component ---
const DownloadsPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    const getPurchasedDownloads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://kxbjsyuhceggsyvxdkof.supabase.co/functions/v1/get-wc-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
  method: 'GET', // <-- Add this
  endpoint: 'cwc/downloads', 
  user_id: user.id 
}),
        });

        const data = await response.json();
        console.log("Downloads API response:", data);
        console.log(downloads);


        // The WooCommerce downloads API returns an array
  if (data && data.Success && Array.isArray(data.Data)) {
  setDownloads(data.Data);
} else {
  setDownloads([]);
}
      } catch (error) {
        setDownloads([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPurchasedDownloads();
  }, [user]);

  if (isLoading) {
    return <MessageContainer>Loading your downloads...</MessageContainer>;
  }

  if (!user) {
    return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  }

  const allDownloads = downloads;

  if (!downloads.length) {
    return (
      <MessageContainer style={{ border: 'none', borderRadius: 0 }}>
        You have no available downloads.
      </MessageContainer>
    );
  }

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
        {allDownloads.map((item: any) => (
          <Row key={item.download_id}>
            <DataCell>{item.product_name}</DataCell>
            <DataCell>{item.downloads_remaining}</DataCell>
            <DataCell>{item.access_expires}</DataCell>
            <DataCell>
              <ButtonContainer>
                <PrimaryButton href={item.download_url} target="_blank">
                  Download
                </PrimaryButton>
             {item.supabase_file_id && (
  <SecondaryButton to={`/practice/${item.supabase_file_id}`}>
    Practice
  </SecondaryButton>
)}
              </ButtonContainer>
            </DataCell>
          </Row>
        ))}
      </DownloadsTable>
    </div>
  );
};

export default DownloadsPage;