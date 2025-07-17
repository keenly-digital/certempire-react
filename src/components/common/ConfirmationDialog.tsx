import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div<{ $isOpen: boolean; }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 2000; // Ensure it's on top of everything
  backdrop-filter: blur(5px);
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 20px;
  margin-bottom: 8px;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button<{ $isPrimary?: boolean; }>`
  padding: 10px 24px;
  border: 1px solid ${({ theme, $isPrimary }) => $isPrimary ? theme.colors.error : theme.colors.lightGrey};
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  background-color: ${({ theme, $isPrimary }) => $isPrimary ? theme.colors.error : theme.colors.surface};
  color: ${({ theme, $isPrimary }) => $isPrimary ? theme.colors.textOnPrimary : theme.colors.textPrimary};
  transition: opacity 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.9;
  }
`;

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} $isPrimary>Log Out</Button>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
};

export default ConfirmationDialog;
