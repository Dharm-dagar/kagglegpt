// ============================================================
//  useSearch.js — all search state + orchestration logic
// ============================================================

import { useState, useCallback } from "react"
import {
  generateQueries,
  searchDatasets,
  searchNotebooks,
  searchCompetitions,
  rankResults,
} from "../utils/api.js"

export function useSearch() {
  const [idea, setIdea] = useState("")
  const [phase, setPhase] = useState("idle") // idle | thinking | searching | ranking | done | error
  const [phaseMessage, setPhaseMessage] = useState("")
  const [queryMeta, setQueryMeta] = useState(null)   // AI understanding of the idea
  const [datasets, setDatasets] = useState([])
  const [notebooks, setNotebooks] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [rankings, setRankings] = useState(null)     // AI ranking of results
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [history, setHistory] = useState([])

  const search = useCallback(async (inputIdea) => {
    const projectIdea = inputIdea || idea
    if (!projectIdea.trim()) return

    setPhase("thinking")
    setPhaseMessage("Understanding your project idea...")
    setError(null)
    setDatasets([])
    setNotebooks([])
    setCompetitions([])
    setRankings(null)
    setQueryMeta(null)

    try {
      // Step 1: Generate smart queries
      const meta = await generateQueries(projectIdea)
      setQueryMeta(meta)
      setPhase("searching")

      // Step 2: Search all three in parallel using first query
      const primaryQuery = meta.searchQueries?.[0] || projectIdea
      const altQuery = meta.searchQueries?.[1] || projectIdea

      setPhaseMessage(`Searching Kaggle for "${primaryQuery}"...`)

      const [ds1, ds2, nb, comp] = await Promise.all([
        searchDatasets(primaryQuery),
        searchDatasets(altQuery),
        searchNotebooks(primaryQuery),
        searchCompetitions(primaryQuery),
      ])

      // Deduplicate datasets by ref
      const allDatasets = [...ds1, ...ds2]
      const seen = new Set()
      const uniqueDatasets = allDatasets.filter(d => {
        const ref = d.ref || d.id
        if (seen.has(ref)) return false
        seen.add(ref)
        return true
      }).slice(0, 8)

      setDatasets(uniqueDatasets)
      setNotebooks(nb.slice(0, 4))
      setCompetitions(comp.slice(0, 4))

      // Step 3: Rank results with AI
      setPhase("ranking")
      setPhaseMessage("Ranking results for your specific project...")

      const allResults = [
        ...uniqueDatasets.map(d => ({ type: "dataset", ref: d.ref, title: d.title, subtitle: d.subtitle, totalBytes: d.totalBytes, usabilityRating: d.usabilityRating, totalVotes: d.totalVotes })),
        ...nb.slice(0, 4).map(n => ({ type: "notebook", ref: n.ref, title: n.title, totalVotes: n.totalVotes, language: n.language })),
        ...comp.slice(0, 4).map(c => ({ type: "competition", ref: c.ref || c.id, title: c.title, deadline: c.deadline })),
      ]

      if (allResults.length > 0) {
        const ranked = await rankResults(projectIdea, allResults)
        setRankings(ranked)
      }

      setPhase("done")

      // Add to history
      setHistory(prev => [
        { id: Date.now(), idea: projectIdea, meta, count: allResults.length, datasetCount: uniqueDatasets.length, notebookCount: nb.slice(0,4).length, competitionCount: comp.slice(0,4).length },
        ...prev.slice(0, 4),
      ])

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
      setPhase("error")
    }
  }, [idea])

  const reset = useCallback(() => {
    setIdea("")
    setPhase("idle")
    setDatasets([])
    setNotebooks([])
    setCompetitions([])
    setRankings(null)
    setQueryMeta(null)
    setError(null)
  }, [])

  return {
    idea, setIdea,
    phase, phaseMessage,
    queryMeta, datasets, notebooks, competitions, rankings,
    error, activeFilter, setActiveFilter,
    history, search, reset,
  }
}
