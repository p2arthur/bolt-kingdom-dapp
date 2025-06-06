import React from 'react';
import { Bold } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-20 border-t border-[#2a3547]">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="https://algorand.com/static/algorand-logo-white-6e6e611912fccb44f0f9d2aeaac193e8.svg" 
            alt="Algorand Logo" 
            className="h-6"
          />
          <span className="text-blue-200/80">Powered by Algorand</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-blue-200/60">
          <span>Made with</span>
          <Bold className="w-4 h-4" />
          <span>by</span>
          <a 
            href="https://github.com/iamp2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            iamp2
          </a>
        </div>
      </div>
    </footer>
  );
}