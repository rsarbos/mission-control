#!/usr/bin/env node
/**
 * RSARBOS Dossier Agent Poller
 *
 * Run this as a cron job or manually to pick up new dossier requests from
 * the Vercel API when HERMES_WEBHOOK_URL is not configured.
 *
 * Usage:
 *   node ops/poll-dossier-requests.js
 *
 * Env vars required:
 *   RSARBOS_SITE_URL     — e.g. https://www.rsarbos.com
 *   ADMIN_TOKEN           — admin token for api/admin-dossiers
 *   HERMES_WEBHOOK_SECRET — secret used to sign Hermes webhook payloads
 *
 * The script:
 *   1. Polls /api/admin-dossiers for requests with status 'requested'
 *   2. For each, simulates (or calls the Hermes agent to) generate the dossier
 *   3. On completion, POSTs to /api/dossier-delivered to mark delivered
 *   4. Repeats for 'paid' requests → full dossier via /api/full-dossier-delivered
 */

const https = require('https')
const http = require('http')

const SITE_URL = process.env.RSARBOS_SITE_URL || 'http://localhost:5173'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || ''
const POLL_INTERVAL_MIN = parseInt(process.env.POLL_INTERVAL_MIN || '5', 10)

async function fetchJson(url, options = {}) {
  const lib = url.startsWith('https') ? https : http
  return new Promise((resolve, reject) => {
    const req = lib.get(url, options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) })
        } catch (e) {
          resolve({ status: res.statusCode, json: { raw: data } })
        }
      })
    })
    req.on('error', reject)
    if (options.timeout) req.setTimeout(options.timeout)
  })
}

async function fetchDossierRequests(status) {
  const url = new URL('/api/admin-dossiers', SITE_URL)
  if (status) url.searchParams.set('status', status)

  const result = await fetchJson(url.toString(), {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
  })

  if (result.status === 401) {
    console.error('❌ Unauthorized — check ADMIN_TOKEN')
    return []
  }
  if (!result.json || !result.json.requests) {
    console.error('❌ Failed to fetch:', result.status, result.json)
    return []
  }
  return result.json.requests
}

function simulateDossierGeneration(request) {
  // In production, this would call the Hermes Agent via:
  //   - The local MCP client
  //   - A subprocess invocation: hermes agent run "...
  //   - Or a local webhook server that receives requests from Vercel
  //
  // For now, we return a simulated dossier URL
  const dossierUrl = `${SITE_URL}/dossiers/${request.id}/free-dossier.html`
  console.log(`  [simulated] Generating free dossier for ${request.property_address}`)
  return { dossierUrl, fullDossierUrl: `${SITE_URL}/dossiers/${request.id}/full-dossier.html` }
}

async function markDelivered(endpoint, requestId, dossierUrl, isFull) {
  const url = new URL(endpoint, SITE_URL)
  const lib = url.protocol === 'https:' ? https : http

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ request_id: requestId, dossier_url: dossierUrl })
    const req = lib.post(url, {
      headers: { 'Content-Type': 'application/json' },
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) })
        } catch (e) {
          resolve({ status: res.statusCode, json: { raw: data } })
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function processFreeDossiers() {
  console.log('🔍 Checking for new free dossier requests...')
  const requests = await fetchDossierRequests('requested')

  for (const request of requests) {
    try {
      console.log(`  Processing: ${request.property_address} (${request.agent_name})`)
      const { dossierUrl } = simulateDossierGeneration(request)

      const result = await markDelivered(
        '/api/dossier-delivered',
        request.id,
        dossierUrl,
        false,
      )
      console.log(`  ✅ Delivered: ${result.status === 200 ? 'OK' : 'FAILED'}`)
    } catch (err) {
      console.error(`  ❌ Error processing ${request.id}:`, err.message)
    }
  }
}

async function processFullDossiers() {
  console.log('🔍 Checking for paid full dossier requests...')
  const requests = await fetchDossierRequests('paid')

  for (const request of requests) {
    if (request.dossier_type === 'full' && !request.full_dossier_file_ref) {
      try {
        console.log(`  Processing full dossier: ${request.property_address} (${request.agent_name})`)
        const { fullDossierUrl } = simulateDossierGeneration(request)

        const result = await markDelivered(
          '/api/full-dossier-delivered',
          request.id,
          fullDossierUrl,
          true,
        )
        console.log(`  ✅ Full dossier delivered: ${result.status === 200 ? 'OK' : 'FAILED'}`)
      } catch (err) {
        console.error(`  ❌ Error processing full dossier ${request.id}:`, err.message)
      }
    }
  }
}

async function main() {
  if (!ADMIN_TOKEN) {
    console.error('❌ ADMIN_TOKEN is required')
    process.exit(1)
  }

  console.log(`RSARBOS Dossier Poller started (interval: ${POLL_INTERVAL_MIN}m)`)

  await processFreeDossiers()
  await processFullDossiers()

  if (process.argv.includes('--once')) {
    console.log('✅ Single poll complete. Exiting.')
    return
  }

  console.log('🔄 Entering continuous poll mode. Press Ctrl+C to stop.')
  setInterval(async () => {
    await processFreeDossiers()
    await processFullDossiers()
  }, POLL_INTERVAL_MIN * 60 * 1000)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
