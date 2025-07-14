// src/pages/OrderDetailPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

// Type for a single order from the API

type OrderDetails = {
  id: number;
  date_created: string;
  status: string;
  total: string;
  currency: string; // Changed from currency_symbol
  line_items: { name: string; total: string; }[];
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  }
};

// --- Styled Components ---
const PageHeader = styled.h2` font-size: 24px; font-weight: 600; margin-bottom: 8px; span { font-weight: 400; color: #757575; }`;
const OrderDate = styled.p` color: #757575; margin-bottom: 24px; `;
const Section = styled.div` background-color: white; border: 1px solid #EAEAEA; border-radius: 8px; margin-bottom: 24px; overflow: hidden; `;
const SectionHeader = styled.h3` font-size: 20px; padding: 20px 24px; border-bottom: 1px solid #EAEAEA; `;
const SectionContent = styled.div` padding: 24px; `;
const ItemsTable = styled.table` width: 100%; border-collapse: collapse; th, td { padding: 12px 0; text-align: left; border-bottom: 1px solid #f0f0f0; } th:last-child, td:last-child { text-align: right; } tbody tr:last-child td { border-bottom: none; }`;
const AddressBlock = styled.address` font-style: normal; line-height: 1.6; `;
const BackLink = styled(Link)` display: inline-block; margin-bottom: 24px; color: #673AB7; text-decoration: none; font-weight: 500; `;
const LoadingContainer = styled.div` padding: 40px; text-align: center; color: #757575; `;

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useUser();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !user) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
       const payload = {
  method: 'GET', // <-- Add this
  endpoint: `cwc/orders/${orderId}`,
  user_id: user.id
};

        console.log("Sending to Supabase:", payload);
        const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
          body: payload,
        });

        if (error) throw error;
        
        // Handle the custom API response object
        if (apiResponse && apiResponse.Success && apiResponse.Data) {
            setOrder(apiResponse.Data);
        }

      } catch(err) {
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

  if (isLoading) return <LoadingContainer>Loading Order Details...</LoadingContainer>;
  if (!order) return <LoadingContainer>Could not find order details.</LoadingContainer>;

  return (
    <div>
      <BackLink to="/orders">← Back to Orders</BackLink>
      <PageHeader>
        Order Details <span>(ID: #{order.id})</span>
      </PageHeader>
      <OrderDate>Placed on {new Date(order.date_created).toLocaleDateString()}</OrderDate>

      <Section>
        <SectionHeader>Order Items</SectionHeader>
        <SectionContent>
          <ItemsTable>
            <thead>
              <tr>
                <th>Product</th>
                <th style={{textAlign: 'right'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.line_items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
<td style={{textAlign: 'right'}}>{`${order.currency || ''}${item.total}`}</td>
                </tr>
              ))}
              <tr>
                  <td><b>Total:</b></td>
<td style={{textAlign: 'right'}}><b>{`${order.currency || ''}${order.total}`}</b></td>
              </tr>
            </tbody>
          </ItemsTable>
        </SectionContent>
      </Section>
      
      <Section>
        <SectionHeader>Billing Address</SectionHeader>
        <SectionContent>
          <AddressBlock>
            {order.billing.first_name} {order.billing.last_name}<br />
            {order.billing.address_1}<br />
            {order.billing.city}, {order.billing.state} {order.billing.postcode}<br />
            {order.billing.country}
          </AddressBlock>
        </SectionContent>
      </Section>
    </div>
  );
};

export default OrderDetailPage;