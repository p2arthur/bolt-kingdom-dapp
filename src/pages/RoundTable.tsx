import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Plus, Timer, Check, X, Shield } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';
import { useKingdom } from '../contexts/KingdomContext';
import CreateProposalModal from '../components/CreateProposalModal';

interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string;
  expiresAt: Date;
  votes: {
    yes: string[];
    no: string[];
  };
}

export default function RoundTable() {
  const { appId } = useParams();
  const { activeAccount } = useWallet();
  const { proposals, updateProposals } = useKingdom();

  console.log('🏛️ RoundTable - Current proposals from context:', proposals);

  // Load proposals on mount and when context updates
  useEffect(() => {
    console.log('🏛️ RoundTable - Proposals updated:', proposals);
  }, [proposals]);

  const isExpired = (expiresAt: Date) => {
    return new Date() > new Date(expiresAt);
  };

  const hasVoted = (proposal: Proposal) => {
    if (!activeAccount?.address) return false;
    return (
      proposal.votes.yes.includes(activeAccount.address) ||
      proposal.votes.no.includes(activeAccount.address)
    );
  };

  const handleVote = async (proposalId: string, vote: 'yes' | 'no') => {
    if (!activeAccount?.address) return;

    console.log(`🗳️ RoundTable - Voting ${vote} on proposal ${proposalId}`);
    
    // For now, just update local state
    // In production, this would update the blockchain
    // TODO: Implement actual voting logic with YJS or blockchain
  };

  const handleProposalCreated = (proposal: Proposal) => {
    console.log('🏛️ RoundTable - Proposal created callback triggered:', proposal);
    // The proposal is already added to YJS in the modal
    // Just trigger a context update to ensure sync
    updateProposals();
  };

  const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const expired = isExpired(proposal.expiresAt);
    const voted = hasVoted(proposal);
    const totalVotes = proposal.votes.yes.length + proposal.votes.no.length;
    const yesPercentage = totalVotes > 0 
      ? (proposal.votes.yes.length / totalVotes) * 100 
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="medieval-card !bg-amber-100/95"
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-3 rounded-xl bg-amber-950">
            <Crown className="w-6 h-6 text-amber-100" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-amber-950">{proposal.title}</h3>
              {expired && (
                <span className="px-2 py-1 bg-amber-950 text-amber-100 text-xs font-bold rounded-full">
                  Expired
                </span>
              )}
            </div>
            
            <p className="text-amber-950/80 mb-4">{proposal.description}</p>
            
            <div className="flex items-center gap-2 text-sm text-amber-950/70 mb-4">
              <Shield className="w-4 h-4" />
              <span>Created by {proposal.creator.slice(0, 8)}...</span>
              <Timer className="w-4 h-4 ml-4" />
              <span>
                {expired 
                  ? 'Ended on ' 
                  : 'Ends on '
                }
                {new Date(proposal.expiresAt).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-amber-950/70">Votes</span>
                <span className="font-bold text-amber-950">
                  {yesPercentage.toFixed(1)}% Yes
                </span>
              </div>
              <div className="h-2 bg-amber-950/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-950"
                  style={{ width: `${yesPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-amber-950/70">
                <span>{proposal.votes.yes.length} Yes</span>
                <span>{proposal.votes.no.length} No</span>
              </div>
            </div>

            {activeAccount && !expired && !voted && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleVote(proposal.id, 'yes')}
                  className="flex-1 medieval-button !bg-amber-950 !text-amber-100 hover:!bg-amber-800 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Yes</span>
                </button>
                <button
                  onClick={() => handleVote(proposal.id, 'no')}
                  className="flex-1 medieval-button !bg-red-950 !text-red-100 hover:!bg-red-800 !border-red-900 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  <span>No</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyProposalCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medieval-card !bg-amber-100/95 !border-amber-950/50"
    >
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-950/10 flex items-center justify-center">
            <Crown className="w-8 h-8 text-amber-950/30" />
          </div>
          <h3 className="text-xl font-bold text-amber-950/50 mb-2">No Active Proposals</h3>
          <p className="text-amber-950/40">
            Be the first to create a proposal for the kingdom
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen page-top-padding">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/kingdom-dapp-round-table-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/20 to-[#f5a105] z-10" />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-950 mb-2">Round Table</h1>
            <p className="text-amber-950/70">App ID: {appId}</p>
          </div>
          
          {activeAccount && (
            <CreateProposalModal onProposalCreated={handleProposalCreated} />
          )}
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-black/20 rounded-lg text-white text-sm">
          <div>🏛️ RoundTable Debug Info:</div>
          <div>- Proposals from context: {proposals.length}</div>
          <div>- Proposal titles: {JSON.stringify(proposals.map(p => p.title))}</div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {proposals.length > 0 ? (
              proposals.map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <EmptyProposalCard />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}