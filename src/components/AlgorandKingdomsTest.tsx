import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { fetchActiveKingdomIds, fetchActiveKingdomIdsAlt } from '../lib/algorand';

export default function AlgorandKingdomsTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'primary' | 'alternative'>('primary');

  const handleFetch = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = method === 'primary' 
        ? await fetchActiveKingdomIds()
        : await fetchActiveKingdomIdsAlt();
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="medieval-card !bg-amber-950/90 backdrop-blur-md border-amber-600">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-amber-100" />
        <h2 className="text-2xl font-bold text-amber-100">Algorand Kingdom IDs Test</h2>
      </div>

      <div className="space-y-4">
        {/* Method Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-amber-200">
            Decoding Method
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMethod('primary')}
              className={`medieval-button !px-4 !py-2 !text-sm ${
                method === 'primary' 
                  ? '!bg-amber-600 !text-amber-100' 
                  : '!bg-amber-900 !text-amber-200'
              }`}
            >
              Primary Method
            </button>
            <button
              onClick={() => setMethod('alternative')}
              className={`medieval-button !px-4 !py-2 !text-sm ${
                method === 'alternative' 
                  ? '!bg-amber-600 !text-amber-100' 
                  : '!bg-amber-900 !text-amber-200'
              }`}
            >
              DataView Method
            </button>
          </div>
        </div>

        {/* Fetch Button */}
        <button
          onClick={handleFetch}
          disabled={isLoading}
          className="medieval-button !bg-amber-700 hover:!bg-amber-600 !text-amber-100 !border-amber-600 flex items-center gap-2"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Fetching...' : 'Fetch Kingdom IDs'}</span>
        </button>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-950/20 border-2 border-green-600/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-green-400">Success!</h3>
            </div>
            
            <div className="space-y-2">
              <div className="text-amber-100">
                <strong>Active Kingdom IDs:</strong>
              </div>
              <div className="bg-amber-900/20 rounded-lg p-3 font-mono text-sm text-amber-200">
                {JSON.stringify(result, null, 2)}
              </div>
              
              {result.activeKingdomIds && (
                <div className="text-amber-200/80 text-sm">
                  Found {result.activeKingdomIds.length} kingdom ID(s)
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/20 border-2 border-red-600/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-red-400">Error</h3>
            </div>
            <div className="text-red-200 text-sm">{error}</div>
          </motion.div>
        )}

        {/* API Info */}
        <div className="bg-amber-900/20 border-2 border-amber-600/30 rounded-xl p-4">
          <h4 className="font-bold text-amber-100 mb-2">API Details</h4>
          <div className="space-y-1 text-sm text-amber-200/80">
            <div><strong>Endpoint:</strong> testnet-idx.4160.nodely.dev</div>
            <div><strong>App ID:</strong> 740978143</div>
            <div><strong>Box Name:</strong> kingdoms (base64: a2luZ2RvbXM=)</div>
            <div><strong>Expected:</strong> 4-byte big-endian unsigned integers</div>
          </div>
        </div>
      </div>
    </div>
  );
}