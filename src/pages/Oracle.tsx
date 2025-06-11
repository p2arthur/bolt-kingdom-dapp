import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Scroll } from 'lucide-react';
import { sharedProjects } from '../lib/yjs';
import AlgorandKingdomsTest from '../components/AlgorandKingdomsTest';

type Message = {
  id: string;
  type: 'user' | 'oracle';
  content: string;
  timestamp: number;
};

export default function Oracle() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlgorandTest, setShowAlgorandTest] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const projects = sharedProjects.toArray();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate Oracle's response
    setTimeout(() => {
      let response = "I see many possibilities in the mists of time...";
      
      // Check if the question is about projects
      if (input.toLowerCase().includes('project') || input.toLowerCase().includes('kingdom')) {
        if (projects.length > 0) {
          response = `I see ${projects.length} kingdoms in our realm. The most recent one is "${projects[projects.length - 1].name}". What else would you like to know about them?`;
        } else {
          response = "The realm awaits its first kingdom. Perhaps you shall be the one to forge it?";
        }
      }

      // Check if asking about Algorand
      if (input.toLowerCase().includes('algorand') || input.toLowerCase().includes('blockchain')) {
        response = "Ah, you seek knowledge of the Algorand blockchain! I can divine the active kingdom IDs from the testnet. Would you like me to reveal this mystical data?";
        setShowAlgorandTest(true);
      }

      const oracleMessage: Message = {
        id: Date.now().toString(),
        type: 'oracle',
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, oracleMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const crystalBallPositions = [
    { scale: 1, rotate: 0, delay: 0, x: -300, y: 100 },
    { scale: 0.8, rotate: -30, delay: 2, x: 300, y: 200 },
    { scale: 0.6, rotate: 45, delay: 4, x: -200, y: 400 },
    { scale: 0.9, rotate: 15, delay: 1, x: 250, y: 300 },
    { scale: 0.5, rotate: -45, delay: 3, x: -150, y: 600 },
    { scale: 0.7, rotate: 60, delay: 2.5, x: 200, y: 500 },
    { scale: 0.4, rotate: -15, delay: 1.5, x: -250, y: 700 },
    { scale: 0.85, rotate: 30, delay: 3.5, x: 150, y: 800 },
    { scale: 0.55, rotate: -60, delay: 0.5, x: -100, y: 900 },
    { scale: 0.75, rotate: 20, delay: 2.8, x: 300, y: 1000 },
    { scale: 0.45, rotate: -40, delay: 1.8, x: -300, y: 1100 },
    { scale: 0.65, rotate: 50, delay: 3.2, x: 250, y: 1200 },
    { scale: 0.95, rotate: -25, delay: 0.8, x: -200, y: 1300 },
    { scale: 0.35, rotate: 35, delay: 2.2, x: 350, y: 1400 },
    { scale: 0.8, rotate: -55, delay: 4.2, x: -350, y: 1500 }
  ];

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

      {/* Floating Crystal Balls */}
      {crystalBallPositions.map((position, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: position.x, 
            y: position.y,
            scale: position.scale, 
            rotate: position.rotate,
            opacity: 0.6
          }}
          animate={{
            rotate: position.rotate + 360,
            y: [
              position.y - 20,
              position.y + 20,
              position.y - 20
            ],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: position.delay },
          }}
          style={{
            left: `calc(50% + ${position.x}px)`,
          }}
        >
          <img 
            src="/images/kingdom_dapp_crystal_ball.png"
            alt="Crystal Ball"
            className="w-32 h-32 object-contain"
            style={{ transform: `scale(${position.scale})` }}
          />
        </motion.div>
      ))}
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Algorand Test Component */}
        {showAlgorandTest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlgorandKingdomsTest />
          </motion.div>
        )}

        {/* Oracle Chat */}
        <div className="medieval-card min-h-[600px] flex flex-col bg-amber-950/90 backdrop-blur-md border-amber-600">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 border-b border-amber-600/50">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700">
              <Scroll className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <h1 className="text-xl font-medieval text-amber-100">The Oracle's Chamber</h1>
              <p className="text-sm text-amber-200/80">Seek wisdom about the realm</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-amber-600/20 text-amber-100 border-2 border-amber-600/30'
                        : 'bg-amber-800/20 text-amber-200 border-2 border-amber-700/30'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] p-3 rounded-lg bg-amber-800/20 border-2 border-amber-700/30">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="flex items-center gap-2 text-amber-200"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>The Oracle is divining...</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-amber-600/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Oracle about the realm or Algorand..."
                className="flex-1 bg-amber-900/50 border-2 border-amber-600 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/50 focus:outline-none focus:border-amber-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="medieval-button !bg-amber-700 hover:!bg-amber-600 !text-amber-100 !border-amber-600 !px-4"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}