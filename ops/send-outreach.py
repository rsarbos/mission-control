#!/usr/bin/env python3
"""
RSARBOS Outreach Sender

Sends the 6 prospect outreach emails via SMTP.
Uses environment variables for credentials — never hardcodes passwords.

Usage:
  export SMTP_HOST=smtp.gmail.com
  export SMTP_PORT=587
  export SMTP_USER=rsarbos.app@gmail.com
  export SMTP_PASS=<your-app-password>

  python3 ops/send-outreach.py            # send all 6
  python3 ops/send-outreach.py 1,3,5      # send specific prospects (by index)
"""

import os
import sys
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate
import json
import time
from datetime import datetime, timezone

# --- Prospect data ---
# Index maps to the OUTREACH_MESSAGES.md package order
PROSPECTS = [
    {
        "id": "t_469e0e21",
        "name": "Kenneth Nguyen",
        "brokerage": "Compass / KNR Realtor (DRE 02150267)",
        "email": "kenneth.nguyen@compass.com",
        "phone": "(408) 895-0123",
        "property": "44 Moon Dance, Milpitas 95035",
        "listing_url": "https://www.zillow.com/homedetails/44-Moon-Dance-Milpitas-CA-95035/59682381_zpid/",
        "verdict": "Walkaway",
        "gap": "14.2% value gap ($148K)",
        "subject": "44 Moon Dance underwriting — 14.2% value gap in your Milpitas listings",
        "body": """Kenneth,

Quick observation from your Milpitas market: 44 Moon Dance — a 3BD/2.5BA townhome at Parc Metro listed at $1,085K after a 4.6% price cut ($1,138K→$1,085K on 8/7). It's been 77 days on market, and Zillow's Zestimate ($1,072K) sits 1.2% below your current asking.

The comparable unit in the same complex — 845 Fire Walk (identical 3BD/2.5BA/1,353 sqft layout) — shows Rent Zestimate of $4,197/mo. After $295/mo HOA, net rent is $46,824/year — a 4.3% cap rate. At the 5.0% market rate for Bay Area rental townhomes, income supports ~$937K. That's a 14.2% value gap ($148K) between your asking and income-justified value.

The same underwriting approach is demonstrated in RSARBOS's sample dossier:
https://rsarbos.com → VIEW SAMPLE DOSSIER

  Verdict: Not Worth Pursuing (HOA + rent realism risk)
  Listing: $1,085K | Zestimate: $1,072K (-1.2%)
  Rent: $4,197/mo | Net: $46,824/yr after HOA $295/mo
  Cap Rate: 4.3% | Market: 5.0% → 14.2% gap
  DOM: 77 days | Price cut: $53K (4.6%)

Same HOA-drag + rent-realism question every Bay Area rental townhome faces before you tell a client "the cash flow works."

Worth 5 minutes to see how this saves you hours of comp research on your next 95035 rental?

Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747

P.S. Happy to run this en español si útil.""",
    },
    {
        "id": "t_b525bf73",
        "name": "Todd Montgomery",
        "brokerage": "Compass (DRE 01875716)",
        "email": "toddmontgomery@compass.com",
        "phone": "(415) 871-0055",
        "property": "720 Clementina St, San Francisco 94103",
        "listing_url": "https://www.compass.com/agents/todd-montgomery/",
        "verdict": "Walkaway",
        "gap": "26.2% rent gap ($988K)",
        "subject": "720 Clementina underwriting — 26.2% rent gap in your SOMA listings",
        "body": """Todd,

Your current listing at 720 Clementina St (4BD/3.5BA, 4,250 sqft single-family home in SOMA) is priced at $3,788K ($891/sqft). Redfin's rental estimate shows $8,161/mo ($97,932/year) — a 2.6% gross cap rate on your asking price.

At the 3.5% market rate for SF luxury rental homes, income supports ~$2.8M. That's a 26.2% value gap ($988K) above your $3,788K asking — the rent doesn't justify the price at current market cap rates.

The same underwriting approach is demonstrated in RSARBOS's sample dossier:
https://rsarbos.com → VIEW SAMPLE DOSSIER

  Verdict: Not Worth Pursuing (rent realism risk at 2.6% cap)
  Listing: $3,788K | Price/sqft: $891
  Rent: $8,161/mo (Redfin est.) | Gross: $97,932/yr
  Cap Rate: 2.6% | Market: 3.5% → 26.2% gap
  Price/sqft: 22% above SOMA median ($725/sqft)

Same rent-verification question every ground-floor / high-value SOMA listing needs before you tell a buyer "the numbers work."

Worth 5 minutes to see how this saves you hours of comp research on your next 94103 listing?

Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747

P.S. Happy to run this en español si útil.""",
    },
    {
        "id": "t_rschulman",
        "name": "Stephen Schulman",
        "brokerage": "Keller Williams Westside Estates (DRE 01427211)",
        "email": "stephen@schulmanre.com",
        "phone": "(310) 322-1008",
        "property": "7807 Breen Ave, Los Angeles 90045",
        "listing_url": "https://www.zillow.com/homedetails/7807-Breen-Ave-Los-Angeles-CA-90045/20391123_zpid/",
        "verdict": "Review Required",
        "gap": "~$377K ADU value",
        "subject": "7807 Breen Ave underwriting — ADU rent gap in your Westchester listings",
        "body": """Richard,

Your listing at 7807 Breen Avenue (4BD/3BA, 1,628 sqft main + 380 sqft ADU in Westchester) is listed at $1,649K ($1,013/sqft) with 35 days on market — 25% longer than LA's 28-day median. Zillow's Zestimate ($1,618,600) is 1.9% below your asking, while the 380 sqft ADU generates estimated rent of ~$2,200/mo ($26,400/year).

The RSARBOS verdict format delivers this in 15 minutes (per rsarbos.com):
https://rsarbos.com → VIEW SAMPLE DOSSIER

  Verdict: Pricing Ambiguity (ADU value unconfirmed)
  Listing: $1,649K | Zestimate: $1,619K (-1.9%)
  ADU: 380 sqft | Est. rent: $2,200/mo
  ADU value: ~$377K (at 7% cap rate)
  DOM: 35 days | LA median: 28 days

The 380 sqft ADU's ~$2,200/mo rental income (~$377K value at 7% cap) isn't reflected in the Zestimate-to-asking relationship — creating a pricing ambiguity that institutional underwriting can resolve.

Worth 5 minutes to see how this saves you hours of comp research on your next 90045 listing?

Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747

P.S. Happy to run this en español si útil.""",
    },
    {
        "id": "t_diana",
        "name": "Diana Patrick",
        "brokerage": "Pacific Sotheby's International Realty (DRE 00526126)",
        "email": "diana@dianapatrick.com",
        "phone": "(858) 530-1104",
        "property": "3226 Brant St, San Diego 92103",
        "listing_url": "https://dianapatrick.com/",
        "verdict": "Worth Pursuing",
        "gap": "17.3% Mills Act equity gap ($778K)",
        "subject": "3226 Brant St underwriting — 17.3% Mills Act equity gap in your 92103",
        "body": """Diana,

Your listing at 3226 Brant Street (5BD/4BA/3,870 sqft, Bankers Hill with Mills Act designation) is priced at $4,495K ($1,161/sqft). Zillow estimates $4,383/mo standard property tax, but the Mills Act reduces this to ~$503/mo — a ~$46,560/year tax savings.

The comparable 3162 2nd Ave (7BD/5BA/6,732 sqft, also Bankers Hill) rents at $20,000/mo. Per-sqft scaling ($2.97/sqft/mo) yields ~$11,500/mo for your 3,871 sqft. Combined rent ($138K/year) + Mills Act tax savings ($46,560/year) = $184,560/year. At a 3.5% cap rate for SD luxury rentals, income supports ~$5.27M — a 17.3% value gap ($778K) below your $4,495K asking.

The same underwriting approach is demonstrated in RSARBOS's sample dossier:
https://rsarbos.com → VIEW SAMPLE DOSSIER

  Verdict: Worth Pursuing (Mills Act + rent upside)
  Listing: $4,495K | Tax: $4,383/mo → $503/mo (Mills Act)
  Rent: ~$11,500/mo | Tax savings: ~$3,617/mo ($46,560/yr)
  Combined yield: $184,560/yr | 3.5% → value $5.27M
  Gap: 17.3% undervaluation ($778K implied equity)

Same tax-incentive + rent-realism combination every Bankers Hill luxury listing faces before you position for buyers.

Worth 5 minutes to see how this saves you hours of comp research on your next 92103 listing?

Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747

P.S. Happy to run this en español si útil.""",
    },
    {
        "id": "t_colleen",
        "name": "Colleen Cotter",
        "brokerage": "Coldwell Banker (DRE 01459695)",
        "email": "colleen.cotter@cbcal.com",
        "phone": "(415) 671-4382",
        "property": "33 Precita Ave, San Francisco 94110",
        "listing_url": "https://www.coldwellbankerhomes.com/ca/san-francisco/33-precita-ave/pid_72600863/",
        "verdict": "Worth Pursuing",
        "gap": "17.3% mixed-use gap ($255K)",
        "subject": "33 Precita underwriting — 17.3% mixed-use gap in your 94110",
        "body": """Colleen,

Your listing at 33 Precita Avenue (4BD/2BA triplex, 3,720 sqft, mixed-use in Bernal Heights/Mission) is listed at $1,225K ($329/sqft) — well below the neighborhood's ~$650-700/sqft residential average. The property includes two 2BD/1BA residential units plus a ground-floor commercial space with a long-term neighborhood market tenant.

Combined rent is ~$7,400/mo ($5,600 residential + $1,800 commercial = $88,800/year). At a 6% cap rate for SF mixed-use properties, income supports ~$1.48M — a 17.3% value gap ($255K) above your $1,225K asking.

The same underwriting approach is demonstrated in RSARBOS's sample dossier:
https://rsarbos.com → VIEW SAMPLE DOSSIER

  Verdict: Worth Pursuing (mixed-use upside)
  Listing: $1,225K | Price/sqft: $329
  Residential rent: ~$5,600/mo (2× 2BD/1BA units)
  Commercial rent: ~$1,800/mo (long-term tenant)
  Combined yield: $88,800/yr | 6% → value $1.48M
  Gap: 17.3% undervaluation ($255K implied equity)

Same mixed-use rent-verification + tenant-stability question every Bernal Heights/Mission investment property needs before client commitment.

Worth 5 minutes to see how this saves you hours of comp research on your next 94110 listing?

Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747

P.S. Happy to run this en español si útil.""",
    },
    {
        "id": "t_james",
        "name": "James B. Hurley",
        "brokerage": "Vanguard Properties (DRE 01080787)",
        "email": "james.hurley@vanguards.com",
        "phone": "(415) 964-2400",
        "property": "1138 Taylor St, San Francisco 94108",
        "listing_url": "https://www.compass.com/homdetails/1138-Taylor-St-San-Francisco-CA-94108/1PY8TR_pid/",
        "verdict": "Walkaway",
        "gap": "21.8% rent gap ($1.08M)",
        "subject": "1138 Taylor underwriting — 21.8% rent gap in your Nob Hill TIC",
        "body": """James,

Your listing at 1138 Taylor Street (5BD/5BA/3,572 sqft TIC 68% share in Nob Hill) is listed at $4,950K ($1,386/sqft) after a price reduction from $4,995K. Zillow's Zestimate ($4,840,500) is 2.2% below your asking, and the Rent Zestimate shows $11,297/mo ($135,564/year) — a 2.75% gross cap rate.

At the 3.5% market rate for SF TIC properties, income supports ~$3.87M — a 21.8% value gap ($1.08M) above your asking. The rent doesn't justify the price at current market cap rates.

The same underwriting approach is demonstrated in RSARBOS's sample dossier:
https://rsarbos.com → VIEW SAMPLE DOSSIER

  Verdict: Not Worth Pursuing (rent realism risk at 2.75% cap)
  Listing: $4,950K | Zestimate: $4,840K (-2.2%)
  Rent: $11,297/mo (68% TIC share) | Gross: $135,564/yr
  Cap Rate: 2.75% | Market: 3.5% → 21.8% gap
  TIC share: 68% | DOM: 28 days | Price cut: $45K (0.9%)

Same rent-verification question every Nob Hill / TIC listing needs before you tell a buyer "the cash flow works."

Worth 5 minutes to see how this saves you hours of comp research on your next 94108 listing?

Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747

P.S. Happy to run this en español si útil.""",
    },
]

