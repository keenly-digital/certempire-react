// src/pages/AccountDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

// --- Type Definitions (Untouched) ---
type BillingData = {
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type UserFormData = {
  first_name: string;
  last_name: string;
  billing: BillingData;
};

type PasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

// --- Styled Components (UI/UX Updated) ---

const PageHeader = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 24px;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  padding: 40px;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 17px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 15.5px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 15px 13px;
  font-size: 15.7px;
  font-family: inherit;
  border-radius: 9px;
  background-color: #F4F6FB;
  border: 1px solid #E0E4F0;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const FormSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 24px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGrey};
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  padding: 15px 24px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 16.5px;
  cursor: pointer;
  align-self: flex-start;
  transition: opacity 0.2s ease-in-out;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;


// --- The Main Page Component (Business Logic Untouched) ---
const AccountDetailsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordFormData>({ newPassword: '', confirmPassword: '' });
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isSavingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchCurrentData = async () => {
      setLoading(true);
      try {
        const { data: apiResponse, error } = await supabase.functions.invoke('get-wc-data', {
          body: { method: 'GET', endpoint: `cwc/customer/${user.id}`, user_id: user.id },
        });
        if (error) throw error;
        if (apiResponse && apiResponse.Success) {
          setFormData(apiResponse.Data);
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!formData) return;
    const billingFields = ['address_1', 'city', 'state', 'postcode', 'country'];
    if (billingFields.includes(name)) {
      setFormData({ ...formData, billing: { ...formData.billing, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData) return;
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('get-wc-data', {
        body: {
          method: 'PUT',
          endpoint: `cwc/update-customer/${user.id}`,
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          billing: formData.billing,
        },
      });
      if (error) throw error;
      alert('Changes saved successfully!');
    } catch (err) {
      console.error("Error updating details:", err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Error: New passwords do not match.");
      return;
    }
    if (!passwordData.newPassword) {
      alert("Error: New password cannot be blank.");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.functions.invoke('get-wc-data', {
        body: {
          method: 'POST',
          endpoint: 'cwc/customer/set-password',
          customer_id: user.id,
          new_password: passwordData.newPassword,
        },
      });
      if (error) throw error;
      alert('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error("Error updating password:", err);
      alert('Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading || !formData) return <LoadingContainer>Loading Details...</LoadingContainer>;

  return (
    <div>
      <PageHeader>Account Details</PageHeader>
      
      <FormContainer>
        {/* --- Main Details Form --- */}
        <Form onSubmit={handleSubmit}>
          <ResponsiveRow>
            <FormGroup>
              <Label htmlFor="first_name">First name</Label>
              <Input id="first_name" name="first_name" type="text" value={formData.first_name} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" name="last_name" type="text" value={formData.last_name} onChange={handleInputChange} />
            </FormGroup>
          </ResponsiveRow>

          <FormSectionTitle>Billing Address</FormSectionTitle>
          
          <FormGroup>
              <Label htmlFor="address_1">Street Address</Label>
              <Input id="address_1" name="address_1" type="text" value={formData.billing.address_1} onChange={handleInputChange} />
          </FormGroup>
          <ResponsiveRow>
            <FormGroup>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" value={formData.billing.city} onChange={handleInputChange} />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" type="text" value={formData.billing.state} onChange={handleInputChange} />
            </FormGroup>
          </ResponsiveRow>
          <FormGroup>
              <Label htmlFor="postcode">Postcode / ZIP</Label>
              <Input id="postcode" name="postcode" type="text" value={formData.billing.postcode} onChange={handleInputChange} />
          </FormGroup>
          
          <SaveButton type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Address'}
          </SaveButton>
        </Form>

        {/* --- Password Change Form --- */}
        <Form onSubmit={handlePasswordSubmit}>
          <FormSectionTitle>Password change</FormSectionTitle>
          <FormGroup>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" placeholder="Leave blank to leave unchanged" value={passwordData.newPassword} onChange={handlePasswordChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
          </FormGroup>
          <SaveButton type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? 'Saving...' : 'Set New Password'}
          </SaveButton>
        </Form>
      </FormContainer>
    </div>
  );
};

export default AccountDetailsPage;
