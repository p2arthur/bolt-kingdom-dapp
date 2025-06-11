import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Vote, Coins, Github, Crown, ExternalLink, TrendingUp, Timer, Zap, Sword, Shield, Star, Heart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useKingdom } from '../contexts/KingdomContext';
import { getFavorites } from '../lib/favorites';
import { sharedProjects } from '../lib/yjs';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectCard from '../components/ProjectCard';

function Home() {
  const { kingdoms, favoriteKingdoms } = useKingdom();
  const [scrollY, setScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  
  const heroRef = useRef(null);
  const activeKingdomsRef = useRef(null);
  const favoritesRef = useRef(null);

  const sections = [
    { ref: heroRef, label: 'Hero' },
    { ref: activeKingdomsRef, label: 'Active Kingdoms' },
    ...(favoriteKingdoms.length > 0 ? [{ ref: favoritesRef, label: 'Favorites' }] : [])
  ];

  const coinPositions = [
    // Hero section coins
    { scale: 1, rotate: 0, delay: 0, x: -300, y: -150 },
    { scale: 0.8, rotate: 45, delay: 2, x: 300, y: -100 },
    { scale: 0.6, rotate: -30, delay: 4, x: 0, y: 200 },
    { scale: 0.7, rotate: 15, delay: 1, x: -200, y: 100 },
    { scale: 0.5, rotate: -45, delay: 3, x: 200, y: -200 },
    { scale: 0.9, rotate: 60, delay: 2.5, x: -100, y: -250 },
    { scale: 0.4, rotate: -15, delay: 1.5, x: 250, y: 150 },
    { scale: 0.75, rotate: 30, delay: 3.5, x: -350, y: 50 },
    { scale: 0.55, rotate: -60, delay: 0.5, x: 150, y: 250 },
    // Active Kingdoms section coins
    { scale: 0.65, rotate: 20, delay: 2, x: -400, y: 600 },
    { scale: 0.45, rotate: -40, delay: 1, x: 350, y: 700 },
    { scale: 0.85, rotate: 50, delay: 3, x: -200, y: 800 },
    { scale: 0.35, rotate: -25, delay: 2.5, x: 300, y: 900 },
    { scale: 0.7, rotate: 35, delay: 1.5, x: -300, y: 1000 },
    // Favorites section coins
    { scale: 0.5, rotate: -55, delay: 4, x: 250, y: 1300 },
    { scale: 0.8, rotate: 25, delay: 2, x: -350, y: 1400 },
    { scale: 0.4, rotate: -30, delay: 3, x: 400, y: 1500 },
    { scale: 0.6, rotate: 45, delay: 1, x: -250, y: 1600 },
    { scale: 0.75, rotate: -15, delay: 2.5, x: 300, y: 1700 },
    // Additional floating coins
    { scale: 0.55, rotate: 40, delay: 3.5, x: -400, y: 1900 },
    { scale: 0.45, rotate: -35, delay: 1.5, x: 350, y: 2000 },
    { scale: 0.65, rotate: 30, delay: 2, x: -300, y: 2200 },
    { scale: 0.35, rotate: -50, delay: 4, x: 400, y: 2300 },
    { scale: 0.7, rotate: 20, delay: 3, x: -350, y: 2500 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY + (viewportHeight / 2);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i].ref.current;
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const scrollToSection = (index) => {
    const section = sections[index].ref.current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const EmptyKingdomCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="medieval-card !bg-white/20 !border-white/30"
    >
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-xl font-bold text-white/50 mb-2">Empty Kingdom Slot</h3>
          <p className="text-white/40">
            A new kingdom awaits to be forged
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Debug logging
  console.log('🏠 Home component render:');
  console.log('🏠 - kingdoms from context:', kingdoms);
  console.log('🏠 - kingdoms length:', kingdoms.length);
  console.log('🏠 - favoriteKingdoms:', favoriteKingdoms);
  console.log('🏠 - Raw YJS array:', sharedProjects.toArray());
  console.log('🏠 - YJS array length:', sharedProjects.length);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Navigation Buttons */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-12 h-12 rounded-full border-4 transition-all transform hover:scale-110 flex items-center justify-center group ${
              currentSection === index
                ? 'bg-amber-950 border-amber-100 text-amber-100'
                : 'bg-amber-100/20 border-amber-950/50 text-amber-950/50 hover:bg-amber-100/40'
            }`}
          >
            <ChevronDown className="w-6 h-6" />
            <span className="absolute right-full mr-4 whitespace-nowrap text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {section.label}
            </span>
          </button>
        ))}
      </div>

      {/* Parallax Background with Floating Coins */}
      <div className="fixed inset-0">
        <div 
          className="absolute inset-0 w-full h-[200vh]"
          style={{
            backgroundImage: 'url("/images/kingdom-dapp-paralax-bg copy.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(-${scrollY * 0.5}px)`,
            top: '34px',
          }}
        />
        <div className="absolute inset-0 bg-amber-500/30" />
        
        {/* Floating Coins */}
        {coinPositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2"
            initial={{ 
              x: position.x, 
              y: position.y - scrollY * 0.8,
              scale: position.scale, 
              rotate: position.rotate 
            }}
            animate={{
              rotate: position.rotate + 360,
              y: [
                position.y - scrollY * 0.8 - 20,
                position.y - scrollY * 0.8 + 20,
                position.y - scrollY * 0.8 - 20
              ],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: position.delay },
            }}
          >
            <img 
              src="/images/kingdom_dapp_algo_coin.png"
              alt="ALGO"
              className="w-32 h-32 object-contain"
              style={{ transform: `scale(${position.scale})` }}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="relative">
        {/* Hero Section */}
        <div 
          ref={heroRef} 
          className="relative h-[calc(100vh-34px)] flex items-center justify-center"
          style={{ marginTop: '34px' }}
        >
          <div className="relative z-30 flex flex-col items-center justify-center text-center mt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-[500px] max-w-full"
            >
              <img 
                src="/images/kingdom-dapp-logo-2.png"
                alt="KingdomDapp"
                className="w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <CreateProjectModal />
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          <div className="relative z-20 max-w-4xl mx-auto px-4 py-20">
            {/* Active Kingdoms Section */}
            <section ref={activeKingdomsRef} className="mb-20 min-h-screen flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
                <Crown className="w-8 h-8" />
                Active Kingdoms ({kingdoms.length})
              </h2>
              
              {/* Debug Info */}
              <div className="mb-4 p-4 bg-black/20 rounded-lg text-white text-sm">
                <div>🔍 Debug Info:</div>
                <div>- Context kingdoms: {kingdoms.length}</div>
                <div>- YJS array length: {sharedProjects.length}</div>
                <div>- YJS contents: {JSON.stringify(sharedProjects.toArray().map(k => k.name))}</div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kingdoms.length > 0 ? (
                  kingdoms.map((project, index) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      isNew={index === 0} 
                    />
                  ))
                ) : (
                  <>
                    <EmptyKingdomCard />
                    <EmptyKingdomCard />
                    <EmptyKingdomCard />
                  </>
                )}
              </div>
            </section>

            {/* Favorite Kingdoms Section */}
            {favoriteKingdoms.length > 0 && (
              <section ref={favoritesRef} className="min-h-screen flex flex-col justify-center">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-20" />
                
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                  <Star className="w-7 h-7 fill-white text-white" />
                  Favorite Kingdoms ({favoriteKingdoms.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteKingdoms.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;