SIGNATURE = """
Best,
Yael Axel
RSARBOS Founder
Contact: +1 (619) 912-5747
"""

LOG_FILE = os.path.join(os.path.dirname(__file__), "outreach-log.jsonl")


def load_log():
    entries = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    entries.append(json.loads(line))
    return entries


def save_log(entries):
    with open(LOG_FILE, "w") as f:
        for entry in entries:
            f.write(json.dumps(entry, indent=2) + "\n")


def send_email(prospect, smtp_host, smtp_port, smtp_user, smtp_pass):
    msg = MIMEMultipart("alternative")
    msg["From"] = smtp_user
    msg["To"] = prospect["email"]
    msg["Subject"] = prospect["subject"]
    msg["Date"] = formatdate()
    msg["Message-ID"] = f"<{prospect['id']}@{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}rsarbos.com>"

    body = prospect["body"]
    html = f"""<html><body style="font-family: -apple-system, BlinkManiMessage, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.6;"><div style="max-width: 600px; margin: 0 auto;">{body.replace(chr(10), '<br>')}
<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
<p style="color: #64748b; font-size: 14px;">Best,<br>Yael Axel<br>RSARBOS Founder<br>Contact: +1 (619) 912-5747</p>
</div></body></html>"""

    msg.attach(MIMEText(body, "plain"))
    msg.attach(MIMEText(html, "html"))

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls(context=context)
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, prospect["email"], msg.as_string())

    return True


