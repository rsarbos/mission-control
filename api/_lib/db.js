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
      dossier_type TEXT NOT NULL DEFAULT 'manual',
      stripe_checkout_session_id TEXT,
      stripe_payment_intent_id TEXT,
      stripe_price_id TEXT,
      email_sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      paid_at TIMESTAMPTZ
    );
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS dossier_requests (
      id TEXT PRIMARY KEY,
      agent_name TEXT NOT NULL,
      agent_email TEXT NOT NULL,
      agent_phone TEXT,
      property_address TEXT NOT NULL,
      property_url TEXT,
      brokerage TEXT,
      mls_id TEXT,
      source_channel TEXT,
      investment_intent TEXT,
      status TEXT NOT NULL DEFAULT 'requested',
      dossier_type TEXT NOT NULL DEFAULT 'free',
      hermes_task_id TEXT,
      hermes_payload JSONB,
      dossier_file_ref TEXT,
      dossier_delivered_at TIMESTAMPTZ,
      stripe_checkout_session_id TEXT,
      stripe_payment_intent_id TEXT,
      paid_at TIMESTAMPTZ,
      full_dossier_file_ref TEXT,
      full_dossier_delivered_at TIMESTAMPTZ,
      upgraded_at TIMESTAMPTZ,
      email_sent_at TIMESTAMPTZ,
      admin_notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  // Add dossier_type column to existing manual_underwriting_requests if not present
  try {
    await query(`ALTER TABLE manual_underwriting_requests ADD COLUMN IF NOT EXISTS dossier_type TEXT NOT NULL DEFAULT 'manual'`)
    await query(`ALTER TABLE manual_underwriting_requests ADD COLUMN IF NOT EXISTS stripe_price_id TEXT`)
  } catch (e) {
    // Column might already exist or table doesn't support IF NOT EXISTS in older PG versions
    // This is a no-op in that case
  }
}

module.exports = {
  ensureSchema,
  query,
}
