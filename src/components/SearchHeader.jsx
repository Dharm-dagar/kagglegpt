// ============================================================
//  SearchHeader — top bar (logo + nav only, no search bar)
// ============================================================

import { THEME } from "../config.js"
import { KaggleLogo, HomeIcon } from "./Icons.jsx"
const C = THEME.colors

export function SearchHeader({ onHome, isLoading, totalResults, idea }) {
  return (
    <header style={{
      background: `${C.bgCard}E0`,
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
      padding: "0 clamp(12px, 3vw, 24px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "52px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <button onClick={onHome} style={{
        background: "transparent", border: "none",
        display: "flex", alignItems: "center", gap: "8px",
        cursor: "pointer", padding: 0,
      }}>
        <KaggleLogo size={20} color={C.primary} />
        <span style={{ color: C.primary, fontSize: "16px", fontWeight: "700", fontFamily: THEME.fonts.mono }}>
          Kaggle<span style={{ color: C.textPrimary }}>GPT</span>
        </span>
      </button>

      {/* Right side info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.primary, animation: "pulse 1s infinite" }} />
            <span style={{ color: C.primary, fontSize: "12px", fontFamily: THEME.fonts.mono }}>Searching...</span>
          </div>
        )}
        {totalResults > 0 && !isLoading && (
          <span style={{ color: C.textMuted, fontSize: "12px", fontFamily: THEME.fonts.mono }}>
            {totalResults} results
          </span>
        )}
        <button onClick={onHome} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          borderRadius: "8px", padding: "5px 14px",
          color: C.textMuted, fontSize: "12px", cursor: "pointer",
          fontFamily: THEME.fonts.sans, transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.color = C.primary; e.currentTarget.style.borderColor = C.primary }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border }}
        >
          ← Home
        </button>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </header>
  )
}
