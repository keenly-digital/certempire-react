// src/pages/OrdersPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

// This type defines the shape of an order coming from your custom WC API
type Order = {
  id: number;
  date_created: string;
  status: string;
  total: string;
  currency: string; // Add this line
};

// --- Styled Components (a direct translation of your Flutter UI) ---

const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const OrdersListContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  border: 1px solid #EAEAEA;
  overflow: hidden;
`;

const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr 2fr 1fr;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const HeaderRow = styled(OrderRow)`
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
  border-bottom: 1px solid #EAEAEA;
`;

const DataCell = styled.div`
  color: #555;
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${({ status }) => status === 'completed' ? '#E8F5E9' : '#FFF3E0'};
  color: ${({ status }) => status === 'completed' ? '#2E7D32' : '#E65100'};
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  text-transform: capitalize;
`;

const ViewButton = styled(Link)`
  background-color: #2c2c54;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
`;

const MessageContainer = styled.div` padding: 40px; text-align: center; color: #757575; background-color: white; border-radius: 12px; border: 1px solid #EAEAEA; `;

// --- The Main Page Component ---
const OrdersPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const getOrdersFromWP = async () => {
      // We must have a user with a WordPress ID to continue
      if (!user || !user.id) {
        setPageLoading(false);
        return;
      }
      
     try {
const payload = { 
  method: 'GET', // <-- Add this
  endpoint: 'cwc/orders',
  user_id: user.id
};
  // Add this line to see the exact data being sent
  console.log('Sending to Supabase:', payload);

  const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
    body: payload,
  });

  if (error) throw error;
  
  if (apiResponse && apiResponse.Success && Array.isArray(apiResponse.Data)) {
      setOrders(apiResponse.Data);
  }

} catch (error) {
  console.error('Error fetching orders from WordPress:', error);
} finally {
  setPageLoading(false);
}
    };

    if (!isUserLoading) {
      getOrdersFromWP();
    }
  }, [isUserLoading, user]);

  if (isUserLoading || isPageLoading) return <MessageContainer>Loading orders...</MessageContainer>;
  if (!user) return <MessageContainer>Please log in to view your orders.</MessageContainer>;

  return (
    <div>
      <PageHeader>Orders</PageHeader>
      <OrdersListContainer>
        <HeaderRow>
          <DataCell>Order</DataCell>
          <DataCell>Date</DataCell>
          <DataCell>Status</DataCell>
          <DataCell>Total</DataCell>
          <DataCell style={{ textAlign: 'right' }}>Actions</DataCell>
        </HeaderRow>
        
        {orders.length > 0 ? orders.map((order) => (
          <OrderRow key={order.id}>
            <DataCell>#{order.id}</DataCell>
            <DataCell>{new Date(order.date_created).toLocaleDateString()}</DataCell>
            <DataCell><StatusBadge status={order.status}>{order.status}</StatusBadge></DataCell>
            <DataCell>{`${order.currency}${order.total}`}</DataCell>
            <DataCell style={{ textAlign: 'right' }}>
              <ViewButton to={`/orders/${order.id}`}>View</ViewButton>
            </DataCell>
          </OrderRow>
        )) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#757575' }}>You have no orders yet.</div>
        )}
      </OrdersListContainer>
    </div>
  );
};

export default OrdersPage;