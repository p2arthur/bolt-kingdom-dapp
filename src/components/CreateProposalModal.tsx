import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Timer, Crown, Scroll } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';
import { addEvent, EVENT_TYPES, sharedProposals } from '../lib/yjs';
import { toast } from 'sonner';

interface CreateProposalModalProps {
  onProposalCreated?: (proposal: any) => void;
  triggerButton?: React.ReactNode;
  className?: string;
}

export default function CreateProposalModal({ 
  onProposalCreated, 
  triggerButton,
  className = ""
}: CreateProposalModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryValue, setExpiryValue] = useState('7');
  const [expiryUnit, setExpiryUnit] = useState<'days' | 'weeks'>('days');
  const [isCreating, setIsCreating] = useState(false);
  const { activeAccount } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      const expiresAt = new Date();
      if (expiryUnit === 'days') {
        expiresAt.setDate(expiresAt.getDate() + parseInt(expiryValue));
      } else {
        expiresAt.setDate(expiresAt.getDate() + (parseInt(expiryValue) * 7));
      }

      const newProposal = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        creator: activeAccount.address,
        expiresAt,
        votes: { yes: [], no: [] },
        createdAt: new Date(),
      };

      // Add to shared proposals for real-time sync
      sharedProposals.push([newProposal]);

      // Call the callback if provided (for local state updates)
      onProposalCreated?.(newProposal);
      
      // Add event for proposal creation
      addEvent({
        type: EVENT_TYPES.PROPOSAL_CREATED,
        title: `New Proposal: ${title.trim()}`,
        description: `${activeAccount.address.slice(0, 8)}... created a new proposal`,
        relatedId: newProposal.id,
        creator: activeAccount.address,
        metadata: {
          proposalTitle: title.trim(),
          expiresAt: expiresAt.toISOString(),
          expiryDuration: `${expiryValue} ${expiryUnit}`
        }
      });
      
      toast.success('Proposal created successfully! 📜');
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create proposal');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setExpiryValue('7');
    setExpiryUnit('days');
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const defaultTrigger = (
    <button className={`medieval-button flex items-center gap-2 ${className}`}>
      <Plus className="w-5 h-5" />
      <span>Create Proposal</span>
    </button>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        {triggerButton || defaultTrigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
          <div className="bg-amber-800 border-4 border-amber-950 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b-4 border-amber-900">
              <Dialog.Title className="text-2xl font-bold text-amber-100 flex items-center gap-2">
                <Scroll className="w-6 h-6" />
                <span>Create Proposal</span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-amber-700/50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-amber-200" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-amber-200">
                  Title <span className="text-amber-400">({title.length}/50)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setTitle(e.target.value);
                    }
                  }}
                  className="w-full bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600"
                  placeholder="Enter proposal title (max 50 characters)"
                  required
                  maxLength={50}
                />
                {title.length >= 45 && (
                  <p className="text-xs text-amber-300">
                    {50 - title.length} characters remaining
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-amber-200">
                  Description <span className="text-amber-400">({description.length}/100)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) {
                      setDescription(e.target.value);
                    }
                  }}
                  className="w-full bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 h-24 resize-none"
                  placeholder="Describe your proposal (max 100 characters)"
                  required
                  maxLength={100}
                />
                {description.length >= 90 && (
                  <p className="text-xs text-amber-300">
                    {100 - description.length} characters remaining
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-amber-200">
                  Expires in
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={expiryUnit === 'days' ? "30" : "8"}
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(e.target.value)}
                    className="w-24 bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-600"
                    required
                  />
                  <select
                    value={expiryUnit}
                    onChange={(e) => {
                      setExpiryUnit(e.target.value as 'days' | 'weeks');
                      // Reset value if switching units and current value is too high
                      if (e.target.value === 'weeks' && parseInt(expiryValue) > 8) {
                        setExpiryValue('4');
                      } else if (e.target.value === 'days' && parseInt(expiryValue) > 30) {
                        setExpiryValue('7');
                      }
                    }}
                    className="flex-1 bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-600"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
                <p className="text-xs text-amber-300">
                  {expiryUnit === 'days' ? 'Max 30 days' : 'Max 8 weeks'}
                </p>
              </div>

              {!activeAccount && (
                <div className="p-4 rounded-xl bg-amber-900/20 border-2 border-amber-800 text-center">
                  <p className="text-amber-100">Connect your wallet to create proposals</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-amber-200 hover:bg-amber-700/50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={isCreating || !activeAccount || !title.trim() || !description.trim()}
                  className="medieval-button !bg-amber-950 !text-amber-100 hover:!bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Timer className="w-5 h-5" />
                      </motion.div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Scroll className="w-5 h-5" />
                      <span>Create Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}