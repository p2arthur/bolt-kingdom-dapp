import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Users, Coins, Vote, Globe, Code, Shield, TrendingUp, Timer, Sword, Scroll, Star, Trophy } from 'lucide-react';
import { sharedProjects, calculateLevel, calculateReputation } from '../lib/yjs';
import FavoriteButton from '../components/FavoriteButton';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [level, setLevel] = useState(0);
  const [reputation, setReputation] = useState(0);

  useEffect(() => {
    const projects = sharedProjects.toArray();
    const foundProject = projects.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
      setLevel(calculateLevel(foundProject));
      setReputation(calculateReputation(foundProject));
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="text-center space-y-4">
          <Crown className="w-16 h-16 mx-auto text-amber-950" />
          <h1 className="text-2xl font-bold text-amber-950">Kingdom Not Found</h1>
          <Link 
            to="/" 
            className="medieval-button inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Realm
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Vote,
      name: "Governance",
      description: "Democratic voting system for community proposals",
      link: `/dapp/round-table/${id}`
    },
    {
      icon: Coins,
      name: "Staking",
      description: "Earn rewards by staking your tokens",
      link: `/dapp/the-fortune-pit/${id}`
    },
    {
      icon: Shield,
      name: "Security",
      description: "Multi-signature protection and audited contracts"
    }
  ];

  const stats = [
    {
      label: "Level",
      value: level,
      icon: Star,
      suffix: ""
    },
    {
      label: "Reputation",
      value: reputation.toLocaleString(),
      icon: Trophy,
      suffix: "XP"
    },
    {
      label: "Treasury",
      value: project.marketCap,
      icon: Coins,
      suffix: ""
    }
  ];

  return (
    <div className="min-h-screen px-4 py-12 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-amber-950 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Kingdoms</span>
          </Link>
          <FavoriteButton projectId={project.id} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Card */}
          <div className="medieval-card">
            <div className="flex items-center gap-6 mb-8">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${project.gradient}`}>
                <Crown className="w-12 h-12 text-amber-950" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-amber-950">{project.name}</h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-900/10 rounded-full border-2 border-amber-950">
                    <Star className="w-4 h-4 text-amber-950" />
                    <span className="font-bold text-amber-950">Lvl {level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-amber-950/80">
                  <Shield className="w-4 h-4" />
                  <span>Created by {project.creator}</span>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-amber-950/90 mb-8">
              {project.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-amber-900/10 rounded-xl p-4 border-4 border-amber-950"
                >
                  <stat.icon className="w-6 h-6 text-amber-950 mb-2" />
                  <div className="text-2xl font-bold text-amber-950">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-amber-950/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Reputation Progress */}
            <div className="mt-6 pt-6 border-t-4 border-amber-950">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-950" />
                  <span className="font-bold text-amber-950">Reputation Progress</span>
                </div>
                <span className="text-sm text-amber-950/70">
                  Next Level: {(Math.floor(reputation / 1000) + 1) * 1000} XP
                </span>
              </div>
              <div className="h-4 bg-amber-900/20 rounded-full overflow-hidden border-4 border-amber-950">
                <div 
                  className={`h-full bg-gradient-to-r ${project.gradient}`}
                  style={{ width: `${(reputation % 1000) / 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="medieval-card">
            <h2 className="text-2xl font-bold text-amber-950 mb-6 flex items-center gap-2">
              <Timer className="w-6 h-6" />
              Quest Progress
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-amber-950/80">Current Progress</span>
                <span className="font-bold text-amber-950">{project.fundingProgress}%</span>
              </div>
              <div className="h-4 bg-amber-900/20 rounded-full overflow-hidden border-4 border-amber-950">
                <div 
                  className={`h-full bg-gradient-to-r ${project.gradient}`}
                  style={{ width: `${project.fundingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-amber-950/70">
                <span>0%</span>
                <span>Goal: {project.fundingGoal}</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="medieval-card">
            <h2 className="text-2xl font-bold text-amber-950 mb-6 flex items-center gap-2">
              <Sword className="w-6 h-6" />
              Kingdom Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-amber-900/10 rounded-xl p-6 border-4 border-amber-950 ${
                    feature.link ? 'cursor-pointer hover:bg-amber-900/20 transition-colors' : ''
                  }`}
                  onClick={() => feature.link && window.location.assign(feature.link)}
                >
                  <feature.icon className="w-8 h-8 text-amber-950 mb-4" />
                  <h3 className="text-lg font-bold text-amber-950 mb-2">{feature.name}</h3>
                  <p className="text-amber-950/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button className="medieval-button flex items-center gap-2">
              <Scroll className="w-5 h-5" />
              <span>View Documentation</span>
            </button>
            <button className="medieval-button flex items-center gap-2">
              <Code className="w-5 h-5" />
              <span>View Source</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectDetails;