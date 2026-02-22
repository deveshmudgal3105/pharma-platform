import { useState, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  T, sigColor, phasePct, daysUntil, fmtDays, SIGNAL_SOURCES,
  HISTORICAL_LOE, PRICE_EROSION_BY_PLAYERS, EROSION_BY_THERAPY, BASE_EROSION,
  PROJECTIONS, PIPELINE, BATTLE_CARDS, ALERTS, REG_FILINGS, LITIGATION
} from "./data";

// ═══════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(10,15,28,0.95)", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 11, fontFamily: T.font }}>
      <div style={{ color: T.bright, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill, marginTop: 2 }}>
          {p.name}: <strong>{typeof p.value === 'number' ? (p.value % 1 !== 0 ? p.value.toFixed(1) : p.value) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function Link({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, textDecoration: "none", background: "rgba(88,80,236,0.08)", color: T.primary2, border: `1px solid rgba(88,80,236,0.15)`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap", transition: "all 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(88,80,236,0.22)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(88,80,236,0.08)"; }}>
      {label}<span style={{ fontSize: 7, opacity: .6 }}>↗</span>
    </a>
  );
}

function Badge({ signal }) {
  const c = sigColor(signal);
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 16, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, background: c.bg, color: c.text, border: `1px solid ${c.brd}` }}>{signal}</span>;
}

function PhaseBar({ phase }) {
  const p = phasePct(phase);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 150 }}>
      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", borderRadius: 3, background: phase === "Launched" ? `linear-gradient(90deg,${T.accent},#00e4bb)` : `linear-gradient(90deg,${T.primary},${T.primary2})`, transition: "width 0.6s" }} />
      </div>
      <span style={{ fontSize: 10, color: T.primary2, fontWeight: 500, whiteSpace: "nowrap" }}>{phase}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 1: HISTORICAL LOE ANALYTICS
// ═══════════════════════════════════════════════════════════

function HistoricalTab() {
  const [selected, setSelected] = useState(0);
  const d = HISTORICAL_LOE[selected];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>Select Historical LoE Case Study</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {HISTORICAL_LOE.map((h, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${i === selected ? T.primary : T.border}`, background: i === selected ? T.glow : T.glass, color: i === selected ? T.primary2 : T.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{h.drug}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
        {[
          { l: "Peak Revenue", v: `$${d.peakRevenue}B`, c: T.primary },
          { l: "Current Revenue", v: `$${d.currentRevenue}B`, c: d.currentRevenue < d.peakRevenue / 2 ? T.danger : T.warn },
          { l: "Revenue Erosion", v: `${Math.round((1 - d.currentRevenue / d.peakRevenue) * 100)}%`, c: T.danger },
          { l: "Players at LOE", v: d.playersAtLOE, c: T.accent },
          { l: "Players Now", v: d.playersNow, c: T.warn },
          { l: "Type", v: d.type, c: T.primary2 },
        ].map((s, i) => (
          <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${s.c}` }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8 }}>{s.l}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.c, marginTop: 2, fontFamily: T.mono }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Market Share Shift Post-LOE</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={d.marketShareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: T.muted }} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} domain={[0, 100]} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="originator" stackId="1" stroke={T.primary} fill={`${T.primary}30`} name="Originator %" />
              <Area type="monotone" dataKey="biosimilars" stackId="1" stroke={T.accent} fill={`${T.accent}30`} name="Biosimilar %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Price Erosion Curve</div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={d.priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: T.muted }} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} domain={[0, 100]} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="price" stroke={T.primary} fill={`${T.primary}15`} name="Price Index" />
              <Line type="monotone" dataKey="discount" stroke={T.danger} strokeWidth={2} dot={{ r: 3 }} name="Discount %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: `${T.primary}08`, border: `1px solid ${T.primary}18`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.primary2, marginBottom: 4 }}>📡 KEY INTELLIGENCE INSIGHT</div>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.6 }}>{d.keyInsight}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <Link label="FDA Drug Data" url={d.links.fdaLabel} />
          <Link label="IQVIA Market Data" url={d.links.iqvia} />
          <Link label="SEC Filings" url={d.links.sec} />
          <Link label="PubMed" url={`https://pubmed.ncbi.nlm.nih.gov/?term=${d.molecule}+biosimilar`} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Price Erosion vs. # Competitors</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PRICE_EROSION_BY_PLAYERS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
              <XAxis dataKey="players" tick={{ fontSize: 10, fill: T.muted }} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} domain={[0, 100]} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="yr1Erosion" fill={T.primary} name="Yr 1 %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="yr2Erosion" fill={T.warn} name="Yr 2 %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="yr3Erosion" fill={T.danger} name="Yr 3 %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Erosion Speed by Therapy Area</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={EROSION_BY_THERAPY} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: T.muted }} domain={[0, 100]} />
              <YAxis type="category" dataKey="area" tick={{ fontSize: 10, fill: T.muted }} width={85} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="avgErosion24m" fill={T.primary} name="Price Erosion %" radius={[0, 4, 4, 0]} />
              <Bar dataKey="avgShareShift24m" fill={T.accent} name="Share Shift %" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 2: PROJECTIONS
