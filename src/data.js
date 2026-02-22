// ═══════════════════════════════════════════════════════════
// PATENT CLIFF INTELLIGENCE PLATFORM — DATA LAYER
// ═══════════════════════════════════════════════════════════

// ─── DESIGN TOKENS ───
export const T = {
  bg: "#04070d", card: "rgba(10,15,28,0.92)", glass: "rgba(255,255,255,0.02)",
  border: "rgba(65,75,110,0.22)", glow: "rgba(88,80,236,0.08)",
  primary: "#5850ec", primary2: "#7c74ff", accent: "#00cba9", warn: "#f59e0b",
  danger: "#ef4444", rose: "#f43f5e", cyan: "#06b6d4", emerald: "#10b981",
  text: "#c8cdd8", muted: "#555e78", bright: "#eef0f6",
  font: "'Outfit', -apple-system, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── HELPER FUNCTIONS ───
export const sigColor = s => ({
  confirmed: { bg: "rgba(0,212,170,0.12)", text: "#00cba9", brd: "#00cba9" },
  strong: { bg: "rgba(88,80,236,0.12)", text: "#7c74ff", brd: "#5850ec" },
  moderate: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", brd: "#f59e0b" },
  early: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", brd: "#a855f7" },
  speculative: { bg: "rgba(85,94,120,0.12)", text: "#7a839e", brd: "#555e78" },
}[s] || { bg: "rgba(85,94,120,0.12)", text: "#7a839e", brd: "#555e78" });

export const phasePct = p => ({
  "Pre-clinical": 10, "Phase I": 25, "Phase II": 45, "Phase III": 65,
  "ANDA Filed": 78, Approved: 90, Launched: 100
}[p] || 5);

export const daysUntil = d => Math.ceil((new Date(d) - new Date()) / 864e5);

export const fmtDays = d => {
  if (d < 0) return `${Math.abs(d)}d ago`;
  if (d < 365) return `${d}d`;
  return `${Math.floor(d / 365)}y ${Math.floor((d % 365) / 30)}m`;
};

// ─── SIGNAL SOURCES ───
export const SIGNAL_SOURCES = [
  { name: "Clinical Trials", icon: "🧪", desc: "ClinicalTrials.gov, WHO ICTRP", url: "https://clinicaltrials.gov" },
  { name: "Patent Filings", icon: "📜", desc: "USPTO, EPO, WIPO databases", url: "https://patents.google.com" },
  { name: "FDA/Regulatory", icon: "🏛️", desc: "FDA, EMA, NMPA submissions", url: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm" },
  { name: "SEC/Financial", icon: "📊", desc: "10-K, investor calls, earnings", url: "https://www.sec.gov/edgar" },
  { name: "Job Postings", icon: "💼", desc: "LinkedIn, career pages", url: "https://www.linkedin.com/jobs" },
  { name: "Conferences", icon: "🎤", desc: "ASCO, ESMO, AAD, EASD", url: "https://www.asco.org" },
  { name: "Supply Chain", icon: "🏭", desc: "CMO contracts, API sourcing", url: "https://www.iqvia.com" },
  { name: "Publications", icon: "📄", desc: "PubMed, preprints, posters", url: "https://pubmed.ncbi.nlm.nih.gov" },
];

// ─── HISTORICAL LOE DATA (5-YEAR LOOKBACK) ───
export const HISTORICAL_LOE = [
  {
    drug: "Humira", molecule: "Adalimumab", originator: "AbbVie", loeDate: "Jan 2023",
    peakRevenue: 21.2, currentRevenue: 8.1, playersAtLOE: 1, playersNow: 9,
    type: "Biologic", therapyArea: "Immunology", complexity: "High",
    marketShareData: [
      { month: "Pre-LOE", originator: 100, biosimilars: 0 },
      { month: "M3", originator: 92, biosimilars: 8 },
      { month: "M6", originator: 82, biosimilars: 18 },
      { month: "M9", originator: 70, biosimilars: 30 },
      { month: "M12", originator: 58, biosimilars: 42 },
      { month: "M18", originator: 42, biosimilars: 58 },
      { month: "M24", originator: 35, biosimilars: 65 },
    ],
    priceData: [
      { month: "Pre-LOE", price: 100, discount: 0 },
      { month: "M3", price: 95, discount: 5 },
      { month: "M6", price: 82, discount: 18 },
      { month: "M9", price: 68, discount: 32 },
      { month: "M12", price: 55, discount: 45 },
      { month: "M18", price: 42, discount: 58 },
      { month: "M24", price: 38, discount: 62 },
    ],
    keyInsight: "Aggressive biosimilar uptake in US after interchangeable designation. Price erosion faster than EU precedent due to PBM contracting.",
    links: { fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm", iqvia: "https://www.iqvia.com", sec: "https://www.sec.gov/cgi-bin/browse-edgar?company=abbvie" }
  },
  {
    drug: "Remicade", molecule: "Infliximab", originator: "J&J/Merck", loeDate: "Sep 2018",
    peakRevenue: 9.2, currentRevenue: 2.1, playersAtLOE: 2, playersNow: 5,
    type: "Biologic", therapyArea: "Immunology", complexity: "High",
    marketShareData: [
      { month: "Pre-LOE", originator: 100, biosimilars: 0 },
      { month: "M6", originator: 88, biosimilars: 12 },
      { month: "M12", originator: 72, biosimilars: 28 },
      { month: "M18", originator: 55, biosimilars: 45 },
      { month: "M24", originator: 42, biosimilars: 58 },
      { month: "M36", originator: 28, biosimilars: 72 },
      { month: "M48", originator: 20, biosimilars: 80 },
    ],
    priceData: [
      { month: "Pre-LOE", price: 100, discount: 0 },
      { month: "M6", price: 85, discount: 15 },
      { month: "M12", price: 68, discount: 32 },
      { month: "M18", price: 55, discount: 45 },
      { month: "M24", price: 45, discount: 55 },
      { month: "M36", price: 38, discount: 62 },
      { month: "M48", price: 32, discount: 68 },
    ],
    keyInsight: "Hospital segment switched faster than retail. Medical benefit drugs show different uptake patterns than pharmacy benefit drugs.",
    links: { fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm", iqvia: "https://www.iqvia.com", sec: "https://www.sec.gov/cgi-bin/browse-edgar?company=johnson" }
  },
  {
    drug: "Herceptin", molecule: "Trastuzumab", originator: "Roche", loeDate: "Jun 2019",
    peakRevenue: 7.1, currentRevenue: 2.8, playersAtLOE: 3, playersNow: 7,
    type: "Biologic", therapyArea: "Oncology", complexity: "Very High",
    marketShareData: [
      { month: "Pre-LOE", originator: 100, biosimilars: 0 },
      { month: "M6", originator: 75, biosimilars: 25 },
      { month: "M12", originator: 55, biosimilars: 45 },
      { month: "M18", originator: 38, biosimilars: 62 },
      { month: "M24", originator: 28, biosimilars: 72 },
      { month: "M36", originator: 18, biosimilars: 82 },
      { month: "M48", originator: 12, biosimilars: 88 },
    ],
    priceData: [
      { month: "Pre-LOE", price: 100, discount: 0 },
      { month: "M6", price: 72, discount: 28 },
      { month: "M12", price: 55, discount: 45 },
      { month: "M18", price: 42, discount: 58 },
      { month: "M24", price: 35, discount: 65 },
      { month: "M36", price: 28, discount: 72 },
      { month: "M48", price: 22, discount: 78 },
    ],
    keyInsight: "Oncology biosimilars see fastest adoption due to institutional buying, GPO contracting, and 340B economics. EU adoption led US by 18 months.",
    links: { fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm", iqvia: "https://www.iqvia.com", sec: "https://www.sec.gov/cgi-bin/browse-edgar?company=roche" }
  },
  {
    drug: "Neulasta", molecule: "Pegfilgrastim", originator: "Amgen", loeDate: "Jun 2020",
    peakRevenue: 4.7, currentRevenue: 0.6, playersAtLOE: 4, playersNow: 6,
    type: "Biologic", therapyArea: "Oncology Support", complexity: "Medium",
    marketShareData: [
      { month: "Pre-LOE", originator: 100, biosimilars: 0 },
      { month: "M3", originator: 70, biosimilars: 30 },
      { month: "M6", originator: 48, biosimilars: 52 },
      { month: "M12", originator: 28, biosimilars: 72 },
      { month: "M18", originator: 18, biosimilars: 82 },
      { month: "M24", originator: 12, biosimilars: 88 },
    ],
    priceData: [
      { month: "Pre-LOE", price: 100, discount: 0 },
      { month: "M3", price: 68, discount: 32 },
      { month: "M6", price: 45, discount: 55 },
      { month: "M12", price: 28, discount: 72 },
      { month: "M18", price: 20, discount: 80 },
      { month: "M24", price: 15, discount: 85 },
    ],
    keyInsight: "Most aggressive erosion — 4 biosimilars at launch created immediate price war. Day-1 readiness is critical for biosimilar entrants.",
    links: { fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm", iqvia: "https://www.iqvia.com", sec: "https://www.sec.gov/cgi-bin/browse-edgar?company=amgen" }
  },
  {
    drug: "Avastin", molecule: "Bevacizumab", originator: "Roche", loeDate: "Jul 2019",
    peakRevenue: 7.0, currentRevenue: 2.0, playersAtLOE: 2, playersNow: 6,
    type: "Biologic", therapyArea: "Oncology", complexity: "High",
    marketShareData: [
      { month: "Pre-LOE", originator: 100, biosimilars: 0 },
      { month: "M6", originator: 72, biosimilars: 28 },
      { month: "M12", originator: 50, biosimilars: 50 },
      { month: "M18", originator: 35, biosimilars: 65 },
      { month: "M24", originator: 25, biosimilars: 75 },
      { month: "M36", originator: 18, biosimilars: 82 },
    ],
    priceData: [
      { month: "Pre-LOE", price: 100, discount: 0 },
      { month: "M6", price: 70, discount: 30 },
      { month: "M12", price: 50, discount: 50 },
      { month: "M18", price: 38, discount: 62 },
      { month: "M24", price: 30, discount: 70 },
      { month: "M36", price: 24, discount: 76 },
    ],
    keyInsight: "340B dynamics accelerated hospital adoption. Oncology practices switched aggressively for margin capture. Community oncology led uptake.",
    links: { fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm", iqvia: "https://www.iqvia.com", sec: "https://www.sec.gov/cgi-bin/browse-edgar?company=roche" }
  },
  {
    drug: "Lantus", molecule: "Insulin Glargine", originator: "Sanofi", loeDate: "Dec 2020",
    peakRevenue: 7.0, currentRevenue: 1.9, playersAtLOE: 2, playersNow: 4,
    type: "Biologic", therapyArea: "Metabolic", complexity: "Medium",
    marketShareData: [
      { month: "Pre-LOE", originator: 100, biosimilars: 0 },
      { month: "M6", originator: 78, biosimilars: 22 },
      { month: "M12", originator: 62, biosimilars: 38 },
      { month: "M18", originator: 50, biosimilars: 50 },
      { month: "M24", originator: 38, biosimilars: 62 },
      { month: "M36", originator: 25, biosimilars: 75 },
    ],
    priceData: [
      { month: "Pre-LOE", price: 100, discount: 0 },
      { month: "M6", price: 78, discount: 22 },
      { month: "M12", price: 60, discount: 40 },
      { month: "M18", price: 48, discount: 52 },
      { month: "M24", price: 38, discount: 62 },
      { month: "M36", price: 30, discount: 70 },
    ],
    keyInsight: "IRA and insulin price caps accelerated erosion. Political pressure created unique market dynamics not seen in other categories.",
    links: { fdaLabel: "https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm", iqvia: "https://www.iqvia.com", sec: "https://www.sec.gov/cgi-bin/browse-edgar?company=sanofi" }
  },
];

// ─── PRICING MODEL FACTORS ───
export const PRICE_EROSION_BY_PLAYERS = [
  { players: 1, yr1Erosion: 10, yr2Erosion: 20, yr3Erosion: 25 },
  { players: 2, yr1Erosion: 22, yr2Erosion: 40, yr3Erosion: 50 },
  { players: 3, yr1Erosion: 35, yr2Erosion: 55, yr3Erosion: 65 },
  { players: 4, yr1Erosion: 48, yr2Erosion: 68, yr3Erosion: 78 },
  { players: "5+", yr1Erosion: 58, yr2Erosion: 78, yr3Erosion: 85 },
];

export const EROSION_BY_THERAPY = [
  { area: "Oncology", avgErosion24m: 68, avgShareShift24m: 72, speed: "Fast", driver: "340B / GPO contracting" },
  { area: "Immunology", avgErosion24m: 55, avgShareShift24m: 60, speed: "Moderate", driver: "PBM formulary / rebates" },
  { area: "Metabolic", avgErosion24m: 62, avgShareShift24m: 65, speed: "Moderate-Fast", driver: "IRA / price caps / volume" },
  { area: "Ophthalmology", avgErosion24m: 40, avgShareShift24m: 45, speed: "Slow", driver: "Physician preference / buy-and-bill" },
  { area: "Neurology", avgErosion24m: 35, avgShareShift24m: 38, speed: "Slow", driver: "Patient switching concerns" },
  { area: "Cardiology", avgErosion24m: 72, avgShareShift24m: 78, speed: "Very Fast", driver: "Small molecule / auto-substitution" },
];

export const BASE_EROSION = { "Oncology": 0.68, "Immunology": 0.55, "Cardiology": 0.72, "Metabolic": 0.62, "Ophthalmology": 0.40, "Neurology": 0.35 };

// ─── UPCOMING DRUG PROJECTIONS ───
export const PROJECTIONS = [
  { drug: "Stelara", loeYear: 2025, revenue: 10.9, players: 5, therapyArea: "Immunology", type: "Biologic",
    projection: [
      { year: "2025", origRev: 10.9, biosimRev: 0.5, totalMarket: 11.4, price: 100 },
      { year: "2026", origRev: 5.8, biosimRev: 4.2, totalMarket: 10.0, price: 60 },
      { year: "2027", origRev: 3.2, biosimRev: 5.5, totalMarket: 8.7, price: 42 },
      { year: "2028", origRev: 2.0, biosimRev: 5.0, totalMarket: 7.0, price: 35 },
    ]},
  { drug: "Eliquis", loeYear: 2026, revenue: 18.0, players: 4, therapyArea: "Cardiology", type: "Small Molecule",
    projection: [
      { year: "2026", origRev: 18.0, biosimRev: 0, totalMarket: 18.0, price: 100 },
      { year: "2027", origRev: 7.2, biosimRev: 5.4, totalMarket: 12.6, price: 35 },
      { year: "2028", origRev: 3.0, biosimRev: 4.5, totalMarket: 7.5, price: 18 },
      { year: "2029", origRev: 1.5, biosimRev: 3.0, totalMarket: 4.5, price: 12 },
    ]},
  { drug: "Keytruda", loeYear: 2028, revenue: 25.0, players: 5, therapyArea: "Oncology", type: "Biologic",
    projection: [
      { year: "2028", origRev: 25.0, biosimRev: 1.0, totalMarket: 26.0, price: 100 },
      { year: "2029", origRev: 14.0, biosimRev: 7.5, totalMarket: 21.5, price: 58 },
      { year: "2030", origRev: 7.5, biosimRev: 10.0, totalMarket: 17.5, price: 38 },
      { year: "2031", origRev: 4.0, biosimRev: 9.0, totalMarket: 13.0, price: 28 },
    ]},
  { drug: "Eylea", loeYear: 2027, revenue: 6.1, players: 4, therapyArea: "Ophthalmology", type: "Biologic",
    projection: [
      { year: "2027", origRev: 6.1, biosimRev: 0.3, totalMarket: 6.4, price: 100 },
      { year: "2028", origRev: 4.2, biosimRev: 1.5, totalMarket: 5.7, price: 72 },
      { year: "2029", origRev: 3.0, biosimRev: 2.0, totalMarket: 5.0, price: 58 },
      { year: "2030", origRev: 2.2, biosimRev: 2.2, totalMarket: 4.4, price: 48 },
    ]},
  { drug: "Opdivo", loeYear: 2028, revenue: 9.0, players: 3, therapyArea: "Oncology", type: "Biologic",
    projection: [
      { year: "2028", origRev: 9.0, biosimRev: 0.5, totalMarket: 9.5, price: 100 },
      { year: "2029", origRev: 5.4, biosimRev: 3.0, totalMarket: 8.4, price: 62 },
      { year: "2030", origRev: 3.0, biosimRev: 4.0, totalMarket: 7.0, price: 42 },
      { year: "2031", origRev: 1.8, biosimRev: 3.5, totalMarket: 5.3, price: 32 },
    ]},
  { drug: "Dupixent", loeYear: 2031, revenue: 13.7, players: 3, therapyArea: "Immunology", type: "Biologic",
    projection: [
      { year: "2031", origRev: 16.0, biosimRev: 0.5, totalMarket: 16.5, price: 100 },
      { year: "2032", origRev: 9.6, biosimRev: 4.0, totalMarket: 13.6, price: 62 },
      { year: "2033", origRev: 5.5, biosimRev: 5.5, totalMarket: 11.0, price: 45 },
      { year: "2034", origRev: 3.5, biosimRev: 5.0, totalMarket: 8.5, price: 38 },
    ]},
];

// ─── PIPELINE DATA ───
export const PIPELINE = [
  { id:1, drug:"Humira", molecule:"Adalimumab", originator:"AbbVie", indication:"Immunology (TNF-α)", patentExpiry:"2023-01-31", revenue:"$14.4B", therapyArea:"immunology",
    competitors: [
      { company:"Amgen (Amjevita)", molecule:"ABP 501", phase:"Launched", signal:"confirmed", estLaunch:"Launched 2023", sources:[{label:"FDA",url:"https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm"},{label:"IQVIA",url:"https://www.iqvia.com"}]},
      { company:"Sandoz (Hyrimoz)", molecule:"GP2017", phase:"Launched", signal:"confirmed", estLaunch:"Launched 2023", sources:[{label:"Sandoz",url:"https://www.sandoz.com/news"}]},
      { company:"Boehringer (Cyltezo)", molecule:"BI 695501", phase:"Launched", signal:"confirmed", estLaunch:"Launched 2023", sources:[{label:"FDA",url:"https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm"}]},
    ]},
  { id:2, drug:"Stelara", molecule:"Ustekinumab", originator:"J&J", indication:"Immunology (IL-12/23)", patentExpiry:"2025-09-22", revenue:"$10.9B", therapyArea:"immunology",
    competitors: [
      { company:"Amgen (Wezlana)", molecule:"ABP 654", phase:"Approved", signal:"confirmed", estLaunch:"2025 Q1", sources:[{label:"FDA",url:"https://www.accessdata.fda.gov/drugsatfda_cgi/index.cfm"},{label:"Amgen IR",url:"https://investors.amgen.com"}]},
      { company:"Samsung Bioepis", molecule:"SB17", phase:"Approved", signal:"confirmed", estLaunch:"2025 Q2", sources:[{label:"EMA",url:"https://www.ema.europa.eu/en/medicines"}]},
      { company:"Sandoz", molecule:"Ustekinumab BS", phase:"Phase III", signal:"strong", estLaunch:"2025 Q2", sources:[{label:"Pipeline",url:"https://www.sandoz.com/our-work/biopharmaceuticals"}]},
      { company:"Celltrion", molecule:"CT-P43", phase:"Phase III", signal:"strong", estLaunch:"2025 Q3", sources:[{label:"ClinicalTrials",url:"https://clinicaltrials.gov/search?term=CT-P43"}]},
    ]},
  { id:3, drug:"Eliquis", molecule:"Apixaban", originator:"BMS/Pfizer", indication:"Cardiology (Factor Xa)", patentExpiry:"2026-11-14", revenue:"$18.0B", therapyArea:"cardiology",
    competitors: [
      { company:"Teva", molecule:"Generic Apixaban", phase:"ANDA Filed", signal:"strong", estLaunch:"2026 Q4", sources:[{label:"ANDA",url:"https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm"},{label:"Court Docs",url:"https://www.courtlistener.com"}]},
      { company:"Aurobindo", molecule:"Generic Apixaban", phase:"ANDA Filed", signal:"strong", estLaunch:"2027 Q1", sources:[{label:"Orange Book",url:"https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm"}]},
      { company:"Cipla", molecule:"Generic Apixaban", phase:"Phase III", signal:"moderate", estLaunch:"2027 Q3", sources:[{label:"Cipla IR",url:"https://www.cipla.com/investors"}]},
    ]},
  { id:4, drug:"Keytruda", molecule:"Pembrolizumab", originator:"Merck", indication:"Oncology (PD-1)", patentExpiry:"2028-04-20", revenue:"$25.0B", therapyArea:"oncology",
    competitors: [
      { company:"Biocon/Viatris", molecule:"BMK-P01", phase:"Phase III", signal:"strong", estLaunch:"2028 Q3", sources:[{label:"ClinicalTrials",url:"https://clinicaltrials.gov/search?term=biocon+pembrolizumab"},{label:"SEC",url:"https://www.sec.gov/cgi-bin/browse-edgar?company=viatris"}]},
      { company:"Shanghai Henlius", molecule:"HLX11", phase:"Phase III", signal:"moderate", estLaunch:"2029 Q1", sources:[{label:"NMPA",url:"https://www.nmpa.gov.cn"},{label:"ESMO",url:"https://www.esmo.org/meetings"}]},
      { company:"Celltrion", molecule:"CT-P65", phase:"Phase I", signal:"early", estLaunch:"2030+", sources:[{label:"Patent",url:"https://patents.google.com/?q=pembrolizumab+biosimilar"}]},
      { company:"Sandoz", molecule:"Pembro BS", phase:"Phase I", signal:"early", estLaunch:"2030+", sources:[{label:"Pipeline",url:"https://www.sandoz.com/our-work/biopharmaceuticals"}]},
    ]},
  { id:5, drug:"Eylea", molecule:"Aflibercept", originator:"Regeneron", indication:"Ophthalmology (VEGF)", patentExpiry:"2027-05-13", revenue:"$6.1B", therapyArea:"ophthalmology",
    competitors: [
      { company:"Samsung Bioepis", molecule:"SB15", phase:"Phase III", signal:"strong", estLaunch:"2027 Q4", sources:[{label:"EMA",url:"https://www.ema.europa.eu/en/medicines"}]},
      { company:"Formycon", molecule:"FYB203", phase:"Phase III", signal:"strong", estLaunch:"2027 Q4", sources:[{label:"Formycon",url:"https://www.formycon.com/en/pipeline/"}]},
      { company:"Biocon", molecule:"BMK-A01", phase:"Phase III", signal:"moderate", estLaunch:"2028 Q1", sources:[{label:"ClinicalTrials",url:"https://clinicaltrials.gov/search?term=biocon+aflibercept"}]},
    ]},
  { id:6, drug:"Opdivo", molecule:"Nivolumab", originator:"BMS", indication:"Oncology (PD-1)", patentExpiry:"2028-12-19", revenue:"$9.0B", therapyArea:"oncology",
    competitors: [
      { company:"Junshi Biosciences", molecule:"JS004-B", phase:"Phase III", signal:"strong", estLaunch:"2029 Q1", sources:[{label:"CDE",url:"https://www.cde.org.cn/en/"}]},
      { company:"Fresenius Kabi", molecule:"MSB11456", phase:"Phase III", signal:"strong", estLaunch:"2029 Q2", sources:[{label:"EMA",url:"https://www.ema.europa.eu/en/medicines"}]},
    ]},
  { id:7, drug:"Ozempic/Wegovy", molecule:"Semaglutide", originator:"Novo Nordisk", indication:"Diabetes/Obesity (GLP-1)", patentExpiry:"2032-06-07", revenue:"$28.0B+", therapyArea:"metabolic",
    competitors: [
      { company:"Biocon", molecule:"Semaglutide BS", phase:"Phase I", signal:"early", estLaunch:"2033+", sources:[{label:"Patent",url:"https://patents.google.com/?q=semaglutide"}]},
      { company:"Teva", molecule:"Generic Sema", phase:"Pre-clinical", signal:"speculative", estLaunch:"2033+", sources:[{label:"SEC",url:"https://www.sec.gov/cgi-bin/browse-edgar?company=teva"}]},
    ]},
  { id:8, drug:"Dupixent", molecule:"Dupilumab", originator:"Sanofi/Regeneron", indication:"Immunology (IL-4/13)", patentExpiry:"2031-06-15", revenue:"$13.7B", therapyArea:"immunology",
    competitors: [
      { company:"Harbour BioMed", molecule:"HBM9378", phase:"Phase II", signal:"moderate", estLaunch:"2032+", sources:[{label:"ClinicalTrials",url:"https://clinicaltrials.gov/search?term=HBM9378"}]},
      { company:"Biocon", molecule:"Dupilumab BS", phase:"Phase I", signal:"early", estLaunch:"2032+", sources:[{label:"Biocon",url:"https://www.biocon.com/biosimilars/"}]},
    ]},
  { id:9, drug:"Entresto", molecule:"Sacubitril/Valsartan", originator:"Novartis", indication:"Cardiology (ARNI)", patentExpiry:"2026-11-07", revenue:"$6.5B", therapyArea:"cardiology",
    competitors: [
      { company:"MSN Labs", molecule:"Generic S/V", phase:"ANDA Filed", signal:"strong", estLaunch:"2027 Q1", sources:[{label:"ANDA",url:"https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm"}]},
      { company:"Torrent Pharma", molecule:"Generic S/V", phase:"ANDA Filed", signal:"strong", estLaunch:"2027 Q1", sources:[{label:"Paragraph IV",url:"https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm"}]},
    ]},
  { id:10, drug:"Jardiance", molecule:"Empagliflozin", originator:"Boehringer/Lilly", indication:"Diabetes/Cardiology (SGLT2)", patentExpiry:"2028-05-19", revenue:"$7.5B", therapyArea:"metabolic",
    competitors: [
      { company:"Teva", molecule:"Generic Empa", phase:"ANDA Filed", signal:"strong", estLaunch:"2028 Q3", sources:[{label:"ANDA",url:"https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm"}]},
      { company:"Lupin", molecule:"Generic Empa", phase:"Phase III", signal:"moderate", estLaunch:"2029 Q1", sources:[{label:"Lupin",url:"https://www.lupin.com/pipeline/"}]},
    ]},
];

// ─── WAR ROOM DATA ───
export const BATTLE_CARDS = {
  "Keytruda": {
    originator: { company: "Merck", revenue: "$25.0B", marketCap: "$290B", rndSpend: "$13.5B", loeDate: "Apr 2028", defenseStrategy: "SC formulation (MK-3475A), combo regimens, global indication expansion", strengthScore: 88 },
    threats: [
      { company: "Biocon/Viatris", readiness: 78, pricing: "Est. 30-40% discount", channel: "340B + Community Oncology", timeline: "2028 Q3", riskLevel: "HIGH", strengths: ["Manufacturing scale", "Viatris distribution", "Phase III data"], weaknesses: ["No US oncology track record", "Single biosimilar"], sourceUrl: "https://clinicaltrials.gov/search?term=biocon+pembrolizumab" },
      { company: "Henlius/Fosun", readiness: 62, pricing: "Est. 40-50% discount", channel: "China + Ex-US first", timeline: "2029 Q1", riskLevel: "MED", strengths: ["NMPA fast-track", "Low-cost manufacturing", "China market access"], weaknesses: ["US regulatory uncertainty", "IP litigation risk"], sourceUrl: "https://www.henlius.com/en/ir/" },
      { company: "Sandoz", readiness: 35, pricing: "TBD", channel: "Global multi-market", timeline: "2030+", riskLevel: "LOW", strengths: ["Biosimilar market leader", "Global distribution", "Payer relationships"], weaknesses: ["Early stage", "Crowded market by launch"], sourceUrl: "https://www.sandoz.com/our-work/biopharmaceuticals" },
    ],
    radarData: [
      { axis: "Price Pressure", originator: 40, topThreat: 85 },
      { axis: "Channel Access", originator: 95, topThreat: 55 },
      { axis: "Clinical Data", originator: 98, topThreat: 70 },
      { axis: "Manufacturing", originator: 90, topThreat: 60 },
      { axis: "Payer Relations", originator: 92, topThreat: 40 },
      { axis: "Global Reach", originator: 95, topThreat: 45 },
    ],
  },
  "Eliquis": {
    originator: { company: "BMS/Pfizer", revenue: "$18.0B", marketCap: "$150B+", rndSpend: "$11B", loeDate: "Nov 2026", defenseStrategy: "Authorized generic strategy, payer contracting, patient assistance programs", strengthScore: 65 },
    threats: [
      { company: "Teva", readiness: 88, pricing: "Est. 85-90% discount", channel: "Full retail + mail order", timeline: "2026 Q4", riskLevel: "CRITICAL", strengths: ["ANDA filed", "Generic leader", "Retail distribution"], weaknesses: ["Litigation pending", "Debt burden"], sourceUrl: "https://www.tevapharm.com/our-products/pipeline/" },
      { company: "Aurobindo", readiness: 82, pricing: "Est. 85-90% discount", channel: "Retail pharmacy", timeline: "2027 Q1", riskLevel: "HIGH", strengths: ["Low-cost API", "ANDA filed", "Price leader"], weaknesses: ["FDA warning history", "Limited branding"], sourceUrl: "https://www.aurobindo.com/investors/" },
    ],
    radarData: [
      { axis: "Price Pressure", originator: 20, topThreat: 95 },
      { axis: "Channel Access", originator: 90, topThreat: 80 },
      { axis: "Clinical Data", originator: 95, topThreat: 90 },
      { axis: "Manufacturing", originator: 85, topThreat: 90 },
      { axis: "Payer Relations", originator: 88, topThreat: 70 },
      { axis: "Global Reach", originator: 90, topThreat: 75 },
    ],
  },
  "Stelara": {
    originator: { company: "Johnson & Johnson", revenue: "$10.9B", marketCap: "$400B+", rndSpend: "$15B", loeDate: "Sep 2025", defenseStrategy: "Tremfya (IL-23 successor) cannibalization strategy, rebate walls, patient support programs", strengthScore: 52 },
    threats: [
      { company: "Amgen (Wezlana)", readiness: 95, pricing: "Est. 45-55% discount", channel: "Specialty pharmacy + PBM", timeline: "2025 Q1", riskLevel: "CRITICAL", strengths: ["FDA approved", "Interchangeable", "Amgen brand trust"], weaknesses: ["Payer contract timing"], sourceUrl: "https://investors.amgen.com" },
      { company: "Samsung Bioepis", readiness: 90, pricing: "Est. 40-50% discount", channel: "EU-first then US", timeline: "2025 Q2", riskLevel: "CRITICAL", strengths: ["EMA approved", "Global scale", "Biogen distribution"], weaknesses: ["US launch logistics"], sourceUrl: "https://www.samsungbioepis.com/en/pipeline.do" },
    ],
    radarData: [
      { axis: "Price Pressure", originator: 25, topThreat: 90 },
      { axis: "Channel Access", originator: 85, topThreat: 75 },
      { axis: "Clinical Data", originator: 92, topThreat: 85 },
      { axis: "Manufacturing", originator: 80, topThreat: 88 },
      { axis: "Payer Relations", originator: 82, topThreat: 65 },
      { axis: "Global Reach", originator: 90, topThreat: 70 },
    ],
  },
};

// ─── EARLY WARNING ALERTS ───
export const ALERTS = [
  { severity: "CRITICAL", time: "2h ago", drug: "Eliquis", event: "Paragraph IV certification filed by Teva Pharmaceuticals for generic apixaban", source: "FDA Orange Book", sourceUrl: "https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm", impact: "Triggers 30-month litigation stay. Generic launch possible Q4 2026 if settlement reached." },
  { severity: "HIGH", time: "6h ago", drug: "Keytruda", event: "Biocon/Viatris Phase III biosimilar trial meets primary endpoint — non-inferiority confirmed", source: "ClinicalTrials.gov", sourceUrl: "https://clinicaltrials.gov/search?term=biocon+pembrolizumab", impact: "BLA filing expected within 6 months. First pembrolizumab biosimilar on track for 2028 Q3 launch." },
  { severity: "HIGH", time: "1d ago", drug: "Eylea", event: "Samsung Bioepis SB15 — EMA accepts MAA for review. CHMP opinion expected Q2 2026", source: "EMA", sourceUrl: "https://www.ema.europa.eu/en/medicines", impact: "EU approval would de-risk US filing. Expected to accelerate US BLA submission." },
  { severity: "MEDIUM", time: "1d ago", drug: "Opdivo", event: "Fresenius Kabi posts 12 manufacturing roles for 'large molecule oncology biosimilar' at Halle plant", source: "LinkedIn Jobs", sourceUrl: "https://www.linkedin.com/company/fresenius-kabi/jobs", impact: "Signal of manufacturing scale-up for MSB11456. Consistent with 2029 Q2 launch target." },
  { severity: "MEDIUM", time: "2d ago", drug: "Dupixent", event: "Harbour BioMed / Kelun partnership announced — $180M upfront for anti-IL4R biosimilar development", source: "SEC 8-K", sourceUrl: "https://www.sec.gov/cgi-bin/browse-edgar", impact: "Signals serious commitment to dupilumab biosimilar. Partnership de-risks R&D. Timeline: 2032+." },
  { severity: "LOW", time: "3d ago", drug: "Ozempic", event: "New patent application published by Novo Nordisk for semaglutide device/formulation improvements", source: "USPTO", sourceUrl: "https://patents.google.com/?q=semaglutide+novo+nordisk", impact: "Patent thickening strategy — may extend effective exclusivity 1-2 years beyond base patent expiry." },
  { severity: "LOW", time: "5d ago", drug: "Stelara", event: "Sandoz ustekinumab biosimilar — payer coverage decisions published by Express Scripts (preferred tier 1)", source: "Formulary Watch", sourceUrl: "https://www.express-scripts.com", impact: "Major PBM support signals rapid uptake. Community pharmacy auto-substitution expected." },
  { severity: "INFO", time: "1w ago", drug: "Jardiance", event: "Zydus Lifesciences registers new clinical trial for empagliflozin generic in India (CTRI)", source: "CTRI India", sourceUrl: "https://ctri.nic.in", impact: "Emerging market generic development. May indicate intent for global filing including US ANDA." },
];

// ─── REGULATORY FILINGS ───
export const REG_FILINGS = [
  { drug:"Keytruda BS", company:"Biocon/Viatris", fda:"Phase III ●", ema:"Phase III ●", nmpa:"Phase II ◐", hc:"Not Filed ○", pmda:"Not Filed ○", tga:"Not Filed ○" },
  { drug:"Stelara BS (Wezlana)", company:"Amgen", fda:"Approved ✓", ema:"Approved ✓", nmpa:"Filed ●", hc:"Filed ●", pmda:"Filed ●", tga:"Filed ●" },
  { drug:"Eliquis Generic", company:"Teva", fda:"ANDA Filed ●", ema:"Filed ●", nmpa:"Phase III ◐", hc:"Filed ●", pmda:"N/A", tga:"Filed ●" },
  { drug:"Eylea BS (SB15)", company:"Samsung Bioepis", fda:"Phase III ●", ema:"MAA Filed ●", nmpa:"Phase I ◐", hc:"Phase III ●", pmda:"Phase II ◐", tga:"Phase III ●" },
  { drug:"Opdivo BS", company:"Fresenius Kabi", fda:"Phase III ●", ema:"Filed ●", nmpa:"Not Filed ○", hc:"Phase III ●", pmda:"Not Filed ○", tga:"Phase I ◐" },
];

// ─── LITIGATION DATA ───
export const LITIGATION = [
  { case: "BMS/Pfizer v. Teva — Apixaban", status: "Discovery Phase", court: "D. Delaware", deadline: "Jun 2026", riskTo: "Eliquis", url: "https://www.courtlistener.com" },
  { case: "Regeneron v. Samsung Bioepis — Aflibercept", status: "Claim Construction", court: "D. Delaware", deadline: "Mar 2027", riskTo: "Eylea", url: "https://www.courtlistener.com" },
  { case: "Merck v. Biocon — Pembrolizumab", status: "Pre-filing Negotiation", court: "TBD", deadline: "2027", riskTo: "Keytruda", url: "https://www.courtlistener.com" },
  { case: "Bayer v. Teva — Rivaroxaban", status: "Settled", court: "D.N.J.", deadline: "Resolved", riskTo: "Xarelto", url: "https://www.courtlistener.com" },
];
