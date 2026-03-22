import { useState } from "react"
import { THEME, CONFIG } from "./config.js"
import { useSearch } from "./hooks/useSearch.js"

import { LandingHero }      from "./components/LandingHero.jsx"
import { SearchHeader }     from "./components/SearchHeader.jsx"
import { BottomSearchBar }  from "./components/BottomSearchBar.jsx"
import { HistorySidebar }   from "./components/HistorySidebar.jsx"
import { LoadingState }     from "./components/LoadingState.jsx"
import { ResultsGrid }      from "./components/ResultsGrid.jsx"

const C = THEME.colors

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const {
    idea, setIdea,
    phase,
    queryMeta, datasets, notebooks, competitions, rankings,
    error, activeFilter, setActiveFilter,
    history, search, reset,
  } = useSearch()

  const isLoading  = ["thinking", "searching", "ranking"].includes(phase)
  const hasResults = phase === "done"
  const total      = datasets.length + notebooks.length + competitions.length

  function handleSearch(inputIdea) {
    setIdea(inputIdea)
    setShowLanding(false)
    search(inputIdea)
  }

  function handleHome() { reset(); setShowLanding(true) }

  if (showLanding) return <LandingHero onSearch={handleSearch} />

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: THEME.fonts.sans }}>

      {/* Top accent */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 300, background: `linear-gradient(90deg, ${C.primary}, ${C.accent}, ${C.green})` }} />

      <SearchHeader onHome={handleHome} isLoading={isLoading} totalResults={total} idea={idea} />

      {/* Main layout: left sidebar + content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        gap: "24px",
        padding: "24px clamp(12px, 3vw, 24px) 0",
        alignItems: "flex-start",
      }}>

        {/* LEFT: history sidebar */}
        {history.length > 0 && (
          <HistorySidebar
            history={history}
            onSelect={handleSearch}
            currentIdea={idea}
          />
        )}

        {/* RIGHT: main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Query understanding banner */}
          {queryMeta && !isLoading && (
            <div style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: "12px", padding: "12px 16px",
              marginBottom: "16px", display: "flex",
              alignItems: "center", gap: "12px", flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "200px" }}>
                <span style={{ fontSize: "16px" }}>🎯</span>
                <div>
                  <p style={{ color: C.textMuted, fontSize: "10px", fontFamily: THEME.fonts.mono, margin: "0 0 2px", letterSpacing: "1px" }}>UNDERSTOOD AS</p>
                  <p style={{ color: C.textPrimary, fontSize: "13px", margin: 0 }}>{queryMeta.understood}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {queryMeta.taskType && (
                  <span style={{ background: `${C.primary}12`, color: C.primary, border: `1px solid ${C.primary}30`, borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontFamily: THEME.fonts.mono }}>
                    {queryMeta.taskType}
                  </span>
                )}
                {queryMeta.recommendedDataTypes?.slice(0, 2).map(t => (
                  <span key={t} style={{ background: `${C.accent}10`, color: C.accent, border: `1px solid ${C.accent}25`, borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontFamily: THEME.fonts.mono }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filter chips */}
          {hasResults && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {CONFIG.filterChips.map(chip => (
                <button key={chip.value} onClick={() => setActiveFilter(chip.value)}
                  style={{
                    background: activeFilter === chip.value ? C.primary : "transparent",
                    color: activeFilter === chip.value ? C.bg : C.textSecondary,
                    border: `1px solid ${activeFilter === chip.value ? C.primary : C.border}`,
                    borderRadius: "20px", padding: "6px 16px",
                    fontSize: "13px", cursor: "pointer", fontFamily: THEME.fonts.sans,
                    fontWeight: activeFilter === chip.value ? "600" : "400",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (activeFilter !== chip.value) { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary } }}
                  onMouseLeave={e => { if (activeFilter !== chip.value) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary } }}
                >
                  {chip.label}
                </button>
              ))}
              <span style={{ color: C.textMuted, fontSize: "12px", fontFamily: THEME.fonts.mono, marginLeft: "4px" }}>
                {total} results
              </span>
            </div>
          )}

          {/* Loading */}
          {isLoading && <LoadingState phase={phase} idea={idea} />}

          {/* Error */}
          {phase === "error" && (
            <div style={{
              background: `${C.red}08`, border: `1px solid ${C.red}25`,
              borderRadius: "14px", padding: "40px", textAlign: "center",
            }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
              <h3 style={{ color: C.textPrimary, margin: "0 0 8px" }}>Something went wrong</h3>
              <p style={{ color: C.red, fontSize: "13px", margin: "0 0 20px", fontFamily: THEME.fonts.mono }}>{error}</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button onClick={() => search(idea)} style={{ background: C.primary, color: C.bg, border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  Try again
                </button>
                <button onClick={handleHome} style={{ background: "transparent", color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "10px 24px", fontSize: "14px", cursor: "pointer" }}>
                  New search
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <ResultsGrid
              datasets={datasets} notebooks={notebooks}
              competitions={competitions} rankings={rankings}
              activeFilter={activeFilter} queryMeta={queryMeta}
            />
          )}
        </div>
      </div>

      {/* Fixed bottom search bar */}
      <BottomSearchBar idea={idea} onSearch={handleSearch} isLoading={isLoading} />

      <style>{`@media(max-width:640px){div[style*="display: flex; gap: 24px"]{flex-direction:column!important}}`}</style>
    </div>
  )
}
