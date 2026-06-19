import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const aiProspectsHandler = require('../api/ai/prospects.js')

function readJsonBody(req: import('http').IncomingMessage) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 120000) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function localAiProxyPlugin() {
  return {
    name: 'local-ai-prospects-proxy',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/ai/prospects', async (req, res) => {
        try {
          const body = await readJsonBody(req)
          await aiProspectsHandler(
            { method: req.method, headers: req.headers, body },
            {
              setHeader: (key: string, value: string) => res.setHeader(key, value),
              status(code: number) {
                res.statusCode = code
                return this
              },
              json(payload: unknown) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(payload))
                return this
              },
            },
          )
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to proxy AI request' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localAiProxyPlugin()],
  root: 'src',
})
