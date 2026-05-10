/**
 * ExportStoryStatic.tsx
 * Export-safe 1080×1920 Instagram Story component.
 *
 * Rules:
 *  - All inline styles only (no Tailwind, no CSS classes)
 *  - No backdrop-filter, no blur, no animations, no mix-blend-mode
 *  - Fixed px units only — no vw/vh/%, no calc()
 *  - No bg-clip-text / CSS masking
 *  - Every element is fully opaque at rest
 */

import React from "react";
import { MaternalMetrics } from "../utils/calculations";

interface Props {
  metrics: MaternalMetrics;
}

// ─── Design tokens ───────────────────────────────────────────────────────────
const BG        = "#070707";
const ROSE      = "#D4A5A5";
const ROSE_DIM  = "#8E6A6A";
const TEXT      = "#F6EDEE";
const TEXT_SOFT = "#C4AFAF";
const CARD_BG   = "#100D0D";
const CARD_BDR  = "#2A1F1F";

// ─── Canvas dimensions ──────────────────────────────────────────────────────
const W = 1080;
const H = 1920;

// ─── Shared font bases ──────────────────────────────────────────────────────
const FONT_UI   = "var(--font-outfit), Outfit, ui-sans-serif, sans-serif";
const FONT_SRF  = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";

// ─── Stat card ──────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  featured = false,
}: {
  value: string;
  label: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: featured ? "28px 24px" : "22px 20px",
        background: CARD_BG,
        border: `1px solid ${featured ? ROSE_DIM + "55" : CARD_BDR}`,
        borderRadius: "20px",
        boxSizing: "border-box",
        // featured cards span full width via parent flex wrap
        flex: featured ? "0 0 100%" : "0 0 calc(50% - 8px)",
      }}
    >
      <span
        style={{
          fontFamily: FONT_UI,
          fontWeight: 700,
          fontSize: featured ? "80px" : "60px",
          lineHeight: 1,
          letterSpacing: "-2px",
          color: featured ? ROSE : TEXT,
          display: "block",
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: FONT_UI,
          fontWeight: 500,
          fontSize: "13px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: featured ? ROSE_DIM : TEXT_SOFT,
          marginTop: "10px",
          display: "block",
          textAlign: "center",
          opacity: 0.85,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      style={{
        width: "360px",
        height: "1px",
        background: `linear-gradient(to right, transparent, ${ROSE_DIM}55, transparent)`,
        margin: "0 auto",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
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
        boxSizing: "border-box",
        padding: "88px 72px 80px",
        gap: "0px",
      }}
    >
      {/* ── Background glow layers (flat, no blur) ──────────────────── */}
      <div style={{
        position: "absolute", top: "-300px", left: "-300px",
        width: "900px", height: "900px", pointerEvents: "none",
        background: "radial-gradient(circle at center, rgba(142,106,106,0.16) 0%, transparent 65%)",
      }} />
      <div style={{
        position: "absolute", bottom: "-300px", right: "-300px",
        width: "800px", height: "800px", pointerEvents: "none",
        background: "radial-gradient(circle at center, rgba(212,165,165,0.10) 0%, transparent 65%)",
      }} />
      <div style={{
        position: "absolute", top: "900px", left: "50%",
        transform: "translateX(-50%)",
        width: "1080px", height: "600px", pointerEvents: "none",
        background: "radial-gradient(ellipse at center, rgba(212,165,165,0.05) 0%, transparent 70%)",
      }} />

      {/* ════════════════════════════════════════════════════════════
          HEADER  (approx 200px tall)
      ════════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100%", flexShrink: 0,
        zIndex: 2,
      }}>
        {/* Eye-brow rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
          <div style={{ width: "48px", height: "1px", background: `${ROSE_DIM}50` }} />
          <span style={{
            fontFamily: FONT_UI, fontWeight: 500, fontSize: "13px",
            letterSpacing: "6px", textTransform: "uppercase", color: `${ROSE}99`,
          }}>
            Maternal Report
          </span>
          <div style={{ width: "48px", height: "1px", background: `${ROSE_DIM}50` }} />
        </div>

        {/* Logo */}
        <h1 style={{
          fontFamily: FONT_UI, fontWeight: 700, fontSize: "88px",
          letterSpacing: "-3px", lineHeight: 1,
          color: TEXT, margin: 0, textAlign: "center",
        }}>
          mother.stats
        </h1>

        {/* Sub-tag */}
        <p style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: "18px",
          letterSpacing: "8px", textTransform: "uppercase",
          color: ROSE_DIM, marginTop: "20px", textAlign: "center",
        }}>
          2026 Report
        </p>
      </div>

      {/* Divider after header */}
      <div style={{ marginTop: "40px", marginBottom: "40px", flexShrink: 0, width: "100%" }}>
        <Divider />
      </div>

      {/* ════════════════════════════════════════════════════════════
          STATS GRID  (approx 1300px tall with two featured + 8 cards)
          Layout:
            [featured] Years Spent Cooking  — full width
            [featured] Meals Prepared       — full width
            [col][col] 4 rows of 2
      ════════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "16px",
        width: "100%",
        flexShrink: 0,
        zIndex: 2,
        alignItems: "flex-start",
        alignContent: "flex-start",
      }}>
        {/* ── Hero stat: Years Spent Cooking ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 24px 30px",
            background: "#0E0808",
            border: `1px solid ${ROSE_DIM}66`,
            borderRadius: "20px",
            boxSizing: "border-box",
            flex: "0 0 100%",
            boxShadow: "inset 0 0 60px rgba(212,165,165,0.04)",
          }}
        >
          {/* Eyebrow */}
          <span style={{
            fontFamily: FONT_UI, fontWeight: 500, fontSize: "12px",
            letterSpacing: "5px", textTransform: "uppercase",
            color: `${ROSE}80`, marginBottom: "14px", display: "block", textAlign: "center",
          }}>
            Emotional Centrepiece
          </span>
          <span style={{
            fontFamily: FONT_UI, fontWeight: 700, fontSize: "108px",
            lineHeight: 1, letterSpacing: "-3px",
            color: ROSE, display: "block", textAlign: "center",
          }}>
            {metrics.cookingYears.toLocaleString()}
          </span>
          <span style={{
            fontFamily: FONT_UI, fontWeight: 500, fontSize: "14px",
            letterSpacing: "5px", textTransform: "uppercase",
            color: ROSE_DIM, marginTop: "14px", display: "block", textAlign: "center",
          }}>
            Years Spent Cooking
          </span>
        </div>

        {/* ── Second featured: Meals Prepared ── */}
        <StatCard featured value={metrics.mealsPrepared.toLocaleString()} label="Meals Prepared" />

        {/* ── 8 supporting stats (2-column grid) ── */}
        <StatCard value={metrics.totalCareHours.toLocaleString()}  label="Total Care Hours"    />
        <StatCard value={metrics.hoursSpentCooking.toLocaleString()} label="Cooking Hours"     />
        <StatCard value={metrics.kitchenDays.toLocaleString()}     label="Kitchen Days"        />
        <StatCard value={metrics.lunchesPacked.toLocaleString()}   label="Lunchboxes Packed"   />
        <StatCard value={metrics.schoolPickupsDrops.toLocaleString()} label="School Trips"     />
        <StatCard value={metrics.clothesWashed.toLocaleString()}   label="Laundry Loads"       />
        <StatCard value={metrics.groceryTrips.toLocaleString()}    label="Grocery Trips"       />
        <StatCard value={metrics.teaCups.toLocaleString()}         label="Cups of Tea Made"    />
      </div>

      {/* Divider before quote */}
      <div style={{ marginTop: "44px", marginBottom: "40px", flexShrink: 0, width: "100%" }}>
        <Divider />
      </div>

      {/* ════════════════════════════════════════════════════════════
          FOOTER QUOTE  (approx 220px)
      ════════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100%", flexShrink: 0, zIndex: 2, textAlign: "center",
      }}>
        <p style={{
          fontFamily: FONT_SRF, fontWeight: 400, fontStyle: "italic",
          fontSize: "34px", lineHeight: 1.65, letterSpacing: "0.3px",
          color: TEXT_SOFT, margin: 0,
        }}>
          This is only the math of it.
          <br />
          <span style={{ color: ROSE }}>
            The actual love behind these numbers
            <br />
            would be impossible to measure.
          </span>
        </p>

        {/* Tiny footer brand */}
        <p style={{
          fontFamily: FONT_UI, fontWeight: 400, fontSize: "13px",
          letterSpacing: "5px", textTransform: "uppercase",
          color: `${ROSE_DIM}55`, marginTop: "36px",
        }}>
          mother.stats
        </p>
      </div>
    </div>
  );
}
