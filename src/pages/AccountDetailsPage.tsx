// src/pages/AccountDetailsPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

// --- Styled Components ---
const PageHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Fieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.lightGrey};
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;

  legend {
    padding: 0 8px;
    font-size: 20px;
    font-weight: 600;
  }
`;

const SaveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start; /* Don't stretch full-width */

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const AccountDetailsPage = () => {
  // We use React's state to manage the form inputs
  const [firstName, setFirstName] = useState('Ahmed');
  const [lastName, setLastName] = useState('R.');
  const [email] = useState('wp.usman.personal@gmail.com');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert('Changes saved!');
  };

  return (
    <div>
      <PageHeader>Account Details</PageHeader>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="firstName">First name</Label>
          <Input 
            id="firstName" 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="lastName">Last name</Label>
          <Input 
            id="lastName" 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email address</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            readOnly 
            disabled
          />
        </FormGroup>

        <Fieldset>
          <legend>Password change</legend>
          <FormGroup>
            <Label htmlFor="currentPassword">Current password (leave blank to leave unchanged)</Label>
            <Input id="currentPassword" type="password" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="newPassword">New password (leave blank to leave unchanged)</Label>
            <Input id="newPassword" type="password" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" type="password" />
          </FormGroup>
        </Fieldset>
        
        <SaveButton type="submit">Save changes</SaveButton>
      </Form>
    </div>
  );
};

export default AccountDetailsPage;