// src/pages/AddressesPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';

// --- Type Definitions (Untouched) ---
type Address = {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type CustomerData = {
  billing: Address;
  shipping: Address;
};

// --- Helper Function for UI ---
const isAddressEmpty = (address: Address | undefined) => {
    if (!address) return true;
    return !address.first_name && !address.last_name && !address.address_1 && !address.city;
}

// --- Styled Components (UI/UX Updated) ---

const PageHeader = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 24px;
`;

const InfoCard = styled.div`
  background-color: #F2F4FB;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 18px;
  padding: 18px 22px;
  margin-bottom: 22px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-weight: 600;
  font-size: 16px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const AddressesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const AddressCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 28px 22px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  margin-bottom: 16px;

  .title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    font-size: 19px;
    font-weight: 700;
    margin: 0;
    color: inherit;
  }
`;

const EditLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: underline;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;

&:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    padding: 5px;
  }
`;

const AddressBlock = styled.address`
  font-style: italic;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
`;

const EmptyAddressMessage = styled(AddressBlock)`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// --- The Main Page Component (Business Logic Untouched) ---
const AddressesPage = () => {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<CustomerData | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAddressData = async () => {
      setLoading(true);
      try {
       const payload = {
          method: 'GET',
          endpoint: `cwc/customer/${user.id}`,
          user_id: user.id
        };
        const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
          body: payload,
        });
        if (error) throw error;
        if (apiResponse && apiResponse.Success && apiResponse.Data) {
          setAddresses(apiResponse.Data);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddressData();
  }, [user]);

  if (isLoading) return <LoadingContainer>Loading Addresses...</LoadingContainer>;
  if (!addresses) return <LoadingContainer>Could not load address information.</LoadingContainer>;

  const shippingIsEmpty = isAddressEmpty(addresses.shipping);

  return (
    <div>
      <PageHeader>Addresses</PageHeader>
      
      <InfoCard>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
        <span>The following addresses will be used on the checkout page by default.</span>
      </InfoCard>

      <AddressesContainer>
        {/* Billing Address Card */}
        <AddressCard>
          <CardHeader>
            <div className="title-group">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <h3>Billing address</h3>
            </div>
            <EditLink to="/account-details">Edit</EditLink>
          </CardHeader>
          <AddressBlock>
            {addresses.billing.first_name} {addresses.billing.last_name}<br />
            {addresses.billing.address_1}<br />
            {addresses.billing.city}, {addresses.billing.state} {addresses.billing.postcode}<br />
            {addresses.billing.country}
          </AddressBlock>
        </AddressCard>
        
        {/* Shipping Address Card */}
        <AddressCard>
          <CardHeader>
            <div className="title-group">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <h3>Shipping address</h3>
            </div>
            <EditLink to="/account-details">{shippingIsEmpty ? 'Add' : 'Edit'}</EditLink>
          </CardHeader>
          {shippingIsEmpty ? (
            <EmptyAddressMessage>You have not set up this type of address yet.</EmptyAddressMessage>
          ) : (
            <AddressBlock>
              {addresses.shipping.first_name} {addresses.shipping.last_name}<br />
              {addresses.shipping.address_1}<br />
              {addresses.shipping.city}, {addresses.shipping.state} {addresses.shipping.postcode}<br />
              {addresses.shipping.country}
            </AddressBlock>
          )}
        </AddressCard>
      </AddressesContainer>
    </div>
  );
};

export default AddressesPage;
