import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Trophy, Crown, Timer, Coins, Star } from 'lucide-react';
import { useKingdom } from '../contexts/KingdomContext';
import { calculateLevel, calculateReputation } from '../lib/yjs';

interface LeaderboardEntry {
  id: string;
  name: string;
  creator: string;
  contribution: number;
  level: number;
  reputation: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function Battle() {
  const { kingdoms } = useKingdom();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate next Monday at midnight
  const getNextWeekReset = () => {
    const now = new Date();
    const nextMonday = new Date();
    nextMonday.setDate(now.getDate() + (7 - now.getDay() + 1) % 7);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  };

  // Generate stable leaderboard data
  useEffect(() => {
    const generateLeaderboard = () => {
      const entries: LeaderboardEntry[] = kingdoms.map(kingdom => {
        // Use kingdom ID to generate consistent random contribution
        const seed = parseInt(kingdom.id) || 1;
        const contribution = Math.floor((seed * 1234567) % 10000) + kingdom.fundingProgress * 100;
        
        return {
          id: kingdom.id,
          name: kingdom.name,
          creator: kingdom.creator,
          contribution,
          level: calculateLevel(kingdom),
          reputation: calculateReputation(kingdom),
          primaryColor: kingdom.primaryColor,
          secondaryColor: kingdom.secondaryColor,
          accentColor: kingdom.accentColor
        };
      });

      // Sort by contribution and take top 10
      const sortedEntries = entries
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 10);

      setLeaderboard(sortedEntries);
    };

    generateLeaderboard();
  }, [kingdoms]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const nextReset = getNextWeekReset().getTime();
      const distance = nextReset - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const rewards = [
    { position: 1, tokens: 10000 },
    { position: 2, tokens: 7500 },
    { position: 3, tokens: 5000 },
    { position: 4, tokens: 3000 },
    { position: 5, tokens: 2500 },
    { position: 6, tokens: 2000 },
    { position: 7, tokens: 1500 },
    { position: 8, tokens: 1000 },
    { position: 9, tokens: 750 },
    { position: 10, tokens: 500 }
  ];

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (position === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (position === 3) return <Star className="w-5 h-5 text-amber-600" />;
    return <span className="text-lg font-bold text-white">#{position}</span>;
  };

  const LeaderboardCard = ({ entry, position }: { entry: LeaderboardEntry; position: number }) => {
    const reward = rewards[position - 1];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ 
          duration: 0.3,
          layout: { duration: 0.3 }
        }}
        className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors"
      >
        <div className="flex items-center justify-between">
          {/* Left side: Position + Kingdom Info */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              {getPositionIcon(position)}
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg">{entry.name}</h3>
              <p className="text-white/70 text-sm">{entry.creator}</p>
            </div>
          </div>

          {/* Right side: Stats */}
          <div className="text-right">
            <div className="text-white font-bold text-lg">
              {entry.contribution.toLocaleString()} pts
            </div>
            <div className="flex items-center gap-1 text-white/80 text-sm justify-end">
              <Coins className="w-4 h-4" />
              <span>{reward.tokens.toLocaleString()} ALGO</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyLeaderboardCard = ({ position }: { position: number }) => {
    const reward = rewards[position - 1];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ 
          duration: 0.3,
          layout: { duration: 0.3 }
        }}
        className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-lg font-bold text-white/50">#{position}</span>
            </div>
            
            <div>
              <h3 className="font-bold text-white/50 text-lg">Empty Throne</h3>
              <p className="text-white/30 text-sm">Awaiting a kingdom</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white/50 font-bold text-lg">0 pts</div>
            <div className="flex items-center gap-1 text-white/40 text-sm justify-end">
              <Coins className="w-4 h-4" />
              <span>{reward.tokens.toLocaleString()} ALGO</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen page-top-padding">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/kingdom-dapp-arena-bg copy.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/20 to-[#f5a105] z-10" />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
              <Sword className="w-8 h-8 text-amber-950" />
            </div>
            <h1 className="text-4xl font-bold text-white">Kingdom Battle Arena</h1>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700">
              <Sword className="w-8 h-8 text-amber-950" />
            </div>
          </div>
          <p className="text-xl text-white/90">
            Compete for glory and rewards in the weekly kingdom tournament
          </p>
        </motion.div>

        {/* Timer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medieval-card !bg-amber-950/90 backdrop-blur-md border-amber-600 mb-8"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Timer className="w-6 h-6 text-amber-100" />
              <h2 className="text-2xl font-bold text-amber-100">Next Reward Distribution</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((time, index) => (
                <div key={index} className="bg-amber-900/50 rounded-xl p-4 border-2 border-amber-600">
                  <div className="text-3xl font-bold text-amber-100">{time.value.toString().padStart(2, '0')}</div>
                  <div className="text-sm text-amber-200/80">{time.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-amber-200/80">
              <Coins className="w-5 h-5" />
              <span>Total Prize Pool: <span className="font-bold text-amber-100">42,250 ALGO</span></span>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="medieval-card !bg-amber-950/90 backdrop-blur-md border-amber-600"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-amber-100" />
            <h2 className="text-2xl font-bold text-amber-100">Weekly Leaderboard</h2>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: 10 }, (_, index) => {
                const position = index + 1;
                const entry = leaderboard[index];
                
                return entry ? (
                  <LeaderboardCard key={`entry-${entry.id}`} entry={entry} position={position} />
                ) : (
                  <EmptyLeaderboardCard key={`empty-${position}`} position={position} />
                );
              })}
            </AnimatePresence>
          </div>

          {/* Contribution Info */}
          <div className="mt-8 pt-6 border-t-2 border-amber-600/30">
            <h3 className="text-lg font-bold text-amber-100 mb-4">How to Earn Contribution Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-900/30 rounded-xl p-4 border-2 border-amber-600/50">
                <Crown className="w-6 h-6 text-amber-100 mb-2" />
                <h4 className="font-bold text-amber-100 mb-1">Create Projects</h4>
                <p className="text-sm text-amber-200/80">Launch new kingdoms to earn base points</p>
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border-2 border-amber-600/50">
                <Coins className="w-6 h-6 text-amber-100 mb-2" />
                <h4 className="font-bold text-amber-100 mb-1">Stake Tokens</h4>
                <p className="text-sm text-amber-200/80">Stake in The Fortune Pit for bonus points</p>
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border-2 border-amber-600/50">
                <Star className="w-6 h-6 text-amber-100 mb-2" />
                <h4 className="font-bold text-amber-100 mb-1">Community Activity</h4>
                <p className="text-sm text-amber-200/80">Vote on proposals and engage with others</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}