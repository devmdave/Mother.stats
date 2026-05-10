"use client";

import React, { useState, useEffect } from 'react';

const questions = [
  { id: 'age', label: 'What is your current age?', type: 'number', placeholder: 'e.g. 28' },
  { id: 'meals', label: 'Meals she cooked for you per day (avg)?', type: 'number', placeholder: 'e.g. 2' },
  { id: 'laundry', label: 'Laundry loads she did per week?', type: 'number', placeholder: 'e.g. 3' },
  { id: 'calls', label: 'Calls or check-ins per week now?', type: 'number', placeholder: 'e.g. 1' },
  { id: 'schoolYears', label: 'Years she helped with schoolwork?', type: 'number', placeholder: 'e.g. 12' },
  { id: 'favoriteDish', label: 'How often does she make your favorite dish per month?', type: 'number', placeholder: 'e.g. 2' },
];

const loadingMessages = [
  "Calculating meals...",
  "Analyzing years of repetition...",
  "Rendering invisible effort...",
  "Generating maternal statistics..."
];

export default function Home() {
  const [appState, setAppState] = useState<'intro' | 'form' | 'generating'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    age: '', meals: '', laundry: '', calls: '', schoolYears: '', favoriteDish: ''
  });
  const [loadingIndex, setLoadingIndex] = useState(0);
  
  // Transition logic
  const handleStart = () => setAppState('form');
  
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setAppState('generating');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (val: string) => {
    setFormData(prev => ({ ...prev, [questions[currentStep].id]: val }));
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

      {/* Form State */}
      {appState === 'form' && (
        <div key={currentStep} className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 sm:px-12 animate-fade-in" style={{ animationDuration: '0.8s' }}>
          
          {/* Progress Indicator */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {questions.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-[2px] transition-all duration-700 ${idx <= currentStep ? 'w-8 bg-[#D4A5A5]/80 shadow-[0_0_8px_rgba(212,165,165,0.4)]' : 'w-4 bg-[#8E6A6A]/20'}`}
              />
            ))}
          </div>

          {/* Question Text */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#F6EDEE] font-serif font-light text-center mb-16 leading-tight max-w-2xl">
            {questions[currentStep].label}
          </h2>

          {/* Input Field */}
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A5A5]/0 via-[#D4A5A5]/5 to-[#D4A5A5]/0 rounded-2xl blur opacity-0 transition duration-700"></div>
            <input
              type="number"
              value={formData[questions[currentStep].id]}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNext() }}
              autoFocus
              placeholder={questions[currentStep].placeholder}
              className="relative w-full bg-[#141010]/40 backdrop-blur-xl border border-[#8E6A6A]/20 rounded-2xl px-8 py-6 text-center text-3xl sm:text-4xl text-[#F6EDEE] focus:outline-none focus:border-[#D4A5A5]/50 focus:shadow-[0_0_20px_2px_rgba(212,165,165,0.1)] transition-all duration-500 placeholder:text-[#8E6A6A]/30 placeholder:font-sans font-sans"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8 mt-20">
            {currentStep > 0 && (
              <button 
                onClick={handleBack} 
                className="text-[#8E6A6A] hover:text-[#D4A5A5] transition-colors text-xs tracking-[0.2em] uppercase font-sans font-light"
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-8 py-4 bg-transparent border border-[#8E6A6A]/30 hover:border-[#D4A5A5]/60 hover:bg-[#D4A5A5]/5 text-[#F6EDEE]/90 hover:text-[#F6EDEE] hover:shadow-[0_0_15px_rgba(212,165,165,0.15)] rounded-full transition-all duration-500 text-xs tracking-[0.2em] uppercase font-sans font-light cursor-pointer"
            >
              {currentStep === questions.length - 1 ? "Generate My Report" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Generating/Loading State */}
      {appState === 'generating' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full animate-fade-in-slow">
          <div className="relative flex items-center justify-center mb-12">
            <div className="absolute w-24 h-24 border-t border-[#D4A5A5]/40 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute w-16 h-16 border-b border-[#8E6A6A]/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            <div className="w-2 h-2 rounded-full bg-[#D4A5A5] shadow-[0_0_15px_3px_rgba(212,165,165,0.5)] animate-pulse"></div>
          </div>
          
          <div className="h-12 relative overflow-hidden flex items-center justify-center w-full">
            <p key={loadingIndex} className="absolute text-[#F6EDEE]/80 font-serif italic text-xl sm:text-2xl animate-fade-in tracking-wide" style={{ animationDuration: '0.8s' }}>
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
