// src/pages/AddressesPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';

// Type to hold the address data from the API
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

// --- Styled Components (remain the same) ---
const PageHeader = styled.h2` font-size: 24px; font-weight: 600; margin-bottom: 24px; `;
const AddressesContainer = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; `;
const AddressCard = styled.div` background-color: white; border: 1px solid #EAEAEA; border-radius: 8px; padding: 24px; `;
const CardHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; h3 { font-size: 20px; margin: 0; } `;
const EditLink = styled(Link)` color: #2c2c54; text-decoration: none; font-weight: 500; &:hover { text-decoration: underline; } `;
const AddressBlock = styled.address` font-style: normal; line-height: 1.6; color: #555; `;
const LoadingContainer = styled.div` padding: 40px; text-align: center; color: #757575; `;

// --- The New Dynamic Page Component ---
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
  method: 'GET', // <-- Add this
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
            {addresses.billing.first_name} {addresses.billing.last_name}<br />
            {addresses.billing.address_1}<br />
            {addresses.billing.city}, {addresses.billing.state} {addresses.billing.postcode}<br />
            {addresses.billing.country}
          </AddressBlock>
        </AddressCard>
        <AddressCard>
          <CardHeader>
            <h3>Shipping address</h3>
            <EditLink to="/account-details">Edit</EditLink>
          </CardHeader>
          <AddressBlock>
            {addresses.shipping.first_name} {addresses.shipping.last_name}<br />
            {addresses.shipping.address_1}<br />
            {addresses.shipping.city}, {addresses.shipping.state} {addresses.shipping.postcode}<br />
            {addresses.shipping.country}
          </AddressBlock>
        </AddressCard>
      </AddressesContainer>
    </div>
  );
};

export default AddressesPage;