import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Users, Coins, Vote, Globe, Code, Shield, TrendingUp, Timer, Sword, Scroll, Star, Trophy, Zap, Palette } from 'lucide-react';
import { sharedProjects, calculateLevel, calculateReputation } from '../lib/yjs';
import { useKingdom } from '../contexts/KingdomContext';
import FavoriteButton from '../components/FavoriteButton';

interface AlgorandKingdomData {
  INITIAL_SUPPLY?: number;
  MAX_TOKEN_SUPPLY?: number;
  project_accent_color?: string;
  project_background_color?: string;
  project_creator?: string;
  project_description?: string;
  project_image_url?: string;
  project_name?: string;
  project_primary_color?: string;
  project_secondary_color?: string;
  project_text_color?: string;
  project_token?: number;
  REALM_APP_ID?: number;
  total_funded?: number;
  TREASURY_APP_ADDRESS?: string;
  TREASURY_APP_ID?: number;
}

function ProjectDetails() {
  const { id } = useParams();
  const { kingdoms } = useKingdom();
  const [project, setProject] = useState(null);
  const [algorandData, setAlgorandData] = useState<AlgorandKingdomData | null>(null);
  const [level, setLevel] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [isLoadingAlgorand, setIsLoadingAlgorand] = useState(false);

  // Fetch Algorand kingdom data
  const fetchAlgorandKingdomData = async (kingdomId: string) => {
    // Extract numeric ID from algorand kingdom ID format
    const numericId = kingdomId.replace('algorand-', '');
    
    if (!numericId || isNaN(Number(numericId))) {
      console.log('🔍 Not an Algorand kingdom or invalid ID format');
      return;
    }

    setIsLoadingAlgorand(true);
    try {
      console.log(`🌐 Fetching Algorand data for kingdom ID: ${numericId}`);
      
      const response = await fetch(`https://testnet-idx.4160.nodely.dev/v2/applications/${numericId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🏰 Raw Algorand kingdom data:', data);

      // Parse global state if available
      if (data.params && data.params['global-state']) {
        const globalState = data.params['global-state'];
        const parsedData: AlgorandKingdomData = {};

        globalState.forEach((item: any) => {
          const key = atob(item.key); // Decode base64 key
          
          if (item.value.type === 1) { // Bytes
            parsedData[key] = atob(item.value.bytes);
          } else if (item.value.type === 2) { // Uint
            parsedData[key] = item.value.uint;
          }
        });

        console.log('✅ Parsed Algorand kingdom data:', parsedData);
        setAlgorandData(parsedData);
      }
    } catch (error) {
      console.error('❌ Error fetching Algorand kingdom data:', error);
    } finally {
      setIsLoadingAlgorand(false);
    }
  };

  useEffect(() => {
    // First try to find in local kingdoms
    const foundProject = kingdoms.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
      setLevel(calculateLevel(foundProject));
      setReputation(calculateReputation(foundProject));
      
      // If it's an Algorand kingdom, fetch additional data
      if (foundProject.isAlgorand) {
        fetchAlgorandKingdomData(foundProject.id);
      }
    }
  }, [id, kingdoms]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center page-top-padding">
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

  // Use Algorand data colors if available, otherwise use project colors
  const displayColors = algorandData ? {
    primary: algorandData.project_primary_color || project.primaryColor || '#A855F7',
    secondary: algorandData.project_secondary_color || project.secondaryColor || '#F0ABFC',
    accent: algorandData.project_accent_color || project.accentColor || '#C084FC',
    background: algorandData.project_background_color || '#2b2f3d',
    text: algorandData.project_text_color || '#ffffff'
  } : {
    primary: project.primaryColor || '#A855F7',
    secondary: project.secondaryColor || '#F0ABFC',
    accent: project.accentColor || '#C084FC',
    background: '#2b2f3d',
    text: '#ffffff'
  };

  const displayName = algorandData?.project_name || project.name;
  const displayDescription = algorandData?.project_description || project.description;
  const displayCreator = algorandData?.project_creator || project.creator;

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

  // Algorand-specific stats
  const algorandStats = algorandData ? [
    {
      label: "Token Supply",
      value: algorandData.INITIAL_SUPPLY?.toLocaleString() || '0',
      icon: Coins,
      suffix: ""
    },
    {
      label: "Max Supply",
      value: algorandData.MAX_TOKEN_SUPPLY?.toLocaleString() || '0',
      icon: TrendingUp,
      suffix: ""
    },
    {
      label: "Total Funded",
      value: algorandData.total_funded?.toLocaleString() || '0',
      icon: Shield,
      suffix: " ALGO"
    },
    {
      label: "Token ID",
      value: algorandData.project_token?.toString() || 'N/A',
      icon: Code,
      suffix: ""
    }
  ] : [];

  return (
    <div className="min-h-screen px-4 py-12 page-top-padding">
      {/* Kingdom Color Palette - Fixed Position */}
      <div className="fixed top-24 right-8 z-30">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-amber-950"
        >
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-amber-950" />
            <span className="text-sm font-bold text-amber-950">Kingdom Colors</span>
          </div>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: displayColors.primary }}
              title="Primary Color"
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: displayColors.secondary }}
              title="Secondary Color"
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: displayColors.accent }}
              title="Accent Color"
            />
          </div>
        </motion.div>
      </div>

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
          {/* Simplified Header Card */}
          <div className="medieval-card">
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 rounded-xl bg-amber-950">
                {project.isAlgorand ? (
                  <Zap className="w-12 h-12 text-amber-100" />
                ) : (
                  <Crown className="w-12 h-12 text-amber-100" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-amber-950">{displayName}</h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-900/10 rounded-full border-2 border-amber-950">
                    <Star className="w-4 h-4 text-amber-950" />
                    <span className="font-bold text-amber-950">Lvl {level}</span>
                  </div>
                  {project.isAlgorand && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full border-2 border-green-600">
                      <img 
                        src="https://algorand.com/static/algorand-logo-mark-black-6e6e611912fccb44f0f9d2aeaac193e8.svg" 
                        alt="Algorand" 
                        className="h-4"
                      />
                      <span className="text-xs font-bold text-green-800">ALGORAND</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-amber-950/80">
                  <Shield className="w-4 h-4" />
                  <span>Created by {displayCreator}</span>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-amber-950/90 mb-6">
              {displayDescription}
            </p>

            {/* Loading indicator for Algorand data */}
            {project.isAlgorand && isLoadingAlgorand && (
              <div className="mb-6 p-4 bg-blue-100/50 rounded-xl border-2 border-blue-300">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <span className="text-blue-800 font-bold">Loading Algorand data...</span>
                </div>
              </div>
            )}

            {/* Simplified Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(algorandData ? algorandStats : stats).map((stat, index) => (
                <div 
                  key={index}
                  className="bg-amber-900/10 rounded-xl p-4 border-2 border-amber-950"
                >
                  <stat.icon className="w-6 h-6 text-amber-950 mb-2" />
                  <div className="text-xl font-bold text-amber-950">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-amber-950/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Algorand-specific info */}
            {algorandData && (
              <div className="mt-6 pt-6 border-t-2 border-amber-950">
                <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Algorand Contract Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {algorandData.TREASURY_APP_ID && (
                    <div>
                      <span className="font-bold text-amber-950">Treasury App ID:</span>
                      <span className="ml-2 font-mono text-amber-950/80">{algorandData.TREASURY_APP_ID}</span>
                    </div>
                  )}
                  {algorandData.REALM_APP_ID && (
                    <div>
                      <span className="font-bold text-amber-950">Realm App ID:</span>
                      <span className="ml-2 font-mono text-amber-950/80">{algorandData.REALM_APP_ID}</span>
                    </div>
                  )}
                  {algorandData.TREASURY_APP_ADDRESS && (
                    <div className="md:col-span-2">
                      <span className="font-bold text-amber-950">Treasury Address:</span>
                      <span className="ml-2 font-mono text-xs text-amber-950/80 break-all">{algorandData.TREASURY_APP_ADDRESS}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Simplified Progress Section */}
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
              <div className="h-4 bg-amber-900/20 rounded-full overflow-hidden border-2 border-amber-950">
                <div 
                  className="h-full bg-amber-950"
                  style={{ width: `${project.fundingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-amber-950/70">
                <span>0%</span>
                <span>Goal: {project.fundingGoal}</span>
              </div>
            </div>
          </div>

          {/* Simplified Features Grid */}
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
                  className={`bg-amber-900/10 rounded-xl p-6 border-2 border-amber-950 transition-all ${
                    feature.link ? 'cursor-pointer hover:bg-amber-900/20' : ''
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

          {/* Simplified Action Buttons */}
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