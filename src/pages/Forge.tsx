import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Upload, Coins, Link, Crown, Shield } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet-react';
import { toast } from 'sonner';

export default function Forge() {
  const { activeAccount } = useWallet();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenUrl, setTokenUrl] = useState('');
  const [tokenImage, setTokenImage] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!tokenName || !tokenSymbol || !tokenUrl || !tokenImage) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      // Simulate token creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Token created successfully!');
      
      // Reset form
      setTokenName('');
      setTokenSymbol('');
      setTokenUrl('');
      setTokenImage('');
    } catch (error) {
      toast.error('Failed to create token');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen page-top-padding">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.3)'
        }}
      />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medieval-card !bg-amber-950/90 backdrop-blur-md border-amber-600"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
              <Hammer className="w-8 h-8 text-amber-950" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-amber-100">The Forge</h1>
              <p className="text-amber-200/80">Create your kingdom's currency</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-amber-100">
                Token Name
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-full bg-amber-900/50 border-2 border-amber-600 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-500"
                placeholder="e.g., Kingdom Gold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-amber-100">
                Token Symbol
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="w-full bg-amber-900/50 border-2 border-amber-600 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-500"
                placeholder="e.g., KGLD"
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-amber-100">
                Token Image URL
              </label>
              <input
                type="url"
                value={tokenImage}
                onChange={(e) => setTokenImage(e.target.value)}
                className="w-full bg-amber-900/50 border-2 border-amber-600 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-500"
                placeholder="https://example.com/token-image.png"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-amber-100">
                Token Website URL
              </label>
              <input
                type="url"
                value={tokenUrl}
                onChange={(e) => setTokenUrl(e.target.value)}
                className="w-full bg-amber-900/50 border-2 border-amber-600 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-500"
                placeholder="https://example.com"
              />
            </div>

            {tokenImage && (
              <div className="p-4 border-2 border-amber-600 rounded-xl bg-amber-900/30">
                <p className="text-sm font-bold text-amber-100 mb-2">Preview</p>
                <div className="aspect-square w-24 rounded-lg overflow-hidden">
                  <img
                    src={tokenImage}
                    alt="Token Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg';
                    }}
                  />
                </div>
              </div>
            )}

            {!activeAccount ? (
              <div className="p-4 border-2 border-amber-600 rounded-xl bg-amber-900/30 text-center">
                <Shield className="w-8 h-8 text-amber-100 mx-auto mb-2" />
                <p className="text-amber-100">Connect your wallet to create tokens</p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isCreating}
                className="w-full medieval-button !bg-amber-800 !text-amber-100 hover:!bg-amber-700 !border-amber-600 flex items-center justify-center gap-2"
              >
                <Hammer className="w-5 h-5" />
                <span>{isCreating ? 'Forging...' : 'Forge Token'}</span>
              </button>
            )}
          </form>

          {/* Token Creation Guide */}
          <div className="mt-8 pt-8 border-t-2 border-amber-600/30">
            <h2 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
              <Crown className="w-6 h-6" />
              Token Creation Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border-2 border-amber-600/50 rounded-xl bg-amber-900/20">
                <Coins className="w-6 h-6 text-amber-100 mb-2" />
                <h3 className="font-bold text-amber-100 mb-1">Choose a Name</h3>
                <p className="text-sm text-amber-200/80">
                  Pick a unique and memorable name for your token
                </p>
              </div>
              <div className="p-4 border-2 border-amber-600/50 rounded-xl bg-amber-900/20">
                <Upload className="w-6 h-6 text-amber-100 mb-2" />
                <h3 className="font-bold text-amber-100 mb-1">Add an Image</h3>
                <p className="text-sm text-amber-200/80">
                  Upload a distinctive icon for recognition
                </p>
              </div>
              <div className="p-4 border-2 border-amber-600/50 rounded-xl bg-amber-900/20">
                <Link className="w-6 h-6 text-amber-100 mb-2" />
                <h3 className="font-bold text-amber-100 mb-1">Link Website</h3>
                <p className="text-sm text-amber-200/80">
                  Connect to your project's homepage
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}