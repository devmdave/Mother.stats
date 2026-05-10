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
  const [ageStr, setAgeStr]     = useState("");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [metrics, setMetrics]   = useState<MaternalMetrics | null>(null);
  const [mounted, setMounted]   = useState(false); // prevent SSR/CSR mismatch

  // Export state
  const exportRef  = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting]   = useState(false);
  const [exportVisible, setExportVisible] = useState(false);

  // Mark client-mount to prevent animation hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  // ── Transitions ───────────────────────────────────────────────────────
  const handleStart = () => setAppState("form");

  const handleGenerate = () => {
    const age = parseInt(ageStr, 10);
    if (age > 0 && age < 150) {
      setMetrics(calculateMaternalMetrics(age));
      setAppState("generating");
    }
  };

  // ── Loading cycle ─────────────────────────────────────────────────────
  useEffect(() => {
    if (appState !== "generating") return;
    setLoadingIdx(0); // reset on each generating phase
    const iv = setInterval(() => {
      setLoadingIdx((prev) => {
        if (prev < LOADING_MSGS.length - 1) return prev + 1;
        clearInterval(iv);
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
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

    setExportVisible(true);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    console.log("[Export] Stage 2 — awaiting document.fonts.ready");
    await document.fonts.ready;

    console.log("[Export] Stage 3 — settling 400ms");
    await new Promise((r) => setTimeout(r, 400));

    const el = exportRef.current;
    if (!el) {
      console.error("[Export] Export element not found — aborting");
      setIsExporting(false);
      setExportVisible(false);
      return;
    }

    console.log("[Export] Stage 4 — capturing", el.offsetWidth, "×", el.offsetHeight);

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#070707",
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
      console.log("[Export] Done");
    }
  };

  // ── Stat blocks ───────────────────────────────────────────────────────
  // climax   = full-width emotional centrepiece
  // highlight = full-width secondary banner
  const stats = metrics ? [
    { value: metrics.cookingYears.toLocaleString(),        label: "Years of Cooking",    subtitle: "An entire life season, quietly given.",            climax:    true },
    { value: metrics.totalCareHours.toLocaleString(),      label: "Total Care Hours",    subtitle: "The invisible shift that never ends.",              highlight: true },
    { value: metrics.mealsPrepared.toLocaleString(),       label: "Meals Prepared",      subtitle: "Across two decades of mornings and nights." },
    { value: metrics.hoursSpentCooking.toLocaleString(),   label: "Hours Cooking",       subtitle: "Standing quietly at the stove." },
    { value: metrics.kitchenDays.toLocaleString(),         label: "Kitchen Days",        subtitle: "Time measured entirely in recipes." },
    { value: metrics.lunchesPacked.toLocaleString(),       label: "Lunchboxes Packed",   subtitle: "Notes folded before the sun rose." },
    { value: metrics.schoolPickupsDrops.toLocaleString(),  label: "School Trips",        subtitle: "Waiting faithfully in the car line." },
    { value: metrics.clothesWashed.toLocaleString(),       label: "Laundry Loads",       subtitle: "Washing, folding, repeating." },
    { value: metrics.groceryTrips.toLocaleString(),        label: "Grocery Trips",       subtitle: "Carrying the weight of the week." },
    { value: metrics.teaCups.toLocaleString(),             label: "Cups of Tea",         subtitle: "Quiet moments of warmth shared." },
  ] : [];

  // ─────────────────────────────────────────────────────────────────────
  return (
    <main
      className={[
        "relative w-full flex flex-col items-center justify-center",
        "overflow-x-hidden bg-[#070707]",
        "selection:bg-[#D4A5A5]/20 selection:text-[#F6EDEE]",
        // Use dvh for safer mobile viewport handling
        "min-h-[100dvh]",
        // Only clip overflow on non-report screens to stop decorative blobs leaking
        appState !== "report" ? "overflow-y-hidden" : "",
      ].join(" ")}
    >
      {/* ── Off-screen export mount ────────────────────────────────────
           Uses fixed left:-9999px (not visibility:hidden) so browser
           still paints it fully — required for html-to-image to work.
           width/height are explicit px so they never depend on viewport.
      ─────────────────────────────────────────────────────────────── */}
      {exportVisible && metrics && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: "-9999px",
            zIndex: -100,
            width: "1080px",
            height: "1920px",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div ref={exportRef}>
            <ExportStoryStatic metrics={metrics} />
          </div>
        </div>
      )}

      {/* ── Decorative background (pointer-none, -z-10) ──────────────── */}
      <div className="bg-grain" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] pointer-events-none -z-10 hw-accel"
        style={{ background: "radial-gradient(circle,rgba(142,106,106,0.06) 0%,transparent 60%)" }}
      />
      <div
        aria-hidden="true"
        className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] pointer-events-none -z-10 hw-accel animate-[pulse-glow_15s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle,rgba(212,165,165,0.04) 0%,transparent 60%)" }}
      />
      {/* Floating particles — desktop only, low complexity */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none hidden md:block -z-10" style={{ overflow: "hidden" }}>
        <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-[#D4A5A5]/20 animate-[float_16s_ease-in-out_infinite] hw-accel" />
        <div className="absolute top-[70%] left-[80%] w-3 h-3 rounded-full bg-[#8E6A6A]/15 animate-[float_20s_ease-in-out_infinite_reverse] hw-accel" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          INTRO
      ══════════════════════════════════════════════════════════════ */}
      {appState === "intro" && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 sm:px-12 min-h-[100dvh] py-20">
          {/* Eyebrow */}
          <div className={`mb-16 sm:mb-24 flex items-center gap-6 hw-accel ${mounted ? "animate-fade-in-slow" : "opacity-0"}`}>
            <div className="h-px w-16 bg-[#8E6A6A]/30" />
            <span className="text-[#D4A5A5]/80 uppercase tracking-[0.4em] text-xs font-medium font-sans">
              Emotional Mathematics
            </span>
            <div className="h-px w-16 bg-[#8E6A6A]/30" />
          </div>

          {/* Hero heading — clamp() prevents overflow on tiny screens */}
          <h1
            className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70 text-center hw-accel font-sans pb-2"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.92 }}
          >
            mother.stats
          </h1>

          {/* Tagline */}
          <p
            className={`mt-12 sm:mt-16 text-[#8E6A6A] font-serif italic font-light tracking-wide max-w-2xl text-center leading-relaxed hw-accel ${mounted ? "animate-fade-in-slow" : "opacity-0"}`}
            style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)", animationDelay: "300ms" }}
          >
            &quot;Quantifying invisible love.&quot;
          </p>

          {/* Sub-description */}
          <p
            className={`mt-6 sm:mt-8 text-[#F6EDEE]/45 font-sans max-w-md text-center leading-loose tracking-wide font-light hw-accel text-sm sm:text-base ${mounted ? "animate-fade-in-slow" : "opacity-0"}`}
            style={{ animationDelay: "500ms" }}
          >
            An emotional math experience. Analyzing quiet sacrifices and infinite patience.
          </p>

          {/* CTA */}
          <div
            className={`mt-20 sm:mt-28 relative group hw-accel ${mounted ? "animate-fade-in-slow" : "opacity-0"}`}
            style={{ animationDelay: "700ms" }}
          >
            <div className="absolute -inset-6 bg-[radial-gradient(circle,rgba(212,165,165,0.08)_0%,transparent_70%)] opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full" />
            <button
              onClick={handleStart}
              className="relative px-10 sm:px-12 py-5 sm:py-6 bg-[#141010]/80 border border-[#8E6A6A]/20 md:hover:border-[#D4A5A5]/40 text-[#F6EDEE]/80 md:hover:text-[#F6EDEE] rounded-full transition-colors duration-500 flex items-center gap-5 text-xs sm:text-sm tracking-[0.3em] uppercase cursor-pointer z-10 font-sans font-medium whitespace-nowrap"
            >
              <span>Generate Report</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#8E6A6A]/50 md:group-hover:bg-[#D4A5A5] transition-colors duration-500 flex-shrink-0" />
            </button>
          </div>

          {/* Signature — fixed so it never affects layout flow */}
          <a
            href="https://github.com/devmdave"
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-8 md:bottom-10 right-6 md:right-10 z-50 group hw-accel flex flex-col items-end gap-0.5 ${mounted ? "animate-fade-in-slow" : "opacity-0"}`}
            style={{ animationDelay: "1200ms" }}
          >
            <div className="absolute -inset-8 bg-[radial-gradient(ellipse,rgba(212,165,165,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10 rounded-lg" />
            <span className="text-[#F2DCDC]/40 group-hover:text-[#F2DCDC]/90 transition-colors duration-700 text-[10px] sm:text-xs tracking-widest uppercase font-syne font-medium">
              Made by Madhav Dave
            </span>
            <span className="text-[#D4A5A5]/55 group-hover:text-[#D4A5A5] transition-colors duration-700 text-sm sm:text-base tracking-wide font-instrument self-end">
              aka devmdave
            </span>
          </a>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FORM
      ══════════════════════════════════════════════════════════════ */}
      {appState === "form" && (
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6 sm:px-12 min-h-[100dvh] py-20 animate-fade-in">
          <h2
            className="text-[#F6EDEE] font-serif font-light text-center mb-8 leading-tight hw-accel italic"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}
          >
            How old are you?
          </h2>

          <p className="text-sm sm:text-base text-[#8E6A6A] font-sans text-center mb-16 sm:mb-20 tracking-widest font-light hw-accel opacity-80 max-w-sm leading-relaxed">
            We&apos;ll estimate the invisible numbers behind your mother&apos;s daily care.
          </p>

          {/* Number input */}
          <div className="relative w-full max-w-xs flex flex-col items-center group hw-accel">
            <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(212,165,165,0.06)_0%,transparent_60%)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
              autoFocus
              placeholder="0"
              min={1}
              max={120}
              className="relative w-full bg-transparent border-b border-[#8E6A6A]/30 pb-5 text-center text-[#F6EDEE] focus:outline-none focus:border-[#D4A5A5] transition-colors duration-500 placeholder:text-[#8E6A6A]/20 font-bold font-sans tracking-tighter z-10 leading-none"
              style={{ fontSize: "clamp(4rem, 15vw, 7rem)" }}
            />
            <div className="absolute bottom-0 w-1/3 h-px bg-[#D4A5A5] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out z-20 origin-center will-change-transform" />
          </div>

          <div className="mt-20 hw-accel">
            <button
              onClick={handleGenerate}
              className={[
                "px-10 sm:px-12 py-4 sm:py-5 bg-transparent border rounded-full",
                "transition-colors duration-500 text-xs tracking-[0.3em] uppercase",
                "font-sans font-medium cursor-pointer whitespace-nowrap",
                ageStr
                  ? "border-[#D4A5A5]/40 md:hover:border-[#D4A5A5]/80 md:hover:bg-[#D4A5A5]/5 text-[#F6EDEE]"
                  : "border-[#8E6A6A]/20 text-[#8E6A6A]/50 md:hover:border-[#8E6A6A]/40",
              ].join(" ")}
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
        <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-[100dvh] py-20 animate-fade-in-slow px-6">
          <div className="relative flex items-center justify-center mb-16 hw-accel flex-shrink-0">
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 border-t border-[#D4A5A5]/40 rounded-full animate-spin" style={{ animationDuration: "3.5s" }} />
            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 border-b border-[#8E6A6A]/40 rounded-full animate-spin" style={{ animationDuration: "2.5s", animationDirection: "reverse" }} />
            <div className="w-3 h-3 rounded-full bg-[#D4A5A5] opacity-80 animate-pulse" style={{ animationDuration: "2s" }} />
          </div>
          {/* Fixed height container prevents layout jump between messages */}
          <div className="relative h-14 w-full max-w-xl flex items-center justify-center hw-accel overflow-hidden">
            <p
              key={loadingIdx}
              className="absolute font-serif italic text-xl sm:text-2xl text-[#F6EDEE]/90 animate-slide-up-fade tracking-wide text-center w-full font-light px-4"
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
        <div className="relative z-10 flex flex-col items-center justify-start w-full pt-24 sm:pt-32 pb-24">

          {/* Report header */}
          <div
            className="animate-slide-up-fade mb-20 sm:mb-28 text-center px-6 w-full max-w-4xl mx-auto hw-accel"
            style={{ animationDelay: "100ms" }}
          >
            <h2 className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-[#8E6A6A] font-sans font-medium mb-5 opacity-80">
              Math Of the Maternal Love
            </h2>
            <h1
              className="text-[#F6EDEE] font-serif italic font-light tracking-wide"
              style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}
            >
              Its the Love that cannot be Quantified.
            </h1>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-14 w-full max-w-[88rem] mx-auto px-5 sm:px-8 md:px-12 mb-28 sm:mb-36">
            {stats.map((stat, idx) => {
              const isClimax    = !!(stat as any).climax;
              const isHighlight = !!(stat as any).highlight;
              return (
                <div
                  key={idx}
                  className={[
                    "animate-slide-up-fade flex flex-col items-center justify-center rounded-[2rem] transition-colors duration-500 group hw-accel",
                    isClimax
                      ? "col-span-1 md:col-span-2 lg:col-span-3 py-20 sm:py-28 px-8 sm:px-16 bg-[#120808]/80 border border-[#D4A5A5]/20 md:hover:border-[#D4A5A5]/40 relative overflow-hidden"
                      : isHighlight
                      ? "md:col-span-2 lg:col-span-3 py-14 sm:py-20 px-8 sm:px-16 bg-[#141010]/60 border border-[#8E6A6A]/10 md:hover:bg-[#141010]/90 md:hover:border-[#D4A5A5]/20"
                      : "p-8 sm:p-12 bg-[#141010]/60 border border-[#8E6A6A]/10 md:hover:bg-[#141010]/90 md:hover:border-[#D4A5A5]/20",
                  ].join(" ")}
                  style={{
                    animationDelay: `${200 + idx * 80}ms`,
                    boxShadow: isClimax ? "0 0 80px rgba(212,165,165,0.05) inset" : undefined,
                  }}
                >
                  {/* Climax ambient glow — capped size, no vw units */}
                  {isClimax && (
                    <div
                      aria-hidden="true"
                      className="absolute w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] pointer-events-none -z-10"
                      style={{ background: "radial-gradient(circle,rgba(212,165,165,0.07) 0%,transparent 60%)" }}
                    />
                  )}

                  {isClimax && (
                    <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-[#D4A5A5]/60 font-sans font-medium mb-6 text-center">
                      Emotional Centrepiece
                    </p>
                  )}

                  <h2
                    className={[
                      "font-sans font-bold tracking-tighter leading-none mb-5 text-center",
                      "transition-transform duration-700 ease-out md:group-hover:scale-[1.02] will-change-transform",
                      isClimax
                        ? "text-[#D4A5A5]"
                        : "text-transparent bg-clip-text bg-gradient-to-b from-[#F6EDEE] to-[#8E6A6A]/70",
                    ].join(" ")}
                    style={{
                      fontSize: isClimax
                        ? "clamp(5rem, 18vw, 14rem)"
                        : isHighlight
                        ? "clamp(4rem, 14vw, 10rem)"
                        : "clamp(3rem, 10vw, 7rem)",
                    }}
                  >
                    {stat.value}
                  </h2>

                  <h3
                    className={[
                      "tracking-[0.4em] uppercase font-sans font-medium mb-3 text-center text-[#D4A5A5]",
                      isClimax ? "text-sm opacity-100" : "text-xs opacity-90",
                    ].join(" ")}
                  >
                    {stat.label}
                  </h3>

                  <p
                    className={[
                      "font-serif italic font-light text-center tracking-wide leading-relaxed text-[#8E6A6A]",
                      isClimax ? "text-base sm:text-lg max-w-md" : "text-sm sm:text-base max-w-xs",
                    ].join(" ")}
                  >
                    {stat.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Emotional ending */}
          <div
            className="animate-slide-up-fade flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 text-center relative hw-accel"
            style={{ animationDelay: "1200ms" }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none -z-10"
              style={{ background: "radial-gradient(ellipse at center,rgba(212,165,165,0.04) 0%,transparent 60%)" }}
            />

            <p
              className="font-light text-[#F6EDEE] font-serif leading-[1.7] mb-16 px-4 tracking-wide"
              style={{ fontSize: "clamp(1.2rem, 3.5vw, 2.5rem)" }}
            >
              These numbers are merely the calculable fractions of presence.
              <br /><br />
              <span className="text-[#D4A5A5]">
                The true gravity of her patience, the quiet depths of her sacrifice, and the
                infinite scale of her love remain elegantly immeasurable.
              </span>
            </p>

            {/* Action buttons — wraps on small screens */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
              <button
                onClick={handleExportStory}
                disabled={isExporting}
                className="w-full sm:w-auto px-10 py-5 bg-[#D4A5A5]/10 border border-[#D4A5A5]/30 md:hover:bg-[#D4A5A5]/20 md:hover:border-[#D4A5A5]/50 text-[#F6EDEE] rounded-full transition-colors duration-500 text-xs tracking-[0.3em] uppercase font-sans font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isExporting ? "Rendering Story…" : "Share the Stats"}
              </button>
            </div>
          </div>

          {/* Report footer signature */}
          <footer
            className="animate-slide-up-fade flex flex-col items-center gap-5 mt-24 sm:mt-32 pb-10 hw-accel"
            style={{ animationDelay: "1600ms" }}
          >
            <div className="h-px w-20 bg-[#8E6A6A]/20" />
            <a
              href="https://github.com/devmdave"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1 relative py-2"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none -z-10 rounded-lg"
                style={{ background: "radial-gradient(ellipse,rgba(212,165,165,0.06) 0%,transparent 60%)" }}
              />
              <span className="text-[#F2DCDC]/30 group-hover:text-[#F2DCDC]/80 transition-colors duration-700 text-[10px] sm:text-xs tracking-widest uppercase font-syne font-medium">
                Made by Madhav Dave
              </span>
              <span className="text-[#D4A5A5]/50 group-hover:text-[#D4A5A5]/90 transition-colors duration-700 text-sm sm:text-base tracking-wide font-instrument">
                aka devmdave
              </span>
            </a>
          </footer>
        </div>
      )}
    </main>
  );
}
