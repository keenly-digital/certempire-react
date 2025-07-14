// src/pages/AccountDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

// --- Type Definitions ---
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

// --- Styled Components ---
const PageHeader = styled.h2` font-size: 24px; font-weight: 600; margin-bottom: 24px; `;
const Form = styled.form` display: flex; flex-direction: column; gap: 16px; max-width: 600px; `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 8px; `;
const Label = styled.label` font-weight: 500; `;
const Input = styled.input` padding: 12px; border: 1px solid #EAEAEA; border-radius: 6px; font-size: 16px; font-family: inherit; &:focus { outline: none; border-color: #2c2c54; } `;
const Fieldset = styled.fieldset` border: 1px solid #EAEAEA; border-radius: 8px; padding: 24px; margin-top: 16px; legend { padding: 0 8px; font-size: 20px; font-weight: 600; } `;
const SaveButton = styled.button` background-color: #2c2c54; color: white; padding: 12px 24px; border-radius: 6px; border: none; font-weight: 500; font-size: 16px; cursor: pointer; align-self: flex-start; &:disabled { background-color: #ccc; } `;
const LoadingContainer = styled.div` padding: 40px; text-align: center; color: #757575; `;
const BackLink = styled(Link)` display: inline-block; margin-bottom: 24px; color: #2c2c54; text-decoration: none; font-weight: 500; `;

const AccountDetailsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordFormData>({ newPassword: '', confirmPassword: '' });
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isSavingPassword, setSavingPassword] = useState(false);

  // 1. Fetch current data to pre-fill the form
  
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
          console.log("API Account Data", apiResponse.Data);
console.log("formData BEFORE set:", formData);
          setFormData(apiResponse.Data);
          console.log("SET formData to", apiResponse.Data);   // <-- log it

        }
      } catch (err) {
        console.error("Error fetching account details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentData();
    
  }, [user]);


  // 2. Handle form input changes for all fields
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!formData) return;

    // Define which fields belong to the billing address
    const billingFields = ['address_1', 'city', 'state', 'postcode', 'country'];

    // Check if the input name is one of the defined billing fields
    if (billingFields.includes(name)) {
      setFormData({
        ...formData,
        billing: { ...formData.billing, [name]: value },
      });
    } else {
      // Otherwise, update the top-level field (e.g., first_name, last_name)
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  
  // 3. Handle submission for main account details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-wc-data', {
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

  // 4. Handle submission for password change
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
      const { data, error } = await supabase.functions.invoke('get-wc-data', {
        body: {
          method: 'POST',
          endpoint: 'cwc/customer/set-password',
          customer_id: user.id,
          new_password: passwordData.newPassword,
        },
      });

      if (error) throw error;
      alert('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' }); // Clear fields
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
      <BackLink to="/addresses">← Back to Addresses</BackLink>
      <PageHeader>Account Details</PageHeader>
      
      {/* --- Main Details Form --- */}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="first_name">First name</Label>
<Input id="first_name" name="first_name" type="text" value={formData.first_name} onChange={handleInputChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" name="last_name" type="text" value={formData.last_name} onChange={handleInputChange} />
        </FormGroup>
        
        <Fieldset>
            <legend>Billing Address</legend>
            <FormGroup>
                <Label htmlFor="address_1">Street Address</Label>
                <Input id="address_1" name="address_1" type="text" value={formData.billing.address_1} onChange={handleInputChange} />
            </FormGroup>
             <FormGroup>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" value={formData.billing.city} onChange={handleInputChange} />
            </FormGroup>
             <FormGroup>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" type="text" value={formData.billing.state} onChange={handleInputChange} />
            </FormGroup>
             <FormGroup>
                <Label htmlFor="postcode">Postcode / ZIP</Label>
                <Input id="postcode" name="postcode" type="text" value={formData.billing.postcode} onChange={handleInputChange} />
            </FormGroup>
        </Fieldset>
        <SaveButton type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Account & Address'}
        </SaveButton>
      </Form>

      {/* --- Password Change Form --- */}
      <Form onSubmit={handlePasswordSubmit} style={{marginTop: '24px'}}>
        <Fieldset>
          <legend>Password change</legend>
          <FormGroup>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
          </FormGroup>
        </Fieldset>
        <SaveButton type="submit" disabled={isSavingPassword}>
          {isSavingPassword ? 'Saving...' : 'Set New Password'}
        </SaveButton>
      </Form>
    </div>
  );
};

export default AccountDetailsPage;