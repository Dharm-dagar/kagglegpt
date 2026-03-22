// ============================================================
//  Icons.jsx — all SVG icons/logos used in the app
//  Change icons here, reflects everywhere
// ============================================================

import { THEME } from "../config.js"
const C = THEME.colors

// Kaggle logo (official mark)
export function KaggleLogo({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.5 32l-8.3-10.1L21.5 12h-5.7L8.5 21.9V0H4v32h4.5V22.1L18.2 32z" fill={color || C.primary} />
    </svg>
  )
}

// Dataset icon (stacked layers)
export function DatasetIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke={color || C.datasetColor} strokeWidth="1.5" />
      <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke={color || C.datasetColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke={color || C.datasetColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke={color || C.datasetColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Notebook icon (code file)
export function NotebookIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={color || C.notebookColor} strokeWidth="1.5" />
      <path d="M8 10l2.5 2.5L8 15" stroke={color || C.notebookColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 15h3" stroke={color || C.notebookColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 6h8" stroke={color || C.notebookColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

// Competition / trophy icon
export function CompetitionIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 21h8M12 17v4" stroke={color || C.competitionColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 3H3v4a4 4 0 004 4M19 3h2v4a4 4 0 01-4 4" stroke={color || C.competitionColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17a6 6 0 006-6V3H6v8a6 6 0 006 6z" stroke={color || C.competitionColor} strokeWidth="1.5" />
    </svg>
  )
}

// Search icon
export function SearchIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color || C.textMuted} strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke={color || C.textMuted} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Sparkle / AI icon
export function SparkleIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke={color || C.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Robot / AI icon
export function AIIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="12" rx="2" stroke={color || C.primary} strokeWidth="1.5" />
      <path d="M12 2v6M9 2h6" stroke={color || C.primary} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1.5" fill={color || C.primary} />
      <circle cx="15" cy="14" r="1.5" fill={color || C.primary} />
      <path d="M9 18h6" stroke={color || C.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// Lightbulb / tip icon
export function TipIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8A6 6 0 0112 3z" stroke={color || C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Target / understood icon
export function TargetIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color || C.textMuted} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color || C.textMuted} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill={color || C.textMuted} />
    </svg>
  )
}

// Send / arrow up icon
export function SendIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M5 12l7-7 7 7" stroke={color || "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Home icon
export function HomeIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color || C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" stroke={color || C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// History / clock icon
export function HistoryIcon({ size = 14, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color || C.textMuted} strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke={color || C.textMuted} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// External link icon
export function ExternalIcon({ size = 14, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke={color || C.textMuted} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 3h6v6M10 14L21 3" stroke={color || C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Loading spinner
export function SpinnerIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke={color || C.textMuted} strokeWidth="2" strokeDasharray="28 56" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  )
}
