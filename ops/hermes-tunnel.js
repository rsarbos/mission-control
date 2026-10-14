#!/usr/bin/env node
/**
 * Combined Hermes Webhook Receiver + localtunnel
 *
 * Starts the webhook receiver on port 3001, then launches localtunnel
 * to expose it to the internet. Prints the public HERMES_WEBHOOK_URL
 * that should be set in Vercel environment variables.
 *
 * Usage: node ops/hermes-tunnel.js [port]
 */

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = parseInt(process.argv[2] || '3001', 10)
const TASKS_FILE = path.join(__dirname, 'hermes-tasks.jsonl')
const RECEIVER_PATH = path.join(__dirname, 'hermes-webhook-receiver.js')

// Start the webhook receiver as a child process
// then attach localtunnel to the same port
const { spawn } = require('child_process')

const receiver = spawn('node', [RECEIVER_PATH, PORT], {
  stdio: ['ignore', 'inherit', 'inherit'],
  cwd: path.join(__dirname, '..'),
})

receiver.on('error', (err) => {
  console.error('Failed to start webhook receiver:', err.message)
})

// Wait for receiver to be ready, then start tunnel
setTimeout(async () => {
  try {
    const lt = require('localtunnel')
    const tunnel = await lt({
      port: PORT,
      host: 'https://loca.lt',
      localHost: '127.0.0.1',
    })

    const webhookUrl = `${tunnel.url}/hermes-webhook`
    console.log('\n========================================')
    console.log('  HERMES TUNNEL READY')
    console.log('========================================')
    console.log(`Tunnel URL:      ${tunnel.url}`)
    console.log(`Webhook URL:     ${webhookUrl}`)
    console.log(`Port:            ${PORT}`)
    console.log(`Tasks file:      ${TASKS_FILE}`)
    console.log('')
    console.log('Set this in Vercel:')
    console.log(`  vercel env add HERMES_WEBHOOK_URL ${webhookUrl} production`)
    console.log('========================================\n')

    tunnel.on('close', () => {
      console.log('Tunnel closed')
      receiver.kill()
      process.exit(0)
    })
  } catch (err) {
    console.error('Tunnel failed:', err.message)
    console.error('The webhook receiver is still running on port', PORT)
    console.error('Set HERMES_WEBHOOK_URL to the tunnel URL once a tunnel is available')
  }
}, 2000)

// Graceful shutdown
process.on('SIGTERM', () => {
  receiver.kill()
  process.exit(0)
})
process.on('SIGINT', () => {
  receiver.kill()
  process.exit(0)
})