def main():
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")

    if not smtp_user or not smtp_pass:
        print("ERROR: Set SMTP_USER and SMTP_PASS environment variables.")
        print("For Gmail: https://myaccount.google.com/apppasswords")
        sys.exit(1)

    indices = list(range(len(PROSPECTS)))
    arg = sys.argv[1] if len(sys.argv) > 1 else "all"
    if arg != "all":
        try:
            indices = [int(x) - 1 for x in arg.split(",")]
        except ValueError:
            print("ERROR: Use comma-separated indices, e.g. '1,3,5'")
            sys.exit(1)

    log = load_log()
    sent = 0
    for i in indices:
        p = PROSPECTS[i]
        already_sent = any(e["prospect_id"] == p["id"] and e["status"] == "sent" for e in log)
        if already_sent:
            print(f"  [{i+1}] {p['name']} ({p['property']}) — already sent, skipping")
            continue

        print(f"  [{i+1}] Sending to {p['name']} ({p['brokerage']}) — {p['property']}...", end=" ")
        try:
            send_email(p, smtp_host, smtp_port, smtp_user, smtp_pass)
            log.append({
                "prospect_id": p["id"],
                "name": p["name"],
                "property": p["property"],
                "email": p["email"],
                "subject": p["subject"],
                "status": "sent",
                "sent_at": datetime.now(timezone.utc).isoformat(),
            })
            save_log(log)
            print("✅ sent")
            sent += 1
            time.sleep(1)  # rate limit
        except Exception as e:
            print(f"❌ failed: {e}")
            log.append({
                "prospect_id": p["id"],
                "name": p["name"],
                "email": p["email"],
                "status": "failed",
                "error": str(e),
                "at": datetime.now(timezone.utc).isoformat(),
            })
            save_log(log)

    print(f"\nResults: {sent} sent, {len(indices) - sent} skipped/failed")
    print(f"Log: {LOG_FILE}")


if __name__ == "__main__":
    main()
