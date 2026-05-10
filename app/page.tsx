import React from 'react';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background grain effect */}
      <div className="bg-grain"></div>
      
      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-amber-600/10 animate-pulse-glow" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-orange-700/10 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-yellow-600/5 animate-pulse-glow" style={{ animationDelay: '4s' }}></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-amber-200/40 animate-float blur-[1px]" style={{ animationDelay: '0s', animationDuration: '12s' }}></div>
        <div className="absolute top-[60%] left-[80%] w-3 h-3 rounded-full bg-amber-300/30 animate-float blur-[2px]" style={{ animationDelay: '3s', animationDuration: '18s' }}></div>
        <div className="absolute top-[80%] left-[25%] w-1.5 h-1.5 rounded-full bg-yellow-100/50 animate-float blur-[1px]" style={{ animationDelay: '7s', animationDuration: '15s' }}></div>
        <div className="absolute top-[30%] left-[70%] w-4 h-4 rounded-full bg-orange-200/20 animate-float blur-[3px]" style={{ animationDelay: '1s', animationDuration: '20s' }}></div>
        <div className="absolute top-[50%] left-[40%] w-2 h-2 rounded-full bg-amber-400/40 animate-float blur-[1.5px]" style={{ animationDelay: '5s', animationDuration: '14s' }}></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-6 sm:px-12">
        
        {/* Subtle top indicator */}
        <div className="animate-fade-in-slow mb-16 sm:mb-24 flex items-center gap-3">
          <div className="h-[1px] w-8 bg-amber-500/40"></div>
          <span className="text-amber-500/60 uppercase tracking-[0.3em] text-xs font-medium font-sans">System Online</span>
          <div className="h-[1px] w-8 bg-amber-500/40"></div>
        </div>

        {/* Branding */}
        <h1 className="animate-fade-in text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/30 drop-shadow-sm pb-2 text-center">
          mother.stats
        </h1>

        {/* Emotional Tagline */}
        <p className="animate-fade-in delay-300 mt-8 sm:mt-12 text-xl sm:text-2xl md:text-3xl text-zinc-400 font-serif italic font-light tracking-wide max-w-2xl text-center leading-relaxed">
          &quot;Quantifying invisible love.&quot;
        </p>

        {/* Subtle descriptive text */}
        <p className="animate-fade-in delay-500 mt-6 sm:mt-8 text-sm sm:text-base text-zinc-500/80 font-sans max-w-md text-center leading-relaxed tracking-wide font-light">
          A comprehensive analysis of emotional labor, midnight sacrifices, and infinite patience.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in delay-700 mt-16 sm:mt-24 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/0 via-amber-500/20 to-amber-600/0 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-500"></div>
          <button className="relative px-8 py-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 hover:border-amber-500/30 text-white/90 hover:text-white rounded-full transition-all duration-500 flex items-center gap-4 text-sm tracking-[0.2em] uppercase overflow-hidden group">
            <span className="relative z-10 font-medium font-sans">Generate Report</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 group-hover:bg-amber-400 group-hover:shadow-[0_0_10px_2px_rgba(251,191,36,0.5)] transition-all duration-500 relative z-10"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"></div>
          </button>
        </div>

      </div>

      {/* Add shimmer animation via style tag for simplicity since it's button specific */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </main>
  );
}
