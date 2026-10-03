#!/usr/bin/env python3
"""Data-driven generator for OUTREACH_RSARBOS.html.

Reads public/prospects.json (a list of prospect dicts) and writes
public/OUTREACH_RSARBOS.html -- a single self-contained HTML file with one
card per prospect (Quick-Copy WhatsApp) plus an Outreach Queue table.

Edit prospects.json, then re-run:  python3 gen-html.py
No build pipeline; open directly or serve: python3 -m http.server 8080 --directory public
"""
import json, html, pathlib

ROOT  = pathlib.Path("/home/mr0/GHOST/mission-control/rsarbos-mission-control")
SRC   = ROOT / "public" / "prospects.json"
OUT   = ROOT / "public" / "OUTREACH_RSARBOS.html"

PROSPECTS = json.loads(SRC.read_text(encoding="utf-8"))


def esc(s):
    s = "" if s is None else str(s)
    return html.escape(s, quote=True)


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RSARBOS Outreach :: PROSPECTS_COUNT prospects</title>
<style>
  :root{--bg:#0b0f14;--panel:#161b24;--panel2:#1c2330;--border:#2a3240;--txt:#e6e8ec;--muted:#9aa0b0;--accent:#2a5fb8;--gb:#1b3a5f;--ok:#2ecc71;--warn:#f5a623;--hi:#ffd870}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--txt);font-family:'Segoe UI',system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5}
  header{padding:22px 26px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,#0f141f,#1b2430)}
  h1{margin:0;font-size:21px;font-weight:600;letter-spacing:.3px}
  .sub{color:var(--muted);margin:6px 0 0;font-size:13px}
  .wrap{max-width:1200px;margin:0 auto;padding:22px}
  .summary{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:6px}
  .pill{background:var(--panel2);border:1px solid var(--border);border-radius:999px;padding:5px 11px;font-size:12px;color:var(--muted)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-bottom:28px}
  .card{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px}
  .card-head{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:9px}
  .badge{font-size:10px;text-transform:uppercase;letter-spacing:.5px;background:var(--gb);color:#a8c7f0;border:1px solid #3a5f9a;border-radius:6px;padding:3px 8px}
  .pk{font-size:11px;color:var(--muted);font-family:'SF Mono',monospace;background:var(--border);border-radius:5px;padding:2px 7px}
  h2{margin:0;font-size:17px;font-weight:600}
  .meta{color:var(--muted);font-size:12px;margin:2px 0 6px}
  .tag{display:inline-block;font-size:11px;background:#2a2548;color:#d2c4ff;border:1px solid #4a427a;border-radius:5px;padding:2px 7px;margin:3px 3px 3px 0}
  .msg{background:#0d1117;border:1px solid var(--border);border-radius:9px;padding:11px;font-family:'SFMono-Regular',Consolas,monospace;font-size:12.5px;white-space:pre-wrap;word-break:break-word;max-height:230px;overflow:auto;color:#e6e8ec;margin:10px 0}
  .label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
  .contact{font-size:12.5px;margin:2px 0}
  .contact b{color:#e6e8ec}
  .actions{display:flex;align-items:center;gap:8px;margin-top:10px}
  .copy-btn{background:var(--gb);color:#a8c7f0;border:1px solid #3a5f9a;border-radius:7px;padding:7px 12px;font-size:12.5px;cursor:pointer}
  .copy-btn:hover{background:#2a6fb8;color:#fff}
  .copied{color:var(--ok);font-size:12px;font-weight:600;opacity:0;transition:opacity .2s}
  .copied.show{opacity:1}
  .ver{font-size:11px;color:var(--warn);margin-top:6px;text-transform:uppercase}
  table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:30px}
  th,td{text-align:left;padding:8px 10px;font-size:12.5px;border-bottom:1px solid var(--border)}
  th{background:var(--panel2);color:var(--muted);font-weight:600;text-transform:uppercase;font-size:10.5px;letter-spacing:.4px}
  a.c{color:#a8c7f0}
  footer{color:var(--muted);font-size:12px;text-align:center;padding:18px;border-top:1px solid var(--border);margin-top:24px}
</style>
</head>
<body>
<header>
  <h1>RSARBOS Outreach :: PROSPECTS_COUNT Verified Prospects</h1>
  <div class="sub">Self-hosted, data-driven HTML. Each card = one prospect's verified property + analytical signal + RSARBOS proof + a WhatsApp message with Quick-Copy. No fabricated numbers. Edit <code>public/prospects.json</code> then re-run <code>gen-html.py</code>.</div>
  <div class="sub">Markets: San Jose 95118/95124 (9.57% demo), Austin/Miami/Phoenix/Raleigh/Tampa/Nashville condos + listing gaps.</div>
  <div class="summary">
    <span class="pill">Serve: python3 -m http.server 8080 --directory public</span>
    <span class="pill">Or open directly: file://…/public/OUTREACH_RSARBOS.html</span>
    <span class="pill">Quick-Copy uses navigator.clipboard (HTTPS/localhost) + prompt fallback</span>
  </div>
</header>
<div class="wrap">
  <div class="grid">
>CARDS<
  </div>
  <h3 style="color:var(--muted);font-size:13px;text-transform:uppercase;letter-spacing:.5px">Outreach Queue (priority = relevance + evidence + contactability)</h3>
  <table>
    <thead><tr><th>#</th><th>Prospect</th><th>Property</th><th>Signal</th><th>WhatsApp</th><th>Channel</th><th>Subject</th><th>Verify</th></tr></thead>
    <tbody>
>QUEUE<
    </tbody>
  </table>
  <footer>RSARBOS • TURNING COMPLEX DATA INTO CONCLUSIONS 100% AUDITABLE • Outreach orchestrator · data: prospects.json · built by Yael Axel / founder</footer>
</div>
<script>
function copyMsg(btn, id){{
  var el=document.getElementById(id);
  var txt=el?el.textContent:'';
  navigator.clipboard.writeText(txt).then(function(){{
    var s=document.getElementById('c_'+id);
    if(s){{s.classList.add('show');setTimeout(function(){{s.classList.remove('show')}},1800)}}
  }).catch(function(e){{
    prompt('Press Ctrl+C to copy the WhatsApp message', txt);
  }});
}}
</script>
</body>
</html>
"""


def card(p, i):
    n = p.get("id", "P%02d" % (i + 1))
    return f'''
    <article class="card">
      <div class="card-head">
        <span class="badge">{esc(p.get("engine","PROPERTY_FIRST"))}</span>
        <span class="pk">{esc(n)}</span>
        <span class="tag">{esc(p.get("qualification","QUAlIFIED"))}</span>
      </div>
      <h2>{esc(p.get("name","—"))}</h2>
      <p class="meta">{esc(p.get("role") or "")} &#182; {esc(p.get("company") or "")} &#182; persona {esc(p.get("persona") or "")} &#182; {esc(p.get("property") or "")} {esc(p.get("price") or "")}</p>
      <p class="meta"><b>Specs:</b> {esc(p.get("specs") or "")}</p>
      <p class="meta"><b>Signal:</b> {esc(p.get("signal") or "")}</p>
      <p class="meta"><b>Proof:</b> {esc(p.get("proof") or "")}</p>
      {f'<p class="meta"><b>Listing:</b> <a class="c" href="{esc(p.get("listing_url"))}" target="_blank">view</a></p>' if p.get("listing_url") else ""}
      <p class="meta">Agent: {esc(p.get("agent") or "—")} / {esc(p.get("brokerage") or "")}</p>
      <p class="label">Contact (publicly verified)</p>
      <p class="contact">Phone: <b>{esc(p.get("phone") or "Not publicly verified")}</b></p>
      <p class="contact">WhatsApp: <b>{esc(p.get("whatsapp") or "Not publicly verified")}</b></p>
      <p class="meta"><b>Channel:</b> {esc(p.get("channel") or "WhatsApp")}</p>
      <p class="meta"><b>Subject:</b> {esc(p.get("subject") or "")}</p>
      <pre class="msg" id="m{n}">{esc(p.get("message") or "")}</pre>
      <div class="actions">
        <button class="copy-btn" onclick="copyMsg(this,'m{n}')">&#128203; Quick Copy WhatsApp message</button>
        <span class="copied" id="c_m{n}">Copied to clipboard</span>
      </div>
      <div class="ver">{esc(p.get("verification","PARTIAL"))}</div>
    </article>'''


def qrow(p, i):
    wa = p.get("whatsapp") or "Not publicly verified"
    channel = "WhatsApp" if (wa and "not" not in wa.lower()) else "Phone / brokerage"
    return (
        f'<tr><td>{i+1}</td>'
        f'<td>{esc(p.get("name") or "—")} <span style="color:var(--muted)">{esc(p.get("company") or "")}</span></td>'
        f'<td>{esc(p.get("property") or "")}</td>'
        f'<td>{esc(p.get("signal") or "")}</td>'
        f'<td>{esc(wa)}</td>'
        f'<td>{channel}</td>'
        f'<td>{esc(p.get("subject") or "")}</td>'
        f'<td>{esc(p.get("verification") or "")}</td></tr>'
    )


doc = (TEMPLATE
       .replace("PROSPECTS_COUNT", str(len(PROSPECTS)))
       .replace(">CARDS<", "".join(card(p, i) for i, p in enumerate(PROSPECTS)))
       .replace(">QUEUE<", "".join(qrow(p, i) for i, p in enumerate(PROSPECTS))))

OUT.write_text(doc, encoding="utf-8")
print("Wrote", OUT, "with", len(PROSPECTS), "prospects")
for p in PROSPECTS:
    print(f"{p.get('id','?'):<7} | {p.get('name','?'):<22} | {p.get('qualification','?')}")
