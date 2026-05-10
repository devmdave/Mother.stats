"use client";

import React, { useState, useEffect, useRef } from 'react';
import { calculateMaternalMetrics, MaternalMetrics } from '../utils/calculations';

const loadingMessages = [
  "Calculating lifetime meals...",
  "Estimating repeated routines...",
  "Rendering invisible effort...",
  "Analyzing years of care...",
  "Generating maternal statistics..."
];

export default function Home() {
  const [appState, setAppState] = useState<'intro' | 'form' | 'generating' | 'report'>('intro');
  const [ageStr, setAgeStr] = useState<string>('');
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [metrics, setMetrics] = useState<MaternalMetrics | null>(null);
  
  // Export states
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Transition logic
  const handleStart = () => setAppState('form');
  
  const handleGenerate = () => {
    const age = parseInt(ageStr, 10);
    if (age && age > 0) {
      setMetrics(calculateMaternalMetrics(age));
      setAppState('generating');
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  // HTML-to-Image Export Logic
  const handleExportStory = async () => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    
    try {
      // Dynamic import to avoid SSR issues
      const { toPng } = await import('html-to-image');
      
      // Wait for all fonts and assets to be completely ready
      await document.fonts.ready;
      
      // Slight delay to ensure DOM is perfectly stabilized
      await new Promise(res => setTimeout(res, 300));

      const dataUrl = await toPng(exportRef.current, {
        quality: 1,
        pixelRatio: 2, // Retina quality
        width: 1080,
        height: 1920,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '1080px',
          height: '1920px',
          // Force layout stability during export
          margin: '0',
          padding: '0'
        }
      });
      
      const link = document.createElement('a');
      link.download = 'mother-stats-story.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Loading message rotation
  useEffect(() => {
    if (appState === 'generating') {
      const interval = setInterval(() => {
        setLoadingIndex(prev => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            setAppState('report');
          }, 1000);
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [appState]);

  const stats = metrics ? [
    { value: metrics.totalCareHours.toLocaleString(), label: "Total Care Hours", subtitle: "The invisible shift that never ends.", highlight: true },
    { value: metrics.mealsPrepared.toLocaleString(), label: "Meals Prepared", subtitle: "Across two decades of mornings and nights." },
    { value: metrics.hoursSpentCooking.toLocaleString(), label: "Hours Cooking", subtitle: "Standing quietly at the stove." },
    { value: metrics.lunchesPacked.toLocaleString(), label: "Lunchboxes Packed", subtitle: "Notes folded before the sun rose." },
    { value: metrics.schoolPickupsDrops.toLocaleString(), label: "School Trips", subtitle: "Waiting faithfully in the car line." },
    { value: metrics.clothesWashed.toLocaleString(), label: "Laundry Loads", subtitle: "Washing, folding, repeating." },
    { value: metrics.groceryTrips.toLocaleString(), label: "Grocery Trips", subtitle: "Carrying the weight of the week." },
    { value: metrics.teaCups.toLocaleString(), label: "Cups of Tea", subtitle: "Quiet moments of warmth shared." },
    { value: metrics.kitchenDays.toLocaleString(), label: "Days in Kitchen", subtitle: "Time measured entirely in recipes." },
    { value: metrics.cookingYears.toLocaleString(), label: "Years of Cooking", subtitle: "A fraction of a life, freely given.", highlight: true }
  ] : [];

  return (
    <main className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#070707] selection:bg-[#D4A5A5]/20 selection:text-[#F6EDEE] ${appState === 'report' ? '' : 'overflow-hidden'}`}>
      
      {/* Hidden Export Component (1080x1920) designed precisely for Instagram Story generation */}
      {/* Absolute positioned out of bounds to avoid flashing the user, while keeping it in the DOM */}
      <div 
        ref={exportRef}
        className="absolute top-[-9999px] left-[-9999px] bg-[#070707] flex flex-col items-center justify-between overflow-hidden pointer-events-none"
        style={{ width: '1080px', height: '1920px', padding: '120px 80px' }}
      >
        {/* Export Background Elements */}
        {/* We use inline SVG for noise to ensure html-to-image renders it safely */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-[-10%] left-[-20%] w-[1200px] h-[1200px] bg-[radial-gradient(circle,rgba(142,106,106,0.15)_0%,transparent_60%)]"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(212,165,165,0.12)_0%,transparent_60%)]"></div>
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[1200px] h-[1200px] bg-[radial-gradient(ellipse,rgba(212,165,165,0.05)_0%,transparent_70%)]"></div>
        
        {/* Export Header */}
        <div className="flex flex-col items-center z-10 w-full mt-10">
          <h1 className="text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/80 font-sans leading-none mb-8">
            mother.stats
          </h1>
          <h2 className="text-3xl tracking-[0.6em] uppercase text-[#D4A5A5] font-sans font-medium opacity-90">
            2026 Report
          </h2>
        </div>

        {/* Export Center Stats (Only the highest emotional impact metrics) */}
        {metrics && (
          <div className="flex flex-col items-center justify-center gap-[5.5rem] z-10 w-full flex-grow my-20">
            <div className="flex flex-col items-center">
              <h2 className="text-[9.5rem] font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 tracking-tighter leading-none mb-6">
                {metrics.mealsPrepared.toLocaleString()}
              </h2>
              <h3 className="text-2xl tracking-[0.4em] uppercase text-[#D4A5A5] font-sans font-medium text-center">Meals Prepared</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <h2 className="text-[9.5rem] font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 tracking-tighter leading-none mb-6">
                {metrics.cookingYears.toLocaleString()}
              </h2>
              <h3 className="text-2xl tracking-[0.4em] uppercase text-[#D4A5A5] font-sans font-medium text-center">Years Spent Cooking</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <h2 className="text-[9.5rem] font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 tracking-tighter leading-none mb-6">
                {metrics.kitchenDays.toLocaleString()}
              </h2>
              <h3 className="text-2xl tracking-[0.4em] uppercase text-[#D4A5A5] font-sans font-medium text-center">Kitchen Days</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <h2 className="text-[9.5rem] font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 tracking-tighter leading-none mb-6">
                {metrics.teaCups.toLocaleString()}
              </h2>
              <h3 className="text-2xl tracking-[0.4em] uppercase text-[#D4A5A5] font-sans font-medium text-center">Cups of Tea Made</h3>
            </div>
          </div>
        )}

        {/* Export Footer */}
        <div className="flex flex-col items-center z-10 w-full mb-16 text-center">
          <div className="w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#8E6A6A]/40 to-transparent mb-20"></div>
          <p className="text-[2.6rem] font-light text-[#F6EDEE] font-serif leading-[1.6] italic tracking-wide">
            This is only the math of it.<br/>
            <span className="text-[#D4A5A5]">The actual love behind these numbers<br/>would be impossible to measure.</span>
          </p>
        </div>
      </div>
      {/* End of Export Component */}


      {/* Screen Background Elements */}
      <div className="bg-grain"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(142,106,106,0.06)_0%,transparent_60%)] pointer-events-none -z-10 hw-accel"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(212,165,165,0.04)_0%,transparent_60%)] pointer-events-none -z-10 hw-accel animate-[pulse-glow_15s_ease-in-out_infinite]"></div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block -z-10">
        <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-[#D4A5A5]/20 animate-[float_16s_ease-in-out_infinite] hw-accel"></div>
        <div className="absolute top-[70%] left-[80%] w-3 h-3 rounded-full bg-[#8E6A6A]/15 animate-[float_20s_ease-in-out_infinite_reverse] hw-accel"></div>
      </div>

      {/* Intro State */}
      {appState === 'intro' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-6 sm:px-12 animate-fade-in min-h-screen">
          <div className="animate-fade-in-slow mb-20 sm:mb-28 flex items-center gap-6 hw-accel">
            <div className="h-[1px] w-16 bg-[#8E6A6A]/30"></div>
            <span className="text-[#D4A5A5]/80 uppercase tracking-[0.4em] text-xs font-medium font-sans">System Online</span>
            <div className="h-[1px] w-16 bg-[#8E6A6A]/30"></div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 pb-4 text-center hw-accel font-sans leading-[0.9]">
            mother.stats
          </h1>

          <p className="animate-fade-in-slow mt-14 sm:mt-20 text-2xl sm:text-3xl md:text-4xl text-[#8E6A6A] font-serif italic font-light tracking-wide max-w-3xl text-center leading-relaxed hw-accel" style={{ animationDelay: '300ms' }}>
            &quot;Quantifying invisible love.&quot;
          </p>

          <p className="animate-fade-in-slow mt-8 sm:mt-10 text-base sm:text-lg text-[#F6EDEE]/50 font-sans max-w-lg text-center leading-loose tracking-wide font-light hw-accel" style={{ animationDelay: '500ms' }}>
            A premium emotional data experience. Analyzing quiet sacrifices and infinite patience.
          </p>

          <div className="animate-fade-in-slow mt-24 sm:mt-32 relative group hw-accel" style={{ animationDelay: '700ms' }}>
            <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(212,165,165,0.08)_0%,transparent_70%)] opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <button 
              onClick={handleStart}
              className="relative px-12 py-6 bg-[#141010]/80 border border-[#8E6A6A]/20 md:hover:border-[#D4A5A5]/40 text-[#F6EDEE]/80 md:hover:text-[#F6EDEE] rounded-full transition-colors duration-500 flex items-center gap-6 text-sm tracking-[0.3em] uppercase cursor-pointer z-10 font-sans font-medium"
            >
              <span>Generate Report</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8E6A6A]/50 md:group-hover:bg-[#D4A5A5] transition-colors duration-500"></div>
            </button>
          </div>
        </div>
      )}

      {/* Single Input Form State */}
      {appState === 'form' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 sm:px-12 animate-fade-in min-h-screen" style={{ animationDuration: '1s' }}>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl text-[#F6EDEE] font-serif font-light text-center mb-10 leading-tight max-w-3xl hw-accel italic">
            How old are you?
          </h2>

          <p className="text-base sm:text-lg text-[#8E6A6A] font-sans text-center mb-20 tracking-widest font-light hw-accel opacity-80">
            We&apos;ll estimate the invisible numbers behind your mother&apos;s daily care.
          </p>

          <div className="relative w-full max-w-sm flex flex-col items-center group hw-accel">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,165,165,0.06)_0%,transparent_60%)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"></div>
            
            <input
              type="number"
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate() }}
              autoFocus
              placeholder="0"
              className="relative w-full bg-transparent border-b border-[#8E6A6A]/30 pb-6 text-center text-7xl sm:text-8xl lg:text-9xl text-[#F6EDEE] focus:outline-none focus:border-[#D4A5A5] transition-colors duration-500 placeholder:text-[#8E6A6A]/20 font-bold font-sans tracking-tighter z-10 leading-none"
            />
            
            <div className="absolute bottom-0 w-1/3 h-[1px] bg-[#D4A5A5] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20 origin-center will-change-transform"></div>
          </div>

          <div className="mt-24 hw-accel">
            <button 
              onClick={handleGenerate}
              className={`px-12 py-5 bg-transparent border rounded-full transition-colors duration-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans font-medium cursor-pointer
                ${ageStr ? 'border-[#D4A5A5]/40 md:hover:border-[#D4A5A5]/80 md:hover:bg-[#D4A5A5]/5 text-[#F6EDEE]' 
                         : 'border-[#8E6A6A]/20 text-[#8E6A6A]/50 md:hover:border-[#8E6A6A]/40'}`}
            >
              Generate Statistics
            </button>
          </div>
        </div>
      )}

      {/* Generating/Loading State */}
      {appState === 'generating' && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full animate-fade-in-slow min-h-screen">
          <div className="relative flex items-center justify-center mb-20 hw-accel">
            <div className="absolute w-32 h-32 border-t border-[#D4A5A5]/40 rounded-full animate-spin" style={{ animationDuration: '3.5s' }}></div>
            <div className="absolute w-24 h-24 border-b border-[#8E6A6A]/40 rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#D4A5A5] opacity-80 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
          
          <div className="h-16 relative overflow-hidden flex items-center justify-center w-full max-w-xl hw-accel">
            <p key={loadingIndex} className="absolute text-[#F6EDEE]/90 font-serif italic text-2xl sm:text-3xl animate-slide-up-fade tracking-wide text-center w-full font-light">
              {loadingMessages[loadingIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Report Dashboard State */}
      {appState === 'report' && (
        <div className="relative z-10 flex flex-col items-center justify-start w-full min-h-screen pt-32 pb-40">
          
          {/* Header */}
          <div className="animate-slide-up-fade opacity-0 mb-32 text-center px-6 hw-accel" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xs sm:text-sm tracking-[0.5em] uppercase text-[#8E6A6A] font-sans font-medium mb-6 opacity-80">
              Maternal Data Analysis
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#F6EDEE] font-serif italic font-light tracking-wide">
              The architecture of devotion.
            </h1>
          </div>

          {/* Optimized Grid Layout with breathing space */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 lg:gap-20 w-full max-w-[90rem] mx-auto px-6 md:px-12 mb-40">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={`animate-slide-up-fade opacity-0 flex flex-col items-center justify-center p-12 sm:p-20 rounded-[2.5rem] bg-[#141010]/60 border border-[#8E6A6A]/10 md:hover:bg-[#141010]/90 md:hover:border-[#D4A5A5]/20 transition-colors duration-500 group hw-accel
                ${stat.highlight ? 'md:col-span-2 lg:col-span-3 py-24 sm:py-32' : ''}`}
                style={{ animationDelay: `${200 + (idx * 100)}ms` }}
              >
                <h2 className={`font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 tracking-tighter leading-[0.85] mb-8 text-center transition-transform duration-700 ease-out md:group-hover:scale-[1.03] will-change-transform
                  ${stat.highlight ? 'text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem]' : 'text-7xl sm:text-8xl lg:text-9xl'}
                `}>
                  {stat.value}
                </h2>
                <h3 className="text-xs sm:text-sm tracking-[0.4em] uppercase text-[#D4A5A5] font-sans font-medium mb-5 text-center opacity-90">
                  {stat.label}
                </h3>
                <p className="text-base sm:text-lg font-serif italic text-[#8E6A6A]/90 font-light max-w-sm text-center tracking-wide leading-relaxed">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Emotional Ending Section */}
          <div className="animate-slide-up-fade opacity-0 flex flex-col items-center justify-center w-full max-w-5xl px-6 text-center relative hw-accel" style={{ animationDelay: '1400ms' }}>
            
            {/* Optimized radial gradient instead of blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] bg-[radial-gradient(ellipse,rgba(212,165,165,0.04)_0%,transparent_60%)] pointer-events-none -z-10"></div>

            <h3 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#F6EDEE] font-serif leading-[1.6] sm:leading-[1.6] mb-24 px-4 tracking-wide">
              These numbers are merely the calculable fractions of presence.<br/><br/>
              <span className="text-[#D4A5A5]">The true gravity of her patience, the quiet depths of her sacrifice, and the infinite scale of her love remain elegantly immeasurable.</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 mt-10">
              {/* Added native HTML-to-Image Export button */}
              <button 
                onClick={handleExportStory}
                disabled={isExporting}
                className="px-12 py-6 bg-[#D4A5A5]/10 border border-[#D4A5A5]/30 md:hover:bg-[#D4A5A5]/20 md:hover:border-[#D4A5A5]/50 text-[#F6EDEE] rounded-full transition-colors duration-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]"
              >
                {isExporting ? 'Rendering Story...' : 'Download Story'}
              </button>
              
              <button 
                onClick={handleNativePrint}
                className="px-12 py-6 bg-transparent border border-[#8E6A6A]/30 md:hover:border-[#8E6A6A]/60 text-[#8E6A6A] md:hover:text-[#F6EDEE] rounded-full transition-colors duration-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans font-medium cursor-pointer"
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global utility styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up-fade {
          animation: slide-up-fade 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
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

        /* Hide buttons during printing/export */
        @media print {
          button {
            display: none !important;
          }
          .bg-grain {
            display: none !important;
          }
          body {
            background: #070707 !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}} />
    </main>
  );
}
