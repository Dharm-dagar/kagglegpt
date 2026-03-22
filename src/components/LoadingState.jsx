import { useEffect, useState } from "react"
import { THEME } from "../config.js"

const C = THEME.colors

const PHASES = [
  { key: "thinking",  icon: "🧠", label: "Understanding your idea",    sublabel: "Parsing ML task type and keywords" },
  { key: "searching", icon: "🔍", label: "Searching Kaggle",            sublabel: "Fetching datasets, notebooks & competitions" },
  { key: "ranking",   icon: "⚡", label: "AI ranking results",          sublabel: "Scoring relevance for your project" },
]

const SKELETON_CARDS = [0, 1, 2, 3, 4, 5]

export function LoadingState({ phase, idea }) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400)
    return () => clearInterval(t)
  }, [])

  const currentIndex = PHASES.findIndex(p => p.key === phase)
  const currentPhase = PHASES[currentIndex] || PHASES[0]

  return (
    <div>
      {/* Phase indicator */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        padding: "20px 24px",
        marginBottom: "24px",
      }}>
        {/* Step pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {PHASES.map((p, i) => (
            <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "5px 14px",
                borderRadius: "20px",
                background: i < currentIndex
                  ? `${C.green}15`
                  : i === currentIndex
                    ? `${C.primary}15`
                    : C.bgHover,
                border: `1px solid ${i < currentIndex ? C.green + "40" : i === currentIndex ? C.primary + "40" : C.border}`,
                transition: "all 0.4s",
              }}>
                <span style={{ fontSize: "14px" }}>
                  {i < currentIndex ? "✓" : p.icon}
                </span>
                <span style={{
                  fontSize: "12px",
                  color: i < currentIndex ? C.green : i === currentIndex ? C.primary : C.textMuted,
                  fontWeight: i === currentIndex ? "600" : "400",
                  fontFamily: THEME.fonts.sans,
                }}>
                  {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div style={{
                  width: "24px", height: "1px",
                  background: i < currentIndex ? C.green : C.border,
                  transition: "background 0.4s",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Current activity */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: `${C.primary}15`,
            border: `1px solid ${C.primary}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0,
          }}>
            {currentPhase.icon}
          </div>
          <div>
            <p style={{ color: C.textPrimary, fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>
              {currentPhase.label}{dots}
            </p>
            <p style={{ color: C.textMuted, fontSize: "12px", margin: 0 }}>
              {currentPhase.sublabel}
            </p>
          </div>
        </div>

        {/* Idea being searched */}
        <div style={{
          marginTop: "14px",
          padding: "10px 14px",
          background: C.bgHover,
          borderRadius: "8px",
          border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ color: C.textMuted, fontSize: "12px", flexShrink: 0 }}>Searching for:</span>
          <span style={{
            color: C.textSecondary, fontSize: "13px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            "{idea}"
          </span>
        </div>
      </div>

      {/* Skeleton cards */}
      <p style={{ color: C.textMuted, fontSize: "11px", fontFamily: THEME.fonts.mono, letterSpacing: "1.5px", margin: "0 0 12px" }}>
        LOADING RESULTS
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
        {SKELETON_CARDS.map(i => (
          <div key={i} style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            padding: "16px",
            animation: `shimmer 1.5s ease-in-out ${i * 0.1}s infinite`,
          }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.bgHover }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: "12px", background: C.bgHover, borderRadius: "4px", marginBottom: "6px", width: "60%" }} />
                <div style={{ height: "10px", background: C.bgHover, borderRadius: "4px", width: "40%" }} />
              </div>
            </div>
            <div style={{ height: "10px", background: C.bgHover, borderRadius: "4px", marginBottom: "6px" }} />
            <div style={{ height: "10px", background: C.bgHover, borderRadius: "4px", width: "80%" }} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
