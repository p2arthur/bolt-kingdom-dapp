import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';
import { WalletUIProvider } from '@txnlab/use-wallet-ui-react';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Oracle from './pages/Oracle';
import RoundTable from './pages/RoundTable';
import FortunePit from './pages/FortunePit';
import Docs from './pages/Docs';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecentKingdomsList from './components/RecentKingdomsList';
import { KingdomProvider, useKingdom } from './contexts/KingdomContext';

// Configure wallet manager
const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.LUTE,
  ],
  defaultNetwork: NetworkId.TESTNET,
});

function AppContent() {
  const { recentKingdoms } = useKingdom();
  
  return (
    <Router>
      <Background />
      <Navbar />
      <RecentKingdomsList recentProjects={recentKingdoms} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/oracle" element={<Oracle />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/dapp/round-table/:appId" element={<RoundTable />} />
        <Route path="/dapp/the-fortune-pit/:appId" element={<FortunePit />} />
      </Routes>
      <Footer />
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a0f2c',
            border: '1px solid #6b21a8',
            color: '#fff',
          }
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        <KingdomProvider>
          <AppContent />
        </KingdomProvider>
      </WalletUIProvider>
    </WalletProvider>
  );
}

export default App;