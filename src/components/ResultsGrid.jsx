import { useState } from "react"
import { THEME } from "../config.js"
import { DatasetIcon, NotebookIcon, CompetitionIcon, AIIcon, TipIcon, ExternalIcon } from "./Icons.jsx"
const C = THEME.colors

const VERDICT = {
  "Perfect fit":    { color: C.green,   bg: `${C.green}12`,   border: `${C.green}35`,   icon: "🏆", glow: C.green },
  "Good match":     { color: C.primary, bg: `${C.primary}10`, border: `${C.primary}30`, icon: "✅", glow: C.primary },
  "Worth checking": { color: C.amber,   bg: `${C.amber}10`,   border: `${C.amber}30`,   icon: "👀", glow: C.amber },
  "Skip":           { color: C.red,     bg: `${C.red}08`,     border: `${C.red}25`,     icon: "⏭️", glow: C.red },
}

function fmtBytes(b) {
  if (!b) return null
  if (b < 1e6) return `${(b/1024).toFixed(0)} KB`
  if (b < 1e9) return `${(b/1e6).toFixed(0)} MB`
  return `${(b/1e9).toFixed(1)} GB`
}

function getRanking(ref, rankings) {
  if (!rankings?.ranked || !ref) return null
  return rankings.ranked.find(r => r.ref && (ref === r.ref || ref.includes(r.ref) || r.ref.includes(ref.split("/").pop())))
}