// ═══════════════════════════════════════════════════════════

function ProjectionsTab() {
  const [sel, setSel] = useState(0);
  const p = PROJECTIONS[sel];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.muted, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>Select Upcoming LoE for Projection</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PROJECTIONS.map((pr, i) => (
            <button key={i} onClick={() => setSel(i)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${i === sel ? T.primary : T.border}`, background: i === sel ? T.glow : T.glass, color: i === sel ? T.primary2 : T.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{pr.drug} ({pr.loeYear})</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { l: "Current Revenue", v: `$${p.revenue}B`, c: T.primary },
          { l: "LOE Year", v: p.loeYear, c: T.warn },
          { l: "Expected Competitors", v: p.players, c: T.accent },
          { l: "Therapy Area", v: p.therapyArea, c: T.primary2 },
          { l: "Type", v: p.type, c: "#c084fc" },
          { l: "Projected Yr3 Price", v: `${p.projection[p.projection.length - 1].price}%`, c: T.danger },
        ].map((s, i) => (
          <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${s.c}` }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: "uppercase" }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.c, marginTop: 2, fontFamily: T.mono }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Revenue Projection ($B)</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={p.projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: T.muted }} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="origRev" stackId="1" stroke={T.primary} fill={`${T.primary}30`} name="Originator $B" />
              <Area type="monotone" dataKey="biosimRev" stackId="1" stroke={T.accent} fill={`${T.accent}30`} name="Biosimilar $B" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Price Index Projection</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={p.projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: T.muted }} />
              <YAxis tick={{ fontSize: 10, fill: T.muted }} domain={[0, 110]} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="price" stroke={T.danger} strokeWidth={3} dot={{ r: 5, fill: T.danger }} name="Price Index %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Total Market Trajectory ($B)</div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={p.projection}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: T.muted }} />
            <YAxis tick={{ fontSize: 10, fill: T.muted }} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="totalMarket" fill={`${T.primary}25`} stroke={T.primary} name="Total Market $B" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="totalMarket" stroke={T.warn} strokeWidth={2} dot={{ r: 4 }} name="Trend" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 3: PIPELINE INTELLIGENCE
// ═══════════════════════════════════════════════════════════

