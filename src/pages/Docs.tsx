import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, Crown, Shield, Star, Sword, Coins, Vote, Code, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Docs() {
  return (
    <div className="relative min-h-screen page-top-padding">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/kingdom-dapp-library-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/20 to-[#f5a105] z-10" />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medieval-card !bg-amber-950/90 backdrop-blur-md border-amber-600"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
              <Scroll className="w-8 h-8 text-amber-950" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-amber-100 flex items-center gap-2">
                <Crown className="w-8 h-8" />
                KingdomDapp
              </h1>
              <p className="text-amber-200/80">A gamified launchpad for decentralized applications</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-amber-100/90 text-lg">
              KingdomDapp empowers anyone to create, manage, and grow decentralized applications (dApps) using a playful, kingdom-themed interface — no smart contract expertise required.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="medieval-card !bg-amber-900/50 !border-amber-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-800">
                  <Crown className="w-5 h-5 text-amber-100" />
                </div>
                <h3 className="text-xl font-bold text-amber-100">Kingdom Creation</h3>
              </div>
              <p className="text-amber-200/80">
                Founders create kingdoms — dApps with DAO features like proposals, staking, and rewards
              </p>
            </div>

            <div className="medieval-card !bg-amber-900/50 !border-amber-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-800">
                  <Vote className="w-5 h-5 text-amber-100" />
                </div>
                <h3 className="text-xl font-bold text-amber-100">The Roundtable</h3>
              </div>
              <p className="text-amber-200/80">
                Users participate in governance via The Roundtable (DAO voting UI)
              </p>
            </div>

            <div className="medieval-card !bg-amber-900/50 !border-amber-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-800">
                  <Coins className="w-5 h-5 text-amber-100" />
                </div>
                <h3 className="text-xl font-bold text-amber-100">The Vault</h3>
              </div>
              <p className="text-amber-200/80">
                Users stake tokens to support projects and earn rewards
              </p>
            </div>

            <div className="medieval-card !bg-amber-900/50 !border-amber-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-800">
                  <Scroll className="w-5 h-5 text-amber-100" />
                </div>
                <h3 className="text-xl font-bold text-amber-100">The Oracle</h3>
              </div>
              <p className="text-amber-200/80">
                Provides insight and verifiable on-chain data
              </p>
            </div>
          </div>

          {/* Why Algorand */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Why Algorand?
            </h2>
            
            <div className="space-y-4">
              <div className="medieval-card !bg-amber-900/50 !border-amber-800">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Trustless Payments</h3>
                <p className="text-amber-200/80">
                  Users stake tokens to on-chain contracts and earn rewards without intermediaries
                </p>
              </div>

              <div className="medieval-card !bg-amber-900/50 !border-amber-800">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Verifiable Data</h3>
                <p className="text-amber-200/80">
                  All governance votes and proposal records are stored in Algorand app local/global state
                </p>
              </div>

              <div className="medieval-card !bg-amber-900/50 !border-amber-800">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Programmable Digital Assets</h3>
                <p className="text-amber-200/80">
                  Projects can launch ASAs, and all interactions with them (like staking) are on-chain
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Tech Stack
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="medieval-card !bg-amber-900/50 !border-amber-800">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Frontend</h3>
                <ul className="space-y-2 text-amber-200/80">
                  <li>• TypeScript</li>
                  <li>• React</li>
                  <li>• Tailwind CSS</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>

              <div className="medieval-card !bg-amber-900/50 !border-amber-800">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Backend</h3>
                <ul className="space-y-2 text-amber-200/80">
                  <li>• AlgoKit</li>
                  <li>• AVM Smart Contracts</li>
                  <li>• Algorand SDK</li>
                  <li>• PyTeal</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex justify-center gap-4">
            <Link to="/" className="medieval-button flex items-center gap-2">
              <Sword className="w-5 h-5" />
              <span>Enter the Realm</span>
            </Link>
            <a 
              href="https://github.com/iamp2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="medieval-button flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              <span>View Source</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}