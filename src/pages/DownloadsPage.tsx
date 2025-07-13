// src/pages/DownloadsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

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
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // LOG 1: Initial render and user
  console.log('[DownloadsPage] Render: user:', user);

  useEffect(() => {
    // LOG 2: useEffect triggered
    console.log('[DownloadsPage] useEffect: user:', user);

    if (!user || !user.id) {
      setIsLoading(false);
      // LOG 3: No user available
      console.log('[DownloadsPage] No user or user.id; aborting fetch.');
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      // LOG 4: Fetching orders start
      console.log('[DownloadsPage] Fetching orders for user_id:', user.id);
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
        // LOG 5: Fetched data
        console.log('[DownloadsPage] API response:', data);

        setOrders(data.orders || []);
      } catch (error) {
        // LOG 6: Error fetching
        console.error('[DownloadsPage] Error fetching orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
        // LOG 7: Fetch finished
        console.log('[DownloadsPage] Fetching finished.');
      }
    };

    fetchOrders();
  }, [user]);

  // LOG 8: Orders state before render
  console.log('[DownloadsPage] Current orders before render:', orders);

  if (isLoading) {
    // LOG 9: Show loading
    console.log('[DownloadsPage] RENDER: Loading');
    return <MessageContainer>Loading your downloads...</MessageContainer>;
  }

  if (!user) {
    // LOG 10: No user, ask login
    console.log('[DownloadsPage] RENDER: User not logged in');
    return <MessageContainer>Please log in to view your downloads.</MessageContainer>;
  }

  // Flatten all items from all orders
  const allOrderItems =
    orders?.flatMap((order: any) =>
      (order.line_items || []).map((item: any) => ({
        ...item,
        orderId: order.id,
        expires: 'Never',
        downloads_remaining: '∞',
      }))
    ) || [];

  // LOG 11: Flattened items
  console.log('[DownloadsPage] allOrderItems:', allOrderItems);

  if (!allOrderItems.length) {
    // LOG 12: No downloads
    console.log('[DownloadsPage] RENDER: No order items to show.');
    return (
      <MessageContainer style={{ border: 'none', borderRadius: 0 }}>
        You have no available downloads.
      </MessageContainer>
    );
  }

  // LOG 13: Rendering downloads table
  console.log('[DownloadsPage] RENDER: Rendering downloads table, items:', allOrderItems);

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
                <PrimaryButton to="#">Download</PrimaryButton>
                <SecondaryButton to={`/practice/${item.product_id}`}>Practice</SecondaryButton>
              </ButtonContainer>
            </DataCell>
          </Row>
        ))}
      </DownloadsTable>
    </div>
  );
};

export default DownloadsPage;
