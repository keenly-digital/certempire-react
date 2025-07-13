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

// Update PrimaryButton to be a standard 'a' tag for external links
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
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // You should store your WordPress site URL in an environment variable
  const WP_SITE_URL = process.env.REACT_APP_WP_SITE_URL || 'https://your-wordpress-site.com';


  useEffect(() => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://kxbjsyuhceggsyvxdkof.supabase.co/functions/v1/get-wc-data',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              endpoint: 'orders',
              user_id: user.id, // WordPress user ID
            }),
          }
        );
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error('[DownloadsPage] Error fetching orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (isLoading) {
    return <MessageContainer>Loading your downloads...</MessageContainer>;
  }

  if (!user) {
    return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  }

  // This business logic remains unchanged, as requested.
  const allOrderItems =
    orders?.flatMap((order: any) =>
      (order.line_items || []).map((item: any) => ({
        ...item,
        orderId: order.id, // This gives us the order ID for each item
        expires: 'Never', // Placeholder
        downloads_remaining: '∞', // Placeholder
      }))
    ) || [];

  if (!allOrderItems.length) {
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
        {allOrderItems.map((item: any) => (
          <Row key={`${item.orderId}-${item.id}`}>
            <DataCell>{item.name}</DataCell>
            <DataCell>{item.downloads_remaining}</DataCell>
            <DataCell>{item.expires}</DataCell>
            <DataCell>
              <ButtonContainer>
                {/*
                  FIX 1: "View Order" button now links to the order page on your main site.
                  This is the most reliable way to let users download without changing the API call.
                */}
                <PrimaryButton
                  href={`${WP_SITE_URL}/my-account/view-order/${item.orderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Order
                </PrimaryButton>

                {/*
                  FIX 2: "Practice" button is now fully functional, assuming you've set up
                  the '/practice/:productId' route in your app's router.
                */}
                <SecondaryButton to={`/practice/${item.product_id}`}>
                  Practice
                </SecondaryButton>
              </ButtonContainer>
            </DataCell>
          </Row>
        ))}
      </DownloadsTable>
    </div>
  );
};

export default DownloadsPage;