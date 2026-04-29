import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   ENTERPRISE MODULES — PatentCliff AI
   Module A: Personalized AI Morning Brief (CEO Suggestion #2)
   Module B: Board-Level Scenario War Game  (CEO Suggestion #5)
   ═══════════════════════════════════════════════════════════════════ */

// ── THEME ─────────────────────────────────────────────────────────
const T = {
  bg: "#05080f", surface: "rgba(9,13,24,0.98)", card: "rgba(12,17,30,0.97)",
  border: "rgba(60,75,120,0.18)", accent: "#6366f1", green: "#10b981",
  red: "#ef4444", amber: "#f59e0b", purple: "#a78bfa", teal: "#14b8a6",
  text: "#c4cad8", muted: "#4e5a7a", bright: "#eef0f6", dim: "#2a3352",
};
const F = { sans: "'Sora','DM Sans',system-ui,sans-serif", mono: "'JetBrains Mono',monospace", display: "'Playfair Display','Georgia',serif" };

// ── CORE DATA ─────────────────────────────────────────────────────
const COMPANIES = [
  "Amgen","Sandoz","Samsung Bioepis","Celltrion","Biocon","Teva","Dr. Reddy's",
  "Fresenius Kabi","Merck","BMS","J&J","Roche","Sanofi","Novo Nordisk",
  "Regeneron","Pfizer","AbbVie","Viatris","Alvotech","Formycon",
];
const ROLES = ["Chief Strategy Officer","VP Business Intelligence","Head of Portfolio Strategy","VP Commercial","Director Market Access","CFO","Business Development Lead","Medical Affairs Director"];
const THERAPY_AREAS = ["Oncology","Immunology","Cardiology","Metabolic","Ophthalmology","Neurology","Nephrology","Respiratory"];

const DRUGS = [
  { id:"KTR", drug:"Keytruda",  mol:"Pembrolizumab", orig:"Merck",        loe:2028, rev:25.0, area:"Oncology",      color:"#ff4d6a", comps:5,  priority:"critical",
    changes:[
      { date:"Feb 19", type:"Clinical",   sev:"critical", text:"HERITAGE-1 (Biocon) meets primary endpoint. BLA filing now imminent — 18 months ahead of some models.", new:true },
      { date:"Feb 10", type:"Clinical",   sev:"high",     text:"Amgen ABP 234 Phase 3 fully enrolled across 45 global sites.", new:true },
      { date:"Sep 25", type:"Regulatory", sev:"medium",   text:"Merck SC Keytruda Qlex approved — lifecycle extension play vs future IV biosimilars.", new:false },
    ],
    projection:[{y:"2028",o:25.0,b:1.0},{y:"2029",o:14.0,b:7.5},{y:"2030",o:7.5,b:10.0},{y:"2031",o:4.0,b:9.0}],
  },
  { id:"STL", drug:"Stelara",   mol:"Ustekinumab",   orig:"J&J",          loe:2025, rev:10.9, area:"Immunology",    color:"#6366f1", comps:7,  priority:"critical",
    changes:[
      { date:"Feb 24", type:"Launch",     sev:"critical", text:"7th ustekinumab biosimilar now on market. J&J confirmed 48% YoY erosion in Q4 2025.", new:true },
      { date:"Feb 07", type:"SEC",        sev:"high",     text:"Amgen Q4: Wezlana $310M revenue, formulary wins accelerating across major PBMs.", new:true },
      { date:"Jan 22", type:"SEC",        sev:"high",     text:"J&J Q4: Stelara down 48% YoY. Express Scripts and CVS both biosimilar-preferred.", new:false },
    ],
    projection:[{y:"2025",o:7.5,b:3.5},{y:"2026",o:3.2,b:5.8},{y:"2027",o:1.5,b:5.0},{y:"2028",o:0.8,b:3.5}],
  },
  { id:"ELQ", drug:"Eliquis",   mol:"Apixaban",      orig:"BMS/Pfizer",   loe:2028, rev:18.0, area:"Cardiology",    color:"#f59e0b", comps:4,  priority:"critical",
    changes:[
      { date:"Feb 20", type:"Litigation", sev:"critical", text:"Dr. Reddy's files new Para IV. Delaware denied BMS motion — all 5 patents go to trial March 2026.", new:true },
      { date:"Jan 30", type:"SEC",        sev:"high",     text:"Teva 20-F: 'Day-1 manufacturing scale-up underway' for April 2028 launch.", new:true },
      { date:"Feb 05", type:"SEC",        sev:"medium",   text:"BMS Q4 confirms April 2028 generic entry. $18B at risk.", new:false },
    ],
    projection:[{y:"2026",o:17.0,b:0},{y:"2027",o:16.5,b:0},{y:"2028",o:9.0,b:4.5},{y:"2029",o:3.6,b:5.4}],
  },
  { id:"EYL", drug:"Eylea",     mol:"Aflibercept",   orig:"Regeneron",    loe:2027, rev:6.1,  area:"Ophthalmology", color:"#10b981", comps:6,  priority:"high",
    changes:[
      { date:"Feb 07", type:"Launch",     sev:"critical", text:"Pavblu at-risk launch ongoing. Regeneron litigation ruling expected Q2 2026.", new:true },
      { date:"Feb 05", type:"Clinical",   sev:"high",     text:"Samsung SB15 24-month DME extension trial complete. FDA submission imminent.", new:true },
      { date:"Dec 31", type:"Settlement", sev:"medium",   text:"Celltrion Eydenzelt: US launch permitted Dec 31, 2026.", new:false },
    ],
    projection:[{y:"2025",o:5.8,b:0.3},{y:"2026",o:4.0,b:1.5},{y:"2027",o:2.5,b:2.5},{y:"2028",o:1.5,b:2.8}],
  },
  { id:"OPD", drug:"Opdivo",    mol:"Nivolumab",     orig:"BMS",          loe:2028, rev:9.0,  area:"Oncology",      color:"#a78bfa", comps:2,  priority:"medium",
    changes:[
      { date:"Jan 15", type:"Clinical",   sev:"medium",   text:"Junshi JS001 Phase 3 recruiting across 52 sites. Primary completion Jun 2027.", new:false },
      { date:"Dec 18", type:"Clinical",   sev:"low",      text:"Fresenius Kabi FKB239 Phase 3 recruitment ongoing in melanoma.", new:false },
    ],
    projection:[{y:"2028",o:9.0,b:0.5},{y:"2029",o:5.4,b:3.0},{y:"2030",o:3.0,b:4.0},{y:"2031",o:1.8,b:3.5}],
  },
  { id:"DUP", drug:"Dupixent",  mol:"Dupilumab",     orig:"Sanofi",       loe:2031, rev:13.7, area:"Immunology",    color:"#14b8a6", comps:2,  priority:"low",
    changes:[
      { date:"Aug 10", type:"Regulatory", sev:"medium",   text:"FDA approves Dupixent for COPD — 6th indication. Further extends runway.", new:false },
      { date:"Jan 20", type:"Clinical",   sev:"low",      text:"Harbour BioMed HBM9378 Phase 2 recruiting in atopic dermatitis.", new:false },
    ],
    projection:[{y:"2031",o:16.0,b:0.5},{y:"2032",o:9.6,b:4.0},{y:"2033",o:5.5,b:5.5},{y:"2034",o:3.5,b:5.0}],
  },
  { id:"XAR", drug:"Xarelto",   mol:"Rivaroxaban",   orig:"Bayer/J&J",    loe:2025, rev:6.4,  area:"Cardiology",    color:"#ff8c42", comps:3,  priority:"critical",
    changes:[
      { date:"Mar 03", type:"Launch",     sev:"critical", text:"Lupin + Sun Pharma launched Day-1. Bayer now reporting 58% YoY revenue decline.", new:true },
      { date:"Jan 25", type:"SEC",        sev:"high",     text:"Lupin 9-month rivaroxaban revenue $180M — first-filer advantage clear.", new:true },
    ],
    projection:[{y:"2025",o:3.5,b:1.5},{y:"2026",o:1.2,b:2.0},{y:"2027",o:0.4,b:1.2},{y:"2028",o:0.2,b:0.6}],
  },
];

const EROSION_TABLE = {
  "Oncology":     { base:68, speed:"Fast",      driver:"340B/GPO" },
  "Immunology":   { base:55, speed:"Moderate",  driver:"PBM rebates" },
  "Cardiology":   { base:72, speed:"Very Fast",  driver:"Auto-substitution" },
  "Ophthalmology":{ base:40, speed:"Slow",       driver:"Physician preference" },
  "Metabolic":    { base:62, speed:"Mod-Fast",   driver:"IRA/price caps" },
  "Neurology":    { base:35, speed:"Slow",       driver:"Switch concerns" },
};

const sev = (s) => s==="critical"?"#ef4444":s==="high"?"#f97316":s==="medium"?"#f59e0b":"#10b981";
const mono = (v) => ({ fontFamily:F.mono, fontWeight:600 });

// ── SHARED MICRO COMPONENTS ───────────────────────────────────────
const Pill = ({ label, color="#6366f1", bg }) => (
  <span style={{ fontSize:9, padding:"2px 8px", borderRadius:10, fontWeight:700, textTransform:"uppercase", letterSpacing:.4,
    background: bg || `${color}18`, color, border:`1px solid ${color}25` }}>{label}</span>
);
const Dot = ({ color, pulse }) => (
  <div style={{ position:"relative", width:8, height:8, flexShrink:0 }}>
    {pulse && <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:color, opacity:.3, animation:"ping 1.5s ease-in-out infinite" }}/>}
    <div style={{ position:"absolute", inset:1, borderRadius:"50%", background:color }}/>
  </div>
);
const Card = ({ children, style={}, glow }) => (
  <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:16,
    ...(glow ? { boxShadow:`0 0 24px ${glow}18` } : {}), ...style }}>
    {children}
  </div>
);
const CTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(8,12,22,0.97)", border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 12px", fontSize:10, fontFamily:F.sans }}>
      <div style={{ color:T.bright, fontWeight:700, marginBottom:3 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color }}>{p.name}: <strong>{typeof p.value==="number"?`$${p.value.toFixed(1)}B`:p.value}</strong></div>)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MODULE A: PERSONALIZED AI MORNING BRIEF
   ═══════════════════════════════════════════════════════ */

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function ProfileSetup({ onSave }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [areas, setAreas] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [step, setStep] = useState(0);

  const toggleArea = (a) => setAreas(p => p.includes(a) ? p.filter(x=>x!==a) : [...p,a]);
  const toggleWatch = (id) => setWatchlist(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const canNext = [name.trim().length>1, company&&role, areas.length>0, watchlist.length>0][step];

  const steps = [
    {
      title:"Who are you?", sub:"Your brief is personalized to your role and context.",
      content: (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:600 }}>YOUR NAME</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sarah Chen"
              style={{ width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:8, color:T.bright, fontSize:13, outline:"none", fontFamily:F.sans }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:600 }}>COMPANY</div>
            <select value={company} onChange={e=>setCompany(e.target.value)}
              style={{ width:"100%", padding:"10px 14px", background:"rgba(9,13,24,0.98)", border:`1px solid ${T.border}`, borderRadius:8, color:T.bright, fontSize:13, outline:"none", fontFamily:F.sans }}>
              <option value="">Select company...</option>
              {COMPANIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:600 }}>YOUR ROLE</div>
            <select value={role} onChange={e=>setRole(e.target.value)}
              style={{ width:"100%", padding:"10px 14px", background:"rgba(9,13,24,0.98)", border:`1px solid ${T.border}`, borderRadius:8, color:T.bright, fontSize:13, outline:"none", fontFamily:F.sans }}>
              <option value="">Select role...</option>
              {ROLES.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      )
    },
    {
      title:"Your therapy areas", sub:"We'll prioritize intelligence in these areas.",
      content: (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {THERAPY_AREAS.map(a => (
            <button key={a} onClick={()=>toggleArea(a)}
              style={{ padding:"9px 16px", borderRadius:20, border:`1px solid ${areas.includes(a)?T.accent:T.border}`,
                background:areas.includes(a)?"rgba(99,102,241,0.12)":"transparent",
                color:areas.includes(a)?"#a5b4fc":T.muted, fontSize:12, fontWeight:areas.includes(a)?700:400, cursor:"pointer", fontFamily:F.sans }}>
              {a}
            </button>
          ))}
        </div>
      )
    },
    {
      title:"Your watchlist", sub:"Select the drugs you track most closely.",
      content: (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {DRUGS.map(d => (
            <div key={d.id} onClick={()=>toggleWatch(d.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 13px", borderRadius:8, cursor:"pointer",
                background:watchlist.includes(d.id)?"rgba(99,102,241,0.06)":"rgba(255,255,255,0.02)",
                border:`1px solid ${watchlist.includes(d.id)?`${d.color}35`:T.border}` }}>
              <div style={{ width:8, height:8, borderRadius:4, background:d.color, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.bright }}>{d.drug} <span style={{ color:T.muted, fontWeight:400, fontSize:11 }}>({d.mol})</span></div>
                <div style={{ fontSize:10, color:T.muted }}>{d.orig} · {d.area} · ${d.rev}B · LOE {d.loe}</div>
              </div>
              <div style={{ width:18, height:18, borderRadius:4, border:`1.5px solid ${watchlist.includes(d.id)?T.accent:T.muted}`,
                background:watchlist.includes(d.id)?"rgba(99,102,241,0.2)":"transparent",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:T.accent }}>
                {watchlist.includes(d.id)?"✓":""}
              </div>
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div style={{ maxWidth:520, margin:"0 auto", padding:"40px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:11, color:T.muted, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>PatentCliff Intelligence</div>
        <div style={{ fontSize:28, fontWeight:800, color:T.bright, fontFamily:F.display, lineHeight:1.2 }}>Your Morning Brief awaits</div>
        <div style={{ fontSize:13, color:T.muted, marginTop:8 }}>Tell us about yourself. 3 steps. 60 seconds.</div>
      </div>

      {/* Progress */}
      <div style={{ display:"flex", gap:6, marginBottom:28 }}>
        {steps.map((_,i) => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=step?"linear-gradient(90deg,#6366f1,#a78bfa)":"rgba(255,255,255,0.06)", transition:"background .3s" }}/>
        ))}
      </div>

      <Card glow="#6366f1" style={{ marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:800, color:T.bright, marginBottom:4 }}>{steps[step].title}</div>
        <div style={{ fontSize:12, color:T.muted, marginBottom:18 }}>{steps[step].sub}</div>
        {steps[step].content}
      </Card>

      <div style={{ display:"flex", justifyContent:"space-between" }}>
        {step > 0
          ? <button onClick={()=>setStep(s=>s-1)} style={{ padding:"10px 24px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, color:T.muted, fontSize:12, cursor:"pointer", fontFamily:F.sans }}>← Back</button>
          : <div/>
        }
        {step < steps.length-1
          ? <button onClick={()=>canNext&&setStep(s=>s+1)} style={{ padding:"10px 24px", background:canNext?"linear-gradient(135deg,#4338ca,#6366f1)":"rgba(255,255,255,0.05)", border:"none", borderRadius:8, color:canNext?"#fff":T.muted, fontSize:12, fontWeight:700, cursor:canNext?"pointer":"not-allowed", fontFamily:F.sans }}>Continue →</button>
          : <button onClick={()=>canNext&&onSave({name,company,role,areas,watchlist})} style={{ padding:"10px 24px", background:canNext?"linear-gradient(135deg,#059669,#10b981)":"rgba(255,255,255,0.05)", border:"none", borderRadius:8, color:canNext?"#fff":T.muted, fontSize:12, fontWeight:700, cursor:canNext?"pointer":"not-allowed", fontFamily:F.sans }}>Generate My Brief →</button>
        }
      </div>
    </div>
  );
}

function MorningBrief({ profile }) {
  const [briefState, setBriefState] = useState("idle"); // idle|loading|done
  const [brief, setBrief] = useState("");
  const [activeSection, setActiveSection] = useState("digest");
  const now = new Date();
  const lastLogin = new Date(now - 3 * 24 * 60 * 60 * 1000); // 3 days ago

  const myDrugs = DRUGS.filter(d => profile.watchlist.includes(d.id));
  const allChanges = myDrugs.flatMap(d => d.changes.map(c => ({ ...c, drug:d.drug, color:d.color, id:d.id })));
  const newChanges = allChanges.filter(c => c.new);
  const criticalCount = newChanges.filter(c => c.sev==="critical").length;
  const highCount = newChanges.filter(c => c.sev==="high").length;

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile.name.split(" ")[0];

  const generateBrief = async () => {
    setBriefState("loading");
    const ctx = myDrugs.map(d => {
      const changes = d.changes.filter(c=>c.new).map(c=>`[${c.sev.toUpperCase()}] ${c.type}: ${c.text}`).join("; ");
      return `${d.drug} (${d.mol}, LOE ${d.loe}, $${d.rev}B): ${changes||"No new changes"}`;
    }).join("\n");

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:900,
          messages:[{ role:"user", content:`You are PatentCliff AI writing a personalized morning intelligence brief for ${profile.name}, ${profile.role} at ${profile.company}. Today is ${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}.

Their watchlist (changes since last login 3 days ago):
${ctx}

Write a brief in this EXACT format:

HEADLINE
One sentence capturing the single most critical development they need to act on today.

WHAT CHANGED SINCE ${DAY_NAMES[lastLogin.getDay()].toUpperCase()}
• [drug] — [1 sharp sentence]
(list only new changes, bullet per drug, 3-5 bullets max)

YOUR PRIORITY ACTION TODAY
Given ${profile.name}'s role as ${profile.role} at ${profile.company}: one specific action they should take before end of day, with a reason why.

WHAT TO WATCH THIS WEEK
Two forward-looking sentences about what to monitor in the next 7 days.

Tone: direct, intelligent, zero fluff. Write like you're briefing a C-suite executive who has 90 seconds to read this.` }]
        })
      });
      const d = await r.json();
      setBrief(d.content?.[0]?.text || "");
    } catch {
      setBrief(`HEADLINE\n${criticalCount > 0 ? `🔴` : `🟠`} ${criticalCount} critical, ${highCount} high-priority changes detected across your ${myDrugs.length}-drug watchlist since ${DAY_NAMES[lastLogin.getDay()]}.\n\nWHAT CHANGED SINCE ${DAY_NAMES[lastLogin.getDay()].toUpperCase()}\n${newChanges.slice(0,4).map(c=>`• ${c.drug} — ${c.text}`).join("\n")}\n\nYOUR PRIORITY ACTION TODAY\nAs ${profile.role} at ${profile.company}: review the Eliquis Delaware court update and brief legal counsel on timeline implications before market open.\n\nWHAT TO WATCH THIS WEEK\nMonitor the Delaware apixaban trial ruling (expected March 15) and Amgen's Wezlana formulary win disclosures in upcoming investor conferences. Both could materially shift 2028 models.`);
    }
    setBriefState("done");
  };

  useEffect(() => { generateBrief(); }, []);

  const sections = [
    { k:"digest",   l:"📋 Digest" },
    { k:"signals",  l:`⚡ Signals (${newChanges.length})` },
    { k:"watchlist",l:`👁️ Watchlist (${myDrugs.length})` },
    { k:"email",    l:"📧 Email Preview" },
  ];

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>

      {/* ── MASTHEAD ── */}
      <div style={{ padding:"28px 0 20px", borderBottom:`1px solid ${T.border}`, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:11, color:T.muted, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>
              {DAY_NAMES[now.getDay()]}, {MONTH_NAMES[now.getMonth()]} {now.getDate()} · PatentCliff Intelligence
            </div>
            <div style={{ fontSize:32, fontWeight:800, color:T.bright, fontFamily:F.display, lineHeight:1.15 }}>
              {greeting}, {firstName}.
            </div>
            <div style={{ fontSize:13, color:T.muted, marginTop:6 }}>
              {profile.company} · {profile.role}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {criticalCount > 0 && (
              <div style={{ padding:"10px 18px", borderRadius:10, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:900, color:"#ef4444", fontFamily:F.mono }}>{criticalCount}</div>
                <div style={{ fontSize:9, color:"#ef4444", fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>Critical</div>
              </div>
            )}
            {highCount > 0 && (
              <div style={{ padding:"10px 18px", borderRadius:10, background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.2)", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:900, color:"#f97316", fontFamily:F.mono }}>{highCount}</div>
                <div style={{ fontSize:9, color:"#f97316", fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>High</div>
              </div>
            )}
            <div style={{ padding:"10px 18px", borderRadius:10, background:"rgba(99,102,241,0.06)", border:`1px solid ${T.border}`, textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:T.purple, fontFamily:F.mono }}>{myDrugs.length}</div>
              <div style={{ fontSize:9, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>Drugs</div>
            </div>
            <div style={{ padding:"10px 18px", borderRadius:10, background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.15)", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:T.green, fontFamily:F.mono }}>3d</div>
              <div style={{ fontSize:9, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:.6 }}>Since login</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display:"flex", gap:2, marginBottom:18, borderBottom:`1px solid ${T.border}` }}>
        {sections.map(s => (
          <button key={s.k} onClick={()=>setActiveSection(s.k)}
            style={{ padding:"8px 16px", border:"none", borderBottom:`2px solid ${activeSection===s.k?T.accent:"transparent"}`, background:"transparent",
              color:activeSection===s.k?"#a5b4fc":T.muted, fontSize:12, fontWeight:activeSection===s.k?700:400, cursor:"pointer", fontFamily:F.sans, marginBottom:-1, whiteSpace:"nowrap" }}>
            {s.l}
          </button>
        ))}
      </div>

      {/* ── DIGEST ── */}
      {activeSection==="digest" && (
        <div>
          {briefState==="loading" && (
            <Card style={{ marginBottom:16, borderColor:"rgba(99,102,241,0.2)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:32, height:32, borderRadius:16, border:"2px solid #6366f1", borderTopColor:"transparent", animation:"spin .8s linear infinite", flexShrink:0 }}/>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.bright }}>Claude AI is reading your watchlist...</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Analyzing {newChanges.length} new changes across {myDrugs.length} drugs since {DAY_NAMES[lastLogin.getDay()]}</div>
                </div>
              </div>
              <div style={{ marginTop:14, display:"flex", gap:8 }}>
                {[80,55,90,40].map((w,i) => <div key={i} className="skeleton" style={{ height:10, borderRadius:3, width:`${w}%`, maxWidth:w*4 }}/>)}
              </div>
            </Card>
          )}

          {brief && (
            <Card glow="#6366f1" style={{ marginBottom:16, borderColor:"rgba(99,102,241,0.18)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#4338ca,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🤖</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.bright }}>AI Intelligence Brief</div>
                    <div style={{ fontSize:10, color:T.muted }}>Generated {now.toLocaleTimeString()} · Personalized for {firstName}</div>
                  </div>
                </div>
                <button onClick={()=>{setBriefState("idle");setBrief("");generateBrief();}}
                  style={{ padding:"5px 12px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:7, color:T.muted, fontSize:10, cursor:"pointer", fontFamily:F.sans }}>↺ Refresh</button>
              </div>
              <div style={{ fontSize:12, color:T.text, lineHeight:2.0, whiteSpace:"pre-wrap",
                padding:"14px 18px", background:"rgba(255,255,255,0.015)", borderRadius:8, border:`1px solid ${T.border}` }}>
                {brief}
              </div>
            </Card>
          )}

          {/* New signals ticker */}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {newChanges.map((c,i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"10px 14px", borderRadius:8, background:T.card, border:`1px solid ${T.border}`, borderLeft:`3px solid ${sev(c.sev)}`, animation:`fadeIn .3s ease ${i*0.05}s both` }}>
                <div style={{ width:6, height:6, borderRadius:3, background:sev(c.sev), marginTop:4, flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3 }}>
                    <span style={{ fontSize:9, padding:"1px 7px", borderRadius:10, background:`${c.color}15`, color:c.color, fontWeight:700 }}>{c.drug}</span>
                    <span style={{ fontSize:9, padding:"1px 7px", borderRadius:10, background:`${sev(c.sev)}12`, color:sev(c.sev), fontWeight:600 }}>{c.type}</span>
                    <Pill label="NEW" color="#10b981"/>
                  </div>
                  <div style={{ fontSize:11, color:T.text, lineHeight:1.6 }}>{c.text}</div>
                  <div style={{ fontSize:9, color:T.muted, marginTop:2, fontFamily:F.mono }}>{c.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SIGNALS ── */}
      {activeSection==="signals" && (
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.bright, marginBottom:14 }}>All signals since {DAY_NAMES[lastLogin.getDay()]}</div>
          {allChanges.sort((a,b)=>["critical","high","medium","low"].indexOf(a.sev)-["critical","high","medium","low"].indexOf(b.sev)).map((c,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"11px 14px", borderRadius:8, background:T.card, border:`1px solid ${T.border}`, borderLeft:`3px solid ${sev(c.sev)}`, marginBottom:5 }}>
              <div style={{ minWidth:55 }}>
                <div style={{ fontSize:9, color:T.muted, fontFamily:F.mono }}>{c.date}</div>
                {c.new && <Pill label="NEW" color="#10b981"/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:5, marginBottom:3 }}>
                  <span style={{ fontSize:9, padding:"1px 7px", borderRadius:10, background:`${c.color}15`, color:c.color, fontWeight:700 }}>{c.drug}</span>
                  <span style={{ fontSize:9, padding:"1px 7px", borderRadius:10, background:"rgba(99,102,241,0.08)", color:"#8b7fff" }}>{c.type}</span>
                  <span style={{ fontSize:9, padding:"1px 7px", borderRadius:10, background:`${sev(c.sev)}12`, color:sev(c.sev), fontWeight:600 }}>{c.sev}</span>
                </div>
                <div style={{ fontSize:11, color:T.text, lineHeight:1.6 }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── WATCHLIST ── */}
      {activeSection==="watchlist" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
          {myDrugs.map(d => {
            const newCount = d.changes.filter(c=>c.new).length;
            return (
              <Card key={d.id} style={{ borderLeft:`3px solid ${d.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:T.bright }}>{d.drug}</div>
                    <div style={{ fontSize:10, color:T.muted }}>{d.mol} · {d.orig}</div>
                  </div>
                  {newCount>0 && <div style={{ fontSize:18, fontWeight:900, color:sev(d.changes[0]?.sev||"low"), fontFamily:F.mono }}>{newCount} new</div>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:10 }}>
                  {[{l:"Revenue",v:`$${d.rev}B`,c:d.color},{l:"LOE",v:d.loe,c:d.loe<=2026?"#ef4444":"#f59e0b"},{l:"Comps",v:d.comps,c:"#a78bfa"}].map((s,i)=>(
                    <div key={i} style={{ textAlign:"center", padding:"5px 8px", background:`${s.c}08`, borderRadius:6 }}>
                      <div style={{ fontSize:8, color:T.muted, textTransform:"uppercase" }}>{s.l}</div>
                      <div style={{ fontSize:14, fontWeight:800, color:s.c, fontFamily:F.mono }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                {d.changes.filter(c=>c.new).slice(0,2).map((c,i) => (
                  <div key={i} style={{ fontSize:10, color:T.text, lineHeight:1.5, padding:"4px 8px", borderRadius:4, background:"rgba(255,255,255,0.02)", marginBottom:3, borderLeft:`2px solid ${sev(c.sev)}` }}>
                    {c.text}
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── EMAIL PREVIEW ── */}
      {activeSection==="email" && (
        <div>
          <div style={{ fontFamily:F.mono, fontSize:10.5, background:"rgba(0,0,0,0.3)", borderRadius:10, border:`1px solid ${T.border}`, overflow:"hidden" }}>
            <div style={{ padding:"10px 16px", background:"rgba(255,255,255,0.03)", borderBottom:`1px solid ${T.border}`, display:"flex", gap:6 }}>
              {["#ef4444","#f59e0b","#10b981"].map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:5,background:c }}/>)}
              <span style={{ color:T.muted, marginLeft:8 }}>Email Client — intelligence@patentcliff.ai</span>
            </div>
            <div style={{ padding:"16px 20px" }}>
              <div style={{ color:"#a99fff", marginBottom:2 }}>From: intelligence@patentcliff.ai</div>
              <div style={{ color:"#a99fff", marginBottom:2 }}>To: {profile.name.toLowerCase().replace(" ",".")}@{profile.company.toLowerCase().replace(" ","")}.com</div>
              <div style={{ color:"#a99fff", marginBottom:2 }}>Subject: {criticalCount>0?"🔴":"🟠"} {criticalCount} critical alert{criticalCount!==1?"s":""} — {DAY_NAMES[now.getDay()]} PatentCliff Brief</div>
              <div style={{ color:"#a99fff", marginBottom:8 }}>Date: {now.toDateString()} {now.toLocaleTimeString()}</div>
              <div style={{ color:T.muted }}>─────────────────────────────────────────────</div>
              <div style={{ color:T.text, marginTop:10, lineHeight:1.9 }}>
                <div style={{ color:T.bright, fontWeight:700, marginBottom:6 }}>{greeting}, {firstName}.</div>
                <div>{criticalCount} critical and {highCount} high-priority changes across your watchlist since {DAY_NAMES[lastLogin.getDay()]}.</div>
                <div style={{ marginTop:8 }}>NEW SINCE {DAY_NAMES[lastLogin.getDay()].toUpperCase()}:</div>
                {newChanges.slice(0,4).map((c,i) => (
                  <div key={i} style={{ paddingLeft:12, borderLeft:`2px solid ${sev(c.sev)}`, marginTop:4, color:T.text }}>
                    [{c.drug}] {c.text}
                  </div>
                ))}
                <div style={{ marginTop:12, color:"#818cf8" }}>→ Open full brief: patentcliff.ai/brief/{now.toISOString().slice(0,10)}</div>
                <div style={{ marginTop:4, color:T.muted, fontSize:9 }}>PatentCliff AI · Unsubscribe · Preferences</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop:10, fontSize:11, color:T.muted, textAlign:"center" }}>
            Email delivery available in Team and Enterprise tiers · Configurable: daily, twice-daily, or trigger-based
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MODULE B: BOARD-LEVEL SCENARIO WAR GAME
   ═══════════════════════════════════════════════════════ */

const DEFAULT_SCENARIOS = [
  { id:"base", name:"Base Case", color:"#6366f1", locked:false,
    params: DRUGS.map(d => ({ id:d.id, comps:d.comps, delay:0, interch:false, pctOverride:null, notes:"" })),
    audit: [{ by:"System", at:"Mar 10, 2026 09:00", action:"Scenario created from market consensus" }],
    collaborators:["Sarah K.","Mike R."],
  },
  { id:"bear", name:"Bear Case", color:"#ef4444", locked:false,
    params: DRUGS.map(d => ({ id:d.id, comps:Math.min(8,d.comps+2), delay:0, interch:true, pctOverride:null, notes:"" })),
    audit: [{ by:"Mike R.", at:"Mar 9, 2026 14:22", action:"Increased competitor count +2 per drug, enabled interchangeability" }],
    collaborators:["Mike R."],
  },
  { id:"bull", name:"Bull Case", color:"#10b981", locked:false,
    params: DRUGS.map(d => ({ id:d.id, comps:Math.max(1,d.comps-1), delay:12, interch:false, pctOverride:null, notes:"" })),
    audit: [{ by:"Sarah K.", at:"Mar 8, 2026 11:05", action:"12-month delay assumption; reduced competitor count" }],
    collaborators:["Sarah K.","David C."],
  },
];

function calcImpact(drug, params) {
  const p = params.find(x=>x.id===drug.id) || params[0];
  const er = EROSION_TABLE[drug.area] || { base:55 };
  const base = er.base / 100;
  const cm = p.comps<=1?0.6:p.comps<=2?0.75:p.comps<=4?1.0:p.comps<=6?1.15:1.3;
  const im = p.interch?1.15:1.0;
  const dm = Math.max(0.3, 1 - p.delay*0.055);
  const adj = p.pctOverride!==null ? p.pctOverride/100 : Math.min(0.92, base*cm*im*dm);
  const y1 = drug.rev*adj*0.45;
  const y2 = drug.rev*adj*0.75;
  const y3 = drug.rev*adj*0.92;
  return { erosion24: +(adj*100).toFixed(0), yr1:+y1.toFixed(2), yr2:+y2.toFixed(2), yr3:+y3.toFixed(2), comps:p.comps, delay:p.delay, interch:p.interch };
}

function BoardWarGame() {
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS);
  const [activeScen, setActiveScen] = useState("base");
  const [editDrug, setEditDrug] = useState(null);
  const [boardView, setBoardView] = useState(false);
  const [newScenName, setNewScenName] = useState("");
  const [showNewScen, setShowNewScen] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [tab, setTab] = useState("grid");
  const [userName] = useState("You");

  const scen = scenarios.find(s=>s.id===activeScen) || scenarios[0];

  const updateParam = useCallback((drugId, field, val) => {
    setScenarios(prev => prev.map(s => {
      if (s.id !== activeScen) return s;
      const newParams = s.params.map(p => p.id===drugId ? {...p,[field]:val} : p);
      const newAudit = [{ by:userName, at:new Date().toLocaleString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}), action:`Updated ${DRUGS.find(d=>d.id===drugId)?.drug} ${field} → ${val}` }, ...s.audit];
      return { ...s, params:newParams, audit:newAudit };
    }));
  }, [activeScen, userName]);

  const cloneScenario = () => {
    if (!newScenName.trim()) return;
    const colors = ["#a78bfa","#14b8a6","#f59e0b","#ff8c42"];
    const newS = { ...scen, id: Date.now().toString(), name:newScenName, color:colors[scenarios.length%colors.length],
      params: JSON.parse(JSON.stringify(scen.params)),
      audit:[{ by:userName, at:new Date().toLocaleString(), action:`Cloned from "${scen.name}"` }],
      collaborators:[userName],
    };
    setScenarios(p=>[...p,newS]);
    setActiveScen(newS.id);
    setShowNewScen(false); setNewScenName("");
  };

  const allImpacts = useMemo(() => DRUGS.map(d => ({ drug:d, impact:calcImpact(d,scen.params) })), [scen]);
  const totalRev = DRUGS.reduce((a,d)=>a+d.rev,0);
  const totalYr1 = allImpacts.reduce((a,x)=>a+x.impact.yr1,0);
  const totalYr2 = allImpacts.reduce((a,x)=>a+x.impact.yr2,0);
  const totalYr3 = allImpacts.reduce((a,x)=>a+x.impact.yr3,0);

  // Sensitivity data: for selected drug, vary competitors 1-8
  const [sensitivityDrug, setSensitivityDrug] = useState(DRUGS[0].id);
  const sd = DRUGS.find(d=>d.id===sensitivityDrug);
  const sensitivityRows = sd ? [0,6,12,18,24].map(delay => ({
    delay: `${delay}m delay`,
    ...Object.fromEntries([1,2,3,4,5,6,7,8].map(c => {
      const fake = { ...scen.params.find(p=>p.id===sd.id)||{}, comps:c, delay };
      const { yr1 } = calcImpact(sd, [fake]);
      return [`c${c}`, +yr1.toFixed(1)];
    }))
  })) : [];

  // Scenario comparison
  const compData = scenarios.map(s => {
    const y1 = DRUGS.reduce((a,d)=>a+calcImpact(d,s.params).yr1,0);
    const y2 = DRUGS.reduce((a,d)=>a+calcImpact(d,s.params).yr2,0);
    const y3 = DRUGS.reduce((a,d)=>a+calcImpact(d,s.params).yr3,0);
    return { name:s.name, color:s.color, yr1:+y1.toFixed(1), yr2:+y2.toFixed(1), yr3:+y3.toFixed(1) };
  });

  // Board view
  if (boardView) {
    return (
      <div style={{ background:"#fff", color:"#1a1a2e", minHeight:"100vh", fontFamily:F.sans, padding:"40px 56px" }}>
        <style>{`@media print { body { -webkit-print-color-adjust: exact; } }`}</style>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
          <div>
            <div style={{ fontSize:11, color:"#6b7280", fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>CONFIDENTIAL — BOARD MATERIALS</div>
            <div style={{ fontSize:30, fontWeight:900, color:"#0f172a", fontFamily:F.display }}>Patent Cliff Impact Analysis</div>
            <div style={{ fontSize:14, color:"#6b7280", marginTop:4 }}>Scenario: {scen.name} · {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
          </div>
          <button onClick={()=>setBoardView(false)} style={{ padding:"8px 18px", background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:8, color:"#374151", fontSize:12, cursor:"pointer", fontFamily:F.sans }}>← Exit Board View</button>
        </div>

        {/* KPI Row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:36 }}>
          {[
            { l:"Total Revenue at Risk", v:`$${totalRev.toFixed(0)}B`, sub:"Across tracked portfolio", c:"#6366f1" },
            { l:"Year 1 Impact", v:`−$${totalYr1.toFixed(1)}B`, sub:`${(totalYr1/totalRev*100).toFixed(0)}% of portfolio`, c:"#ef4444" },
            { l:"Year 2 Impact", v:`−$${totalYr2.toFixed(1)}B`, sub:`${(totalYr2/totalRev*100).toFixed(0)}% of portfolio`, c:"#ef4444" },
            { l:"3-Year Cumulative", v:`−$${(totalYr1+totalYr2+totalYr3).toFixed(1)}B`, sub:"Revenue impact", c:"#dc2626" },
          ].map((s,i)=>(
            <div key={i} style={{ padding:"20px 22px", borderRadius:10, background:"#f8fafc", border:"2px solid #e2e8f0", borderTop:`4px solid ${s.c}` }}>
              <div style={{ fontSize:11, color:"#6b7280", fontWeight:600, textTransform:"uppercase", letterSpacing:.8 }}>{s.l}</div>
              <div style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:F.mono, marginTop:4 }}>{s.v}</div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Waterfall Chart */}
        <div style={{ background:"#f8fafc", borderRadius:12, padding:"20px 24px", marginBottom:28, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:16 }}>Year 1 Revenue Impact by Drug ({scen.name})</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={allImpacts.filter(x=>x.impact.yr1>0).sort((a,b)=>b.impact.yr1-a.impact.yr1)} margin={{left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="drug.drug" tick={{fontSize:11,fill:"#6b7280"}}/>
              <YAxis tick={{fontSize:10,fill:"#6b7280"}} label={{value:"Loss ($B)",angle:-90,position:"insideLeft",fontSize:10,fill:"#6b7280"}}/>
              <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d=payload[0].payload;return <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:6,padding:"8px 12px",fontSize:11}}><strong>{d.drug.drug}</strong><br/>Yr1 Loss: −${d.impact.yr1}B<br/>24m Erosion: {d.impact.erosion24}%</div>}}/>
              <Bar dataKey="impact.yr1" radius={[4,4,0,0]}>{allImpacts.filter(x=>x.impact.yr1>0).sort((a,b)=>b.impact.yr1-a.impact.yr1).map((_,i)=><Cell key={i} fill={["#6366f1","#f59e0b","#ef4444","#a78bfa","#14b8a6","#ff8c42","#10b981"][i%7]}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div style={{ background:"#f8fafc", borderRadius:12, padding:"20px 24px", border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:14 }}>Detailed Impact by Drug</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:"#f1f5f9" }}>
                {["Drug","Revenue","Competitors","Delay","Interch.","24m Erosion","Yr1 Loss","Yr2 Loss","Yr3 Loss"].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 12px", textAlign:i>1?"center":"left", fontWeight:700, color:"#374151", borderBottom:"2px solid #e2e8f0", fontSize:11, textTransform:"uppercase", letterSpacing:.6 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allImpacts.map(({drug,impact},i)=>(
                <tr key={i} style={{ background:i%2===0?"#fff":"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
                  <td style={{ padding:"10px 12px", fontWeight:700, color:"#0f172a" }}>{drug.drug}</td>
                  <td style={{ padding:"10px 12px", fontFamily:F.mono, color:"#374151" }}>${drug.rev}B</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono }}>{impact.comps}</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono }}>{impact.delay}m</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", color:impact.interch?"#059669":"#6b7280", fontWeight:600 }}>{impact.interch?"Yes":"No"}</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, fontWeight:800, color:impact.erosion24>60?"#dc2626":impact.erosion24>40?"#d97706":"#059669" }}>{impact.erosion24}%</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, color:"#dc2626", fontWeight:700 }}>−${impact.yr1}B</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, color:"#dc2626", fontWeight:700 }}>−${impact.yr2}B</td>
                  <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, color:"#dc2626", fontWeight:700 }}>−${impact.yr3}B</td>
                </tr>
              ))}
              <tr style={{ background:"#1e293b", color:"#fff" }}>
                <td colSpan={6} style={{ padding:"10px 12px", fontWeight:800, fontSize:13 }}>PORTFOLIO TOTAL</td>
                <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, fontWeight:900, fontSize:14 }}>−${totalYr1.toFixed(1)}B</td>
                <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, fontWeight:900, fontSize:14 }}>−${totalYr2.toFixed(1)}B</td>
                <td style={{ padding:"10px 12px", textAlign:"center", fontFamily:F.mono, fontWeight:900, fontSize:14 }}>−${totalYr3.toFixed(1)}B</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop:24, display:"flex", justifyContent:"space-between", color:"#9ca3af", fontSize:10 }}>
          <div>PatentCliff AI · Confidential · {new Date().toLocaleDateString()}</div>
          <div>Scenario: {scen.name} · Assumptions: See working model</div>
        </div>
      </div>
    );
  }

  const tabDefs = [
    { k:"grid",        l:"🎛️ Parameter Grid" },
    { k:"sensitivity", l:"📐 Sensitivity Table" },
    { k:"compare",     l:"⚖️ Scenario Compare" },
    { k:"audit",       l:`📜 Audit Trail (${scen.audit.length})` },
  ];

  return (
    <div style={{ maxWidth:1100, margin:"0 auto" }}>

      {/* ── HEADER ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:11, color:T.muted, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Board-Level Scenario War Game</div>
          <div style={{ fontSize:24, fontWeight:900, color:T.bright }}>Patent Cliff Impact Modeling</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setShowAudit(!showAudit)}
            style={{ padding:"8px 16px", background:showAudit?"rgba(99,102,241,0.1)":"transparent", border:`1px solid ${showAudit?T.accent:T.border}`, borderRadius:8, color:showAudit?"#a5b4fc":T.muted, fontSize:11, cursor:"pointer", fontFamily:F.sans }}>
            📜 Audit Trail
          </button>
          <button onClick={()=>setBoardView(true)}
            style={{ padding:"8px 20px", background:"linear-gradient(135deg,#1d4ed8,#6366f1)", border:"none", borderRadius:8, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F.sans, display:"flex", alignItems:"center", gap:6 }}>
            🎯 Board View
          </button>
        </div>
      </div>

      {/* ── SCENARIO TABS ── */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ fontSize:10, color:T.muted, fontWeight:700, letterSpacing:.8, textTransform:"uppercase", marginRight:4 }}>Scenario:</div>
        {scenarios.map(s => (
          <button key={s.id} onClick={()=>setActiveScen(s.id)}
            style={{ padding:"7px 18px", borderRadius:20, border:`1px solid ${activeScen===s.id?s.color:T.border}`,
              background:activeScen===s.id?`${s.color}14`:"transparent",
              color:activeScen===s.id?s.color:T.muted, fontSize:12, fontWeight:activeScen===s.id?700:400, cursor:"pointer", fontFamily:F.sans,
              display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:6, height:6, borderRadius:3, background:s.color }}/>
            {s.name}
            <span style={{ fontSize:9, opacity:.7 }}>{s.collaborators.length > 0 ? `·${s.collaborators.length}👤`:""}</span>
          </button>
        ))}
        <button onClick={()=>setShowNewScen(!showNewScen)}
          style={{ padding:"7px 14px", borderRadius:20, border:`1px dashed ${T.border}`, background:"transparent", color:T.muted, fontSize:11, cursor:"pointer", fontFamily:F.sans }}>
          + Clone
        </button>
        {showNewScen && (
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <input value={newScenName} onChange={e=>setNewScenName(e.target.value)} placeholder={`Clone of "${scen.name}"...`}
              style={{ padding:"6px 12px", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`, borderRadius:7, color:T.bright, fontSize:11, outline:"none", fontFamily:F.sans, width:200 }}/>
            <button onClick={cloneScenario} style={{ padding:"6px 14px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:7, color:"#10b981", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:F.sans }}>Create</button>
          </div>
        )}
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:8, marginBottom:16 }}>
        {[
          { l:"Portfolio at Risk", v:`$${totalRev.toFixed(0)}B`,          c:"#6366f1" },
          { l:"Year 1 Loss",       v:`−$${totalYr1.toFixed(1)}B`,         c:"#ef4444", sub:`${(totalYr1/totalRev*100).toFixed(0)}%` },
          { l:"Year 2 Loss",       v:`−$${totalYr2.toFixed(1)}B`,         c:"#ef4444" },
          { l:"Year 3 Loss",       v:`−$${totalYr3.toFixed(1)}B`,         c:"#dc2626" },
          { l:"3-Year Total",      v:`−$${(totalYr1+totalYr2+totalYr3).toFixed(1)}B`, c:"#dc2626" },
          { l:"Scenario",          v:scen.name,                           c:scen.color },
        ].map((s,i)=>(
          <div key={i} style={{ padding:"11px 14px", borderRadius:10, background:T.card, border:`1px solid ${T.border}`, borderTop:`2px solid ${s.c}` }}>
            <div style={{ fontSize:9, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:.8 }}>{s.l}</div>
            <div style={{ fontSize:18, fontWeight:900, color:s.c, fontFamily:F.mono, marginTop:2 }}>{s.v}</div>
            {s.sub && <div style={{ fontSize:9, color:T.muted }}>{s.sub} of portfolio</div>}
          </div>
        ))}
      </div>

      {/* ── SUB TABS ── */}
      <div style={{ display:"flex", gap:2, marginBottom:16, borderBottom:`1px solid ${T.border}` }}>
        {tabDefs.map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{ padding:"7px 14px", border:"none", borderBottom:`2px solid ${tab===t.k?T.accent:"transparent"}`, background:"transparent",
              color:tab===t.k?"#a5b4fc":T.muted, fontSize:11, fontWeight:tab===t.k?700:400, cursor:"pointer", fontFamily:F.sans, marginBottom:-1, whiteSpace:"nowrap" }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* ══ TAB: PARAMETER GRID ══ */}
      {tab==="grid" && (
        <div>
          <div style={{ fontSize:11, color:T.muted, marginBottom:10 }}>
            Click any drug row to expand sliders · Changes logged in audit trail · {scen.name} scenario
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 4px", minWidth:820 }}>
              <thead>
                <tr style={{ fontSize:9, color:T.muted, textTransform:"uppercase", letterSpacing:.8 }}>
                  {["Drug","Revenue","Competitors","Delay","Interch.","24m Erosion","Yr1 Loss","Yr2 Loss","Yr3 Loss","Note"].map((h,i)=>(
                    <th key={i} style={{ textAlign:i<2?"left":"center", padding:"0 8px 6px", fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allImpacts.map(({drug,impact},i) => {
                  const p = scen.params.find(x=>x.id===drug.id) || {};
                  const isOpen = editDrug===drug.id;
                  return (
                    <tr key={drug.id} onClick={()=>setEditDrug(isOpen?null:drug.id)}
                      style={{ background:isOpen?"rgba(99,102,241,0.05)":"rgba(255,255,255,0.01)", cursor:"pointer", transition:"background .15s" }}>
                      <td style={{ padding:"10px 8px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:8, height:8, borderRadius:4, background:drug.color, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:T.bright }}>{drug.drug}</div>
                            <div style={{ fontSize:9, color:T.muted }}>{drug.mol}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 8px", fontFamily:F.mono, fontSize:12, color:T.text }}>${drug.rev}B</td>
                      <td style={{ padding:"10px 8px", textAlign:"center" }}>
                        {isOpen ? (
                          <div onClick={e=>e.stopPropagation()} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                            <input type="range" min={1} max={8} value={p.comps||1} onChange={e=>updateParam(drug.id,"comps",+e.target.value)} style={{ width:80 }}/>
                            <span style={{ fontFamily:F.mono, fontSize:12, fontWeight:800, color:"#a5b4fc" }}>{p.comps}</span>
                          </div>
                        ) : <span style={{ fontFamily:F.mono, fontSize:13, fontWeight:700, color:"#a5b4fc" }}>{impact.comps}</span>}
                      </td>
                      <td style={{ padding:"10px 8px", textAlign:"center" }}>
                        {isOpen ? (
                          <div onClick={e=>e.stopPropagation()} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                            <input type="range" min={0} max={24} value={p.delay||0} onChange={e=>updateParam(drug.id,"delay",+e.target.value)} style={{ width:80 }}/>
                            <span style={{ fontFamily:F.mono, fontSize:11, color:T.text }}>{p.delay}m</span>
                          </div>
                        ) : <span style={{ fontFamily:F.mono, fontSize:12, color:T.text }}>{impact.delay}m</span>}
                      </td>
                      <td style={{ padding:"10px 8px", textAlign:"center" }}>
                        {isOpen ? (
                          <button onClick={e=>{e.stopPropagation();updateParam(drug.id,"interch",!p.interch);}}
                            style={{ padding:"4px 12px", borderRadius:6, border:`1px solid ${p.interch?"rgba(16,185,129,.4)":T.border}`, background:p.interch?"rgba(16,185,129,.1)":"transparent", color:p.interch?"#10b981":T.muted, fontSize:10, cursor:"pointer", fontFamily:F.sans }}>
                            {p.interch?"YES":"NO"}
                          </button>
                        ) : <span style={{ fontSize:11, color:impact.interch?"#10b981":T.muted, fontWeight:600 }}>{impact.interch?"Yes":"No"}</span>}
                      </td>
                      <td style={{ padding:"10px 8px", textAlign:"center" }}>
                        <span style={{ fontFamily:F.mono, fontSize:14, fontWeight:900, color:impact.erosion24>60?"#ef4444":impact.erosion24>40?"#f59e0b":"#10b981" }}>{impact.erosion24}%</span>
                      </td>
                      <td style={{ padding:"10px 8px", textAlign:"center", fontFamily:F.mono, fontSize:12, fontWeight:700, color:"#ef4444" }}>−${impact.yr1}B</td>
                      <td style={{ padding:"10px 8px", textAlign:"center", fontFamily:F.mono, fontSize:12, fontWeight:700, color:"#ef4444" }}>−${impact.yr2}B</td>
                      <td style={{ padding:"10px 8px", textAlign:"center", fontFamily:F.mono, fontSize:12, fontWeight:700, color:"#dc2626" }}>−${impact.yr3}B</td>
                      <td style={{ padding:"10px 8px", textAlign:"center" }}>
                        <button onClick={e=>{e.stopPropagation();setNoteTarget(drug.id);setNoteText(p.notes||"");}}
                          style={{ fontSize:9, padding:"2px 8px", borderRadius:4, border:`1px solid ${p.notes?"rgba(99,102,241,.3)":T.border}`, background:p.notes?"rgba(99,102,241,.08)":"transparent", color:p.notes?"#a5b4fc":T.muted, cursor:"pointer", fontFamily:F.sans }}>
                          {p.notes?"✏️":"+ Note"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {/* Total row */}
                <tr style={{ background:"rgba(99,102,241,0.06)", borderTop:`1px solid rgba(99,102,241,.2)` }}>
                  <td colSpan={6} style={{ padding:"10px 8px", fontWeight:800, color:T.bright, fontSize:13 }}>PORTFOLIO TOTAL</td>
                  <td style={{ padding:"10px 8px", textAlign:"center", fontFamily:F.mono, fontWeight:900, fontSize:14, color:"#ef4444" }}>−${totalYr1.toFixed(1)}B</td>
                  <td style={{ padding:"10px 8px", textAlign:"center", fontFamily:F.mono, fontWeight:900, fontSize:14, color:"#ef4444" }}>−${totalYr2.toFixed(1)}B</td>
                  <td style={{ padding:"10px 8px", textAlign:"center", fontFamily:F.mono, fontWeight:900, fontSize:14, color:"#dc2626" }}>−${totalYr3.toFixed(1)}B</td>
                  <td/>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Note modal */}
          {noteTarget && (
            <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
              <Card style={{ width:400, zIndex:101 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.bright, marginBottom:10 }}>
                  📝 Note — {DRUGS.find(d=>d.id===noteTarget)?.drug}
                </div>
                <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={4} placeholder="Add assumption or note for this drug..."
                  style={{ width:"100%", padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}`, borderRadius:8, color:T.bright, fontSize:12, outline:"none", resize:"none", fontFamily:F.sans }}/>
                <div style={{ display:"flex", gap:8, marginTop:10, justifyContent:"flex-end" }}>
                  <button onClick={()=>setNoteTarget(null)} style={{ padding:"7px 16px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:7, color:T.muted, fontSize:11, cursor:"pointer", fontFamily:F.sans }}>Cancel</button>
                  <button onClick={()=>{updateParam(noteTarget,"notes",noteText);setNoteTarget(null);}}
                    style={{ padding:"7px 16px", background:"linear-gradient(135deg,#4338ca,#6366f1)", border:"none", borderRadius:7, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:F.sans }}>Save Note</button>
                </div>
              </Card>
            </div>
          )}

          {/* Waterfall preview */}
          <Card style={{ marginTop:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.bright, marginBottom:10 }}>Year 1 Impact Waterfall — {scen.name}</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={allImpacts.filter(x=>x.impact.yr1>0).sort((a,b)=>b.impact.yr1-a.impact.yr1)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.1)"/>
                <XAxis dataKey="drug.drug" tick={{fontSize:10,fill:T.muted}}/>
                <YAxis tick={{fontSize:10,fill:T.muted}} label={{value:"Yr1 Loss ($B)",angle:-90,position:"insideLeft",fontSize:9,fill:T.muted}}/>
                <Tooltip content={<CTip/>}/>
                <Bar dataKey="impact.yr1" name="Yr1 Loss $B" radius={[4,4,0,0]}>
                  {allImpacts.filter(x=>x.impact.yr1>0).sort((a,b)=>b.impact.yr1-a.impact.yr1).map((_,i)=>(
                    <Cell key={i} fill={["#ef4444","#f59e0b","#6366f1","#a78bfa","#14b8a6","#ff8c42","#10b981"][i%7]}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* ══ TAB: SENSITIVITY TABLE ══ */}
      {tab==="sensitivity" && (
        <div>
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Showing sensitivity for:</div>
            {DRUGS.map(d => (
              <button key={d.id} onClick={()=>setSensitivityDrug(d.id)}
                style={{ padding:"5px 14px", borderRadius:16, border:`1px solid ${sensitivityDrug===d.id?d.color:T.border}`,
                  background:sensitivityDrug===d.id?`${d.color}12`:"transparent",
                  color:sensitivityDrug===d.id?d.color:T.muted, fontSize:11, cursor:"pointer", fontFamily:F.sans, fontWeight:sensitivityDrug===d.id?700:400 }}>
                {d.drug}
              </button>
            ))}
          </div>

          {sd && (
            <>
              <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:10, background:`${sd.color}08`, border:`1px solid ${sd.color}20` }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.bright }}>{sd.drug} ({sd.mol}) — Year 1 Revenue Loss Sensitivity Matrix</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
                  Rows = launch delay months · Columns = number of competitors at LOE · Values = Yr1 revenue loss ($B)
                </div>
              </div>

              {/* Heat map table */}
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"2px" }}>
                  <thead>
                    <tr>
                      <th style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:T.muted, fontWeight:700 }}>Delay \ Competitors →</th>
                      {[1,2,3,4,5,6,7,8].map(c => (
                        <th key={c} style={{ padding:"8px 10px", textAlign:"center", fontSize:11, fontWeight:700, color:c===sd.comps?"#a5b4fc":T.muted }}>
                          {c} {c===sd.comps?<span style={{ fontSize:8, color:"#a5b4fc" }}>★</span>:""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityRows.map((row,ri) => (
                      <tr key={ri}>
                        <td style={{ padding:"8px 12px", fontSize:11, fontWeight:600, color:T.muted, whiteSpace:"nowrap" }}>{row.delay}</td>
                        {[1,2,3,4,5,6,7,8].map(c => {
                          const val = row[`c${c}`];
                          const max = Math.max(...sensitivityRows.flatMap(r=>[1,2,3,4,5,6,7,8].map(cc=>r[`c${cc}`])));
                          const min = Math.min(...sensitivityRows.flatMap(r=>[1,2,3,4,5,6,7,8].map(cc=>r[`c${cc}`])));
                          const pct = (val-min)/(max-min);
                          const bg = pct>0.7?"rgba(239,68,68,0.18)":pct>0.4?"rgba(245,158,11,0.15)":"rgba(16,185,129,0.12)";
                          const col = pct>0.7?"#ef4444":pct>0.4?"#f59e0b":"#10b981";
                          const isCurrent = ri===0 && c===sd.comps;
                          return (
                            <td key={c} style={{ padding:"10px 10px", textAlign:"center", background:bg, borderRadius:6, border:isCurrent?`2px solid ${col}`:"2px solid transparent" }}>
                              <div style={{ fontSize:13, fontWeight:900, color:col, fontFamily:F.mono }}>−${val}</div>
                              <div style={{ fontSize:8, color:T.muted }}>$B Yr1</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop:12, display:"flex", gap:16, flexWrap:"wrap" }}>
                {[["🟢 Low impact","rgba(16,185,129,0.12)","#10b981"],["🟡 Medium","rgba(245,158,11,0.15)","#f59e0b"],["🔴 High impact","rgba(239,68,68,0.18)","#ef4444"]].map(([l,bg,c],i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:14, height:14, borderRadius:3, background:bg, border:`1px solid ${c}` }}/>
                    <span style={{ fontSize:10, color:T.muted }}>{l}</span>
                  </div>
                ))}
                <div style={{ fontSize:10, color:T.muted }}>★ = current scenario assumption</div>
              </div>

              {/* Tornado chart */}
              <Card style={{ marginTop:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.bright, marginBottom:10 }}>Key Driver Sensitivity — {sd.drug}</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart layout="vertical"
                    data={[
                      { driver:"Competitors (+2)", low:allImpacts.find(x=>x.drug.id===sd.id)?.impact.yr1||0, high:calcImpact(sd,[{...scen.params.find(p=>p.id===sd.id),comps:(scen.params.find(p=>p.id===sd.id)?.comps||3)+2}]).yr1 },
                      { driver:"Interchangeable", low:allImpacts.find(x=>x.drug.id===sd.id)?.impact.yr1||0, high:calcImpact(sd,[{...scen.params.find(p=>p.id===sd.id),interch:true}]).yr1 },
                      { driver:"No Launch Delay", low:calcImpact(sd,[{...scen.params.find(p=>p.id===sd.id),delay:12}]).yr1, high:allImpacts.find(x=>x.drug.id===sd.id)?.impact.yr1||0 },
                    ]}
                    margin={{ left:100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.1)"/>
                    <XAxis type="number" tick={{fontSize:10,fill:T.muted}} label={{value:"Yr1 Loss ($B)",position:"insideBottom",fontSize:9,fill:T.muted}}/>
                    <YAxis type="category" dataKey="driver" tick={{fontSize:10,fill:T.muted}} width={100}/>
                    <Tooltip content={<CTip/>}/>
                    <Bar dataKey="low"  stackId="a" fill="rgba(99,102,241,0.3)"  name="Base" radius={[0,0,0,0]}/>
                    <Bar dataKey="high" stackId="a" fill="rgba(239,68,68,0.5)"  name="Stressed" radius={[0,4,4,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </div>
      )}

      {/* ══ TAB: SCENARIO COMPARE ══ */}
      {tab==="compare" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card>
              <div style={{ fontSize:12, fontWeight:700, color:T.bright, marginBottom:10 }}>Year 1 Loss by Scenario</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={compData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.1)"/>
                  <XAxis dataKey="name" tick={{fontSize:11,fill:T.muted}}/>
                  <YAxis tick={{fontSize:10,fill:T.muted}}/>
                  <Tooltip content={<CTip/>}/>
                  <Bar dataKey="yr1" name="Yr1 Loss $B" radius={[4,4,0,0]}>
                    {compData.map((s,i)=><Cell key={i} fill={s.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{ fontSize:12, fontWeight:700, color:T.bright, marginBottom:10 }}>3-Year Revenue Loss Trajectory</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[{y:"Yr1"},{y:"Yr2"},{y:"Yr3"}].map((r,ri) => ({
                  ...r, ...Object.fromEntries(scenarios.map(s=>[s.name,[compData.find(c=>c.name===s.name)?.yr1,compData.find(c=>c.name===s.name)?.yr2,compData.find(c=>c.name===s.name)?.yr3][ri]]))
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.1)"/>
                  <XAxis dataKey="y" tick={{fontSize:10,fill:T.muted}}/>
                  <YAxis tick={{fontSize:10,fill:T.muted}}/>
                  <Tooltip content={<CTip/>}/>
                  {scenarios.map(s=><Line key={s.id} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2} dot={{r:4,fill:s.color}} name={s.name}/>)}
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card>
            <div style={{ fontSize:12, fontWeight:700, color:T.bright, marginBottom:12 }}>Scenario Side-by-Side Comparison</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                <thead>
                  <tr>
                    <th style={{ padding:"8px 10px", textAlign:"left", color:T.muted, fontWeight:600, fontSize:10, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>Drug</th>
                    {scenarios.map(s=>(
                      <th key={s.id} colSpan={2} style={{ padding:"8px 10px", textAlign:"center", color:s.color, fontWeight:700, fontSize:10, textTransform:"uppercase", borderBottom:`2px solid ${s.color}` }}>{s.name}</th>
                    ))}
                  </tr>
                  <tr>
                    <th style={{ padding:"4px 10px 8px", borderBottom:`1px solid ${T.border}` }}/>
                    {scenarios.map(s=>[
                      <th key={`${s.id}-e`} style={{ padding:"4px 6px 8px", textAlign:"center", fontSize:9, color:T.muted, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>Erosion</th>,
                      <th key={`${s.id}-y1`} style={{ padding:"4px 6px 8px", textAlign:"center", fontSize:9, color:T.muted, fontWeight:600, borderBottom:`1px solid ${T.border}` }}>Yr1 Loss</th>
                    ])}
                  </tr>
                </thead>
                <tbody>
                  {DRUGS.map((d,di)=>(
                    <tr key={d.id} style={{ background:di%2===0?"rgba(255,255,255,0.01)":"transparent" }}>
                      <td style={{ padding:"8px 10px", fontWeight:600, color:T.bright }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <div style={{ width:6, height:6, borderRadius:3, background:d.color }}/>
                          {d.drug}
                        </div>
                      </td>
                      {scenarios.map(s=>{
                        const imp = calcImpact(d,s.params);
                        return [
                          <td key={`${s.id}-e`} style={{ padding:"8px 6px", textAlign:"center", fontFamily:F.mono, fontWeight:700, color:imp.erosion24>60?"#ef4444":imp.erosion24>40?"#f59e0b":"#10b981" }}>{imp.erosion24}%</td>,
                          <td key={`${s.id}-y1`} style={{ padding:"8px 6px", textAlign:"center", fontFamily:F.mono, color:"#ef4444", fontWeight:600 }}>−${imp.yr1}B</td>,
                        ];
                      })}
                    </tr>
                  ))}
                  <tr style={{ background:"rgba(99,102,241,0.08)" }}>
                    <td style={{ padding:"10px 10px", fontWeight:800, color:T.bright, fontSize:12 }}>TOTAL</td>
                    {scenarios.map(s=>{
                      const y1=DRUGS.reduce((a,d)=>a+calcImpact(d,s.params).yr1,0);
                      return [
                        <td key={`${s.id}-e`}/>,
                        <td key={`${s.id}-y1`} style={{ padding:"10px 6px", textAlign:"center", fontFamily:F.mono, color:s.color, fontWeight:900, fontSize:13 }}>−${y1.toFixed(1)}B</td>
                      ];
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══ TAB: AUDIT TRAIL ══ */}
      {tab==="audit" && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.bright }}>Assumption Audit Trail — {scen.name}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>Every parameter change is logged with user and timestamp</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <div style={{ fontSize:10, color:T.muted, padding:"4px 10px", borderRadius:6, background:"rgba(255,255,255,0.03)", border:`1px solid ${T.border}` }}>
                {scen.collaborators.join(", ")} · {scen.audit.length} entries
              </div>
            </div>
          </div>

          {scen.audit.map((a,i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 14px", borderRadius:8, background:T.card, border:`1px solid ${T.border}`, marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:i===0?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>
                {i===0?"✏️":"👤"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:700, color:T.bright }}>{a.by}</span>
                  <span style={{ fontSize:10, color:T.muted, fontFamily:F.mono }}>{a.at}</span>
                  {i===0 && <Pill label="LATEST" color="#6366f1"/>}
                </div>
                <div style={{ fontSize:11, color:T.text, marginTop:2 }}>{a.action}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop:16, padding:"14px 16px", borderRadius:10, background:"rgba(99,102,241,0.04)", border:"1px solid rgba(99,102,241,0.12)" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#a99fff", marginBottom:4 }}>📋 Collaboration Features</div>
            <div style={{ fontSize:11, color:T.text, lineHeight:1.8 }}>
              In production: team members can add named assumptions, annotate cells with citation URLs, and tag approvers for sign-off before board submission. Version history allows rollback to any prior state. Changes sync in real-time across sessions. <span style={{ color:T.muted }}>Available in Enterprise tier.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP — DUAL MODULE SWITCHER
   ═══════════════════════════════════════════════════════ */
export default function EnterpriseModules() {
  const [module, setModule] = useState("brief");
  const [profile, setProfile] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:F.sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:wght@700;800;900&display=swap');
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes ping    { 0%,100%{opacity:.25;transform:scale(1)} 60%{opacity:.5;transform:scale(2)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#4338ca #060a12}
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:#060a12} ::-webkit-scrollbar-thumb{background:#4338ca;border-radius:2px}
        .skeleton{background:linear-gradient(90deg,rgba(99,102,241,.04) 25%,rgba(99,102,241,.1) 50%,rgba(99,102,241,.04) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite}
        input,select,textarea,button{font-family:inherit}
        input[type=range]{height:4px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,.08);border-radius:2px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#6366f1;cursor:pointer;border:2px solid #060a12}
        select{background:rgba(9,13,24,.98);color:#eef0f6;border:1px solid rgba(60,75,120,.18);border-radius:8px;padding:8px 12px;font-size:12px;outline:none;cursor:pointer}
        select option{background:#0a0e1a}
        a{color:#818cf8;text-decoration:none} a:hover{opacity:.8}
      `}</style>

      {/* ── TOP NAV ── */}
      <div style={{ padding:"10px 24px", background:"rgba(5,8,15,.99)", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#4338ca,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🧬</div>
          <div style={{ fontSize:13, fontWeight:800, color:T.bright, letterSpacing:.2 }}>PatentCliff AI</div>
          <div style={{ fontSize:10, color:T.muted, padding:"2px 8px", borderRadius:4, background:"rgba(255,255,255,.03)", border:`1px solid ${T.border}` }}>Enterprise</div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[
            { k:"brief", l:"📧 Morning Brief", desc:"Suggestion #2" },
            { k:"wargame", l:"⚔️ Board War Game", desc:"Suggestion #5" },
          ].map(m => (
            <div key={m.k} style={{ textAlign:"center" }}>
              <button onClick={()=>setModule(m.k)}
                style={{ padding:"7px 18px", border:`1px solid ${module===m.k?T.accent:T.border}`, background:module===m.k?"rgba(99,102,241,.1)":"transparent",
                  borderRadius:8, color:module===m.k?"#a5b4fc":T.muted, fontSize:12, fontWeight:module===m.k?700:400, cursor:"pointer", fontFamily:F.sans }}>
                {m.l}
              </button>
              <div style={{ fontSize:8, color:T.dim, marginTop:2 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding:"20px 24px" }}>
        {module==="brief" && (
          !profile
            ? <ProfileSetup onSave={setProfile}/>
            : <div>
                <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
                  <button onClick={()=>setProfile(null)}
                    style={{ fontSize:10, padding:"4px 12px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:6, color:T.muted, cursor:"pointer", fontFamily:F.sans }}>
                    ← Change profile
                  </button>
                </div>
                <MorningBrief profile={profile}/>
              </div>
        )}
        {module==="wargame" && <BoardWarGame/>}
      </div>
    </div>
  );
}
