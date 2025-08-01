import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Timer, Crown, Sparkles } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';
import { addProposal } from '../lib/yjs';
import { toast } from 'sonner';

interface CreateProposalModalProps {
  onProposalCreated: (proposal: any) => void;
}

export default function CreateProposalModal({ onProposalCreated }: CreateProposalModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryValue, setExpiryValue] = useState('24');
  const [expiryUnit, setExpiryUnit] = useState<'hours' | 'days'>('hours');
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    try {
      const expiresAt = new Date();
      if (expiryUnit === 'hours') {
        expiresAt.setHours(expiresAt.getHours() + parseInt(expiryValue));
      } else {
        expiresAt.setDate(expiresAt.getDate() + parseInt(expiryValue));
      }

      const newProposal = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        creator: activeAccount.address,
        expiresAt,
        votes: { yes: [], no: [] }
      };

      console.log('📜 CreateProposalModal - Creating proposal:', newProposal);

      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add to YJS shared state (this will trigger events and context updates)
      addProposal(newProposal);
      
      // Call the callback to notify parent component
      onProposalCreated(newProposal);
      
      toast.success('Proposal created successfully! 📜');
      
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Failed to create proposal');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setExpiryValue('24');
    setExpiryUnit('hours');
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="medieval-button flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span>Create Proposal</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
          <div className="bg-amber-800 border-4 border-amber-950 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b-4 border-amber-900">
              <Dialog.Title className="text-2xl font-bold text-amber-100 flex items-center gap-2">
                <Crown className="w-6 h-6" />
                <span>New Proposal</span>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button 
                  onClick={handleClose}
                  className="p-2 hover:bg-amber-700/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-amber-200" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-amber-200">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600"
                  placeholder="Enter proposal title"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-amber-200">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 h-32 resize-none"
                  placeholder="Describe your proposal..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-amber-200">
                  Expires in
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(e.target.value)}
                    className="w-24 bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-600"
                    required
                    disabled={isLoading}
                  />
                  <select
                    value={expiryUnit}
                    onChange={(e) => setExpiryUnit(e.target.value as 'hours' | 'days')}
                    className="flex-1 bg-amber-900/50 border-2 border-amber-900 rounded-xl px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-600"
                    disabled={isLoading}
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-amber-200 hover:bg-amber-700/50 rounded-xl transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="medieval-button !bg-amber-950 !text-amber-100 hover:!bg-amber-900 flex items-center gap-2"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  <span>{isLoading ? 'Creating...' : 'Create Proposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}