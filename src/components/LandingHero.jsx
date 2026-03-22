import { useState, useEffect } from "react"
import { CONFIG, THEME } from "../config.js"

const C = THEME.colors

const ROTATING_WORDS = ["datasets", "notebooks", "competitions", "insights"]

export function LandingHero({ onSearch }) {
  const [input, setInput] = useState("")
  const [entering, setEntering] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  // Rotate headline word
  useEffect(() => {
    const t = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
        setWordVisible(true)
      }, 300)
    }, 2000)
    return () => clearInterval(t)
  }, [])

  function handleSubmit(text) {
    const idea = text || input
    if (!idea.trim()) return
    setEntering(true)
    setTimeout(() => onSearch(idea), 400)
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bg,
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, ${C.primary}14 0%, transparent 45%),
        radial-gradient(ellipse at 80% 80%, ${C.accent}10 0%, transparent 45%),
        radial-gradient(ellipse at 60% 10%, ${C.green}08 0%, transparent 35%)
      `,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: THEME.fonts.sans,
      opacity: entering ? 0 : 1,
      transform: entering ? "scale(0.98)" : "scale(1)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
      overflowY: "auto",
    }}>

      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${C.primary}, ${C.accent}, ${C.green})`, zIndex: 100 }} />

      <div style={{ maxWidth: "700px", width: "100%", textAlign: "center" }}>

        {/* Logo mark */}
        <div style={{
          width: "64px", height: "64px",
          borderRadius: "18px",
          background: `linear-gradient(135deg, ${C.primary}30, ${C.accent}20)`,
          border: `1px solid ${C.primary}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "28px", margin: "0 auto 24px",
          boxShadow: `0 0 40px ${C.primary}20`,
        }}>
          📦
        </div>

        {/* Headline with rotating word */}
        <h1 style={{
          fontSize: "clamp(32px, 7vw, 60px)",
          fontWeight: 700,
          color: C.textPrimary,
          margin: "0 0 16px",
          lineHeight: 1.15,
          letterSpacing: "-1px",
        }}>
          Find Kaggle{" "}
          <span style={{
            color: C.primary,
            opacity: wordVisible ? 1 : 0,
            transform: wordVisible ? "translateY(0)" : "translateY(-8px)",
            transition: "opacity 0.3s, transform 0.3s",
            display: "inline-block",
            minWidth: "160px",
          }}>
            {ROTATING_WORDS[wordIndex]}
          </span>
          <br />for your ML project
        </h1>

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
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = C.primary
            e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}15`
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = C.border
            e.currentTarget.style.boxShadow = "none"
          }}
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
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px 12px",
          }}>
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
              <span>Find Data</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Example chips */}
        <p style={{ color: C.textMuted, fontSize: "11px", margin: "0 0 10px", letterSpacing: "1.5px", fontFamily: THEME.fonts.mono }}>
          TRY AN EXAMPLE
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "56px" }}>
          {CONFIG.exampleIdeas.map((ex) => (
            <button
              key={ex.text}
              onClick={() => handleSubmit(ex.text)}
              style={{
                background: "transparent", border: `1px solid ${C.border}`,
                borderRadius: "20px", padding: "7px 14px",
                color: C.textSecondary, fontSize: "13px",
                cursor: "pointer", fontFamily: THEME.fonts.sans,
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.primary
                e.currentTarget.style.color = C.primary
                e.currentTarget.style.background = `${C.primary}10`
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.color = C.textSecondary
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <span>{ex.emoji}</span> {ex.text}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          padding: "20px",
          background: `${C.bgCard}80`,
          border: `1px solid ${C.border}`,
          borderRadius: "16px",
        }}>
          {[
            { icon: "📦", value: "100K+", label: "Datasets" },
            { icon: "📓", value: "500K+", label: "Notebooks" },
            { icon: "🏆", value: "1000+", label: "Competitions" },
            { icon: "⚡", value: "< 5s", label: "Search time" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ color: C.primary, fontSize: "clamp(16px,3vw,20px)", fontWeight: "700", fontFamily: THEME.fonts.mono }}>{s.value}</div>
              <div style={{ color: C.textMuted, fontSize: "11px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`textarea::placeholder { color: #4A5568; }`}</style>
    </div>
  )
}
