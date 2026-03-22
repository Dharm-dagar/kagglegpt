// ============================================================
//  /api/kaggle.js — Vercel serverless function
// ============================================================

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { action, payload } = req.body

  const kaggleToken = process.env.KAGGLE_API_TOKEN
  const kaggleUser  = process.env.KAGGLE_USERNAME
  const kaggleKey   = process.env.KAGGLE_KEY
  const groqKey     = process.env.GROQ_API_KEY

  if (!kaggleToken && !kaggleKey) return res.status(500).json({ error: "No Kaggle credentials found" })
  if (!groqKey) return res.status(500).json({ error: "GROQ_API_KEY not configured" })

  const kaggleBase = "https://www.kaggle.com/api/v1"

  async function kaggleFetch(url) {
    const authMethods = []
    if (kaggleToken) authMethods.push(`Bearer ${kaggleToken}`)
    if (kaggleKey)   authMethods.push(`Bearer ${kaggleKey}`)
    if (kaggleUser && kaggleKey) authMethods.push("Basic " + Buffer.from(`${kaggleUser}:${kaggleKey}`).toString("base64"))

    let lastError = null
    for (const auth of authMethods) {
      const r = await fetch(url, {
        headers: { "Authorization": auth, "Content-Type": "application/json", "Accept": "application/json" }
      })
      if (r.ok) return r.json()
      const body = await r.text().catch(() => "")
      lastError = `${r.status}: ${body.slice(0, 200)}`
      if (r.status !== 401 && r.status !== 403) break
    }
    throw new Error(`Kaggle API failed — ${lastError}`)
  }

  // Extract JSON from AI response — handles truncation
  function extractJSON(text) {
    const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()

    // 1. Try direct parse
    try { return JSON.parse(clean) } catch {}

    // 2. Find outermost { }
    const start = clean.indexOf("{")
    const end   = clean.lastIndexOf("}")
    if (start !== -1 && end > start) {
      try { return JSON.parse(clean.slice(start, end + 1)) } catch {}
    }

    // 3. Response is truncated — extract what we can field by field
    // For rankResults: build a partial result from what parsed ok
    if (clean.includes('"ranked"')) {
      return buildPartialRanking(clean)
    }

    // 4. For generateQueries: build fallback
    if (clean.includes('"searchQueries"')) {
      return buildFallbackQueries(clean)
    }

    throw new Error(`Could not parse AI response. Raw: ${clean.slice(0, 150)}`)
  }

  // Build ranking from truncated JSON by parsing each complete item
  function buildPartialRanking(text) {
    const ranked = []
    // Match complete JSON objects inside the ranked array
    const itemRegex = /\{[^{}]*"ref"\s*:\s*"([^"]+)"[^{}]*"score"\s*:\s*(\d+)[^{}]*"why"\s*:\s*"([^"]+)"[^{}]*"verdict"\s*:\s*"([^"]+)"[^{}]*/g
    let match
    while ((match = itemRegex.exec(text)) !== null) {
      ranked.push({
        ref: match[1],
        score: parseInt(match[2]),
        why: match[3],
        verdict: match[4],
        warning: null,
      })
    }

    // Extract summary if present
    const summaryMatch = text.match(/"summary"\s*:\s*"([^"]+)"/)
    const summary = summaryMatch ? summaryMatch[1] : "Review the top-ranked results above for your project."

    if (ranked.length > 0) return { ranked, summary }
    throw new Error("Could not extract any ranked items from response")
  }

  // Build fallback query object from truncated response
  function buildFallbackQueries(text) {
    const queriesMatch = text.match(/"searchQueries"\s*:\s*\[([^\]]+)\]/)
    const queries = queriesMatch
      ? queriesMatch[1].match(/"([^"]+)"/g)?.map(q => q.replace(/"/g, "")) || []
      : []
    const understoodMatch = text.match(/"understood"\s*:\s*"([^"]+)"/)
    const taskMatch = text.match(/"taskType"\s*:\s*"([^"]+)"/)
    return {
      understood: understoodMatch?.[1] || "Your ML project idea",
      searchQueries: queries.length > 0 ? queries : ["machine learning dataset"],
      taskType: taskMatch?.[1] || "classification",
      recommendedDataTypes: ["tabular"],
      tips: "Start with a well-rated dataset and explore available notebooks for guidance.",
    }
  }

  async function groqCall(systemPrompt, userMessage, maxTokens = 2000) {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: maxTokens,
        temperature: 0.1,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data?.error?.message || `Groq error ${r.status}`)
    const text = data.choices?.[0]?.message?.content || ""
    return extractJSON(text)
  }

  try {
    // ── Test auth ──
    if (action === "testAuth") {
      try {
        const data = await kaggleFetch(`${kaggleBase}/datasets/list?pageSize=1`)
        return res.status(200).json({ success: true, sample: data?.[0]?.title || "connected" })
      } catch (err) {
        return res.status(200).json({ success: false, error: err.message })
      }
    }

    // ── Generate search queries ──
    if (action === "generateQueries") {
      const { idea, systemPrompt } = payload
      const result = await groqCall(systemPrompt, `Project idea: ${idea}`, 2000)
      return res.status(200).json({ result })
    }

    // ── Search datasets ──
    if (action === "searchDatasets") {
      const { query } = payload
      const data = await kaggleFetch(`${kaggleBase}/datasets/list?search=${encodeURIComponent(query)}&sortBy=votes&pageSize=6`)
      return res.status(200).json({ results: Array.isArray(data) ? data : [] })
    }

    // ── Search notebooks ──
    if (action === "searchNotebooks") {
      const { query } = payload
      const data = await kaggleFetch(`${kaggleBase}/kernels/list?search=${encodeURIComponent(query)}&sortBy=voteCount&pageSize=4`)
      return res.status(200).json({ results: Array.isArray(data) ? data : [] })
    }

    // ── Search competitions ──
    if (action === "searchCompetitions") {
      const { query } = payload
      const data = await kaggleFetch(`${kaggleBase}/competitions/list?search=${encodeURIComponent(query)}&sortBy=recentlyCreated&pageSize=4`)
      return res.status(200).json({ results: Array.isArray(data) ? data : [] })
    }

    // ── Rank results ──
    if (action === "rankResults") {
      const { idea, results, systemPrompt } = payload

      // Only send top 5 results with minimal fields to keep response small
      const trimmed = results.slice(0, 5).map(r => ({
        ref: r.ref,
        title: r.title?.slice(0, 60),
        type: r.type,
      }))

      const result = await groqCall(
        systemPrompt,
        `Project: ${idea.slice(0, 100)}\nResults: ${JSON.stringify(trimmed)}`,
        1500
      )
      return res.status(200).json({ result })
    }

    return res.status(400).json({ error: "Unknown action" })
  } catch (err) {
    console.error("KaggleGPT error:", err.message)
    return res.status(500).json({ error: err.message })
  }
}