function PipelineTab() {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = PIPELINE.filter(d => {
    const t = search.toLowerCase();
    return !t || d.drug.toLowerCase().includes(t) || d.molecule.toLowerCase().includes(t) || d.originator.toLowerCase().includes(t) || d.competitors.some(c => c.company.toLowerCase().includes(t));
  });

  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drug, molecule, company..."
        style={{ width: "100%", maxWidth: 400, padding: "9px 14px", background: T.glass, border: `1px solid ${T.border}`, borderRadius: 8, color: T.bright, fontSize: 12, outline: "none", fontFamily: T.font, marginBottom: 16 }}
        onFocus={e => e.target.style.borderColor = T.primary} onBlur={e => e.target.style.borderColor = T.border} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(drug => {
          const days = daysUntil(drug.patentExpiry); const exp = days < 0; const urg = days >= 0 && days < 365;
          return (
            <div key={drug.id} style={{ background: T.card, border: `1px solid ${exp ? `${T.accent}30` : urg ? `${T.warn}30` : T.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div onClick={() => setExpanded(expanded === drug.id ? null : drug.id)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, borderBottom: expanded === drug.id ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: exp ? "linear-gradient(135deg,#064e3b,#065f46)" : `linear-gradient(135deg,#2d2570,#4338ca)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: exp ? T.accent : T.primary2, flexShrink: 0 }}>{drug.drug.substring(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: T.bright }}>{drug.drug}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>{drug.molecule}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: T.glow, color: T.primary2, fontWeight: 600 }}>{drug.indication}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2, display: "flex", gap: 12 }}>
                    <span>{drug.originator}</span><span>Rev: {drug.revenue}</span>
                    <span style={{ color: exp ? T.accent : urg ? T.warn : T.muted }}>{exp ? "EXPIRED" : `LOE: ${fmtDays(days)}`}</span>
                  </div>
                </div>
                <div style={{ background: T.glow, borderRadius: 16, padding: "3px 10px", fontSize: 11, color: T.primary2, fontWeight: 600 }}>{drug.competitors.length} comp.</div>
                <svg width="14" height="14" viewBox="0 0 16 16" style={{ transform: expanded === drug.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: T.muted }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
              </div>
              {expanded === drug.id && (
                <div style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, lineHeight: "22px", marginRight: 4 }}>Quick Links:</span>
                    <Link label="FDA Label" url="https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm" />
                    <Link label="Orange Book" url="https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm" />
                    <Link label="ClinicalTrials" url={`https://clinicaltrials.gov/search?term=${drug.molecule}`} />
                    <Link label="Patents" url={`https://patents.google.com/?q=${drug.molecule}`} />
                    <Link label="PubMed" url={`https://pubmed.ncbi.nlm.nih.gov/?term=${drug.molecule}`} />
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px" }}>
                      <thead><tr style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>
                        <th style={{ textAlign: "left", padding: "0 6px 6px", fontWeight: 600 }}>Company</th>
                        <th style={{ textAlign: "left", padding: "0 6px 6px", fontWeight: 600 }}>Molecule</th>
                        <th style={{ textAlign: "left", padding: "0 6px 6px", fontWeight: 600, minWidth: 160 }}>Development</th>
                        <th style={{ textAlign: "left", padding: "0 6px 6px", fontWeight: 600 }}>Signal</th>
                        <th style={{ textAlign: "left", padding: "0 6px 6px", fontWeight: 600 }}>Est. Launch</th>
                        <th style={{ textAlign: "left", padding: "0 6px 6px", fontWeight: 600 }}>Sources</th>
                      </tr></thead>
                      <tbody>{drug.competitors.map((c, i) => (
                        <tr key={i} style={{ background: "rgba(255,255,255,0.015)" }}>
                          <td style={{ padding: "8px 6px", color: T.bright, fontSize: 12, fontWeight: 600, borderRadius: "6px 0 0 6px" }}>{c.company}</td>
                          <td style={{ padding: "8px 6px", color: T.muted, fontSize: 11, fontFamily: T.mono }}>{c.molecule}</td>
                          <td style={{ padding: "8px 6px" }}><PhaseBar phase={c.phase} /></td>
                          <td style={{ padding: "8px 6px" }}><Badge signal={c.signal} /></td>
                          <td style={{ padding: "8px 6px", color: T.text, fontSize: 11 }}>{c.estLaunch}</td>
                          <td style={{ padding: "8px 6px", borderRadius: "0 6px 6px 0" }}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{c.sources.map((s, j) => <Link key={j} label={s.label} url={s.url} />)}</div></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 4: COMPETITIVE WAR ROOM
// ═══════════════════════════════════════════════════════════

function WarRoom() {
  const [activeDrug, setActiveDrug] = useState("Keytruda");
  const bc = BATTLE_CARDS[activeDrug];
  const riskColor = r => r === "CRITICAL" ? T.danger : r === "HIGH" ? T.rose : r === "MED" ? T.warn : T.emerald;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {Object.keys(BATTLE_CARDS).map(d => (
          <button key={d} onClick={() => setActiveDrug(d)} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${d === activeDrug ? T.primary : T.border}`, background: d === activeDrug ? T.glow : T.glass, color: d === activeDrug ? T.primary2 : T.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{d}</button>
        ))}
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: T.primary2, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>Originator Defense Profile</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.bright, marginTop: 4 }}>{bc.originator.company} — {activeDrug}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
              {[["Revenue", bc.originator.revenue], ["Market Cap", bc.originator.marketCap], ["R&D", bc.originator.rndSpend], ["LOE", bc.originator.loeDate]].map(([l, v], i) =>
                <div key={i}><span style={{ fontSize: 10, color: T.muted }}>{l}: </span><span style={{ fontSize: 13, color: T.bright, fontWeight: 700, fontFamily: T.mono }}>{v}</span></div>
              )}
            </div>
            <div style={{ marginTop: 10, padding: "8px 14px", background: T.glow, border: `1px solid ${T.primary}18`, borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: T.primary2, fontWeight: 700 }}>DEFENSE: </span>
              <span style={{ fontSize: 12, color: T.text }}>{bc.originator.defenseStrategy}</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${bc.originator.strengthScore > 75 ? T.emerald : bc.originator.strengthScore > 50 ? T.warn : T.danger}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: T.mono, color: T.bright }}>{bc.originator.strengthScore}</div>
              <div style={{ fontSize: 8, color: T.muted, textTransform: "uppercase" }}>Defense</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bc.threats.map((t, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px", borderLeft: `3px solid ${riskColor(t.riskLevel)}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.bright }}>{t.company}</div>
                <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: `${riskColor(t.riskLevel)}18`, color: riskColor(t.riskLevel) }}>{t.riskLevel} RISK</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[["Readiness", `${t.readiness}%`], ["Pricing", t.pricing], ["Channel", t.channel], ["Timeline", t.timeline]].map(([l, v], j) =>
                  <div key={j}><div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 11, color: T.text, fontWeight: 600, marginTop: 2 }}>{v}</div></div>
                )}
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                <div><div style={{ fontSize: 9, color: T.emerald, fontWeight: 700 }}>STRENGTHS</div>{t.strengths.map((s, j) => <div key={j} style={{ fontSize: 10, color: T.text, marginTop: 2 }}>+ {s}</div>)}</div>
                <div><div style={{ fontSize: 9, color: T.danger, fontWeight: 700 }}>WEAKNESSES</div>{t.weaknesses.map((w, j) => <div key={j} style={{ fontSize: 10, color: T.text, marginTop: 2 }}>− {w}</div>)}</div>
              </div>
              <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: T.primary2, textDecoration: "none" }}>View source ↗</a>
            </div>
          ))}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 8 }}>Originator vs Top Threat</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={bc.radarData}>
              <PolarGrid stroke="rgba(65,75,110,0.2)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: T.muted }} />
              <PolarRadiusAxis tick={{ fontSize: 8, fill: T.muted }} domain={[0, 100]} />
              <Radar name="Originator" dataKey="originator" stroke={T.primary} fill={T.primary} fillOpacity={0.15} />
              <Radar name="Top Threat" dataKey="topThreat" stroke={T.danger} fill={T.danger} fillOpacity={0.1} />
              <Tooltip content={<Tip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 5: FINANCIAL SIMULATOR
// ═══════════════════════════════════════════════════════════

function Simulator() {
  const [competitors, setCompetitors] = useState(3);
  const [interchangeable, setInterchangeable] = useState(true);
  const [therapy, setTherapy] = useState("Oncology");
  const [revenue, setRevenue] = useState(10);
  const [is340B, setIs340B] = useState(true);

  const compMult = Math.min(1.4, 0.6 + competitors * 0.16);
  const intMult = interchangeable ? 1.25 : 1.0;
  const b340Mult = is340B ? 1.12 : 1.0;
  const erosion24 = Math.min(0.92, BASE_EROSION[therapy] * compMult * intMult * b340Mult);

  const projData = [
    { year: "Pre-LOE", origRev: revenue, biosimRev: 0, price: 100 },
    { year: "Year 1", origRev: +(revenue * (1 - erosion24 * 0.45)).toFixed(1), biosimRev: +(revenue * erosion24 * 0.2).toFixed(1), price: +(100 * (1 - erosion24 * 0.5)).toFixed(0) },
    { year: "Year 2", origRev: +(revenue * (1 - erosion24 * 0.75)).toFixed(1), biosimRev: +(revenue * erosion24 * 0.4).toFixed(1), price: +(100 * (1 - erosion24 * 0.8)).toFixed(0) },
    { year: "Year 3", origRev: +(revenue * (1 - erosion24 * 0.92)).toFixed(1), biosimRev: +(revenue * erosion24 * 0.5).toFixed(1), price: +(100 * (1 - erosion24 * 0.95)).toFixed(0) },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.bright, marginBottom: 16 }}>🎛️ Scenario Parameters</div>
          {[{ label: "Pre-LOE Revenue ($B)", val: revenue, set: setRevenue, min: 1, max: 30, step: 0.5 }, { label: `Competitors at Launch`, val: competitors, set: setCompetitors, min: 1, max: 8, step: 1 }].map((s, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6 }}>{s.label}: <span style={{ color: T.primary2, fontFamily: T.mono }}>{s.val}</span></div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e => s.set(+e.target.value)} style={{ width: "100%", accentColor: T.primary }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 6 }}>Therapy Area</div>
            <select value={therapy} onChange={e => setTherapy(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: T.glass, border: `1px solid ${T.border}`, borderRadius: 6, color: T.bright, fontSize: 12 }}>
              {Object.keys(BASE_EROSION).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {[{ label: "Interchangeable / Auto-Substitute", val: interchangeable, set: setInterchangeable }, { label: "Significant 340B Exposure", val: is340B, set: setIs340B }].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div onClick={() => s.set(!s.val)} style={{ width: 36, height: 20, borderRadius: 10, background: s.val ? T.primary : "rgba(255,255,255,0.08)", cursor: "pointer", position: "relative" }}>
                <div style={{ width: 16, height: 16, borderRadius: 8, background: T.bright, position: "absolute", top: 2, left: s.val ? 18 : 2, transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 11, color: T.text }}>{s.label}</span>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "12px 14px", background: `${T.danger}10`, border: `1px solid ${T.danger}25`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: T.danger, fontWeight: 700 }}>PROJECTED 24M EROSION</div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: T.mono, color: T.danger }}>{(erosion24 * 100).toFixed(0)}%</div>
            <div style={{ fontSize: 10, color: T.muted }}>Revenue at risk: <strong style={{ color: T.danger }}>${(revenue * erosion24).toFixed(1)}B</strong></div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Revenue Transfer ($B)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={projData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" /><XAxis dataKey="year" tick={{ fontSize: 10, fill: T.muted }} /><YAxis tick={{ fontSize: 10, fill: T.muted }} /><Tooltip content={<Tip />} /><Area type="monotone" dataKey="origRev" stackId="1" stroke={T.primary} fill={`${T.primary}30`} name="Originator $B" /><Area type="monotone" dataKey="biosimRev" stackId="1" stroke={T.accent} fill={`${T.accent}30`} name="Biosimilar $B" /></AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Price Decline (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={projData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(65,75,110,0.15)" /><XAxis dataKey="year" tick={{ fontSize: 10, fill: T.muted }} /><YAxis tick={{ fontSize: 10, fill: T.muted }} domain={[0, 110]} /><Tooltip content={<Tip />} /><Line type="monotone" dataKey="price" stroke={T.danger} strokeWidth={3} dot={{ r: 5, fill: T.danger }} name="Price %" /></LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 12 }}>Sensitivity Matrix — Erosion % by Competitors × Therapy</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 4 }}>
                <thead><tr><th style={{ padding: 8, fontSize: 10, color: T.muted, textAlign: "left" }}>Area ↓ Comp →</th>{[1, 2, 3, 4, "5+"].map(c => <th key={c} style={{ padding: 8, fontSize: 10, color: T.muted, textAlign: "center" }}>{c}</th>)}</tr></thead>
                <tbody>{Object.entries(BASE_EROSION).map(([area, base]) => (
                  <tr key={area}><td style={{ padding: 8, fontSize: 11, color: T.bright, fontWeight: 600 }}>{area}</td>
                    {[1, 2, 3, 4, 5].map(c => {
                      const e = Math.min(92, Math.round(base * (0.6 + c * 0.16) * 100));
                      return <td key={c} style={{ padding: 8, textAlign: "center", borderRadius: 6, background: e > 70 ? `${T.danger}12` : e > 50 ? `${T.warn}12` : `${T.emerald}12` }}>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: T.mono, color: e > 70 ? T.danger : e > 50 ? T.warn : T.emerald }}>{e}%</div>
                        <div style={{ fontSize: 9, color: T.muted }}>${(revenue * e / 100).toFixed(1)}B</div>
                      </td>;
                    })}</tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 6: EARLY WARNING SYSTEM
// ═══════════════════════════════════════════════════════════

function EarlyWarning() {
  const sevColor = s => ({ CRITICAL: T.danger, HIGH: T.rose, MEDIUM: T.warn, LOW: T.cyan, INFO: T.muted }[s] || T.muted);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[["CRITICAL", ALERTS.filter(a => a.severity === "CRITICAL").length, T.danger], ["HIGH", ALERTS.filter(a => a.severity === "HIGH").length, T.rose], ["MEDIUM", ALERTS.filter(a => a.severity === "MEDIUM").length, T.warn], ["LOW/INFO", ALERTS.filter(a => a.severity === "LOW" || a.severity === "INFO").length, T.cyan]].map(([l, v, c], i) =>
          <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${c}` }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, textTransform: "uppercase" }}>{l} Alerts</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: T.mono, color: c }}>{v}</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ALERTS.map((a, i) => (
          <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 18px", borderLeft: `3px solid ${sevColor(a.severity)}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 700, background: `${sevColor(a.severity)}15`, color: sevColor(a.severity) }}>{a.severity}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.bright }}>{a.drug}</span>
                <span style={{ fontSize: 10, color: T.muted }}>{a.time}</span>
              </div>
              <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: T.primary2, textDecoration: "none", padding: "3px 8px", background: T.glow, borderRadius: 6 }}>{a.source} ↗</a>
            </div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5, marginBottom: 6 }}>{a.event}</div>
            <div style={{ fontSize: 11, color: T.muted, padding: "6px 10px", background: T.glass, borderRadius: 6 }}>
              <span style={{ color: T.warn, fontWeight: 700, fontSize: 10 }}>IMPACT: </span>{a.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 7: REGULATORY & LITIGATION
// ═══════════════════════════════════════════════════════════

function RegulatoryTab() {
  const statusColor = s => s.includes("✓") ? T.emerald : s.includes("●") ? T.primary2 : s.includes("◐") ? T.warn : T.muted;
  return (
    <div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, overflowX: "auto", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.bright, marginBottom: 14 }}>Global Regulatory Filing Tracker</div>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
          <thead><tr style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" }}>
            <th style={{ textAlign: "left", padding: 8 }}>Drug</th><th style={{ textAlign: "left", padding: 8 }}>Developer</th>
            {["🇺🇸 FDA", "🇪🇺 EMA", "🇨🇳 NMPA", "🇨🇦 HC", "🇯🇵 PMDA", "🇦🇺 TGA"].map(h => <th key={h} style={{ textAlign: "center", padding: 8 }}>{h}</th>)}
          </tr></thead>
          <tbody>{REG_FILINGS.map((f, i) => (
            <tr key={i} style={{ background: "rgba(255,255,255,0.015)" }}>
              <td style={{ padding: 10, color: T.bright, fontSize: 12, fontWeight: 600, borderRadius: "6px 0 0 6px" }}>{f.drug}</td>
              <td style={{ padding: 10, color: T.text, fontSize: 11 }}>{f.company}</td>
              {[f.fda, f.ema, f.nmpa, f.hc, f.pmda, f.tga].map((s, j) => <td key={j} style={{ padding: 10, textAlign: "center" }}><span style={{ fontSize: 10, fontWeight: 600, color: statusColor(s) }}>{s}</span></td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.bright, marginBottom: 14 }}>Patent Litigation Monitor</div>
        {LITIGATION.map((c, i) => (
          <div key={i} style={{ padding: "10px 14px", background: T.glass, borderRadius: 8, marginBottom: 8, border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.bright }}>{c.case}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{c.court} • Deadline: {c.deadline} • Risk to: <span style={{ color: T.warn }}>{c.riskTo}</span></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: c.status === "Settled" ? `${T.emerald}15` : `${T.warn}12`, color: c.status === "Settled" ? T.emerald : T.warn, fontWeight: 600 }}>{c.status}</span>
              <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: T.primary2, textDecoration: "none" }}>PACER ↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 8: STRATEGY
// ═══════════════════════════════════════════════════════════

function StrategyTab() {
  const recs = [
    { who: "Originator / Innovator", icon: "🏢", color: T.primary, items: [
      { title: "Lifecycle Management", desc: "File next-gen formulations 3-5 years pre-LOE. Historical data shows 20-35% patient retention on next-gen vs. biosimilar switch.", link: "https://www.fda.gov/drugs/biosimilars/biosimilar-product-information" },
      { title: "Authorized Biosimilar Strategy", desc: "Launch own authorized biosimilar pre-LOE to control price erosion. AbbVie's Hadlima partnership preserved $2B+ value.", link: "https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm" },
      { title: "Contracting & Payer Lock-in", desc: "Negotiate multi-year PBM contracts with rebate structures creating switching costs. Start 24 months pre-LOE.", link: "https://www.cms.gov/medicare/payment" },
    ]},
    { who: "Biosimilar / Generic Developer", icon: "⚗️", color: T.accent, items: [
      { title: "Day-1 Readiness", desc: "Neulasta shows first 3 entrants capture 70% of biosimilar share. Manufacturing at-risk prep 18 months before LOE is critical.", link: "https://www.iqvia.com" },
      { title: "Interchangeability", desc: "FDA interchangeable designation enables pharmacy substitution. Humira data shows 2.5x faster uptake.", link: "https://purplebooksearch.fda.gov" },
      { title: "340B Targeting", desc: "Target 340B entities and hospital systems first. Retail pharmacy follows 6-12 months later via PBM formulary wins.", link: "https://www.hrsa.gov/opa" },
    ]},
    { who: "Payer / Health System", icon: "🏥", color: T.warn, items: [
      { title: "Formulary Planning", desc: "Build biosimilar-preferred formularies 12 months pre-LOE. Our data shows 15-25% cost reduction in year 1.", link: "https://www.cms.gov/data-research" },
      { title: "Gainsharing", desc: "Shared savings with prescribers for biosimilar adoption drives 40-60% faster uptake.", link: "https://www.cms.gov/medicare/payment" },
    ]},
    { who: "Investor / Analyst", icon: "📈", color: T.danger, items: [
      { title: "LOE Exposure Scoring", desc: "Portfolios with >30% revenue at risk within 3 years underperform sector by 800-1200bps.", link: "https://www.sec.gov/edgar" },
      { title: "Signal-Based Trading", desc: "Patent challenges and trial registrations precede formal announcements by 6-12 months.", link: "https://www.courtlistener.com" },
    ]},
  ];

  return (
    <div>
      {recs.map((r, i) => (
        <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>{r.icon}</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: r.color }}>For {r.who}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {r.items.map((item, j) => (
              <div key={j} style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", borderTop: `2px solid ${r.color}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.bright, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: T.text, lineHeight: 1.65, marginBottom: 10 }}>{item.desc}</div>
                <Link label="View Source ↗" url={item.link} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE 9: EXECUTIVE BRIEFING
// ═══════════════════════════════════════════════════════════

function ExecBriefing() {
  const [generating, setGenerating] = useState(false);
  const [briefing, setBriefing] = useState(null);

  const generate = async () => {
    setGenerating(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `You are a pharma patent strategy consultant. Write a 250-word Executive Patent Cliff Intelligence Briefing for Feb 2026 covering: 1) THIS WEEK'S CRITICAL EVENTS 2) 90-DAY OUTLOOK 3) MARKET SIGNALS 4) RISK RADAR 5) OPPORTUNITY ALERT. Be specific. No disclaimers.` }] })
      });
      const d = await r.json();
      setBriefing(d.content?.map(b => b.text || "").join("\n") || "Unable to generate.");
    } catch { setBriefing("⚠ API unavailable. Connect to generate AI briefings."); }
    setGenerating(false);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.bright, marginBottom: 12 }}>📋 Auto-Generated Reports</div>
          {[{ title: "Weekly Patent Cliff Brief", freq: "Every Monday 8AM", icon: "📊" }, { title: "Real-Time Alert Digest", freq: "Push + Slack + Email", icon: "🚨" }, { title: "Monthly Strategic Review", freq: "1st of month", icon: "📈" }, { title: "Quarterly Board Pack", freq: "End of quarter", icon: "🏢" }].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: T.glass, borderRadius: 8, marginBottom: 6, border: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: T.bright }}>{r.title}</div><div style={{ fontSize: 10, color: T.muted }}>{r.freq}</div></div>
              <div style={{ padding: "4px 12px", borderRadius: 6, background: T.glow, color: T.primary2, fontSize: 10, fontWeight: 600 }}>Configure</div>
            </div>
          ))}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.bright, marginBottom: 12 }}>🔌 Integrations</div>
          {[{ name: "REST API", desc: "Full programmatic access", icon: "⚡", s: "Active" }, { name: "Tableau / Power BI", desc: "Direct BI connector", icon: "📊", s: "Active" }, { name: "Slack / Teams", desc: "Alert delivery", icon: "💬", s: "Active" }, { name: "Salesforce CRM", desc: "Push to accounts", icon: "☁️", s: "Beta" }, { name: "Excel Export", desc: "One-click .xlsx", icon: "📑", s: "Active" }, { name: "Webhooks", desc: "Custom triggers", icon: "🔗", s: "Active" }].map((int, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: T.glass, borderRadius: 8, marginBottom: 4, border: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 14 }}>{int.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: T.bright }}>{int.name}</div><div style={{ fontSize: 9, color: T.muted }}>{int.desc}</div></div>
              <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: int.s === "Beta" ? `${T.warn}12` : `${T.emerald}12`, color: int.s === "Beta" ? T.warn : T.emerald, fontWeight: 600 }}>{int.s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: `linear-gradient(135deg,${T.glow},rgba(0,203,169,0.04))`, border: `1px solid ${T.primary}20`, borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: T.bright }}>⚡ AI Executive Briefing Generator</div><div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>One-click C-suite ready intelligence</div></div>
          <button onClick={generate} disabled={generating} style={{ padding: "10px 24px", background: generating ? T.glass : `linear-gradient(135deg,${T.primary},#7c74ff)`, border: "none", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer" }}>
            {generating ? "Generating..." : "Generate Weekly Briefing"}
          </button>
        </div>
        {briefing && <div style={{ background: "rgba(10,15,28,0.8)", border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, fontFamily: T.mono, fontSize: 12, color: T.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{briefing}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState("historical");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setLastRefresh(new Date()); setRefreshing(false); }, 2500);
  }, []);

  const tabs = [
    { key: "historical", label: "Historical Analytics", icon: "📊" },
    { key: "projections", label: "Projections", icon: "📈" },
    { key: "pipeline", label: "Pipeline", icon: "🧬" },
    { key: "warroom", label: "War Room", icon: "⚔️" },
    { key: "simulator", label: "Simulator", icon: "🎛️" },
    { key: "alerts", label: "Alerts", icon: "🚨" },
    { key: "regulatory", label: "Regulatory", icon: "🏛️" },
    { key: "strategy", label: "Strategy", icon: "🎯" },
    { key: "exec", label: "Executive & API", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${T.bg} 0%, #080d1a 50%, #0a0520 100%)`, fontFamily: T.font, color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: ${T.primary} ${T.bg}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.primary}; border-radius: 3px; }
        input::placeholder { color: #475569; }
        select { appearance: auto; }
        body { margin: 0; }
      `}</style>

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "14px 22px", background: "rgba(4,7,13,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg,${T.primary},#a855f7)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: `0 4px 16px ${T.primary}40` }}>🧬</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: -0.5, color: T.bright }}>Patent Cliff Intelligence Platform</h1>
              <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>Analytics • Projections • War Room • Alerts • Strategy</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: T.muted, fontFamily: T.mono }}>Last: {lastRefresh.toLocaleTimeString()}</span>
            <button onClick={handleRefresh} disabled={refreshing} style={{ padding: "6px 14px", background: refreshing ? T.glass : `linear-gradient(135deg,#4a3dcc,${T.primary})`, border: `1px solid ${T.primary}30`, borderRadius: 8, color: "#fff", fontSize: 11, fontWeight: 600, cursor: refreshing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 5, boxShadow: refreshing ? "none" : `0 2px 12px ${T.primary}25` }}>
              <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}>⟳</span>
              {refreshing ? "Scanning..." : "Refresh All"}
            </button>
          </div>
        </div>
        {/* TAB BAR */}
        <div style={{ display: "flex", gap: 2, marginTop: 12, overflowX: "auto", paddingBottom: 2 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "7px 14px", borderRadius: "7px 7px 0 0", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", fontFamily: T.font, transition: "all 0.2s",
              background: tab === t.key ? T.glow : "transparent",
              color: tab === t.key ? T.primary2 : T.muted,
              borderBottom: tab === t.key ? `2px solid ${T.primary}` : "2px solid transparent",
            }}><span style={{ fontSize: 12 }}>{t.icon}</span>{t.label}</button>
          ))}
        </div>
      </div>

      {refreshing && (
        <div style={{ padding: "8px 22px", background: T.glow, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, border: `2px solid ${T.primary}30`, borderTop: `2px solid ${T.primary}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 10, color: T.primary2 }}>Scanning FDA, EMA, USPTO, SEC, PACER, LinkedIn, ClinicalTrials.gov, PubMed, IQVIA...</span>
        </div>
      )}

      <div style={{ padding: 22, maxWidth: 1440, margin: "0 auto" }}>
        {tab === "historical" && <HistoricalTab />}
        {tab === "projections" && <ProjectionsTab />}
        {tab === "pipeline" && <PipelineTab />}
        {tab === "warroom" && <WarRoom />}
        {tab === "simulator" && <Simulator />}
        {tab === "alerts" && <EarlyWarning />}
        {tab === "regulatory" && <RegulatoryTab />}
        {tab === "strategy" && <StrategyTab />}
        {tab === "exec" && <ExecBriefing />}
      </div>
    </div>
  );
}
