// ============================================================
//  BottomSearchBar — fixed search bar at bottom of screen
// ============================================================

import { useState, useRef, useEffect } from "react"
import { CONFIG, THEME } from "../config.js"
import { SparkleIcon, SendIcon, SpinnerIcon, SearchIcon } from "./Icons.jsx"
const C = THEME.colors

export function BottomSearchBar({ idea, onSearch, isLoading }) {
  const [input, setInput] = useState(idea || "")
  const [focused, setFocused] = useState(false)
  const [showChips, setShowChips] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => { setInput(idea || "") }, [idea])

  // Auto resize
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 100) + "px"
  }, [input])

  function handleSubmit() {
    if (!input.trim() || isLoading) return
    setShowChips(false)
    onSearch(input.trim())
  }

  return (
    <>
      {/* Quick chips popover */}
      {showChips && (
        <div style={{
          position: "fixed", bottom: "100px", left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, calc(100vw - 32px))",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: "16px",
          padding: "16px",
          zIndex: 199,
          boxShadow: `0 -8px 40px #00000060`,
          animation: "slideUp 0.2s ease",
        }}>
          <p style={{ color: C.textMuted, fontSize: "11px", fontFamily: THEME.fonts.mono, letterSpacing: "1.5px", margin: "0 0 10px" }}>
            EXAMPLE IDEAS
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CONFIG.exampleIdeas.map(ex => (
              <button key={ex.text} onClick={() => { setInput(ex.text); setShowChips(false); setTimeout(() => textareaRef.current?.focus(), 50) }}
                style={{
                  background: "transparent", border: `1px solid ${C.border}`,
                  borderRadius: "20px", padding: "6px 14px",
                  color: C.textSecondary, fontSize: "12px",
                  cursor: "pointer", fontFamily: THEME.fonts.sans,
                  display: "flex", alignItems: "center", gap: "6px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; e.currentTarget.style.background = `${C.primary}10` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; e.currentTarget.style.background = "transparent" }}
              >
                <span>{ex.emoji}</span> {ex.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop for chips */}
      {showChips && (
        <div onClick={() => setShowChips(false)} style={{
          position: "fixed", inset: 0, zIndex: 198,
        }} />
      )}

      {/* Bottom bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "12px 16px 16px",
        background: `${C.bg}F0`,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${focused ? C.primary + "40" : C.border}`,
        zIndex: 200,
        transition: "border-color 0.2s",
      }}>
        <div style={{
          maxWidth: "760px",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
        }}>
          {/* Examples button */}
          <button
            onClick={() => setShowChips(s => !s)}
            title="Example ideas"
            style={{
              width: "40px", height: "40px", flexShrink: 0,
              background: showChips ? `${C.primary}15` : C.bgCard,
              border: `1px solid ${showChips ? C.primary + "50" : C.border}`,
              borderRadius: "10px", cursor: "pointer",
              fontSize: "18px", transition: "all 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary }}
            onMouseLeave={e => { if (!showChips) e.currentTarget.style.borderColor = C.border }}
          >
            <SparkleIcon size={18} color={showChips ? C.primary : C.textSecondary} />
          </button>

          {/* Input box */}
          <div style={{
            flex: 1,
            background: C.bgCard,
            border: `1.5px solid ${focused ? C.primary : C.border}`,
            borderRadius: "14px",
            padding: "10px 14px",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px ${C.primary}15` : "none",
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
              placeholder="Describe your ML project idea..."
              rows={1}
              style={{
                width: "100%", background: "transparent",
                border: "none", outline: "none", resize: "none",
                fontSize: "14px", fontFamily: THEME.fonts.sans,
                color: C.textPrimary, lineHeight: 1.5,
                maxHeight: "100px", overflow: "auto",
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            style={{
              width: "40px", height: "40px", flexShrink: 0,
              background: input.trim() && !isLoading ? C.primary : C.border,
              border: "none", borderRadius: "10px",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              fontSize: isLoading ? "16px" : "18px",
            }}
            onMouseEnter={e => { if (input.trim() && !isLoading) { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = `0 4px 16px ${C.primary}40` } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none" }}
          >
            {isLoading
              ? <SpinnerIcon size={16} color={C.textMuted} />
              : <SendIcon size={16} color={input.trim() ? C.bg : C.textMuted} />
            }
          </button>
        </div>

        <p style={{ textAlign: "center", color: C.textMuted, fontSize: "10px", fontFamily: THEME.fonts.mono, margin: "6px 0 0" }}>
          Enter to search · Shift+Enter for new line · ✨ for examples
        </p>
      </div>

      <style>{`
        textarea::placeholder { color: #4A5568; }
        @keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </>
  )
}
