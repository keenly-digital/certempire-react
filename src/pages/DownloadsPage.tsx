// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';

// --- Helper for UI ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString.replace(' ', 'T'));
  if (isNaN(date.getTime())) return 'Never'; // Added check for invalid date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// --- Styled Components for Single Download Card ---

const SingleDownloadCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 36px 54px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 32px #00000014;
  margin: 40px auto 24px auto;
  justify-content: flex-start;
  max-width: 800px;
  min-height: 180px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px;
    text-align: center;
  }
`;

const ProductImage = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  margin-right: 34px;
  background: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 2px 14px #0000001a;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 24px;
    width: 160px;
    height: 160px;
  }
`;

const CardBadge = styled.div<{ $isPrimary?: boolean }>`
  position: absolute;
  top: ${({ $isPrimary }) => ($isPrimary ? '8px' : '18px')};
  left: ${({ $isPrimary }) => ($isPrimary ? '8px' : 'auto')};
  right: ${({ $isPrimary }) => ($isPrimary ? 'auto' : '28px')};
  background: ${({ theme, $isPrimary }) => ($isPrimary ? '#45ccbe' : theme.colors.button)};
  color: ${({ theme, $isPrimary }) => ($isPrimary ? '#fff' : theme.colors.primary)};
  font-weight: 700;
  font-size: 12px;
  padding: 3px 9px;
  border-radius: 7px;
  z-index: 2;
  box-shadow: 0 1px 4px #0000001a;

  @media (max-width: 768px) {
    top: 16px;
    left: ${({ $isPrimary }) => ($isPrimary ? '16px' : 'auto')};
    right: ${({ $isPrimary }) => ($isPrimary ? 'auto' : '16px')};
  }
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const MetaInfo = styled.div`
  color: #6b6b8d;
  font-size: 15px;
  margin-bottom: 7px;
  font-weight: 500;
  display: flex;
  flex-wrap: wrap;
  gap: 0 18px;

  b {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
`;

const OrderInfo = styled.div`
  color: #444;
  font-size: 13px;
  margin: 6px 0 0 0;
`;

const ActionButtons = styled.div`
  margin-top: 19px;
  display: flex;
  gap: 14px;

  @media (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
    align-items: stretch;
  }
`;

const FooterInfo = styled.div`
  margin-top: 16px;
  color: #a0a0c0;
  font-size: 14px;
`;

const HelpLinks = styled.div`
  margin-top: 22px;
  text-align: center;
  color: #6b6b8d;
  font-size: 15px;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    font-weight: 500;
  }
`;

// --- Original Table Styles ---
const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;
const DownloadsTable = styled.div`
  /* On mobile, this becomes a simple flex container to space out the cards */
  display: flex;
  flex-direction: column;
  gap: 16px; /* This creates a nice space between each card */
`;
const Row = styled.div`
  /* Keep original desktop styles */
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 2fr;
  align-items: center;
  padding: 16px 24px;

  /* On desktop, the row is inside a table with borders */
  @media (min-width: 769px) {
    border-bottom: 1px solid #f0f0f0;
    &:last-child {
      border-bottom: none;
    }
  }

  /* On mobile, each row becomes its own card */
  @media (max-width: 768px) {
    display: block;
    padding: 16px;
    background-color: white;
    border-radius: 16px;
    border: 1px solid #EAEAEA;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
`;

const HeaderRow = styled(Row)`
  background-color: #fafafa;
  font-weight: 600;
  color: #333;

  @media (max-width: 768px) {
    display: none; // Hide the header on mobile
  }
`;
const DataCell = styled.div`
  color: #555;

  @media (max-width: 768px) {
    display: flex; // Arrange label and content
    justify-content: space-between; // Push them to opposite ends
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5; // Separator for data points

    // Use the ::before pseudo-element to display the label
    &::before {
      content: attr(data-label); // Get content from the data-label attribute
      font-weight: 600;
      color: #333;
      padding-right: 16px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column; // Stack buttons vertically on very small screens
    align-items: stretch; // Make buttons full-width
    
    // On slightly larger mobile screens, keep them in a row
    @media (min-width: 400px) {
      flex-direction: row;
      align-items: center;
    }
  }
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
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: 0.5px solid rgb(177, 177, 255);
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    }
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
  const { user } = useUser();
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
        const payload = {
          method: 'GET',
          endpoint: 'cwc/downloads',
          user_id: user.id
        };

        const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
          body: payload,
        });

        if (error) throw error;

        if (apiResponse && apiResponse.Success && Array.isArray(apiResponse.Data)) {
          setDownloads(apiResponse.Data);
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
      {allDownloads.length === 1 ? (
        <SingleDownloadCard>
          <CardBadge $isPrimary>Verified Purchase</CardBadge>
          <CardBadge>Premium Product</CardBadge>
          <ProductImage
            src={allDownloads[0].product_image || 'https://cdn-icons-png.flaticon.com/512/337/337946.png'}
            alt={allDownloads[0].product_name}
            onError={e => {
              const img = e.target as HTMLImageElement;
              img.onerror = null;
              img.src = 'https://cdn-icons-png.flaticon.com/512/337/337946.png';
            }}
          />
          <InfoContainer>
            <ProductName>{allDownloads[0].product_name}</ProductName>
            <MetaInfo>
              <span><b>Downloads Left:</b> {allDownloads[0].downloads_remaining}</span>
              <span><b>Expires:</b> {formatDate(allDownloads[0].access_expires)}</span>
              <span><b>Format:</b> Digital</span>
            </MetaInfo>
            <OrderInfo>
              Order #: <b>{allDownloads[0].order_id}</b>
            </OrderInfo>
            <ActionButtons>
              <PrimaryButton href={allDownloads[0].download_url} target="_blank">Download</PrimaryButton>
              {allDownloads[0].supabase_file_id && (
                <SecondaryButton to={`/practice/${allDownloads[0].supabase_file_id}`}>Practice</SecondaryButton>
              )}
            </ActionButtons>
            <FooterInfo>
              <span style={{ marginRight: 8 }}>Trusted by 20,000+ students worldwide</span>
              <span style={{ fontSize: 13 }}>| Secure SSL Download</span>
            </FooterInfo>
          </InfoContainer>
        </SingleDownloadCard>
      ) : (
        <DownloadsTable>
          <HeaderRow>
            <DataCell>Product</DataCell>
            <DataCell>Downloads Remaining</DataCell>
            <DataCell>Expires</DataCell>
            <DataCell style={{ textAlign: 'right' }}>Actions</DataCell>
          </HeaderRow>
          {allDownloads.map((item: any) => (
            <Row key={item.download_id}>
              <DataCell data-label="Product">{item.product_name}</DataCell>
              <DataCell data-label="Downloads Remaining">{item.downloads_remaining}</DataCell>
              <DataCell data-label="Expires">{formatDate(item.access_expires)}</DataCell>

              {/* 👇 This is the corrected section */}
              <DataCell data-label="Actions">
                <ButtonContainer>
                  <PrimaryButton href={item.download_url} target="_blank">Download</PrimaryButton>
                  {item.supabase_file_id && (
                    <SecondaryButton to={`/practice/${item.supabase_file_id}`}>Practice</SecondaryButton>
                  )}
                </ButtonContainer>
              </DataCell>

            </Row>
          ))}
        </DownloadsTable>
      )}
      <HelpLinks>
        Need help?{' '}
        <a href="/contact">Contact Support</a>
        {' '}|{' '}
        <a href="/faq">FAQ</a>
      </HelpLinks>
    </div>
  );
};

export default DownloadsPage;
