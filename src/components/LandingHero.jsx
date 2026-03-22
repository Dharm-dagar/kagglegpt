import { useState, useEffect } from "react"
import { CONFIG, THEME } from "../config.js"
import { KaggleLogo, DatasetIcon, NotebookIcon, CompetitionIcon, SparkleIcon } from "./Icons.jsx"

const C = THEME.colors

// All words pre-measured — use the longest to set fixed width
const ROTATING_WORDS = ["datasets", "notebooks", "competitions", "insights"]

export function LandingHero({ onSearch }) {
  const [input, setInput] = useState("")
  const [entering, setEntering] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
        setVisible(true)
      }, 250)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  function handleSubmit(text) {
    const idea = text || input
    if (!idea.trim()) return
    setEntering(true)
    setTimeout(() => onSearch(idea), 380)
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bg,
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, ${C.primary}14 0%, transparent 45%),
        radial-gradient(ellipse at 80% 80%, ${C.accent}10 0%, transparent 45%)
      `,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: THEME.fonts.sans,
      opacity: entering ? 0 : 1,
      transform: entering ? "scale(0.98)" : "scale(1)",
      transition: "opacity 0.38s ease, transform 0.38s ease",
      overflowY: "auto",
    }}>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.primary}, ${C.accent}, ${C.green})`, zIndex: 100 }} />

      <div style={{ maxWidth: "700px", width: "100%", textAlign: "center" }}>

        {/* Logo mark */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: `linear-gradient(135deg, ${C.primary}25, ${C.accent}15)`,
          border: `1px solid ${C.primary}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          boxShadow: `0 0 40px ${C.primary}20`,
        }}>
          <KaggleLogo size={36} color={C.primary} />
        </div>

        {/* Headline — fixed height container prevents layout shift */}
        <div style={{ marginBottom: "16px" }}>
          <h1 style={{
            fontSize: "clamp(32px, 7vw, 60px)",
            fontWeight: 700,
            color: C.textPrimary,
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
          }}>
            Find Kaggle
          </h1>

          {/* Fixed-height row — "competitions" is the widest word, sets the height */}
          <div style={{
            height: "clamp(38px, 8.5vw, 72px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            marginBottom: "4px",
          }}>
            {/* Invisible reference word to hold layout */}
            <span style={{
              fontSize: "clamp(32px, 7vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              visibility: "hidden",
              userSelect: "none",
              lineHeight: 1.15,
            }}>
              competitions
            </span>

            {/* Actual animated word, absolutely positioned */}
            <span style={{
              fontSize: "clamp(32px, 7vw, 60px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              color: C.primary,
              lineHeight: 1.15,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%)`,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.25s ease",
              whiteSpace: "nowrap",
            }}>
              {ROTATING_WORDS[wordIndex]}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 7vw, 60px)",
            fontWeight: 700,
            color: C.textPrimary,
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
          }}>
            for your ML project
          </h1>
        </div>

        <p style={{
          color: C.textSecondary,
          fontSize: "clamp(15px, 2.5vw, 18px)",
          margin: "0 0 40px",
          lineHeight: 1.7,
        }}>
          Describe your idea in plain English. AI finds and ranks the best Kaggle resources — instantly.
        </p>

        {/* Search box */}
        <div style={{
          background: C.bgCard,
          border: `1.5px solid ${C.border}`,
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "16px",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
          onFocusCapture={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}15` }}
          onBlurCapture={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none" }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            placeholder="e.g. I want to build a movie recommendation system using collaborative filtering..."
            rows={3}
            autoFocus
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              resize: "none", fontSize: "15px", fontFamily: THEME.fonts.sans,
              color: C.textPrimary, lineHeight: 1.6,
              padding: "18px 20px 8px", boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px 12px" }}>
            <span style={{ color: C.textMuted, fontSize: "12px", fontFamily: THEME.fonts.mono }}>
              {input.length > 0 ? `${input.length} chars · Enter to search` : "Shift+Enter for new line"}
            </span>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? C.primary : C.border,
                color: input.trim() ? C.bg : C.textMuted,
                border: "none", borderRadius: "10px",
                padding: "10px 24px", fontSize: "14px",
                fontWeight: "600", cursor: input.trim() ? "pointer" : "not-allowed",
                fontFamily: THEME.fonts.sans, transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "8px",
              }}
              onMouseEnter={e => { if (input.trim()) { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = `0 4px 16px ${C.primary}40` } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none" }}
            >
              Find Data →
            </button>
          </div>
        </div>

        {/* Example chips */}
        <p style={{ color: C.textMuted, fontSize: "11px", margin: "0 0 10px", letterSpacing: "1.5px", fontFamily: THEME.fonts.mono }}>
          TRY AN EXAMPLE
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "48px" }}>
          {CONFIG.exampleIdeas.map((ex) => (
            <button key={ex.text} onClick={() => handleSubmit(ex.text)} style={{
              background: "transparent", border: `1px solid ${C.border}`,
              borderRadius: "20px", padding: "7px 14px",
              color: C.textSecondary, fontSize: "13px",
              cursor: "pointer", fontFamily: THEME.fonts.sans,
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; e.currentTarget.style.background = `${C.primary}10`; e.currentTarget.style.transform = "translateY(-1px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)" }}
            >
              <span>{ex.emoji}</span> {ex.text}
            </button>
          ))}
        </div>

        {/* Stats — with SVG icons */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px",
          padding: "20px", background: `${C.bgCard}80`,
          border: `1px solid ${C.border}`, borderRadius: "16px",
        }}>
          {[
            { icon: <DatasetIcon size={22} color={C.primary} />,      value: "100K+", label: "Datasets" },
            { icon: <NotebookIcon size={22} color={C.accent} />,      value: "500K+", label: "Notebooks" },
            { icon: <CompetitionIcon size={22} color={C.green} />,    value: "1000+", label: "Competitions" },
            { icon: <SparkleIcon size={22} color={C.textSecondary} />, value: "< 5s",  label: "Search time" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ color: C.primary, fontSize: "clamp(15px,3vw,20px)", fontWeight: "700", fontFamily: THEME.fonts.mono }}>{s.value}</div>
              <div style={{ color: C.textMuted, fontSize: "11px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`textarea::placeholder { color: #4A5568; }`}</style>
    </div>
  )
}
