import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Timer, TrendingUp, Shield, Plus, Minus } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';
import { toast } from 'sonner';

export default function FortunePit() {
  const { appId } = useParams();
  const { activeAccount } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);

  // Mock data - in production, these would come from the blockchain
  const totalStaked = '1,000,000';
  const apy = '12.5';
  const stakingPeriod = '90';
  const userStaked = activeAccount ? '50,000' : '0';

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsStaking(true);
    try {
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully staked ${stakeAmount} tokens`);
      setStakeAmount('');
    } catch (error) {
      toast.error('Failed to stake tokens');
    } finally {
      setIsStaking(false);
    }
  };

  const StatsCard = ({ icon: Icon, title, value, suffix = '' }) => (
    <div className="medieval-card !bg-amber-950 border-amber-800">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-900">
          <Icon className="w-6 h-6 text-amber-100" />
        </div>
        <div>
          <p className="text-amber-100/70 text-sm">{title}</p>
          <p className="text-2xl font-bold text-amber-100">
            {value}{suffix}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen page-top-padding">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/kingdom-dapp-fortunes-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/20 to-[#f5a105] z-10" />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-amber-100 mb-2">The Fortune Pit</h1>
          <p className="text-amber-200/70">App ID: {appId}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatsCard
            icon={Coins}
            title="Total Staked"
            value={totalStaked}
            suffix=" ALGO"
          />
          <StatsCard
            icon={TrendingUp}
            title="Annual Yield"
            value={apy}
            suffix="%"
          />
          <StatsCard
            icon={Timer}
            title="Staking Period"
            value={stakingPeriod}
            suffix=" Days"
          />
          <StatsCard
            icon={Shield}
            title="Your Stake"
            value={userStaked}
            suffix=" ALGO"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medieval-card !bg-amber-950/90 backdrop-blur-md border-amber-600"
        >
          <h2 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-2">
            <Coins className="w-6 h-6" />
            Stake Your Tokens
          </h2>

          <form onSubmit={handleStake} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-amber-100">
                Amount to Stake
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full medieval-input !bg-amber-900/50 !text-amber-100 !placeholder-amber-400/50"
                    placeholder="Enter amount"
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-100/70">
                    ALGO
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStakeAmount('100')}
                  className="medieval-button !bg-amber-900 !text-amber-100 !border-amber-700"
                >
                  100
                </button>
                <button
                  type="button"
                  onClick={() => setStakeAmount('1000')}
                  className="medieval-button !bg-amber-900 !text-amber-100 !border-amber-700"
                >
                  1000
                </button>
                <button
                  type="button"
                  onClick={() => setStakeAmount('10000')}
                  className="medieval-button !bg-amber-900 !text-amber-100 !border-amber-700"
                >
                  10000
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isStaking || !activeAccount}
                className="flex-1 medieval-button !bg-amber-800 !text-amber-100 hover:!bg-amber-700 !border-amber-600 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>{isStaking ? 'Staking...' : 'Stake'}</span>
              </button>
              <button
                type="button"
                disabled={!activeAccount}
                className="flex-1 medieval-button !bg-red-950 !text-red-100 hover:!bg-red-900 !border-red-900 flex items-center justify-center gap-2"
                onClick={() => toast.error('Unstaking is not available yet')}
              >
                <Minus className="w-5 h-5" />
                <span>Unstake</span>
              </button>
            </div>
          </form>

          {!activeAccount && (
            <div className="mt-6 p-4 rounded-xl bg-amber-900/20 border-2 border-amber-800 text-center">
              <p className="text-amber-100">Connect your wallet to start staking</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}