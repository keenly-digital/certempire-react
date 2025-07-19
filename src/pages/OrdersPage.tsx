// src/pages/OrdersPage.tsx
import React, { useState, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

// This type defines the shape of an order coming from your custom WC API
type Order = {
  id: number;
  date_created: string;
  status: string;
  total: string;
  currency: string;
};

// --- Helper Functions for UI ---
const formatDate = (isoTimestamp: string) => {
  try {
    return new Date(isoTimestamp).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

const getStatusColors = (status: string, theme: DefaultTheme) => {
  switch (status) {
    case 'completed':
      return { bg: 'rgba(46, 125, 50, 0.11)', text: '#2E7D32' };
    case 'processing':
      return { bg: `rgba(45, 22, 132, 0.11)`, text: theme.colors.primary };
    case 'pending':
      return { bg: 'rgba(230, 81, 0, 0.11)', text: '#E65100' };
    default:
      return { bg: theme.colors.lightGrey, text: theme.colors.textSecondary };
  }
};


// --- Styled Components (UI/UX Updated) ---

const PageHeader = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 24px;
`;

// --- Single Order Card Styles ---
const SingleOrderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  max-width: 700px;
  margin: 24px auto;
`;

const SingleOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SingleOrderId = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const SingleOrderInfo = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }
`;

const SingleOrderTotal = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 24px;
`;

const SingleOrderButton = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;


// --- Desktop Table Styles ---
const DesktopTableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 22px; // Matching Flutter
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;

  @media (max-width: 800px) {
    display: none; // Hide on mobile
  }
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 2fr 1.2fr;
  align-items: center;
  padding: 16px 24px;
  background-color: rgba(45, 22, 132, 0.08); // Matching Flutter
`;

const HeaderCell = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700; // Bold
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 2fr 1.2fr;
  align-items: center;
  padding: 18px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightGrey};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const DataCell = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;

  &.order-id {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${({ status, theme }) => getStatusColors(status, theme).bg};
  color: ${({ status, theme }) => getStatusColors(status, theme).text};
  padding: 5px 10px;
  border-radius: 7px; // Matching Flutter
  font-weight: 600;
  font-size: 12px;
  text-transform: capitalize;
  display: inline-block;
`;

const ViewButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  padding: 8px 22px;
  border-radius: 22px; // Matching Flutter
  text-decoration: none;
  font-weight: 700;
  text-align: center;
  justify-self: start;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

// --- Mobile Card Styles ---

const MobileListContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 800px) {
    display: flex; // Show on mobile
  }
`;

const MobileOrderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  padding: 16px;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CardOrderId = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 16px;
`;

const CardDate = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  margin-bottom: 12px;
`;

const CardTotal = styled(CardOrderId)`
  margin-top: 12px;
`;

const CardViewButton = styled(ViewButton)`
  width: 100%;
  margin-top: 16px;
  padding: 12px;
`;

// --- Common ---

const MessageContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;


// --- The Main Page Component (Business Logic Untouched) ---
const OrdersPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const getOrdersFromWP = async () => {
      if (!user || !user.id) {
        setPageLoading(false);
        return;
      }

      try {
        const payload = {
          method: 'GET',
          endpoint: 'cwc/orders',
          user_id: user.id
        };
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

      {orders.length === 0 ? (
        <MessageContainer>
          You have no orders yet.
        </MessageContainer>
      ) : orders.length === 1 ? (
        <SingleOrderCard>
          <SingleOrderHeader>
            <SingleOrderId>Order #{orders[0].id}</SingleOrderId>
            <StatusBadge status={orders[0].status}>{orders[0].status}</StatusBadge>
          </SingleOrderHeader>
          <SingleOrderInfo>
            Placed on <strong>{formatDate(orders[0].date_created)}</strong>
          </SingleOrderInfo>
          <SingleOrderTotal>
            Total: {orders[0].currency} {orders[0].total}
          </SingleOrderTotal>
          <SingleOrderButton to={`/orders/${orders[0].id}`}>View Details</SingleOrderButton>
        </SingleOrderCard>
      ) : (
        <>
          {/* Desktop Table View */}
          <DesktopTableContainer>
            <HeaderRow>
              <HeaderCell>Order</HeaderCell>
              <HeaderCell>Date</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Total</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </HeaderRow>

            {orders.map((order) => (
              <DataRow key={order.id}>
                <DataCell className="order-id">#{order.id}</DataCell>
                <DataCell>{formatDate(order.date_created)}</DataCell>
                <DataCell><StatusBadge status={order.status}>{order.status}</StatusBadge></DataCell>
                <DataCell>{`${order.currency} ${order.total}`}</DataCell>
                <DataCell>
                  <ViewButton to={`/orders/${order.id}`}>View</ViewButton>
                </DataCell>
              </DataRow>
            ))}
          </DesktopTableContainer>

          {/* Mobile Card View */}
          <MobileListContainer>
            {orders.map((order) => (
              <MobileOrderCard key={order.id}>
                <CardRow>
                  <CardOrderId>#{order.id}</CardOrderId>
                  <StatusBadge status={order.status}>{order.status}</StatusBadge>
                </CardRow>
                <CardDate>{formatDate(order.date_created)}</CardDate>
                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />
                <CardTotal>{`${order.currency} ${order.total}`}</CardTotal>
                <CardViewButton to={`/orders/${order.id}`}>View Details</CardViewButton>
              </MobileOrderCard>
            ))}
          </MobileListContainer>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
