"use client";

import React, { useState, useEffect, useRef } from "react";
import { calculateMaternalMetrics, MaternalMetrics } from "../utils/calculations";
import ExportStoryStatic from "../components/ExportStoryStatic";

// ─── constants ────────────────────────────────────────────────────────────
const LOADING_MSGS = [
  "Calculating lifetime meals...",
  "Estimating repeated routines...",
  "Rendering invisible effort...",
  "Analyzing years of care...",
  "Generating maternal statistics...",
];

// ─── component ────────────────────────────────────────────────────────────
export default function Home() {
  const [appState, setAppState] = useState<"intro" | "form" | "generating" | "report">("intro");
  const [ageStr, setAgeStr] = useState("");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [metrics, setMetrics] = useState<MaternalMetrics | null>(null);

  // Export state
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportVisible, setExportVisible] = useState(false); // mount before capture

  // ── Transitions ───────────────────────────────────────────────────────
  const handleStart = () => setAppState("form");

  const handleGenerate = () => {
    const age = parseInt(ageStr, 10);
    if (age > 0) {
      setMetrics(calculateMaternalMetrics(age));
      setAppState("generating");
    }
  };

  // ── Loading cycle ─────────────────────────────────────────────────────
  useEffect(() => {
    if (appState !== "generating") return;
    const iv = setInterval(() => {
      setLoadingIdx((prev) => {
        if (prev < LOADING_MSGS.length - 1) return prev + 1;
        clearInterval(iv);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          setAppState("report");
        }, 1000);
        return prev;
      });
    }, 2000);
    return () => clearInterval(iv);
  }, [appState]);

  // ── Export pipeline ───────────────────────────────────────────────────
  const handleExportStory = async () => {
    if (isExporting || !metrics) return;
    setIsExporting(true);
    console.log("[Export] Stage 1 — mounting export component");

    // 1. Mount the export component so it paints fully
    setExportVisible(true);

    // Give the browser 2 frames to fully paint before we try to capture
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    // 2. Wait for fonts
    console.log("[Export] Stage 2 — awaiting document.fonts.ready");
    await document.fonts.ready;

    // 3. Additional settle time for background images / gradients
    console.log("[Export] Stage 3 — settling 400ms");
    await new Promise((r) => setTimeout(r, 400));

    // 4. Verify element exists
    const el = exportRef.current;
    if (!el) {
      console.error("[Export] Export element not found — aborting");
      setIsExporting(false);
      setExportVisible(false);
      return;
    }

    console.log("[Export] Stage 4 — capturing element", el.offsetWidth, "×", el.offsetHeight);

    try {
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#070707",
        // Explicit dimensions match the component's fixed px size
        width: 1080,
        height: 1920,
      });

      console.log("[Export] Stage 5 — success, downloading");

      const link = document.createElement("a");
      link.download = "mother-stats-story.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("[Export] Capture failed:", err);
      alert("Export failed — please try again on desktop Chrome or Edge.");
    } finally {
      setIsExporting(false);
      setExportVisible(false);
      console.log("[Export] Done — export component unmounted");
    }
  };

  // Metrics-derived stat blocks (for report grid)
  // `climax`   — full-width solo card with massive typography + rose glow (emotional centrepiece)
  // `highlight` — full-width card, large but secondary
  const stats = metrics
    ? [
      { value: metrics.cookingYears.toLocaleString(), label: "Years of Cooking", subtitle: "An entire life season, quietly given.", climax: true },
      { value: metrics.totalCareHours.toLocaleString(), label: "Total Care Hours", subtitle: "The invisible shift that never ends.", highlight: true },
      { value: metrics.mealsPrepared.toLocaleString(), label: "Meals Prepared", subtitle: "Across two decades of mornings and nights." },
      { value: metrics.hoursSpentCooking.toLocaleString(), label: "Hours Cooking", subtitle: "Standing quietly at the stove." },
      { value: metrics.kitchenDays.toLocaleString(), label: "Kitchen Days", subtitle: "Time measured entirely in recipes." },
      { value: metrics.lunchesPacked.toLocaleString(), label: "Lunchboxes Packed", subtitle: "Notes folded before the sun rose." },
      { value: metrics.schoolPickupsDrops.toLocaleString(), label: "School Trips", subtitle: "Waiting faithfully in the car line." },
      { value: metrics.clothesWashed.toLocaleString(), label: "Laundry Loads", subtitle: "Washing, folding, repeating." },
      { value: metrics.groceryTrips.toLocaleString(), label: "Grocery Trips", subtitle: "Carrying the weight of the week." },
      { value: metrics.teaCups.toLocaleString(), label: "Cups of Tea", subtitle: "Quiet moments of warmth shared." },
    ]
    : [];

  // ─────────────────────────────────────────────────────────────────────
  return (
    <main
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden bg-[#070707] selection:bg-[#D4A5A5]/20 selection:text-[#F6EDEE] ${appState === "report" ? "" : "overflow-hidden"
        }`}
    >
      {/* ── Off-screen export mount point ─────────────────────────────
           Rendered OUTSIDE the visible viewport. Position fixed + very
           negative left keeps it out of view but still fully painted by
           the browser (visibility:hidden would stop painting). 
      ─────────────────────────────────────────────────────────────────── */}
      {exportVisible && metrics && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "-9999px",
            zIndex: -100,
            width: "1080px",
            height: "1920px",
            pointerEvents: "none",
          }}
        >
          <div ref={exportRef}>
            <ExportStoryStatic metrics={metrics} />
          </div>
        </div>
      )}

      {/* ── Screen background ────────────────────────────────────────── */}
      <div className="bg-grain" />
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(142,106,106,0.06)_0%,transparent_60%)] pointer-events-none -z-10 hw-accel" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(212,165,165,0.04)_0%,transparent_60%)] pointer-events-none -z-10 hw-accel animate-[pulse-glow_15s_ease-in-out_infinite]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden md:block -z-10">
        <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-[#D4A5A5]/20 animate-[float_16s_ease-in-out_infinite] hw-accel" />
        <div className="absolute top-[70%] left-[80%] w-3 h-3 rounded-full bg-[#8E6A6A]/15 animate-[float_20s_ease-in-out_infinite_reverse] hw-accel" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          INTRO
      ══════════════════════════════════════════════════════════════ */}
      {appState === "intro" && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-6 sm:px-12 animate-fade-in min-h-screen">
          <div className="animate-fade-in-slow mb-20 sm:mb-28 flex items-center gap-6 hw-accel">
            <div className="h-[1px] w-16 bg-[#8E6A6A]/30" />
            <span className="text-[#D4A5A5]/80 uppercase tracking-[0.4em] text-xs font-medium font-sans">
              Emotional Mathematics
            </span>
            <div className="h-[1px] w-16 bg-[#8E6A6A]/30" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 pb-4 text-center hw-accel font-sans leading-[0.9]">
            mother.stats
          </h1>

          <p
            className="animate-fade-in-slow mt-14 sm:mt-20 text-2xl sm:text-3xl md:text-4xl text-[#8E6A6A] font-serif italic font-light tracking-wide max-w-3xl text-center leading-relaxed hw-accel"
            style={{ animationDelay: "300ms" }}
          >
            &quot;Quantifying invisible love.&quot;
          </p>

          <p
            className="animate-fade-in-slow mt-8 sm:mt-10 text-base sm:text-lg text-[#F6EDEE]/50 font-sans max-w-lg text-center leading-loose tracking-wide font-light hw-accel"
            style={{ animationDelay: "500ms" }}
          >
            A emotional math experience. Analyzing quiet sacrifices and infinite patience.
          </p>

          <div
            className="animate-fade-in-slow mt-24 sm:mt-32 relative group hw-accel"
            style={{ animationDelay: "700ms" }}
          >
            <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(212,165,165,0.08)_0%,transparent_70%)] opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <button
              onClick={handleStart}
              className="relative px-12 py-6 bg-[#141010]/80 border border-[#8E6A6A]/20 md:hover:border-[#D4A5A5]/40 text-[#F6EDEE]/80 md:hover:text-[#F6EDEE] rounded-full transition-colors duration-500 flex items-center gap-6 text-sm tracking-[0.3em] uppercase cursor-pointer z-10 font-sans font-medium"
            >
              <span>Generate Report</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8E6A6A]/50 md:group-hover:bg-[#D4A5A5] transition-colors duration-500" />
            </button>
          </div>
          {/* ── Quiet signature — landing page ── */}
          <a
            href="https://github.com/devmdave"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in-slow fixed bottom-8 md:bottom-12 right-8 md:right-12 z-50 group hw-accel flex flex-col items-end gap-1"
            style={{ animationDelay: "1200ms" }}
          >
            <div className="absolute -inset-8 bg-[radial-gradient(ellipse,rgba(212,165,165,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10" />
            <span className="text-[#F2DCDC]/40 group-hover:text-[#F2DCDC]/90 transition-colors duration-700 text-xs sm:text-sm tracking-widest uppercase font-syne font-medium drop-shadow-sm">
              Made by Madhav Dave
            </span>
            <span className="text-[#D4A5A5]/60 group-hover:text-[#D4A5A5] transition-colors duration-700 text-base sm:text-lg tracking-wide font-instrument drop-shadow-md">
              aka devmdave
            </span>
          </a>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FORM
      ══════════════════════════════════════════════════════════════ */}
      {appState === "form" && (
        <div
          className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 sm:px-12 animate-fade-in min-h-screen"
          style={{ animationDuration: "1s" }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl text-[#F6EDEE] font-serif font-light text-center mb-10 leading-tight max-w-3xl hw-accel italic">
            How old are you?
          </h2>

          <p className="text-base sm:text-lg text-[#8E6A6A] font-sans text-center mb-20 tracking-widest font-light hw-accel opacity-80">
            We&apos;ll estimate the invisible numbers behind your mother&apos;s daily care.
          </p>

          <div className="relative w-full max-w-sm flex flex-col items-center group hw-accel">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,165,165,0.06)_0%,transparent_60%)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />
            <input
              type="number"
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
              autoFocus
              placeholder="0"
              className="relative w-full bg-transparent border-b border-[#8E6A6A]/30 pb-6 text-center text-7xl sm:text-8xl lg:text-9xl text-[#F6EDEE] focus:outline-none focus:border-[#D4A5A5] transition-colors duration-500 placeholder:text-[#8E6A6A]/20 font-bold font-sans tracking-tighter z-10 leading-none"
            />
            <div className="absolute bottom-0 w-1/3 h-[1px] bg-[#D4A5A5] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20 origin-center will-change-transform" />
          </div>

          <div className="mt-24 hw-accel">
            <button
              onClick={handleGenerate}
              className={`px-12 py-5 bg-transparent border rounded-full transition-colors duration-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans font-medium cursor-pointer ${ageStr
                ? "border-[#D4A5A5]/40 md:hover:border-[#D4A5A5]/80 md:hover:bg-[#D4A5A5]/5 text-[#F6EDEE]"
                : "border-[#8E6A6A]/20 text-[#8E6A6A]/50 md:hover:border-[#8E6A6A]/40"
                }`}
            >
              See the Maternal Math
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          GENERATING
      ══════════════════════════════════════════════════════════════ */}
      {appState === "generating" && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full animate-fade-in-slow min-h-screen">
          <div className="relative flex items-center justify-center mb-20 hw-accel">
            <div className="absolute w-32 h-32 border-t border-[#D4A5A5]/40 rounded-full animate-spin" style={{ animationDuration: "3.5s" }} />
            <div className="absolute w-24 h-24 border-b border-[#8E6A6A]/40 rounded-full animate-spin" style={{ animationDuration: "2.5s", animationDirection: "reverse" }} />
            <div className="w-3 h-3 rounded-full bg-[#D4A5A5] opacity-80 animate-pulse" style={{ animationDuration: "2s" }} />
          </div>
          <div className="h-16 relative overflow-hidden flex items-center justify-center w-full max-w-xl hw-accel">
            <p
              key={loadingIdx}
              className="absolute text-[#F6EDEE]/90 font-serif italic text-2xl sm:text-3xl animate-slide-up-fade tracking-wide text-center w-full font-light"
            >
              {LOADING_MSGS[loadingIdx]}
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          REPORT
      ══════════════════════════════════════════════════════════════ */}
      {appState === "report" && (
        <div className="relative z-10 flex flex-col items-center justify-start w-full min-h-screen pt-32 pb-40">

          {/* Header */}
          <div className="animate-slide-up-fade opacity-0 mb-32 text-center px-6 hw-accel" style={{ animationDelay: "100ms" }}>
            <h2 className="text-xs sm:text-sm tracking-[0.5em] uppercase text-[#8E6A6A] font-sans font-medium mb-6 opacity-80">
              Math Of the Maternal Love
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#F6EDEE] font-serif italic font-light tracking-wide">
              Its the Love that cannot be Quantified.
            </h1>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 lg:gap-20 w-full max-w-[90rem] mx-auto px-6 md:px-12 mb-40">
            {stats.map((stat, idx) => {
              const isClimax = !!(stat as any).climax;
              const isHighlight = !!(stat as any).highlight;
              return (
                <div
                  key={idx}
                  className={`animate-slide-up-fade opacity-0 flex flex-col items-center justify-center rounded-[2.5rem] transition-colors duration-500 group hw-accel ${isClimax
                    ? "col-span-1 md:col-span-2 lg:col-span-3 py-28 sm:py-40 px-12 sm:px-20 bg-[#120808]/80 border border-[#D4A5A5]/20 md:hover:border-[#D4A5A5]/40"
                    : isHighlight
                      ? "md:col-span-2 lg:col-span-3 py-20 sm:py-28 px-12 sm:px-20 bg-[#141010]/60 border border-[#8E6A6A]/10 md:hover:bg-[#141010]/90 md:hover:border-[#D4A5A5]/20"
                      : "p-10 sm:p-16 bg-[#141010]/60 border border-[#8E6A6A]/10 md:hover:bg-[#141010]/90 md:hover:border-[#D4A5A5]/20"
                    }`}
                  style={{
                    animationDelay: `${200 + idx * 100}ms`,
                    // Climax card gets a very subtle rose bloom shadow
                    boxShadow: isClimax ? "0 0 80px rgba(212,165,165,0.06) inset" : undefined,
                  }}
                >
                  {/* Climax ambient glow behind number */}
                  {isClimax && (
                    <div className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[radial-gradient(circle,rgba(212,165,165,0.07)_0%,transparent_60%)] pointer-events-none -z-10" />
                  )}

                  {/* Eyebrow for climax */}
                  {isClimax && (
                    <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-[#D4A5A5]/60 font-sans font-medium mb-8 text-center">
                      Emotional Centrepiece
                    </p>
                  )}

                  <h2
                    className={`font-sans font-bold tracking-tighter leading-[0.85] mb-6 text-center transition-transform duration-700 ease-out md:group-hover:scale-[1.03] will-change-transform ${isClimax
                      ? "text-[10rem] sm:text-[13rem] md:text-[16rem] lg:text-[18rem] text-[#D4A5A5]"
                      : isHighlight
                        ? "text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem] text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70"
                        : "text-6xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70"
                      }`}
                  >
                    {stat.value}
                  </h2>
                  <h3
                    className={`tracking-[0.4em] uppercase font-sans font-medium mb-4 text-center ${isClimax
                      ? "text-sm sm:text-base text-[#D4A5A5] opacity-100"
                      : "text-xs sm:text-sm text-[#D4A5A5] opacity-90"
                      }`}
                  >
                    {stat.label}
                  </h3>
                  <p
                    className={`font-serif italic font-light text-center tracking-wide leading-relaxed ${isClimax
                      ? "text-lg sm:text-xl text-[#8E6A6A] max-w-lg"
                      : "text-base sm:text-lg text-[#8E6A6A]/90 max-w-sm"
                      }`}
                  >
                    {stat.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Emotional ending */}
          <div
            className="animate-slide-up-fade opacity-0 flex flex-col items-center justify-center w-full max-w-5xl px-6 text-center relative hw-accel"
            style={{ animationDelay: "1400ms" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] bg-[radial-gradient(ellipse,rgba(212,165,165,0.04)_0%,transparent_60%)] pointer-events-none -z-10" />

            <h3 className="text-3xl sm:text-5xl md:text-6xl font-light text-[#F6EDEE] font-serif leading-[1.6] mb-24 px-4 tracking-wide">
              These numbers are merely the calculable fractions of presence.
              <br /><br />
              <span className="text-[#D4A5A5]">
                The true gravity of her patience, the quiet depths of her sacrifice, and the
                infinite scale of her love remain elegantly immeasurable.
              </span>
            </h3>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-8 mt-10">
              {/* ── Download Story ── */}
              <button
                onClick={handleExportStory}
                disabled={isExporting}
                className="px-12 py-6 bg-[#D4A5A5]/10 border border-[#D4A5A5]/30 md:hover:bg-[#D4A5A5]/20 md:hover:border-[#D4A5A5]/50 text-[#F6EDEE] rounded-full transition-colors duration-500 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-w-[260px]"
              >
                {isExporting ? "Rendering Story…" : "SHARE THE STATS"}
              </button>


            </div>
          </div>
          {/* ── Report footer signature ── */}
          <footer className="animate-slide-up-fade opacity-0 flex flex-col items-center gap-6 mt-32 pb-12 hw-accel" style={{ animationDelay: "1800ms" }}>
            <div className="h-[1px] w-24 bg-[#8E6A6A]/20" />
            <a
              href="https://github.com/devmdave"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1 relative"
            >
              <div className="absolute -inset-10 bg-[radial-gradient(ellipse,rgba(212,165,165,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10" />
              <span className="text-[#F2DCDC]/30 group-hover:text-[#F2DCDC]/80 transition-colors duration-700 text-[11px] sm:text-xs tracking-widest uppercase font-syne font-medium">
                Made by Madhav Dave
              </span>
              <span className="text-[#D4A5A5]/50 group-hover:text-[#D4A5A5]/90 transition-colors duration-700 text-[15px] sm:text-base tracking-wide font-instrument">
                aka devmdave
              </span>
            </a>
          </footer>
        </div>
      )}

      {/* ── Global inline styles ────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slide-up-fade {
          0%   { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media print {
          button { display: none !important; }
          .bg-grain { display: none !important; }
          body { background: #070707 !important; -webkit-print-color-adjust: exact; }
        }
      ` }} />
    </main>
  );
}
