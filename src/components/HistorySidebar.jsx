// ============================================================
//  HistorySidebar — LEFT sidebar with search history
// ============================================================

import { THEME } from "../config.js"
const C = THEME.colors

export function HistorySidebar({ history, onSelect, currentIdea }) {
  if (history.length === 0) return null

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      position: "sticky",
      top: "68px",
      maxHeight: "calc(100vh - 160px)",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: `${C.border} transparent`,
    }}>
      <p style={{
        color: C.textMuted, fontSize: "10px",
        fontFamily: THEME.fonts.mono, letterSpacing: "1.5px",
        margin: "0 0 10px", textTransform: "uppercase",
      }}>
        Search History
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {history.map((h, i) => {
          const isActive = h.idea === currentIdea
          return (
            <button
              key={h.id}
              onClick={() => onSelect(h.idea)}
              style={{
                background: isActive ? `${C.primary}12` : C.bgCard,
                border: `1px solid ${isActive ? C.primary + "40" : C.border}`,
                borderLeft: `3px solid ${isActive ? C.primary : C.border}`,
                borderRadius: "10px",
                padding: "10px 12px",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = C.primary + "40"
                  e.currentTarget.style.borderLeftColor = C.primary
                  e.currentTarget.style.background = C.bgHover
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.borderLeftColor = C.border
                  e.currentTarget.style.background = C.bgCard
                }
              }}
            >
              {/* Time ago */}
              <p style={{
                color: C.textMuted, fontSize: "9px",
                fontFamily: THEME.fonts.mono, margin: "0 0 4px",
                letterSpacing: "0.5px",
              }}>
                {i === 0 ? "just now" : `search ${i + 1}`}
              </p>

              {/* Idea text */}
              <p style={{
                color: isActive ? C.primary : C.textPrimary,
                fontSize: "12px", margin: "0 0 6px",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontWeight: isActive ? "500" : "400",
              }}>
                {h.idea}
              </p>

              {/* Result count chips */}
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {h.datasetCount > 0 && (
                  <span style={{ background: `${C.datasetColor}15`, color: C.datasetColor, borderRadius: "4px", padding: "1px 6px", fontSize: "9px", fontFamily: THEME.fonts.mono }}>
                    📦 {h.datasetCount}
                  </span>
                )}
                {h.notebookCount > 0 && (
                  <span style={{ background: `${C.notebookColor}15`, color: C.notebookColor, borderRadius: "4px", padding: "1px 6px", fontSize: "9px", fontFamily: THEME.fonts.mono }}>
                    📓 {h.notebookCount}
                  </span>
                )}
                {h.competitionCount > 0 && (
                  <span style={{ background: `${C.competitionColor}15`, color: C.competitionColor, borderRadius: "4px", padding: "1px 6px", fontSize: "9px", fontFamily: THEME.fonts.mono }}>
                    🏆 {h.competitionCount}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
