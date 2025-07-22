// src/App.tsx
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // We only need to import the Provider

import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

import MainLayout from './components/common/MainLayout';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import DownloadsPage from './pages/DownloadsPage';
import AddressesPage from './pages/AddressesPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import SimulationPage from './pages/SimulationPage';
import ProtectedRoute from "./components/common/ProtectedRoute";


function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="/addresses" element={<AddressesPage />} />
                <Route path="/account-details" element={<AccountDetailsPage />} />
                <Route path="/practice/:fileId" element={<SimulationPage />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;