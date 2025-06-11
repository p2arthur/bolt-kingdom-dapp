import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wand2, Settings, ChevronRight, Sparkles, Crown, Scroll, Sword, Hammer } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { addKingdom } from '../lib/yjs';
import clsx from 'clsx';

const microdapps = [
  { id: 'governance', name: 'Governance', description: 'DAO voting system' },
  { id: 'staking', name: 'Staking', description: 'Token staking rewards' },
  { id: 'marketplace', name: 'Marketplace', description: 'NFT trading platform' },
  { id: 'bridge', name: 'Bridge', description: 'Cross-chain bridge' },
];

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'choose' | 'manual' | 'ai'>('choose');
  const [isLoading, setIsLoading] = useState(false);
  
  // Manual creation state
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#A855F7');
  const [secondaryColor, setSecondaryColor] = useState('#F0ABFC');
  const [accentColor, setAccentColor] = useState('#C084FC');
  const [selectedDapps, setSelectedDapps] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  
  // AI creation state
  const [prompt, setPrompt] = useState('');
  const [generatedProject, setGeneratedProject] = useState(null);

  const resetState = () => {
    setStep('choose');
    setName('');
    setPrimaryColor('#A855F7');
    setSecondaryColor('#F0ABFC');
    setAccentColor('#C084FC');
    setSelectedDapps([]);
    setImageUrl('');
    setPrompt('');
    setGeneratedProject(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  const handleManualCreate = async () => {
    if (!name || selectedDapps.length === 0) {
      toast.error('Your project requires a name and chosen features');
      return;
    }

    setIsLoading(true);
    try {
      const newProject = {
        id: Date.now().toString(),
        name,
        creator: '0xUser',
        gradient: `from-[${primaryColor}] to-[${secondaryColor}]`,
        description: `A Web3 project with ${selectedDapps.join(', ')}`,
        marketCap: '$0',
        fundingProgress: Math.floor(Math.random() * 80) + 10, // Random progress between 10-90%
        fundingGoal: '$500K',
        imageUrl,
        primaryColor,
        secondaryColor,
        accentColor,
        features: selectedDapps.map(dapp => ({
          name: dapp.charAt(0).toUpperCase() + dapp.slice(1),
          description: microdapps.find(d => d.id === dapp)?.description || ''
        }))
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the new addKingdom function
      addKingdom(newProject);
      
      toast.success('Project forged successfully! 🗡️');
      handleClose();
    } catch (error) {
      toast.error('Failed to forge project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!prompt) {
      toast.error('The Oracle requires your vision');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProject = {
        id: Date.now().toString(),
        name: "Oracle's Vision",
        creator: "0xOracle",
        gradient: "from-amber-500 to-amber-700",
        description: prompt,
        marketCap: "$0",
        fundingProgress: Math.floor(Math.random() * 80) + 10,
        fundingGoal: "$500K",
        primaryColor: "#F59E0B",
        secondaryColor: "#B45309",
        accentColor: "#D97706",
        features: [
          { name: "Feature 1", description: "Oracle Generated Feature" },
          { name: "Feature 2", description: "Oracle Generated Feature" }
        ]
      };

      setGeneratedProject(newProject);
    } catch (error) {
      toast.error('The Oracle could not divine your vision');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIDeploy = async () => {
    if (!generatedProject) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the new addKingdom function
      addKingdom(generatedProject);
      
      toast.success('Project manifested successfully! ✨');
      handleClose();
    } catch (error) {
      toast.error('Failed to manifest project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="medieval-button flex items-center gap-2">
          <Hammer className="w-5 h-5" />
          <span>Enter the Forge</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto z-50">
          <div className="bg-amber-800 border-4 border-amber-950 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b-4 border-amber-900">
              <Dialog.Title className="text-2xl font-bold text-amber-100">
                The Forge
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-amber-700/50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-amber-200" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-6 bg-amber-800/95">
              <AnimatePresence mode="wait">
                {step === 'choose' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={() => setStep('ai')}
                      className="w-full p-4 bg-amber-700 hover:bg-amber-600 border-4 border-amber-900 rounded-xl transition-colors flex items-center gap-4"
                    >
                      <div className="p-3 rounded-xl bg-amber-600">
                        <Scroll className="w-6 h-6 text-amber-200" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-amber-100">Consult the Oracle</h3>
                        <p className="text-sm text-amber-200/80">Let the Oracle guide your vision</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-200/50" />
                    </button>

                    <button
                      onClick={() => setStep('manual')}
                      className="w-full p-4 bg-amber-700 hover:bg-amber-600 border-4 border-amber-900 rounded-xl transition-colors flex items-center gap-4"
                    >
                      <div className="p-3 rounded-xl bg-amber-600">
                        <Sword className="w-6 h-6 text-amber-200" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-amber-100">Forge Manually</h3>
                        <p className="text-sm text-amber-200/80">Craft every detail yourself</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-200/50" />
                    </button>
                  </motion.div>
                )}

                {step === 'manual' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-amber-200">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-amber-900/50 border-4 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600"
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-amber-200">
                          Primary Color
                        </label>
                        <div className="relative">
                          <div className="h-10 w-full rounded-lg border-4 border-amber-900 cursor-pointer" 
                               style={{ backgroundColor: primaryColor }}
                               onClick={() => document.getElementById('primaryPicker')?.classList.toggle('hidden')}
                          />
                          <div id="primaryPicker" className="absolute z-10 top-full mt-2 hidden">
                            <HexColorPicker color={primaryColor} onChange={setPrimaryColor} style={{ width: '150px', height: '150px' }} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-amber-200">
                          Secondary Color
                        </label>
                        <div className="relative">
                          <div className="h-10 w-full rounded-lg border-4 border-amber-900 cursor-pointer" 
                               style={{ backgroundColor: secondaryColor }}
                               onClick={() => document.getElementById('secondaryPicker')?.classList.toggle('hidden')}
                          />
                          <div id="secondaryPicker" className="absolute z-10 top-full mt-2 hidden">
                            <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} style={{ width: '150px', height: '150px' }} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-amber-200">
                          Accent Color
                        </label>
                        <div className="relative">
                          <div className="h-10 w-full rounded-lg border-4 border-amber-900 cursor-pointer" 
                               style={{ backgroundColor: accentColor }}
                               onClick={() => document.getElementById('accentPicker')?.classList.toggle('hidden')}
                          />
                          <div id="accentPicker" className="absolute z-10 top-full mt-2 hidden">
                            <HexColorPicker color={accentColor} onChange={setAccentColor} style={{ width: '150px', height: '150px' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-amber-200">
                        Select Features
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {microdapps.map((dapp) => {
                          const isSelected = selectedDapps.includes(dapp.id);
                          return (
                            <button
                              key={dapp.id}
                              onClick={() => {
                                setSelectedDapps(prev => 
                                  prev.includes(dapp.id)
                                    ? prev.filter(id => id !== dapp.id)
                                    : [...prev, dapp.id]
                                );
                              }}
                              className={clsx(
                                "p-4 rounded-xl transition-all transform",
                                isSelected 
                                  ? "bg-amber-600 border-4 border-amber-400 shadow-[0_0_20px_rgba(217,119,6,0.3)] scale-105" 
                                  : "bg-amber-700 border-4 border-amber-900 hover:bg-amber-600/80"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={clsx(
                                  "w-8 h-8 rounded-lg flex items-center justify-center",
                                  isSelected ? "bg-amber-500" : "bg-amber-800"
                                )}>
                                  <Crown className={clsx(
                                    "w-5 h-5",
                                    isSelected ? "text-amber-950" : "text-amber-500"
                                  )} />
                                </div>
                                <div className="text-left">
                                  <h4 className={clsx(
                                    "font-bold",
                                    isSelected ? "text-amber-950" : "text-amber-100"
                                  )}>{dapp.name}</h4>
                                  <p className={clsx(
                                    "text-sm",
                                    isSelected ? "text-amber-900" : "text-amber-200/80"
                                  )}>{dapp.description}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-amber-200">
                        Project Image URL
                      </label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-amber-900/50 border-4 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600"
                        placeholder="https://example.com/image.png"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button
                        onClick={() => setStep('choose')}
                        className="px-6 py-2 text-amber-200 hover:bg-amber-700/50 rounded-xl transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleManualCreate}
                        disabled={isLoading}
                        className="flex-1 medieval-button"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <span>Forge Project</span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'ai' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {!generatedProject ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-amber-200">
                            Share Your Vision
                          </label>
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-amber-900/50 border-4 border-amber-900 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-600 h-32 resize-none"
                            placeholder="Describe your project to the Oracle..."
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setStep('choose')}
                            className="px-6 py-2 text-amber-200 hover:bg-amber-700/50 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleAIGenerate}
                            disabled={isLoading}
                            className="flex-1 medieval-button flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              <>
                                <Scroll className="w-5 h-5" />
                                <span>Consult Oracle</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-amber-700 border-4 border-amber-900 rounded-xl p-6 space-y-4">
                          <h3 className="text-xl font-bold text-amber-100">{generatedProject.name}</h3>
                          <p className="text-amber-200/80">{generatedProject.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {generatedProject.features.map((feature, index) => (
                              <div key={index} className="bg-amber-800 border-4 border-amber-900 rounded-xl p-4">
                                <h4 className="font-bold text-amber-100">{feature.name}</h4>
                                <p className="text-sm text-amber-200/80">{feature.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setGeneratedProject(null)}
                            className="px-6 py-2 text-amber-200 hover:bg-amber-700/50 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleAIDeploy}
                            disabled={isLoading}
                            className="flex-1 medieval-button flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              <span>Manifest Project</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}