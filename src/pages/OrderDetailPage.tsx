// src/pages/OrderDetailPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';

// --- Sample Data ---
// In a real app, you'd fetch this data based on the orderId
const sampleOrderDetails = {
  id: '70422',
  date: 'June 15, 2024',
  status: 'Completed',
  items: [
    { name: 'CISSP - Certified Information Systems Security Professional', price: 199.00 },
  ],
  subtotal: 199.00,
  total: 199.00,
  billingAddress: {
    name: 'Ahmed R.',
    street: '123 Test Street',
    city: 'Lahore, Punjab',
    country: 'Pakistan'
  }
};

// --- Styled Components ---
const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const OrderDate = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.h3`
  font-size: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
`;

const SectionContent = styled.div`
  padding: 24px;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 0;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  }
  th:last-child, td:last-child {
    text-align: right;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const TotalsTable = styled.table`
  width: 100%;
  margin-top: 16px;
  
  td {
    padding: 8px 0;
  }
  td:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

const AddressBlock = styled.address`
  font-style: normal;
  line-height: 1.6;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
`;

const OrderDetailPage = () => {
  const { orderId } = useParams();

  // In a real app, you would use the orderId to fetch data.
  // Here, we just display the same sample data regardless of the id.
  const order = sampleOrderDetails;

  return (
    <div>
      <BackLink to="/orders">← Back to Orders</BackLink>
      <PageHeader>
        Order Details <span>(ID: #{orderId})</span>
      </PageHeader>
      <OrderDate>Placed on {order.date}</OrderDate>

      <Section>
        <SectionHeader>Order Items</SectionHeader>
        <SectionContent>
          <ItemsTable>
            <thead>
              <tr>
                <th>Product</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </ItemsTable>
          <TotalsTable>
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td>${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total:</td>
                <td>${order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </TotalsTable>
        </SectionContent>
      </Section>
      
      <Section>
        <SectionHeader>Billing Address</SectionHeader>
        <SectionContent>
          <AddressBlock>
            {order.billingAddress.name}<br />
            {order.billingAddress.street}<br />
            {order.billingAddress.city}<br />
            {order.billingAddress.country}
          </AddressBlock>
        </SectionContent>
      </Section>
    </div>
  );
};

export default OrderDetailPage;