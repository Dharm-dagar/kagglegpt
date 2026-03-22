// ============================================================
//  Local dev server — runs /api/kaggle endpoint locally
//  Run with: node server.js
//  Then in another terminal: npm run dev
// ============================================================

import { createServer } from "http"
import { readFileSync } from "fs"
import { Buffer } from "buffer"

// Load .env.local
try {
  const env = readFileSync(".env.local", "utf8")
  env.split("\n").forEach(line => {
    const [key, ...rest] = line.split("=")
    if (key && !key.startsWith("#")) {
      process.env[key.trim()] = rest.join("=").trim()
    }
  })
  console.log("✓ Loaded .env.local")
} catch {
  console.log("⚠ No .env.local found")
}

// Map VITE_ prefixed vars to non-prefixed for the serverless fn
process.env.KAGGLE_API_TOKEN = process.env.KAGGLE_API_TOKEN || process.env.VITE_KAGGLE_API_TOKEN
process.env.KAGGLE_USERNAME  = process.env.KAGGLE_USERNAME  || process.env.VITE_KAGGLE_USERNAME
process.env.KAGGLE_KEY       = process.env.KAGGLE_KEY       || process.env.VITE_KAGGLE_KEY
process.env.GROQ_API_KEY     = process.env.GROQ_API_KEY     || process.env.VITE_GROQ_API_KEY

const PORT = 3001

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return }
  if (req.url !== "/api/kaggle") { res.writeHead(404); res.end("Not found"); return }
  if (req.method !== "POST") { res.writeHead(405); res.end(); return }

  let body = ""
  req.on("data", chunk => body += chunk)
  req.on("end", async () => {
    try {
      req.body = JSON.parse(body)
      const mockRes = {
        statusCode: 200,
        headers: {},
        body: null,
        status(code) { this.statusCode = code; return this },
        json(data) { this.body = data; return this },
      }

      const { default: handler } = await import(`./api/kaggle.js?t=${Date.now()}`)
      await handler(req, mockRes)

      res.writeHead(mockRes.statusCode, { "Content-Type": "application/json" })
      res.end(JSON.stringify(mockRes.body))
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: err.message }))
    }
  })
})

server.listen(PORT, () => {
  console.log(`\n🚀 Local API server running at http://localhost:${PORT}`)
  console.log(`   Kaggle token: ${process.env.KAGGLE_API_TOKEN ? "✓ set" : "✗ missing"}`)
  console.log(`   Kaggle user:  ${process.env.KAGGLE_USERNAME  ? "✓ set" : "✗ missing"}`)
  console.log(`   Groq key:     ${process.env.GROQ_API_KEY     ? "✓ set" : "✗ missing"}`)
  console.log(`\n   Test auth: curl http://localhost:${PORT}/api/kaggle -X POST -H "Content-Type: application/json" -d '{"action":"testAuth","payload":{}}'`)
})
