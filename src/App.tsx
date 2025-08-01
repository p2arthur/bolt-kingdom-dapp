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
import Battle from './pages/Battle';
import Docs from './pages/Docs';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecentEventsList from './components/RecentEventsList';
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
  const { recentEvents } = useKingdom();
  
  return (
    <Router>
      <Background />
      <Navbar />
      <RecentEventsList recentEvents={recentEvents} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/oracle" element={<Oracle />} />
        <Route path="/battle" element={<Battle />} />
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