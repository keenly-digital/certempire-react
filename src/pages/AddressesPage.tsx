// src/pages/AddressesPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Sample Data ---
const sampleAddresses = {
  billing: {
    name: 'Ahmed R.',
    street: '123 Test Street',
    city: 'Lahore, Punjab',
    country: 'Pakistan'
  },
  shipping: {
    name: 'Ahmed R.',
    street: '456 Main Avenue',
    city: 'Karachi, Sindh',
    country: 'Pakistan'
  }
};

// --- Styled Components ---
const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const AddressesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const AddressCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 8px;
  padding: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 20px;
    margin: 0;
  }
`;

const EditLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AddressBlock = styled.address`
  font-style: normal;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AddressesPage = () => {
  return (
    <div>
      <PageHeader>Addresses</PageHeader>
      <AddressesContainer>
        <AddressCard>
          <CardHeader>
            <h3>Billing address</h3>
            <EditLink to="/account-details">Edit</EditLink>
          </CardHeader>
          <AddressBlock>
            {sampleAddresses.billing.name}<br />
            {sampleAddresses.billing.street}<br />
            {sampleAddresses.billing.city}<br />
            {sampleAddresses.billing.country}
          </AddressBlock>
        </AddressCard>
        <AddressCard>
          <CardHeader>
            <h3>Shipping address</h3>
            <EditLink to="/account-details">Edit</EditLink>
          </CardHeader>
          <AddressBlock>
            {sampleAddresses.shipping.name}<br />
            {sampleAddresses.shipping.street}<br />
            {sampleAddresses.shipping.city}<br />
            {sampleAddresses.shipping.country}
          </AddressBlock>
        </AddressCard>
      </AddressesContainer>
    </div>
  );
};

export default AddressesPage;