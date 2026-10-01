#!/usr/bin/env bash
# RSARBOS Vercel Environment Setup Script
#
# Run this after authenticating with Vercel CLI:
#   vercel login
#   cd /home/mr0/GHOST/mission-control
#   bash ops/setup-vercel-env.sh
#
set -e

echo "🔧 Setting up RSARBOS Vercel environment variables..."

PROJECT_ID="prj_j65DvfK6Ji8h0ZX1CwAM8xORxwxn"
ORG_ID="team_VxJMmlVB9FHdgN41ig8PCiBp"

# --- Required env vars ---
set_var() {
  local key="$1"
  local value="$2"
  local target="${3:-production}"
  echo "  Setting $key ($target)..."
  vercel env add "$key" "$target" <<< "$value" 2>/dev/null || true
}

# --- Generate secure tokens if not provided ---
HERMES_WEBHOOK_SECRET="${HERMES_WEBHOOK_SECRET:-$(openssl rand -hex 32)}"
ADMIN_TOKEN="${ADMIN_TOKEN:-$(openssl rand -base64 32)}"

# --- Set environment variables ---
# Stripe
set_var STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
set_var STRIPE_WEBHOOK_SECRET "$STRIPE_WEBHOOK_SECRET"

# Resend
set_var RESEND_API_KEY "$RESEND_API_KEY"
set_var EMAIL_TO "uw.requests@rsarbos.com"
set_var EMAIL_FROM "RSARBOS Intake <onboarding@resend.dev>"

# Database
set_var DATABASE_URL "$DATABASE_URL"

# Site URL
set_var SITE_URL "https://www.rsarbos.com"
set_var VITE_SITE_URL "https://www.rsarbos.com"

# Admin
set_var ADMIN_TOKEN "$ADMIN_TOKEN"

# Hermes Agent webhook integration
set_var HERMES_WEBHOOK_URL "$HERMES_WEBHOOK_URL"
set_var HERMES_WEBHOOK_SECRET "$HERMES_WEBHOOK_SECRET"

# Analytics (optional)
if [ -n "$VITE_PLAUSIBLE_DOMAIN" ]; then
  set_var VITE_PLAUSIBLE_DOMAIN "$VITE_PLAUSIBLE_DOMAIN"
fi
if [ -n "$VITE_PLAUSIBLE_SCRIPT_SRC" ]; then
  set_var VITE_PLAUSIBLE_SCRIPT_SRC "$VITE_PLAUSIBLE_SCRIPT_SRC"
fi

echo ""
echo "✅ Environment variables set in Vercel."
echo ""
echo "🔐 Generated secrets (save these):"
echo "  ADMIN_TOKEN: $ADMIN_TOKEN"
echo "  HERMES_WEBHOOK_SECRET: $HERMES_WEBHOOK_SECRET"
echo ""
echo "📝 Next steps:"
echo "  1. In Stripe Dashboard → Webhooks: add endpoint https://www.rsarbos.com/api/stripe-webhook"
echo "     (or wait for next Vercel deploy, then set up)"
echo "  2. Start the Hermes webhook tunnel (see ops/start-hermes-tunnel.sh)"
echo "  3. Set HERMES_WEBHOOK_URL to the tunnel URL:"
echo "     vercel env add HERMES_WEBHOOK_URL production <<< 'https://<tunnel-url>/<path>'"
echo "  4. Redeploy: vercel --prod"
