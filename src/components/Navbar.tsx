import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scroll, ChevronDown, Book, Sword, Plus } from 'lucide-react';
import { WalletButton } from '@txnlab/use-wallet-ui-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateProposalModal from './CreateProposalModal';

export default function Navbar() {
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Network Strip */}
      <div className="fixed top-0 left-0 right-0 z-50 h-6 bg-amber-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-xs text-amber-100"
          >
            You're using KingdomDapp {network}
          </motion.span>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-amber-100 text-xs hover:text-amber-200 transition-colors"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-1 w-32 bg-amber-950 rounded-lg shadow-lg border border-amber-900 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setNetwork('mainnet');
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-amber-100 hover:bg-amber-900 transition-colors"
                  >
                    Mainnet
                  </button>
                  <button
                    onClick={() => {
                      setNetwork('testnet');
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-amber-100 hover:bg-amber-900 transition-colors"
                  >
                    Testnet
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Main Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 bg-amber-100/90 backdrop-blur-lg border-b-4 border-amber-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/images/kingdom-dapp-logo-2.png" 
                alt="KingdomDapp Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            
            <div className="flex items-center gap-6">
              <Link 
                to="/oracle" 
                className="flex items-center gap-2 text-amber-950 hover:text-amber-800 transition-colors font-bold text-sm"
              >
                <Scroll className="w-4 h-4" />
                <span>Oracle</span>
              </Link>
              
              <Link 
                to="/battle" 
                className="flex items-center gap-2 text-amber-950 hover:text-amber-800 transition-colors font-bold text-sm"
              >
                <Sword className="w-4 h-4" />
                <span>Battle</span>
              </Link>
              
              <Link 
                to="/docs" 
                className="flex items-center gap-2 text-amber-950 hover:text-amber-800 transition-colors font-bold text-sm"
              >
                <Book className="w-4 h-4" />
                <span>Docs</span>
              </Link>

              {/* Global Create Proposal Button */}
              <CreateProposalModal 
                triggerButton={
                  <button className="flex items-center gap-2 text-amber-950 hover:text-amber-800 transition-colors font-bold text-sm bg-amber-200/50 hover:bg-amber-200/70 px-3 py-1.5 rounded-lg border-2 border-amber-950/20 hover:border-amber-950/40">
                    <Plus className="w-4 h-4" />
                    <span>Proposal</span>
                  </button>
                }
              />
            </div>
          </div>
          
          <div data-wallet-ui>
            <WalletButton className="bg-red-300"/>
          </div>
        </div>
      </nav>
    </>
  );
}