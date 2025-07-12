// src/pages/OrdersPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Sample Data ---
const sampleOrders = [
  { id: '#41388', date: 'July 2, 2025', status: 'completed', total: '$30.00 USD for 1 item(s)' },
  { id: '#41383', date: 'June 24, 2025', status: 'completed', total: '26,00 € EUR for 1 item(s)' },
  { id: '#41378', date: 'May 27, 2025', status: 'processing', total: '$60.00 USD for 2 item(s)' },
  { id: '#41343', date: 'May 13, 2025', status: 'completed', total: '$30.00 USD for 1 item(s)' },
  { id: '#41342', date: 'May 13, 2025', status: 'completed', total: '$30.00 USD for 1 item(s)' },
];

// --- Styled Components to match the Flutter UI ---

const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

// This is the main container for the list
const OrdersListContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  border: 1px solid #E0E0E0; // Colors.grey.shade200
  overflow: hidden; // To keep the rounded corners
`;

// This matches the OrderHeader widget
const OrderHeaderRow = styled.div`
  display: flex;
  background-color: #EFEFEF;
  padding: 12px 16px;
  border-bottom: 1px solid #E0E0E0; // Colors.grey.shade300
`;

// This matches the OrderRow widget
const OrderDataRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

// This matches the HeaderCell widget
const HeaderCell = styled.div<{ flex?: number }>`
  flex: ${({ flex }) => flex || 1};
  font-weight: bold;
  color: #333;
  padding: 8px;
`;

// This matches the TableCell widget
const DataCell = styled.div<{ flex?: number }>`
  flex: ${({ flex }) => flex || 1};
  padding: 8px;
  color: #555;
`;

// A specific component for the status badge
const StatusBadge = styled.span<{ status: string }>`
  background-color: ${({ status }) => status === 'completed' ? '#E8F5E9' : '#FFF3E0'}; // Green for completed, Orange for processing
  color: ${({ status }) => status === 'completed' ? '#2E7D32' : '#E65100'};
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  text-transform: capitalize;
`;

// The "View" button, styled to match the screenshot
const ViewButton = styled(Link)`
  background-color: #2c2c54; // themeBlue
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3A5FCD;
  }
`;

const OrdersPage = () => {
  return (
    <div>
      <PageHeader>Orders</PageHeader>
      <OrdersListContainer>
        <OrderHeaderRow>
          <HeaderCell>Order</HeaderCell>
          <HeaderCell>Date</HeaderCell>
          <HeaderCell>Status</HeaderCell>
          <HeaderCell flex={2}>Total</HeaderCell>
          <HeaderCell>Actions</HeaderCell>
        </OrderHeaderRow>
        {sampleOrders.map((order) => (
          <OrderDataRow key={order.id}>
            <DataCell>{order.id}</DataCell>
            <DataCell>{order.date}</DataCell>
            <DataCell>
              <StatusBadge status={order.status}>{order.status}</StatusBadge>
            </DataCell>
            <DataCell flex={2}>{order.total}</DataCell>
            <DataCell>
              <ViewButton to={`/orders/${order.id.replace('#', '')}`}>View</ViewButton>
            </DataCell>
          </OrderDataRow>
        ))}
      </OrdersListContainer>
    </div>
  );
};

export default OrdersPage;