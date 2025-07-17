// src/pages/OrderDetailPage.tsx
import React, { useState, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';

// --- Type Definitions (Untouched) ---
type OrderDetails = {
  id: number;
  date_created: string;
  status: string;
  total: string;
  currency: string;
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

const getStatusColor = (status: string, theme: DefaultTheme) => {
    return status === 'completed' ? theme.colors.success : '#E65100'; // Using theme color for success
};


// --- Styled Components (UI/UX Updated) ---

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
  }
`;

const SectionCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 22px;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: 32px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const OrderSummaryText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }

  .status {
    font-weight: 700;
    color: ${({ theme }) => getStatusColor('completed', theme)};
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
`;

const ItemsTable = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0 8px 12px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  .total {
    text-align: right;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 16px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};

  &:last-child {
    border-bottom: none;
  }
  
  .product-name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .product-total {
    text-align: right;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;

    .product-total {
      text-align: left;
      font-size: 14px;
    }

    .product-total::before {
      content: 'Price: ';
      font-weight: 400;
    }
  }
`;

const TotalsRow = styled(ItemRow)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};

  .total-label {
    font-size: 16px;
  }
  .total-value {
    text-align: right;
    font-size: 18px;
  }

  @media (max-width: 600px) {
    .total-value {
      text-align: left;
    }
  }
`;

const AddressBlock = styled.address`
  font-style: normal;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// --- The Main Page Component (Business Logic Untouched) ---
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
          method: 'GET',
          endpoint: `cwc/orders/${orderId}`,
          user_id: user.id
        };
        console.log("Sending to Supabase:", payload);
        const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
          body: payload,
        });
        if (error) throw error;
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

      <SectionCard>
        <OrderSummaryText>
          Order <strong>#{order.id}</strong> was placed on <strong>{formatDate(order.date_created)}</strong> and is currently <strong className="status">{order.status}</strong>.
        </OrderSummaryText>
      </SectionCard>

      <SectionCard>
        <SectionTitle>Order Details</SectionTitle>
        <ItemsTable>
          <TableHeader>
            <div>Product</div>
            <div className="total">Total</div>
          </TableHeader>
          {order.line_items.map((item, index) => (
            <ItemRow key={index}>
              <div className="product-name">{item.name}</div>
              <div className="product-total">{`${order.currency || ''}${item.total}`}</div>
            </ItemRow>
          ))}
          <TotalsRow>
            <div className="total-label">Total:</div>
            <div className="total-value">{`${order.currency || ''}${order.total}`}</div>
          </TotalsRow>
        </ItemsTable>
      </SectionCard>
      
      <SectionCard>
        <SectionTitle>Billing Address</SectionTitle>
        <AddressBlock>
          {order.billing.first_name} {order.billing.last_name}<br />
          {order.billing.address_1}<br />
          {order.billing.city}, {order.billing.state} {order.billing.postcode}<br />
          {order.billing.country}
        </AddressBlock>
      </SectionCard>
    </div>
  );
};

export default OrderDetailPage;
