// ============================================================
//  api.js — frontend API helper
//  All calls proxied through /api/kaggle serverless function
// ============================================================

import { CONFIG } from "../config.js"

async function callAPI(action, payload) {
  const res = await fetch("/api/kaggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || `Server error ${res.status}`)
  }
  return res.json()
}

export async function testAuth() {
  return callAPI("testAuth", {})
}

export async function generateQueries(idea) {
  const data = await callAPI("generateQueries", { idea, systemPrompt: CONFIG.querySystemPrompt })
  return data.result
}

export async function searchDatasets(query) {
  const data = await callAPI("searchDatasets", { query })
  return data.results || []
}

export async function searchNotebooks(query) {
  const data = await callAPI("searchNotebooks", { query })
  return data.results || []
}

export async function searchCompetitions(query) {
  const data = await callAPI("searchCompetitions", { query })
  return data.results || []
}

export async function rankResults(idea, results) {
  const data = await callAPI("rankResults", { idea, results, systemPrompt: CONFIG.rankSystemPrompt })
  return data.result
}
