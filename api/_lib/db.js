const { Pool } = require('pg')

let pool

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required')
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    })
  }

  return pool
}

async function query(text, params) {
  return getPool().query(text, params)
}

async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS manual_underwriting_requests (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      property_address TEXT NOT NULL,
      property_url TEXT NOT NULL,
      investment_intent TEXT,
      urgency TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      stripe_checkout_session_id TEXT,
      stripe_payment_intent_id TEXT,
      email_sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      paid_at TIMESTAMPTZ
    );
  `)
}

module.exports = {
  ensureSchema,
  query,
}
