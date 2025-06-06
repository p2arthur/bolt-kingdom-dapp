import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sword, Trophy, Crown, Timer, Coins, Shield, Star, Flame } from 'lucide-react';
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

  // Generate leaderboard data
  const leaderboard: LeaderboardEntry[] = kingdoms
    .map(kingdom => ({
      id: kingdom.id,
      name: kingdom.name,
      creator: kingdom.creator,
      contribution: Math.floor(Math.random() * 10000) + kingdom.fundingProgress * 100,
      level: calculateLevel(kingdom),
      reputation: calculateReputation(kingdom),
      primaryColor: kingdom.primaryColor,
      secondaryColor: kingdom.secondaryColor,
      accentColor: kingdom.accentColor
    }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 10);

  const rewards = [
    { position: 1, tokens: 10000, color: 'from-yellow-400 to-yellow-600' },
    { position: 2, tokens: 7500, color: 'from-gray-300 to-gray-500' },
    { position: 3, tokens: 5000, color: 'from-amber-600 to-amber-800' },
    { position: 4, tokens: 3000, color: 'from-purple-500 to-purple-700' },
    { position: 5, tokens: 2500, color: 'from-blue-500 to-blue-700' },
    { position: 6, tokens: 2000, color: 'from-green-500 to-green-700' },
    { position: 7, tokens: 1500, color: 'from-red-500 to-red-700' },
    { position: 8, tokens: 1000, color: 'from-indigo-500 to-indigo-700' },
    { position: 9, tokens: 750, color: 'from-pink-500 to-pink-700' },
    { position: 10, tokens: 500, color: 'from-teal-500 to-teal-700' }
  ];

  const LeaderboardCard = ({ entry, position }: { entry: LeaderboardEntry; position: number }) => {
    const reward = rewards[position - 1];
    const isTopThree = position <= 3;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.1 }}
        className={`medieval-card !p-4 ${isTopThree ? 'animate-pulse' : ''}`}
        style={{
          background: entry.primaryColor && entry.secondaryColor 
            ? `linear-gradient(135deg, ${entry.primaryColor}, ${entry.secondaryColor})`
            : undefined,
          borderColor: entry.accentColor || '#C084FC'
        }}
      >
        <div className="flex items-center gap-4">
          {/* Position Badge */}
          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
            isTopThree ? 'animate-bounce' : ''
          }`}>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${reward.color} opacity-90`} />
            <div className="relative z-10 flex items-center justify-center">
              {position === 1 && <Crown className="w-6 h-6 text-white" />}
              {position === 2 && <Trophy className="w-6 h-6 text-white" />}
              {position === 3 && <Star className="w-6 h-6 text-white" />}
              {position > 3 && (
                <span className="text-lg font-bold text-white">#{position}</span>
              )}
            </div>
          </div>

          {/* Kingdom Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-lg">{entry.name}</h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">Lvl {entry.level}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90 mb-2">
              <Shield className="w-4 h-4" />
              <span>{entry.creator}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-white" />
                <span className="font-bold text-white">{entry.contribution.toLocaleString()} pts</span>
              </div>
              <div className="flex items-center gap-1 text-white/90">
                <Coins className="w-4 h-4" />
                <span className="font-bold">{reward.tokens.toLocaleString()}</span>
              </div>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.1 }}
        className="medieval-card !bg-white/20 !border-white/30"
      >
        <div className="flex items-center gap-4 py-2">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${reward.color} opacity-50 flex items-center justify-center`}>
            <span className="text-lg font-bold text-white">#{position}</span>
          </div>
          <div className="flex-1">
            <div className="text-white/50 font-bold">Empty Throne</div>
            <div className="text-white/40 text-sm">Awaiting a worthy kingdom</div>
            <div className="flex items-center gap-1 text-white/50 mt-1">
              <Coins className="w-4 h-4" />
              <span className="font-bold">{reward.tokens.toLocaleString()}</span>
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
          backgroundImage: `url('/images/kingdom-dapp-arena-bg.png')`,
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
            {Array.from({ length: 10 }, (_, index) => {
              const position = index + 1;
              const entry = leaderboard[index];
              
              return entry ? (
                <LeaderboardCard key={entry.id} entry={entry} position={position} />
              ) : (
                <EmptyLeaderboardCard key={position} position={position} />
              );
            })}
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