/**
 * ExportStoryStatic.tsx
 *
 * A completely self-contained, export-safe component built exclusively
 * for html-to-image rendering.
 *
 * Rules enforced:
 *  - No backdrop-filter / backdrop-blur
 *  - No CSS animation / transition
 *  - No mix-blend-mode
 *  - No vw/vh/% units for size (fixed px only)
 *  - No Tailwind classes — only inline styles
 *  - All colors flat/explicit (no opacity helpers that become rgba mask layers)
 *  - No external image references
 *  - Fonts referenced via CSS variable already injected by layout.tsx
 */

import React from "react";
import { MaternalMetrics } from "../utils/calculations";

interface Props {
  metrics: MaternalMetrics;
}

// ─── Design tokens (all flat, explicit) ────────────────────────────────────
const BG       = "#070707";
const SURFACE  = "#120e0e";
const ROSE     = "#D4A5A5";
const ROSE_DIM = "#8E6A6A";
const TEXT     = "#F6EDEE";
const TEXT_MID = "#C9B8B8";

const W = 1080;
const H = 1920;

// ─── Stat row ──────────────────────────────────────────────────────────────
function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "0 0 60px 0",
        borderBottom: `1px solid ${ROSE_DIM}22`,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-outfit), Outfit, sans-serif",
          fontWeight: 700,
          fontSize: "140px",
          lineHeight: 1,
          letterSpacing: "-4px",
          color: TEXT,
          display: "block",
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-outfit), Outfit, sans-serif",
          fontWeight: 500,
          fontSize: "22px",
          letterSpacing: "8px",
          textTransform: "uppercase",
          color: ROSE,
          marginTop: "18px",
          display: "block",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ExportStoryStatic({ metrics }: Props) {
  return (
    <div
      id="export-story-root"
      style={{
        position: "relative",
        width: `${W}px`,
        height: `${H}px`,
        background: BG,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "140px 96px 130px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Background glow layers (flat radial gradients, no blur) ── */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "-300px",
          width: "1200px",
          height: "1200px",
          background:
            "radial-gradient(circle at center, rgba(142,106,106,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-250px",
          right: "-350px",
          width: "1100px",
          height: "1100px",
          background:
            "radial-gradient(circle at center, rgba(212,165,165,0.13) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "750px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1300px",
          height: "900px",
          background:
            "radial-gradient(ellipse at center, rgba(212,165,165,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          zIndex: 2,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            marginBottom: "36px",
          }}
        >
          <div style={{ width: "60px", height: "1px", background: `${ROSE_DIM}50` }} />
          <span
            style={{
              fontFamily: "var(--font-outfit), Outfit, sans-serif",
              fontWeight: 500,
              fontSize: "18px",
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: `${ROSE}bb`,
            }}
          >
            System Online
          </span>
          <div style={{ width: "60px", height: "1px", background: `${ROSE_DIM}50` }} />
        </div>

        {/* Logo */}
        <h1
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 700,
            fontSize: "112px",
            letterSpacing: "-4px",
            lineHeight: 1,
            color: TEXT,
            margin: 0,
            textAlign: "center",
          }}
        >
          mother.stats
        </h1>

        {/* Year label */}
        <p
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "24px",
            letterSpacing: "10px",
            textTransform: "uppercase",
            color: ROSE_DIM,
            marginTop: "28px",
            textAlign: "center",
          }}
        >
          2026 Report
        </p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: "68px",
          zIndex: 2,
          flexGrow: 1,
          justifyContent: "center",
          padding: "80px 0",
        }}
      >
        {/* Thin top divider */}
        <div
          style={{
            width: "480px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${ROSE_DIM}50, transparent)`,
          }}
        />

        <StatRow value={metrics.mealsPrepared.toLocaleString()} label="Meals Prepared" />
        <StatRow value={metrics.cookingYears.toLocaleString()} label="Years Spent Cooking" />
        <StatRow value={metrics.kitchenDays.toLocaleString()} label="Kitchen Days" />
        <StatRow value={metrics.teaCups.toLocaleString()} label="Cups of Tea Made" />

        {/* Thin bottom divider */}
        <div
          style={{
            width: "480px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${ROSE_DIM}50, transparent)`,
          }}
        />
      </div>

      {/* ── Footer Quote ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          zIndex: 2,
          paddingTop: "30px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "44px",
            lineHeight: 1.7,
            letterSpacing: "0.5px",
            color: TEXT_MID,
            textAlign: "center",
            margin: 0,
          }}
        >
          This is only the math of it.
          <br />
          <span style={{ color: ROSE }}>
            The actual love behind these numbers
            <br />
            would be impossible to measure.
          </span>
        </p>

        {/* Subtle footer tag */}
        <p
          style={{
            fontFamily: "var(--font-outfit), Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "18px",
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: `${ROSE_DIM}60`,
            marginTop: "60px",
            textAlign: "center",
          }}
        >
          mother.stats
        </p>
      </div>
    </div>
  );
}
