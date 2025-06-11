import React from 'react';
import { useWallet } from '@txnlab/use-wallet-react';
import { WalletButton as BaseWalletButton } from '@txnlab/use-wallet-ui-react';
import { Shield, Crown, Coins } from 'lucide-react';

export default function WalletButton() {
  const { activeAccount, connectedAccounts } = useWallet();

  // Custom wallet button component
  const CustomWalletButton = ({ onClick, isConnected, address, balance }: any) => {
    if (isConnected && address) {
      return (
        <button
          onClick={onClick}
          data-connected="true"
          className="medieval-button !px-4 !py-2 !text-xs !normal-case !tracking-normal !bg-amber-950 !text-amber-100 !border-amber-600 hover:!bg-amber-800 hover:!border-amber-500 flex items-center gap-2 min-w-[160px]"
        >
          <Shield className="w-4 h-4" />
          <div className="flex flex-col items-start">
            <span className="wallet-status text-xs opacity-80">Connected</span>
            <span className="wallet-address font-mono text-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={onClick}
        className="medieval-button !px-4 !py-2 !text-xs !normal-case !tracking-normal flex items-center gap-2"
      >
        <Crown className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  };

  return (
    <div data-wallet-ui className="relative">
      <BaseWalletButton 
        customButton={CustomWalletButton}
        className="medieval-button"
      />
    </div>
  );
}