function Tag({ children, color }) {
  return (
    <span style={{
      background: color ? `${color}15` : C.bgHover,
      color: color || C.textMuted,
      border: `1px solid ${color ? color + "30" : C.border}`,
      borderRadius: "6px", padding: "2px 8px",
      fontSize: "11px", fontFamily: THEME.fonts.mono,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  )
}

function Card({ type, item, ranking, accentColor, icon, url }) {
  const [hovered, setHovered] = useState(false)
  const v = ranking?.verdict ? VERDICT[ranking.verdict] : null
  const isPerfect = ranking?.verdict === "Perfect fit"

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? C.bgHover : C.bgCard,
          border: `1px solid ${hovered ? accentColor + "60" : isPerfect ? C.green + "50" : C.border}`,
          borderTop: `2px solid ${isPerfect ? C.green : hovered ? accentColor : C.border}`,
          borderRadius: "12px",
          padding: "16px",
          cursor: "pointer",
          transition: "all 0.22s ease",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? `0 12px 32px ${accentColor}18` : isPerfect ? `0 0 0 1px ${C.green}20` : "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Glow on perfect fit */}
        {isPerfect && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`,
          }} />
        )}

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
            transition: "transform 0.2s",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}>
            {icon}
          </div>

          {v && (
            <span style={{
              background: v.bg, color: v.color,
              border: `1px solid ${v.border}`,
              borderRadius: "20px", padding: "3px 10px",
              fontSize: "10px", fontWeight: "700",
              fontFamily: THEME.fonts.mono,
              display: "flex", alignItems: "center", gap: "4px",
              whiteSpace: "nowrap",
            }}>
              {v.icon} {ranking.verdict}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          color: C.textPrimary,
          fontSize: "13px",
          margin: 0,
          fontWeight: "600",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {item.title}
        </h3>

        {/* Subtitle */}
        {item.subtitle && (
          <p style={{
            color: C.textMuted, fontSize: "12px", margin: 0,
            lineHeight: 1.4, display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {item.subtitle}
          </p>
        )}

        {/* AI why box */}
        {ranking?.why && (
          <div style={{
            background: `${accentColor}08`,
            border: `1px dashed ${accentColor}25`,
            borderRadius: "8px",
            padding: "8px 10px",
            fontSize: "12px",
            color: C.textSecondary,
            lineHeight: 1.5,
            flex: 1,
          }}>
            <span style={{ color: accentColor, fontSize: "10px", fontFamily: THEME.fonts.mono, marginRight: "4px" }}>AI →</span>
            {ranking.why}
          </div>
        )}

        {/* Warning */}
        {ranking?.warning && (
          <div style={{ fontSize: "11px", color: C.amber, display: "flex", gap: "5px" }}>
            <span>⚠️</span><span>{ranking.warning}</span>
          </div>
        )}

        {/* Meta tags row */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", marginTop: "auto" }}>
          {type === "dataset" && <>
            {fmtBytes(item.totalBytes) && <Tag>💾 {fmtBytes(item.totalBytes)}</Tag>}
            {item.totalVotes != null && <Tag color={C.primary}>▲ {item.totalVotes}</Tag>}
            {item.usabilityRating != null && (
              <Tag color={item.usabilityRating > 0.7 ? C.green : C.amber}>
                ⭐ {(item.usabilityRating * 10).toFixed(0)}%
              </Tag>
            )}
          </>}
          {type === "notebook" && <>
            {item.totalVotes != null && <Tag color={C.primary}>▲ {item.totalVotes}</Tag>}
            {item.language && <Tag color={C.notebookColor}>{item.language}</Tag>}
          </>}
          {type === "competition" && item.deadline && (
            <Tag color={new Date(item.deadline) > new Date() ? C.green : C.textMuted}>
              {new Date(item.deadline) > new Date() ? "🟢 Active" : "🔴 Ended"}
            </Tag>
          )}
          <span style={{ marginLeft: "auto", transition: "all 0.2s", transform: hovered ? "translate(2px, -2px)" : "none" }}><ExternalIcon size={13} color={hovered ? accentColor : C.textMuted} /></span>
        </div>
      </div>
    </a>
  )
}

// Top result featured card (larger)
function FeaturedCard({ type, item, ranking, accentColor, icon, url }) {
  const [hovered, setHovered] = useState(false)
  const v = ranking?.verdict ? VERDICT[ranking.verdict] : null

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: `linear-gradient(135deg, ${accentColor}10, ${C.bgCard})`,
          border: `1px solid ${accentColor}40`,
          borderTop: `3px solid ${accentColor}`,
          borderRadius: "14px",
          padding: "20px",
          cursor: "pointer",
          transition: "all 0.22s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? `0 16px 40px ${accentColor}20` : `0 4px 16px ${accentColor}10`,
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
      >
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", flexShrink: 0,
        }}>
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
            {v && (
              <span style={{
                background: v.bg, color: v.color, border: `1px solid ${v.border}`,
                borderRadius: "20px", padding: "3px 10px",
                fontSize: "11px", fontWeight: "700", fontFamily: THEME.fonts.mono,
              }}>
                {v.icon} {ranking.verdict}
              </span>
            )}
            <span style={{ color: C.textMuted, fontSize: "10px", fontFamily: THEME.fonts.mono }}>TOP RESULT</span>
          </div>

          <h3 style={{ color: C.textPrimary, fontSize: "16px", margin: "0 0 8px", fontWeight: "700", lineHeight: 1.3 }}>
            {item.title}
          </h3>

          {ranking?.why && (
            <p style={{ color: C.textSecondary, fontSize: "13px", margin: "0 0 10px", lineHeight: 1.6 }}>
              <span style={{ color: accentColor, fontFamily: THEME.fonts.mono, fontSize: "11px" }}>AI → </span>
              {ranking.why}
            </p>
          )}

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {type === "dataset" && <>
              {fmtBytes(item.totalBytes) && <Tag>💾 {fmtBytes(item.totalBytes)}</Tag>}
              {item.totalVotes != null && <Tag color={C.primary}>▲ {item.totalVotes} votes</Tag>}
              {item.usabilityRating != null && <Tag color={C.green}>⭐ {(item.usabilityRating * 10).toFixed(0)}% usability</Tag>}
            </>}
            <span style={{ marginLeft: "auto", transition: "all 0.2s", transform: hovered ? "translate(2px,-2px)" : "none" }}><ExternalIcon size={13} color={hovered ? accentColor : C.textMuted} /></span>
          </div>
        </div>
      </div>
    </a>
  )
}

function Section({ icon, title, count, color, items, type, rankings, urlFn }) { /* icon is now JSX */
  // Sort by verdict: Perfect fit first
  const verdictOrder = { "Perfect fit": 0, "Good match": 1, "Worth checking": 2, "Skip": 3 }
  const sorted = [...items].sort((a, b) => {
    const ra = getRanking(a.ref || a.id, rankings)
    const rb = getRanking(b.ref || b.id, rankings)
    return (verdictOrder[ra?.verdict] ?? 4) - (verdictOrder[rb?.verdict] ?? 4)
  })

  const [featured, ...rest] = sorted

  return (
    <section>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px",
        }}>
          {icon}
        </div>
        <h2 style={{ color: C.textPrimary, fontSize: "16px", margin: 0, fontWeight: "600" }}>
          {title}
        </h2>
        <span style={{
          background: `${color}15`, color: color,
          border: `1px solid ${color}30`,
          borderRadius: "20px", padding: "2px 10px",
          fontSize: "11px", fontFamily: THEME.fonts.mono,
        }}>
          {count} found
        </span>
        <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${color}30, transparent)` }} />
      </div>

      {/* Featured top result */}
      {featured && (
        <div style={{ marginBottom: "12px" }}>
          <FeaturedCard
            type={type}
            item={featured}
            ranking={getRanking(featured.ref || featured.id, rankings)}
            accentColor={color}
            icon={icon}
            url={urlFn(featured)}
          />
        </div>
      )}

      {/* Rest in grid */}
      {rest.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "10px" }}>
          {rest.map((item, i) => (
            <Card
              key={item.ref || item.id || i}
              type={type}
              item={item}
              ranking={getRanking(item.ref || item.id, rankings)}
              accentColor={color}
              icon={icon}
              url={urlFn(item)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export function ResultsGrid({ datasets, notebooks, competitions, rankings, activeFilter, queryMeta }) {
  const showDatasets     = activeFilter === "all" || activeFilter === "datasets"
  const showNotebooks    = activeFilter === "all" || activeFilter === "notebooks"
  const showCompetitions = activeFilter === "all" || activeFilter === "competitions"
  const total = datasets.length + notebooks.length + competitions.length

  if (total === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "80px 20px",
        background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
        <h3 style={{ color: C.textPrimary, margin: "0 0 8px" }}>No results found</h3>
        <p style={{ color: C.textMuted, fontSize: "14px", margin: 0 }}>Try rephrasing with more specific keywords</p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* AI Summary */}
      {rankings?.summary && (
        <div style={{
          background: `linear-gradient(135deg, ${C.primary}10, ${C.accent}08, ${C.bg})`,
          border: `1px solid ${C.primary}25`,
          borderRadius: "16px", padding: "20px 22px",
          display: "flex", gap: "14px",
          boxShadow: `0 4px 24px ${C.primary}10`,
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: `${C.primary}15`, border: `1px solid ${C.primary}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0,
          }}><AIIcon size={22} color={C.primary} /></div>
          <div>
            <p style={{ color: C.primary, fontSize: "10px", fontFamily: THEME.fonts.mono, margin: "0 0 6px", letterSpacing: "1.5px" }}>
              AI RECOMMENDATION
            </p>
            <p style={{ color: C.textPrimary, fontSize: "15px", margin: 0, lineHeight: 1.7, fontWeight: "500" }}>
              {rankings.summary}
            </p>
          </div>
        </div>
      )}

      {/* Project Tips */}
      {queryMeta?.tips && (
        <div style={{
          background: `${C.accent}08`,
          border: `1px solid ${C.accent}20`,
          borderRadius: "14px", padding: "16px 20px",
          display: "flex", gap: "12px",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: `${C.accent}15`, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}><TipIcon size={22} color={C.accent} /></div>
          <div>
            <p style={{ color: C.accent, fontSize: "10px", fontFamily: THEME.fonts.mono, margin: "0 0 5px", letterSpacing: "1.5px" }}>PROJECT TIPS</p>
            <p style={{ color: C.textSecondary, fontSize: "13px", margin: 0, lineHeight: 1.7 }}>{queryMeta.tips}</p>
          </div>
        </div>
      )}

      {showDatasets && datasets.length > 0 && (
        <Section
          icon={<DatasetIcon size={16} color={C.datasetColor} />} title="Datasets" count={datasets.length}
          color={C.datasetColor} items={datasets} type="dataset"
          rankings={rankings}
          urlFn={d => `https://www.kaggle.com/datasets/${d.ref}`}
        />
      )}

      {showNotebooks && notebooks.length > 0 && (
        <Section
          icon={<NotebookIcon size={16} color={C.notebookColor} />} title="Notebooks" count={notebooks.length}
          color={C.notebookColor} items={notebooks} type="notebook"
          rankings={rankings}
          urlFn={n => `https://www.kaggle.com/${n.ref}`}
        />
      )}

      {showCompetitions && competitions.length > 0 && (
        <Section
          icon={<CompetitionIcon size={16} color={C.competitionColor} />} title="Competitions" count={competitions.length}
          color={C.competitionColor} items={competitions} type="competition"
          rankings={rankings}
          urlFn={c => `https://www.kaggle.com/c/${c.ref || c.id}`}
        />
      )}

      {/* Bottom padding for fixed search bar */}
      <div style={{ height: "80px" }} />
    </div>
  )
}
