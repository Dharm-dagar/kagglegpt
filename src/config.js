// ============================================================
//  CONFIG.js — edit everything from here
// ============================================================

export const CONFIG = {
  name: "KaggleGPT",
  tagline: "Describe your ML project. Get the perfect datasets instantly.",
  version: "v1.0.0",

  // Example project ideas shown on landing
  exampleIdeas: [
    { emoji: "🌱", text: "Crop disease detection using leaf images" },
    { emoji: "💬", text: "Sentiment analysis on Twitter data" },
    { emoji: "🏥", text: "Predict patient readmission in hospitals" },
    { emoji: "🚗", text: "Self-driving car object detection" },
    { emoji: "📈", text: "Stock price prediction with LSTM" },
    { emoji: "🎭", text: "Fake news detection classifier" },
    { emoji: "🏠", text: "House price prediction regression" },
    { emoji: "😷", text: "COVID-19 X-ray classification" },
  ],

  // Quick filter chips
  filterChips: [
    { label: "All", value: "all" },
    { label: "📦 Datasets", value: "datasets" },
    { label: "📓 Notebooks", value: "notebooks" },
    { label: "🏆 Competitions", value: "competitions" },
  ],

  // Groq system prompt for query generation + result ranking
  querySystemPrompt: `You are KaggleGPT. Given an ML project idea, respond ONLY with this JSON (no markdown, no extra text):
{"understood":"one sentence","searchQueries":["term1","term2","term3"],"taskType":"classification","recommendedDataTypes":["image"],"tips":"one practical tip"}

Rules: searchQueries should match real Kaggle dataset names. taskType: classification/regression/nlp/computer-vision/time-series/clustering. Keep ALL strings SHORT (under 100 chars each).`,

  // Groq system prompt for ranking/explaining results
  rankSystemPrompt: `You are KaggleGPT. Rank Kaggle results for an ML project. Respond ONLY with this JSON (no markdown, no extra text):
{"ranked":[{"ref":"ref_string","score":8,"why":"short reason","verdict":"Perfect fit","warning":null}],"summary":"one sentence recommendation"}

verdict must be exactly one of: Perfect fit / Good match / Worth checking / Skip. Keep ALL strings SHORT (under 80 chars). Only include top 5 results.`,
}

// ============================================================
//  THEME — dark data-science aesthetic
// ============================================================
export const THEME = {
  fonts: {
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    sans: "'Inter', system-ui, sans-serif",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap",
  },
  colors: {
    bg: "#0A0E1A",
    bgCard: "#111827",
    bgHover: "#1a2235",
    bgInput: "#0D1322",

    primary: "#20BDFF",       // Kaggle blue
    primaryDim: "#1a9fd4",
    primaryGlow: "#20BDFF18",

    accent: "#00D4AA",        // teal accent
    green: "#00E676",         // success / good match
    amber: "#FFB300",         // warning
    red: "#FF5252",           // skip / danger

    textPrimary: "#E8EDF5",
    textSecondary: "#8B9AB0",
    textMuted: "#4A5568",

    border: "#1E2D45",
    borderBright: "#2D4060",

    kaggleBlue: "#20BDFF",
    datasetColor: "#20BDFF",
    notebookColor: "#00D4AA",
    competitionColor: "#FFB300",
  },
}
