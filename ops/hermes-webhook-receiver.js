#!/usr/bin/env node
/**
 * Hermes Webhook Receiver
 *
 * A lightweight HTTP server that receives webhook calls from Vercel
 * (api/dossier-request.js → HERMES_WEBHOOK_URL).
 *
 * Incoming webhooks are written to ops/hermes-tasks.jsonl (one JSON per line).
 * The Hermes Agent polls this file for new tasks.
 *
 * Usage:
 *   node ops/hermes-webhook-receiver.js [port]
 *
 *   Default port: 3001
 *
 * Behind a tunnel (localtunnel / ngrok):
 *   npx localtunnel --port 3001 --subdomain rsarbos-hermes
 *
 * Then set HERMES_WEBHOOK_URL=https://<tunnel-url>/hermes-webhook
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const PORT = process.env.PORT || parseInt(process.argv[2] || '3001', 10)
const HERMES_WEBHOOK_SECRET = process.env.HERMES_WEBHOOK_SECRET || ''
const TASKS_FILE = path.join(__dirname, 'hermes-tasks.jsonl')

function verifySignature(body, signature, timestamp) {
  if (!HERMES_WEBHOOK_SECRET) {
    console.warn('⚠  HERMES_WEBHOOK_SECRET not set — signature verification disabled')
    return true
  }
  const expectedSignature = crypto
    .createHmac('sha256', HERMES_WEBHOOK_SECRET)
    .update(`${timestamp}.${body}`)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  if (req.url !== '/hermes-webhook') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  const chunks = []
  req.on('data', (chunk) => chunks.push(chunk))
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString()
    const signature = req.headers['x-rsarbos-signature'] || ''
    const timestamp = req.headers['x-rsarbos-timestamp'] || ''

    if (!verifySignature(body, signature, timestamp)) {
      console.error('Invalid HMAC signature')
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid signature' }))
      return
    }

    let payload
    try {
      payload = JSON.parse(body)
    } catch (err) {
      console.error('Invalid JSON:', err.message)
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
      return
    }

    // Write to task file for the Hermes Agent to pick up
    const taskRecord = {
      received_at: new Date().toISOString(),
      signature: signature.slice(0, 16) + '…',
      payload,
    }
    fs.appendFileSync(TASKS_FILE, JSON.stringify(taskRecord) + '\n')

    console.log(`Received dossier request: ${payload.property_address} (request_id: ${payload.request_id})`)
    console.log(`   Agent: ${payload.agent_name} <${payload.agent_email}>`)
    if (payload.trigger === 'full_dossier_generation') {
      console.log(`   Type: Full dossier generation (post-payment)`)
    } else {
      console.log(`   Type: Free 15-min dossier`)
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      success: true,
      task_id: payload.request_id,
      message: 'Webhook received. Task queued for Hermes Agent processing.',
    }))
  })
})

server.listen(PORT, () => {
  console.log(`RSARBOS Hermes Webhook Receiver listening on port ${PORT}`)
  console.log(`Tasks file: ${TASKS_FILE}`)
  console.log(`Webhook secret configured: ${HERMES_WEBHOOK_SECRET ? 'Yes' : 'No (disabled)'}`)
  console.log('')
  console.log('Next steps:')
  console.log('  1. Start a tunnel: npx localtunnel --port ' + PORT + ' --subdomain rsarbos-hermes')
  console.log('  2. Set HERMES_WEBHOOK_URL in Vercel env to the tunnel URL + /hermes-webhook')
  console.log('  3. The Hermes Agent should poll ' + TASKS_FILE + ' for new tasks')
})
