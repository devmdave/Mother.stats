"use client";

import React, { useState, useEffect } from 'react';
import { calculateMaternalMetrics } from '../utils/calculations';

const loadingMessages = [
  "Calculating lifetime meals...",
  "Estimating repeated routines...",
  "Rendering invisible effort...",
  "Analyzing years of care...",
  "Generating maternal statistics..."
];

export default function Home() {
  const [appState, setAppState] = useState<'intro' | 'form' | 'generating'>('intro');
  const [ageStr, setAgeStr] = useState<string>('');
  const [loadingIndex, setLoadingIndex] = useState(0);
  
  // Transition logic
  const handleStart = () => setAppState('form');
  
  const handleGenerate = () => {
    if (ageStr && parseInt(ageStr, 10) > 0) {
      setAppState('generating');
    }
  };

  // Loading message rotation
  useEffect(() => {
    if (appState === 'generating') {
      const interval = setInterval(() => {
        setLoadingIndex(prev => {
          if (prev < loadingMessages.length - 1) return prev + 1;
          return prev; // stop at last message for now
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [appState]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#070707] selection:bg-[#D4A5A5]/20 selection:text-[#F6EDEE]">
      {/* Background grain effect */}
      <div className="bg-grain"></div>
      
      {/* Ambient soft romantic bloom (Rose Noir glow) */}
      <div className="absolute top-1/4 left-1/4 w-[45vw] h-[45vw] rounded-full bg-[#8E6A6A]/15 animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-[#D4A5A5]/5 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full bg-[#4a2c2c]/10 animate-pulse-glow" style={{ animationDelay: '4s' }}></div>

      {/* Floating particles - slow cinematic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-[#D4A5A5]/30 animate-float blur-[1px]" style={{ animationDelay: '0s', animationDuration: '14s' }}></div>
        <div className="absolute top-[65%] left-[80%] w-3 h-3 rounded-full bg-[#8E6A6A]/20 animate-float blur-[2px]" style={{ animationDelay: '3s', animationDuration: '20s' }}></div>
        <div className="absolute top-[80%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#F6EDEE]/40 animate-float blur-[1px]" style={{ animationDelay: '7s', animationDuration: '16s' }}></div>
        <div className="absolute top-[25%] left-[75%] w-4 h-4 rounded-full bg-[#8E6A6A]/15 animate-float blur-[3px]" style={{ animationDelay: '1s', animationDuration: '22s' }}></div>
        <div className="absolute top-[50%] left-[40%] w-2 h-2 rounded-full bg-[#D4A5A5]/20 animate-float blur-[1.5px]" style={{ animationDelay: '5s', animationDuration: '15s' }}></div>
      </div>

      {/* Intro State */}
      {appState === 'intro' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-6 sm:px-12 animate-fade-in">
          <div className="animate-fade-in-slow mb-16 sm:mb-24 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-[#8E6A6A]/30"></div>
            <span className="text-[#D4A5A5]/70 uppercase tracking-[0.4em] text-xs font-light font-sans">System Online</span>
            <div className="h-[1px] w-12 bg-[#8E6A6A]/30"></div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] via-[#F6EDEE]/90 to-[#8E6A6A]/40 drop-shadow-sm pb-2 text-center">
            mother.stats
          </h1>

          <p className="delay-300 mt-10 sm:mt-14 text-xl sm:text-2xl md:text-3xl text-[#8E6A6A] font-serif italic font-light tracking-wide max-w-2xl text-center leading-relaxed">
            &quot;Quantifying invisible love.&quot;
          </p>

          <p className="delay-500 mt-6 sm:mt-8 text-sm sm:text-base text-[#F6EDEE]/40 font-sans max-w-md text-center leading-relaxed tracking-wider font-light">
            A premium emotional data experience. Analyzing quiet sacrifices and infinite patience.
          </p>

          <div className="delay-700 mt-20 sm:mt-28 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#D4A5A5]/0 via-[#D4A5A5]/10 to-[#D4A5A5]/0 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500"></div>
            <button 
              onClick={handleStart}
              className="relative px-10 py-5 bg-[#141010]/80 backdrop-blur-xl border border-[#8E6A6A]/20 hover:border-[#D4A5A5]/40 text-[#F6EDEE]/80 hover:text-[#F6EDEE] rounded-full transition-all duration-700 flex items-center gap-5 text-sm tracking-[0.25em] uppercase overflow-hidden group cursor-pointer"
            >
              <span className="relative z-10 font-light font-sans">Generate Report</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8E6A6A]/50 group-hover:bg-[#D4A5A5] group-hover:shadow-[0_0_12px_2px_rgba(212,165,165,0.6)] transition-all duration-700 relative z-10"></div>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[#F6EDEE]/5 to-transparent skew-x-[-20deg]"></div>
            </button>
          </div>
        </div>
      )}

      {/* Single Input Form State */}
      {appState === 'form' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 sm:px-12 animate-fade-in" style={{ animationDuration: '1s' }}>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#F6EDEE] font-serif font-light text-center mb-6 leading-tight max-w-2xl">
            How old are you?
          </h2>

          <p className="text-sm sm:text-base text-[#8E6A6A] font-sans text-center mb-16 tracking-wide font-light">
            We&apos;ll estimate the invisible numbers behind your mother&apos;s daily care.
          </p>

          <div className="relative w-full max-w-xs flex flex-col items-center group">
            {/* Soft glowing ambient background that reveals on focus via CSS group */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A5A5]/0 via-[#D4A5A5]/10 to-[#D4A5A5]/0 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
            
            <input
              type="number"
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate() }}
              autoFocus
              placeholder="0"
              className="relative w-full bg-transparent border-b border-[#8E6A6A]/30 pb-4 text-center text-6xl sm:text-7xl lg:text-8xl text-[#F6EDEE] focus:outline-none focus:border-[#D4A5A5] transition-all duration-700 placeholder:text-[#8E6A6A]/20 font-light font-sans z-10"
            />
            
            {/* Animated custom cursor/blink effect line */}
            <div className="absolute bottom-0 w-1/3 h-[1px] bg-[#D4A5A5] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20"></div>
          </div>

          <div className="mt-20">
            <button 
              onClick={handleGenerate}
              className={`px-10 py-4 bg-transparent border rounded-full transition-all duration-700 text-xs tracking-[0.25em] uppercase font-sans font-light cursor-pointer
                ${ageStr ? 'border-[#D4A5A5]/40 hover:border-[#D4A5A5]/80 hover:bg-[#D4A5A5]/5 text-[#F6EDEE] shadow-[0_0_20px_rgba(212,165,165,0.15)]' 
                         : 'border-[#8E6A6A]/20 text-[#8E6A6A]/50 hover:border-[#8E6A6A]/40'}`}
            >
              Generate Statistics
            </button>
          </div>
        </div>
      )}

      {/* Generating/Loading State */}
      {appState === 'generating' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full animate-fade-in-slow">
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute w-28 h-28 border-t border-[#D4A5A5]/40 rounded-full animate-spin" style={{ animationDuration: '3.5s' }}></div>
            <div className="absolute w-20 h-20 border-b border-[#8E6A6A]/40 rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4A5A5] shadow-[0_0_20px_4px_rgba(212,165,165,0.6)] animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
          
          <div className="h-12 relative overflow-hidden flex items-center justify-center w-full max-w-md">
            <p key={loadingIndex} className="absolute text-[#F6EDEE]/90 font-serif italic text-xl sm:text-2xl animate-fade-in tracking-wide text-center w-full" style={{ animationDuration: '0.8s' }}>
              {loadingMessages[loadingIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Global utility styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        
        /* Remove arrows from number input */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}} />
    </main>
  );
}
