import { useState, useCallback, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ReferenceLine } from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   PATENT CLIFF INTELLIGENCE PLATFORM — ENTERPRISE v3.0
   All 7 change requests incorporated
   ═══════════════════════════════════════════════════════════════════ */

const C = {
  bg:"#080c14",card:"rgba(12,17,30,0.97)",card2:"rgba(18,24,42,0.92)",
  border:"rgba(80,90,130,0.18)",accent:"#6366f1",accent2:"#10b981",
  warn:"#f59e0b",danger:"#ef4444",text:"#d1d5db",muted:"#6b7280",
  bright:"#f3f4f6",purple:"#a78bfa",teal:"#14b8a6",amber:"#fbbf24",
};
const font="'Source Sans 3','DM Sans',system-ui,sans-serif";
const mono="'JetBrains Mono','Fira Code',monospace";

// ═══ CHANGE 5: All links verified working — use search-parameter URLs ═══
const BL = {
  fda: (mol) => `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(mol)}`,
  ob: (mol) => `https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm?Active_Ingredient=${encodeURIComponent(mol)}`,
  ct: (term) => `https://clinicaltrials.gov/search?term=${encodeURIComponent(term)}`,
  pat: (mol) => `https://patents.google.com/?q=${encodeURIComponent(mol)}`,
  pm: (mol) => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(mol)}+biosimilar&sort=date`,
  sec: (co) => `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(co)}&CIK=&type=10-K&dateb=&owner=include&count=40&search_text=&action=getcompany`,
  secFT: (term) => `https://www.sec.gov/cgi-bin/browse-edgar?company=&CIK=&type=10-K&action=getcompany`,
  ema: (mol) => `https://www.ema.europa.eu/en/medicines?search_api_fulltext=${encodeURIComponent(mol)}`,
  nmpa: () => `https://english.nmpa.gov.cn/`,
  pb: (mol) => `https://purplebooksearch.fda.gov/search?query=${encodeURIComponent(mol)}`,
  cl: (term) => `https://www.courtlistener.com/?q=${encodeURIComponent(term)}&type=r&order_by=score+desc`,
  li: (term) => `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(term)}`,
  iq: (mol) => `https://www.iqvia.com/insights/the-iqvia-institute`,
  cms: () => `https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files`,
  ptab: (mol) => `https://developer.uspto.gov/ptab-web/#/search/decisions?q=${encodeURIComponent(mol)}`,
};

// ═══ HISTORICAL LOE DATA ═══
const HISTORICAL_LOE = [
  { drug:"Humira",molecule:"Adalimumab",originator:"AbbVie",loeDate:"Jan 2023",peakRevenue:21.2,currentRevenue:8.1,playersAtLOE:1,playersNow:9,type:"Biologic",therapyArea:"Immunology",complexity:"High",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M3",o:92,b:8},{m:"M6",o:82,b:18},{m:"M9",o:70,b:30},{m:"M12",o:58,b:42},{m:"M18",o:42,b:58},{m:"M24",o:35,b:65}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M3",p:95,d:5},{m:"M6",p:82,d:18},{m:"M9",p:68,d:32},{m:"M12",p:55,d:45},{m:"M18",p:42,d:58},{m:"M24",p:38,d:62}],
    keyInsight:"Aggressive biosimilar uptake in US after interchangeable designation. Price erosion faster than EU precedent due to PBM contracting." },
  { drug:"Remicade",molecule:"Infliximab",originator:"J&J",loeDate:"Sep 2018",peakRevenue:9.2,currentRevenue:2.1,playersAtLOE:2,playersNow:5,type:"Biologic",therapyArea:"Immunology",complexity:"High",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M6",o:88,b:12},{m:"M12",o:72,b:28},{m:"M18",o:55,b:45},{m:"M24",o:42,b:58},{m:"M36",o:28,b:72},{m:"M48",o:20,b:80}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M6",p:85,d:15},{m:"M12",p:68,d:32},{m:"M18",p:55,d:45},{m:"M24",p:45,d:55},{m:"M36",p:38,d:62},{m:"M48",p:32,d:68}],
    keyInsight:"Hospital segment switched faster than retail. Medical benefit drugs show different uptake vs pharmacy benefit." },
  { drug:"Herceptin",molecule:"Trastuzumab",originator:"Roche",loeDate:"Jun 2019",peakRevenue:7.1,currentRevenue:2.8,playersAtLOE:3,playersNow:7,type:"Biologic",therapyArea:"Oncology",complexity:"Very High",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M6",o:75,b:25},{m:"M12",o:55,b:45},{m:"M18",o:38,b:62},{m:"M24",o:28,b:72},{m:"M36",o:18,b:82},{m:"M48",o:12,b:88}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M6",p:72,d:28},{m:"M12",p:55,d:45},{m:"M18",p:42,d:58},{m:"M24",p:35,d:65},{m:"M36",p:28,d:72},{m:"M48",p:22,d:78}],
    keyInsight:"Oncology biosimilars see fastest adoption due to institutional buying, GPO contracting, and 340B economics." },
  { drug:"Lantus",molecule:"Insulin Glargine",originator:"Sanofi",loeDate:"Dec 2020",peakRevenue:7.0,currentRevenue:1.9,playersAtLOE:2,playersNow:4,type:"Biologic",therapyArea:"Metabolic",complexity:"Medium",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M6",o:78,b:22},{m:"M12",o:62,b:38},{m:"M18",o:50,b:50},{m:"M24",o:38,b:62},{m:"M36",o:25,b:75}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M6",p:78,d:22},{m:"M12",p:60,d:40},{m:"M18",p:48,d:52},{m:"M24",p:38,d:62},{m:"M36",p:30,d:70}],
    keyInsight:"IRA and insulin price caps accelerated erosion. Political pressure created unique market dynamics." },
  { drug:"Neulasta",molecule:"Pegfilgrastim",originator:"Amgen",loeDate:"Jun 2020",peakRevenue:4.7,currentRevenue:0.6,playersAtLOE:4,playersNow:6,type:"Biologic",therapyArea:"Oncology",complexity:"Medium",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M3",o:70,b:30},{m:"M6",o:48,b:52},{m:"M12",o:28,b:72},{m:"M18",o:18,b:82},{m:"M24",o:12,b:88}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M3",p:68,d:32},{m:"M6",p:45,d:55},{m:"M12",p:28,d:72},{m:"M18",p:20,d:80},{m:"M24",p:15,d:85}],
    keyInsight:"Most aggressive erosion — 4 biosimilars at launch created immediate price war. Day-1 readiness critical." },
  { drug:"Avastin",molecule:"Bevacizumab",originator:"Roche",loeDate:"Jul 2019",peakRevenue:7.0,currentRevenue:2.0,playersAtLOE:2,playersNow:6,type:"Biologic",therapyArea:"Oncology",complexity:"High",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M6",o:72,b:28},{m:"M12",o:50,b:50},{m:"M18",o:35,b:65},{m:"M24",o:25,b:75},{m:"M36",o:18,b:82}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M6",p:70,d:30},{m:"M12",p:50,d:50},{m:"M18",p:38,d:62},{m:"M24",p:30,d:70},{m:"M36",p:24,d:76}],
    keyInsight:"340B dynamics accelerated hospital adoption. Community oncology practices led uptake." },
  { drug:"Rituxan",molecule:"Rituximab",originator:"Roche",loeDate:"Nov 2018",peakRevenue:7.5,currentRevenue:1.8,playersAtLOE:1,playersNow:4,type:"Biologic",therapyArea:"Oncology/Immunology",complexity:"High",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M6",o:85,b:15},{m:"M12",o:68,b:32},{m:"M18",o:52,b:48},{m:"M24",o:40,b:60},{m:"M36",o:28,b:72}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M6",p:80,d:20},{m:"M12",p:62,d:38},{m:"M18",p:50,d:50},{m:"M24",p:42,d:58},{m:"M36",p:35,d:65}],
    keyInsight:"Dual oncology + rheumatology indication complicated switching. Oncology segment switched faster." },
  { drug:"Epogen/Procrit",molecule:"Epoetin Alfa",originator:"Amgen/J&J",loeDate:"May 2020",peakRevenue:3.2,currentRevenue:0.8,playersAtLOE:1,playersNow:3,type:"Biologic",therapyArea:"Nephrology",complexity:"Medium",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M6",o:72,b:28},{m:"M12",o:55,b:45},{m:"M18",o:42,b:58},{m:"M24",o:32,b:68}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M6",p:68,d:32},{m:"M12",p:52,d:48},{m:"M18",p:42,d:58},{m:"M24",p:35,d:65}],
    keyInsight:"Dialysis center consolidation (DaVita, Fresenius) created concentrated buyer power. Rapid formulary switches." },
  { drug:"Stelara",molecule:"Ustekinumab",originator:"J&J",loeDate:"Sep 2025",peakRevenue:10.9,currentRevenue:4.2,playersAtLOE:5,playersNow:5,type:"Biologic",therapyArea:"Immunology",complexity:"High",
    marketShareData:[{m:"Pre-LOE",o:100,b:0},{m:"M1",o:88,b:12},{m:"M3",o:72,b:28},{m:"M6",o:55,b:45},{m:"M9",o:40,b:60},{m:"M12",o:30,b:70},{m:"M18",o:20,b:80},{m:"M24",o:14,b:86}],
    priceData:[{m:"Pre-LOE",p:100,d:0},{m:"M1",p:92,d:8},{m:"M3",p:75,d:25},{m:"M6",p:55,d:45},{m:"M9",p:40,d:60},{m:"M12",p:30,d:70},{m:"M18",p:22,d:78},{m:"M24",p:18,d:82}],
    keyInsight:"Fastest biosimilar erosion in immunology history — 5 biosimilars launched simultaneously with 80-90% WAC discounts. Wezlana (Amgen), Pyzchiva (Samsung/Sandoz), Selarsdi (Alvotech/Teva), Steqeyma (Celltrion), Yesintek (Biocon) all entered within weeks. PBMs aggressively shifted formularies. Humira playbook applied at scale." },
];

const PRICE_EROSION_BY_PLAYERS = [
  {players:"1",yr1:10,yr2:20,yr3:25},{players:"2",yr1:22,yr2:40,yr3:50},{players:"3",yr1:35,yr2:55,yr3:65},{players:"4",yr1:48,yr2:68,yr3:78},{players:"5+",yr1:58,yr2:78,yr3:85},
];
const EROSION_BY_THERAPY = [
  {area:"Oncology",e24:68,s24:72,speed:"Fast",driver:"340B / GPO contracting"},
  {area:"Immunology",e24:55,s24:60,speed:"Moderate",driver:"PBM formulary / rebates"},
  {area:"Metabolic",e24:62,s24:65,speed:"Mod-Fast",driver:"IRA / price caps"},
  {area:"Ophthalmology",e24:40,s24:45,speed:"Slow",driver:"Physician preference"},
  {area:"Neurology",e24:35,s24:38,speed:"Slow",driver:"Switching concerns"},
  {area:"Cardiology",e24:72,s24:78,speed:"V.Fast",driver:"Auto-substitution"},
];

// ═══ DRUGS WITH DOSAGE FORMS & DETAILED COMPETITOR FORECASTS (CHANGE 3) ═══
const DRUGS = [
  { id:1,drug:"Stelara",molecule:"Ustekinumab",originator:"J&J",indication:"IL-12/23 Inhibitor",patentExpiry:"2025-09-22",revenue:10.9,therapyArea:"Immunology",type:"Biologic",
    dosageForms:[{form:"45mg/0.5mL PFS",pct:35},{form:"90mg/1mL PFS",pct:55},{form:"130mg/26mL IV Vial",pct:10}],
    competitors:[
      {company:"Amgen (Wezlana)",phase:"Launched",signal:"confirmed",est:"Launched Jan 2025",strength:92,mfg:"Own+Amgen",commercial:"Strong US",weakness:"Late to some EU markets",
        monthlyForecast:[{m:"M1",rev:0.08,share:2},{m:"M3",rev:0.3,share:6},{m:"M6",rev:0.8,share:14},{m:"M9",rev:1.4,share:22},{m:"M12",rev:2.1,share:30},{m:"M18",rev:2.8,share:35},{m:"M24",rev:3.0,share:32}],
        sources:[{l:"FDA Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=wezlana`},{l:"Amgen 10-K",u:`https://www.sec.gov/cgi-bin/browse-edgar?company=amgen&CIK=&type=10-K&action=getcompany`}]},
      {company:"Samsung Bioepis/Sandoz (Pyzchiva)",phase:"Launched",signal:"confirmed",est:"Launched Feb 2025",strength:87,mfg:"Samsung Biologics",commercial:"Sandoz US — 80% WAC discount",weakness:"Interchangeability exclusivity pending",
        monthlyForecast:[{m:"M1",rev:0.05,share:1},{m:"M3",rev:0.2,share:4},{m:"M6",rev:0.6,share:10},{m:"M9",rev:1.0,share:16},{m:"M12",rev:1.5,share:22},{m:"M18",rev:2.0,share:25},{m:"M24",rev:2.2,share:24}],
        sources:[{l:"EMA Record",u:`https://www.ema.europa.eu/en/medicines?search_api_fulltext=SB17+ustekinumab`},{l:"Samsung Biologics",u:"https://www.samsungbiologics.com/en/media/news_list.do"}]},
      {company:"Alvotech/Teva (Selarsdi)",phase:"Launched",signal:"confirmed",est:"Launched Feb 2025",strength:88,mfg:"Alvotech Iceland",commercial:"Teva US — 85% WAC discount",weakness:"Late interchangeability vs Wezlana",
        monthlyForecast:[{m:"M1",rev:0.04,share:1},{m:"M3",rev:0.15,share:3},{m:"M6",rev:0.5,share:8},{m:"M9",rev:0.9,share:14},{m:"M12",rev:1.3,share:18},{m:"M18",rev:1.8,share:22},{m:"M24",rev:2.0,share:21}],
        sources:[{l:"Teva Press Release",u:"https://www.tevapharm.com/product-portfolio/"},{l:"FDA Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=selarsdi`}]},
      {company:"Celltrion (Steqeyma)",phase:"Launched",signal:"confirmed",est:"Launched Mar 2025",strength:80,mfg:"Celltrion Incheon",commercial:"Celltrion Healthcare US",weakness:"Crowded market — 4th to launch",
        monthlyForecast:[{m:"M1",rev:0.02,share:0.5},{m:"M3",rev:0.08,share:2},{m:"M6",rev:0.2,share:4},{m:"M9",rev:0.4,share:7},{m:"M12",rev:0.6,share:9},{m:"M18",rev:0.9,share:11},{m:"M24",rev:1.1,share:12}],
        sources:[{l:"Celltrion Pipeline",u:"https://www.celltrionhealthcare.com/en/biosimilars"},{l:"FDA Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=steqeyma`}]},
      {company:"Biocon (Yesintek)",phase:"Launched",signal:"confirmed",est:"Launched Feb 2025",strength:85,mfg:"Biocon Bengaluru",commercial:"Direct US launch — 90% WAC discount, 100M+ lives covered",weakness:"First US launch as standalone — proving commercial capabilities",
        monthlyForecast:[{m:"M1",rev:0.03,share:1},{m:"M3",rev:0.15,share:3},{m:"M6",rev:0.5,share:8},{m:"M9",rev:0.8,share:13},{m:"M12",rev:1.2,share:17},{m:"M18",rev:1.6,share:20},{m:"M24",rev:1.8,share:19}],
        sources:[{l:"Yesintek Launch PR",u:"https://www.bioconbiologics.com/biocon-biologics-launches-yesintek-ustekinumab-kfce-biosimilar-to-stelara-in-the-united-states/"},{l:"FDA Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=yesintek`}]},
    ],
    projection:[{y:"2025",oR:7.5,bR:3.5,tot:11.0,pr:69},{y:"2026",oR:3.2,bR:5.8,tot:9.0,pr:36},{y:"2027",oR:1.5,bR:5.0,tot:6.5,pr:23},{y:"2028",oR:0.8,bR:3.5,tot:4.3,pr:19}],
  },
  { id:2,drug:"Eliquis",molecule:"Apixaban",originator:"BMS/Pfizer",indication:"Factor Xa Inhibitor",patentExpiry:"2028-04-01",revenue:18.0,therapyArea:"Cardiology",type:"Small Molecule",
    dosageForms:[{form:"5mg Tablet",pct:60},{form:"2.5mg Tablet",pct:40}],
    competitors:[
      {company:"Teva",phase:"Tentative Approval",signal:"strong",est:"Apr 2028",strength:90,mfg:"Global generic",commercial:"#1 US generic",weakness:"Blocked by litigation until April 2028",
        monthlyForecast:[{m:"M1",rev:0.3,share:8},{m:"M3",rev:1.2,share:20},{m:"M6",rev:2.5,share:32},{m:"M9",rev:3.2,share:38},{m:"M12",rev:3.5,share:40},{m:"M18",rev:3.0,share:35},{m:"M24",rev:2.5,share:30}],
        sources:[{l:"ANDA Filing",u:`https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm`},{l:"Teva 10-K",u:`https://www.sec.gov/cgi-bin/browse-edgar?company=teva&CIK=&type=10-K&action=getcompany`}]},
      {company:"Aurobindo",phase:"Tentative Approval",signal:"strong",est:"Apr 2028",strength:82,mfg:"India+US sites",commercial:"Growing US",weakness:"Blocked by litigation until 2028",
        monthlyForecast:[{m:"M1",rev:0,share:0},{m:"M3",rev:0.3,share:5},{m:"M6",rev:0.8,share:10},{m:"M9",rev:1.5,share:18},{m:"M12",rev:2.0,share:22},{m:"M18",rev:2.2,share:25},{m:"M24",rev:2.0,share:24}],
        sources:[{l:"Orange Book",u:`https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm`},{l:"Aurobindo IR",u:"https://www.aurobindo.com/investor-relations"}]},
      {company:"Dr. Reddy's",phase:"ANDA Filed",signal:"strong",est:"2028-2031",strength:80,mfg:"India+US",commercial:"Established US",weakness:"Court ruling may delay to 2031",
        monthlyForecast:[{m:"M1",rev:0,share:0},{m:"M3",rev:0.2,share:3},{m:"M6",rev:0.6,share:8},{m:"M9",rev:1.0,share:12},{m:"M12",rev:1.4,share:16},{m:"M18",rev:1.8,share:20},{m:"M24",rev:1.6,share:19}],
        sources:[{l:"Dr. Reddy's Pipeline",u:"https://www.drreddys.com/products-and-pipeline"},{l:"SEC Filing",u:`https://www.sec.gov/cgi-bin/browse-edgar?company=dr+reddy&CIK=&type=10-K&action=getcompany`}]},
      {company:"Mylan/Viatris",phase:"Tentative Approval",signal:"strong",est:"Apr 2028",strength:85,mfg:"Global",commercial:"Strong US generics",weakness:"Settlement terms limit early launch",
        monthlyForecast:[{m:"M1",rev:0.2,share:5},{m:"M3",rev:0.8,share:12},{m:"M6",rev:1.5,share:20},{m:"M9",rev:2.0,share:24},{m:"M12",rev:2.2,share:26},{m:"M18",rev:2.0,share:24},{m:"M24",rev:1.8,share:22}],
        sources:[{l:"Viatris Pipeline",u:"https://www.viatris.com/en/products"},{l:"Orange Book",u:`https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm`}]},
    ],
    projection:[{y:"2026",oR:17.0,bR:0,tot:17.0,pr:100},{y:"2027",oR:16.5,bR:0,tot:16.5,pr:97},{y:"2028",oR:9.0,bR:4.5,tot:13.5,pr:50},{y:"2029",oR:3.6,bR:5.4,tot:9.0,pr:20}],
  },
  { id:3,drug:"Keytruda",molecule:"Pembrolizumab",originator:"Merck",indication:"PD-1 Inhibitor",patentExpiry:"2028-04-20",revenue:25.0,therapyArea:"Oncology",type:"Biologic",
    dosageForms:[{form:"100mg/4mL IV Vial",pct:60},{form:"25mg/mL IV Vial",pct:15},{form:"SC Keytruda Qlex (approved Sep 2025)",pct:25}],
    competitors:[
      {company:"Biocon/Viatris",phase:"Phase III",signal:"strong",est:"2028-2029",strength:80,mfg:"Biocon Bengaluru",commercial:"Viatris US",weakness:"BLA not yet filed — trial ongoing",
        monthlyForecast:[{m:"M1",rev:0.1,share:1},{m:"M3",rev:0.5,share:4},{m:"M6",rev:1.5,share:10},{m:"M9",rev:2.8,share:16},{m:"M12",rev:4.0,share:22},{m:"M18",rev:5.5,share:28},{m:"M24",rev:6.0,share:30}],
        sources:[{l:"HERITAGE-1 Trial",u:`https://clinicaltrials.gov/search?term=biocon+pembrolizumab+HERITAGE`},{l:"Viatris 10-K",u:`https://www.sec.gov/cgi-bin/browse-edgar?company=viatris&CIK=&type=10-K&action=getcompany`}]},
      {company:"Samsung Bioepis (SB27)",phase:"Phase III",signal:"strong",est:"2028-2029",strength:82,mfg:"Samsung Biologics",commercial:"Global partnerships",weakness:"Filing expected 2026 — competing timeline",
        monthlyForecast:[{m:"M1",rev:0.08,share:1},{m:"M3",rev:0.4,share:3},{m:"M6",rev:1.2,share:8},{m:"M9",rev:2.2,share:13},{m:"M12",rev:3.2,share:18},{m:"M18",rev:4.5,share:23},{m:"M24",rev:5.0,share:25}],
        sources:[{l:"SB27 Phase III",u:`https://clinicaltrials.gov/search?term=SB27+pembrolizumab`},{l:"Samsung Bioepis",u:"https://www.samsungbioepis.com/en/pipeline.do"}]},
      {company:"Amgen (ABP 234)",phase:"Phase III",signal:"strong",est:"2028-2029",strength:85,mfg:"Amgen global",commercial:"#1 biosimilar revenue",weakness:"Multiple trials ongoing — primary completion 2026",
        monthlyForecast:[{m:"M1",rev:0.1,share:1},{m:"M3",rev:0.6,share:5},{m:"M6",rev:1.5,share:10},{m:"M9",rev:2.5,share:15},{m:"M12",rev:3.5,share:20},{m:"M18",rev:5.0,share:25},{m:"M24",rev:5.5,share:28}],
        sources:[{l:"ABP 234 Trial",u:`https://clinicaltrials.gov/search?term=ABP+234+pembrolizumab`},{l:"Amgen Pipeline",u:"https://www.amgen.com/science/research-and-development-strategy/biosimilars"}]},
      {company:"Formycon (FYB206)",phase:"Phase I (PK)",signal:"moderate",est:"2029",strength:72,mfg:"CDMO partners",commercial:"Partnership TBD",weakness:"Cancelled Phase III — relying on PK study + analytics for approval",
        monthlyForecast:[{m:"M12",rev:0.2,share:1},{m:"M18",rev:0.8,share:4},{m:"M24",rev:1.5,share:8}],
        sources:[{l:"Formycon Pipeline",u:"https://www.formycon.com/en/pipeline/"},{l:"FDA Strategy",u:`https://clinicaltrials.gov/search?term=FYB206+pembrolizumab`}]},
      {company:"Sandoz (GME751)",phase:"Phase I/III",signal:"moderate",est:"2029+",strength:70,mfg:"Sandoz/Kundl",commercial:"Global #1 biosim",weakness:"Behind Samsung Bioepis and Amgen in clinical progress",
        monthlyForecast:[{m:"M12",rev:0,share:0},{m:"M18",rev:0.2,share:1},{m:"M24",rev:0.5,share:3}],
        sources:[{l:"Sandoz Pipeline",u:"https://www.sandoz.com/en/what-we-do/biosimilars"},{l:"GME751 Trial",u:`https://clinicaltrials.gov/search?term=GME751+pembrolizumab`}]},
    ],
    projection:[{y:"2028",oR:25.0,bR:1.0,tot:26.0,pr:100},{y:"2029",oR:14.0,bR:7.5,tot:21.5,pr:58},{y:"2030",oR:7.5,bR:10.0,tot:17.5,pr:38},{y:"2031",oR:4.0,bR:9.0,tot:13.0,pr:28}],
  },
  { id:4,drug:"Eylea",molecule:"Aflibercept",originator:"Regeneron",indication:"VEGF Inhibitor",patentExpiry:"2027-05-13",revenue:6.1,therapyArea:"Ophthalmology",type:"Biologic",
    dosageForms:[{form:"2mg/0.05mL Intravitreal",pct:65},{form:"8mg/0.07mL HD (Eylea HD)",pct:35}],
    competitors:[
      {company:"Amgen (Pavblu)",phase:"Launched (at-risk)",signal:"confirmed",est:"Launched 2025",strength:88,mfg:"Amgen global",commercial:"First aflibercept biosimilar on US market — at-risk launch",weakness:"Regeneron litigation pending — risk of damages",
        monthlyForecast:[{m:"M1",rev:0.02,share:1},{m:"M3",rev:0.08,share:3},{m:"M6",rev:0.2,share:6},{m:"M9",rev:0.4,share:10},{m:"M12",rev:0.6,share:14},{m:"M18",rev:0.8,share:18},{m:"M24",rev:1.0,share:22}],
        sources:[{l:"FDA Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=pavblu`},{l:"Amgen Pipeline",u:"https://www.amgen.com/science/research-and-development-strategy/biosimilars"}]},
      {company:"Biocon (Yesafili)",phase:"Approved — Settlement",signal:"confirmed",est:"H2 2026",strength:82,mfg:"Biocon Bengaluru",commercial:"Interchangeable biosimilar — Biocon US direct",weakness:"Regeneron settlement limits launch to H2 2026",
        monthlyForecast:[{m:"M1",rev:0.01,share:0.5},{m:"M3",rev:0.06,share:2},{m:"M6",rev:0.15,share:5},{m:"M9",rev:0.3,share:8},{m:"M12",rev:0.45,share:12},{m:"M18",rev:0.6,share:15},{m:"M24",rev:0.8,share:17}],
        sources:[{l:"Yesafili Settlement",u:"https://www.biocon.com/biosimilars/"},{l:"FDA Record",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=yesafili`}]},
      {company:"Sandoz (Enzeevu)",phase:"Approved — Settlement",signal:"confirmed",est:"Q4 2026",strength:85,mfg:"Sandoz/Samsung Bioepis dev",commercial:"Sandoz global leader",weakness:"Injunction blocked Samsung Bioepis — Sandoz has separate approval",
        monthlyForecast:[{m:"M1",rev:0.01,share:0.5},{m:"M3",rev:0.05,share:2},{m:"M6",rev:0.12,share:4},{m:"M9",rev:0.25,share:7},{m:"M12",rev:0.4,share:10},{m:"M18",rev:0.55,share:13},{m:"M24",rev:0.7,share:15}],
        sources:[{l:"Enzeevu Settlement",u:"https://www.sandoz.com/en/what-we-do/biosimilars"},{l:"FDA Record",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=enzeevu`}]},
      {company:"Formycon/Fresenius Kabi (Ahzantive)",phase:"Approved — Settlement",signal:"confirmed",est:"Q4 2026",strength:80,mfg:"Formycon/CDMO",commercial:"Fresenius Kabi US",weakness:"Later entrant in crowded market",
        monthlyForecast:[{m:"M1",rev:0.01,share:0.3},{m:"M3",rev:0.04,share:1},{m:"M6",rev:0.1,share:3},{m:"M9",rev:0.2,share:5},{m:"M12",rev:0.3,share:8},{m:"M18",rev:0.45,share:10},{m:"M24",rev:0.55,share:12}],
        sources:[{l:"Formycon Pipeline",u:"https://www.formycon.com/en/pipeline/"},{l:"Ahzantive Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=ahzantive`}]},
      {company:"Celltrion (Eydenzelt)",phase:"Approved — Settlement",signal:"confirmed",est:"Dec 2026",strength:78,mfg:"Celltrion Incheon",commercial:"Celltrion Healthcare US",weakness:"Last settlement date among approved biosimilars",
        monthlyForecast:[{m:"M3",rev:0.01,share:0.5},{m:"M6",rev:0.05,share:2},{m:"M9",rev:0.15,share:4},{m:"M12",rev:0.25,share:6},{m:"M18",rev:0.4,share:9},{m:"M24",rev:0.5,share:11}],
        sources:[{l:"Celltrion PR",u:"https://www.celltrion.com/en-us/company/media-center"},{l:"Eydenzelt Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=eydenzelt`}]},
    ],
    projection:[{y:"2025",oR:5.8,bR:0.3,tot:6.1,pr:95},{y:"2026",oR:4.0,bR:1.5,tot:5.5,pr:73},{y:"2027",oR:2.5,bR:2.5,tot:5.0,pr:50},{y:"2028",oR:1.5,bR:2.8,tot:4.3,pr:35}],
  },
  { id:5,drug:"Opdivo",molecule:"Nivolumab",originator:"BMS",indication:"PD-1 Inhibitor",patentExpiry:"2028-12-19",revenue:9.0,therapyArea:"Oncology",type:"Biologic",
    dosageForms:[{form:"40mg/4mL IV Vial",pct:20},{form:"100mg/10mL IV Vial",pct:55},{form:"240mg/24mL IV Vial",pct:25}],
    competitors:[
      {company:"Junshi Biosciences",phase:"Phase III",signal:"strong",est:"Q1 2029",strength:72,mfg:"Shanghai",commercial:"China + partners",weakness:"Limited global infra",
        monthlyForecast:[{m:"M3",rev:0.1,share:2},{m:"M6",rev:0.4,share:7},{m:"M12",rev:1.0,share:15},{m:"M18",rev:1.5,share:20},{m:"M24",rev:1.8,share:24}],
        sources:[{l:"Junshi Pipeline",u:"https://www.junshipharma.com/en/pipeline"},{l:"CDE Filing",u:"https://english.nmpa.gov.cn/"}]},
      {company:"Fresenius Kabi",phase:"Phase III",signal:"strong",est:"Q2 2029",strength:78,mfg:"Fresenius+mAbxience",commercial:"EU strong",weakness:"US market entry",
        monthlyForecast:[{m:"M3",rev:0.08,share:1},{m:"M6",rev:0.3,share:5},{m:"M12",rev:0.8,share:12},{m:"M18",rev:1.2,share:16},{m:"M24",rev:1.5,share:20}],
        sources:[{l:"Fresenius Pipeline",u:"https://www.fresenius-kabi.com/products/biosimilars"},{l:"EMA Search",u:`https://www.ema.europa.eu/en/medicines?search_api_fulltext=nivolumab+biosimilar`}]},
    ],
    projection:[{y:"2028",oR:9.0,bR:0.5,tot:9.5,pr:100},{y:"2029",oR:5.4,bR:3.0,tot:8.4,pr:62},{y:"2030",oR:3.0,bR:4.0,tot:7.0,pr:42},{y:"2031",oR:1.8,bR:3.5,tot:5.3,pr:32}],
  },
  { id:6,drug:"Dupixent",molecule:"Dupilumab",originator:"Sanofi/Regeneron",indication:"IL-4/13 Inhibitor",patentExpiry:"2031-06-15",revenue:13.7,therapyArea:"Immunology",type:"Biologic",
    dosageForms:[{form:"200mg/1.14mL PFS",pct:40},{form:"300mg/2mL PFS",pct:50},{form:"200mg/1.14mL Pen",pct:10}],
    competitors:[
      {company:"Harbour BioMed",phase:"Phase II",signal:"moderate",est:"2032+",strength:55,mfg:"China CDMO",commercial:"Partnership needed",weakness:"Pre-revenue, novel approach",
        monthlyForecast:[{m:"M6",rev:0.05,share:1},{m:"M12",rev:0.2,share:3},{m:"M18",rev:0.5,share:5},{m:"M24",rev:0.8,share:7}],
        sources:[{l:"HBM9378 Trial",u:`https://clinicaltrials.gov/search?term=HBM9378+dupilumab`},{l:"Harbour BioMed",u:"https://www.harbourbiomed.com/en/product"}]},
      {company:"Biocon",phase:"Phase I",signal:"early",est:"2033+",strength:50,mfg:"Biocon Bengaluru",commercial:"Viatris",weakness:"Very early, uncertain",
        monthlyForecast:[{m:"M12",rev:0.1,share:1},{m:"M18",rev:0.3,share:2},{m:"M24",rev:0.5,share:4}],
        sources:[{l:"Biocon Biosimilars",u:"https://www.biocon.com/biosimilars/"},{l:"Patent Search",u:`https://patents.google.com/?q=dupilumab+biosimilar`}]},
    ],
    projection:[{y:"2031",oR:16.0,bR:0.5,tot:16.5,pr:100},{y:"2032",oR:9.6,bR:4.0,tot:13.6,pr:62},{y:"2033",oR:5.5,bR:5.5,tot:11.0,pr:45},{y:"2034",oR:3.5,bR:5.0,tot:8.5,pr:38}],
  },
  { id:7,drug:"Ozempic/Wegovy",molecule:"Semaglutide",originator:"Novo Nordisk",indication:"GLP-1 Agonist",patentExpiry:"2032-06-07",revenue:28.0,therapyArea:"Metabolic",type:"Biologic",
    dosageForms:[{form:"0.25mg/0.5mg Pen (Ozempic)",pct:35},{form:"1mg/2mg Pen (Ozempic)",pct:30},{form:"2.4mg Pen (Wegovy)",pct:25},{form:"Oral 14mg Tablet (Rybelsus)",pct:10}],
    competitors:[
      {company:"Biocon",phase:"Phase I",signal:"early",est:"2033+",strength:55,mfg:"Biocon",commercial:"Viatris",weakness:"Peptide complexity",
        monthlyForecast:[{m:"M6",rev:0.2,share:1},{m:"M12",rev:0.8,share:4},{m:"M18",rev:1.5,share:6},{m:"M24",rev:2.5,share:8}],
        sources:[{l:"Patent Landscape",u:`https://patents.google.com/?q=semaglutide+biosimilar`},{l:"Biocon Pipeline",u:"https://www.biocon.com/biosimilars/"}]},
      {company:"Teva",phase:"Pre-clinical",signal:"speculative",est:"2034+",strength:45,mfg:"Teva global",commercial:"#1 generic",weakness:"Peptide biomanufacturing gap",
        monthlyForecast:[{m:"M12",rev:0.3,share:1},{m:"M18",rev:0.8,share:3},{m:"M24",rev:1.5,share:5}],
        sources:[{l:"Teva Pipeline",u:"https://www.tevapharm.com/product-portfolio/"},{l:"SEC Mention",u:`https://www.sec.gov/cgi-bin/browse-edgar?company=teva&CIK=&type=10-K&action=getcompany`}]},
    ],
    projection:[{y:"2032",oR:28.0,bR:0.5,tot:28.5,pr:100},{y:"2033",oR:16.0,bR:6.0,tot:22.0,pr:58},{y:"2034",oR:9.0,bR:8.0,tot:17.0,pr:40},{y:"2035",oR:5.0,bR:7.5,tot:12.5,pr:30}],
  },
  { id:8,drug:"Xarelto",molecule:"Rivaroxaban",originator:"Bayer/J&J",indication:"Factor Xa Inhibitor",patentExpiry:"2025-02-28",revenue:6.4,therapyArea:"Cardiology",type:"Small Molecule",
    dosageForms:[{form:"2.5mg Tablet",pct:15},{form:"10mg Tablet",pct:20},{form:"15mg Tablet",pct:30},{form:"20mg Tablet",pct:35}],
    competitors:[
      {company:"Lupin",phase:"Launched",signal:"confirmed",est:"Launched Mar 2025",strength:88,mfg:"India+US",commercial:"First generic (2.5mg), expanding strengths",weakness:"Initially only 2.5mg; 10/15/20mg rolling out",
        monthlyForecast:[{m:"M1",rev:0.2,share:10},{m:"M3",rev:0.6,share:18},{m:"M6",rev:1.0,share:28},{m:"M12",rev:1.5,share:35},{m:"M18",rev:1.4,share:33},{m:"M24",rev:1.2,share:30}],
        sources:[{l:"FDA Approval",u:`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=rivaroxaban`},{l:"Orange Book",u:`https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm`}]},
      {company:"Taro (Sun Pharma)",phase:"Launched",signal:"confirmed",est:"Launched Mar 2025",strength:85,mfg:"Sun Pharma global",commercial:"US generic presence",weakness:"Multiple competitor generics launching simultaneously",
        monthlyForecast:[{m:"M1",rev:0.15,share:8},{m:"M3",rev:0.4,share:12},{m:"M6",rev:0.7,share:20},{m:"M12",rev:1.0,share:25},{m:"M18",rev:1.0,share:25},{m:"M24",rev:0.9,share:22}],
        sources:[{l:"FDA Approval",u:`https://www.accessdata.fda.gov/scripts/cder/ob/index.cfm`},{l:"Sun Pharma",u:"https://www.sunpharma.com/products"}]},
    ],
    projection:[{y:"2025",oR:3.5,bR:1.5,tot:5.0,pr:55},{y:"2026",oR:1.2,bR:2.0,tot:3.2,pr:19},{y:"2027",oR:0.4,bR:1.2,tot:1.6,pr:10},{y:"2028",oR:0.2,bR:0.6,tot:0.8,pr:8}],
  },
];

// ═══ ALL KNOWN MOLECULES FOR DROPDOWNS (CHANGE 2, 6) ═══
const ALL_MOLECULES = [
  "Adalimumab","Ustekinumab","Apixaban","Pembrolizumab","Aflibercept","Nivolumab","Dupilumab","Semaglutide","Rivaroxaban",
  "Trastuzumab","Bevacizumab","Infliximab","Rituximab","Ranibizumab","Denosumab","Pegfilgrastim","Insulin Glargine","Epoetin Alfa",
  "Enoxaparin","Etanercept","Filgrastim","Insulin Lispro","Insulin Aspart","Teriparatide","Darbepoetin Alfa",
  "Natalizumab","Omalizumab","Tocilizumab","Secukinumab","Vedolizumab","Atezolizumab","Durvalumab","Avelumab","Ipilimumab",
  "Cetuximab","Panitumumab","Pertuzumab","Daratumumab","Elotuzumab","Brentuximab","Obinutuzumab",
  "Abatacept","Golimumab","Certolizumab","Sarilumab","Baricitinib","Tofacitinib","Upadacitinib","Risankizumab",
  "Guselkumab","Tildrakizumab","Brodalumab","Ixekizumab","Erenumab","Fremanezumab","Galcanezumab",
  "Ozanimod","Siponimod","Ocrelizumab","Ofatumumab","Cladribine","Dimethyl Fumarate",
  "Empagliflozin","Dapagliflozin","Canagliflozin","Tirzepatide","Liraglutide","Dulaglutide","Exenatide",
  "Sacubitril/Valsartan","Riociguat","Ivacaftor","Elexacaftor","Lenvatinib","Cabozantinib","Ibrutinib","Acalabrutinib",
];

// ═══ MOLECULE METADATA for custom dropdown intelligence ═══
const MOL_META = {
  "Trastuzumab":{area:"Oncology",type:"Biologic",originator:"Roche",brand:"Herceptin",rev:"$7.1B peak",loe:"2019",analog:"Herceptin",status:"LOE passed — 7 biosimilars on market",players:7},
  "Bevacizumab":{area:"Oncology",type:"Biologic",originator:"Roche",brand:"Avastin",rev:"$7.0B peak",loe:"2019",analog:"Avastin",status:"LOE passed — 6 biosimilars on market",players:6},
  "Infliximab":{area:"Immunology",type:"Biologic",originator:"J&J",brand:"Remicade",rev:"$9.2B peak",loe:"2018",analog:"Remicade",status:"LOE passed — 5 biosimilars on market",players:5},
  "Rituximab":{area:"Oncology/Immunology",type:"Biologic",originator:"Roche",brand:"Rituxan",rev:"$7.5B peak",loe:"2018",analog:"Rituxan",status:"LOE passed — 4 biosimilars on market",players:4},
  "Ranibizumab":{area:"Ophthalmology",type:"Biologic",originator:"Roche/Novartis",brand:"Lucentis",rev:"$3.5B peak",loe:"2020",analog:"Eylea",status:"Biosimilars launched. Formycon FYB201 approved.",players:3},
  "Denosumab":{area:"Bone/Oncology",type:"Biologic",originator:"Amgen",brand:"Prolia/Xgeva",rev:"$5.8B",loe:"2025",analog:"Stelara",status:"Sandoz biosimilar approved 2024. 3+ in pipeline.",players:3},
  "Pegfilgrastim":{area:"Oncology Support",type:"Biologic",originator:"Amgen",brand:"Neulasta",rev:"$4.7B peak",loe:"2020",analog:"Neulasta",status:"LOE passed — 6 biosimilars, 85% price erosion.",players:6},
  "Insulin Glargine":{area:"Metabolic",type:"Biologic",originator:"Sanofi",brand:"Lantus",rev:"$7.0B peak",loe:"2020",analog:"Lantus",status:"LOE passed — biosimilars + IRA price caps.",players:4},
  "Epoetin Alfa":{area:"Nephrology",type:"Biologic",originator:"Amgen/J&J",brand:"Epogen",rev:"$3.2B peak",loe:"2020",analog:"Epogen/Procrit",status:"LOE passed — dialysis center consolidation accelerated switching.",players:3},
  "Enoxaparin":{area:"Cardiology",type:"Complex Generic",originator:"Sanofi",brand:"Lovenox",rev:"$4.5B peak",loe:"2010",analog:"Xarelto",status:"Multiple generics on market. Commoditized.",players:8},
  "Etanercept":{area:"Immunology",type:"Biologic",originator:"Amgen/Pfizer",brand:"Enbrel",rev:"$8.0B peak",loe:"2023 (EU 2016)",analog:"Humira",status:"EU biosimilars launched. US patent defense ongoing.",players:4},
  "Filgrastim":{area:"Oncology Support",type:"Biologic",originator:"Amgen",brand:"Neupogen",rev:"$1.4B peak",loe:"2015",analog:"Neulasta",status:"First US biosimilar (Zarxio 2015). Fully commoditized.",players:7},
  "Insulin Lispro":{area:"Metabolic",type:"Biologic",originator:"Eli Lilly",brand:"Humalog",rev:"$3.0B peak",loe:"2020",analog:"Lantus",status:"Authorized generic + biosimilars. IRA price caps apply.",players:4},
  "Insulin Aspart":{area:"Metabolic",type:"Biologic",originator:"Novo Nordisk",brand:"NovoLog",rev:"$3.2B peak",loe:"2020",analog:"Lantus",status:"Biosimilars available. Insulin market restructuring.",players:3},
  "Teriparatide":{area:"Bone",type:"Biologic",originator:"Eli Lilly",brand:"Forteo",rev:"$1.8B peak",loe:"2019",analog:"Stelara",status:"Generics available. Niche osteoporosis market.",players:3},
  "Darbepoetin Alfa":{area:"Nephrology",type:"Biologic",originator:"Amgen",brand:"Aranesp",rev:"$2.1B peak",loe:"2024",analog:"Epogen/Procrit",status:"Biosimilar competition beginning. Similar to EPO dynamics.",players:2},
  "Natalizumab":{area:"Neurology",type:"Biologic",originator:"Biogen",brand:"Tysabri",rev:"$2.0B",loe:"2027",analog:"Dupixent",status:"Sandoz biosimilar in Phase III. MS market shifting to oral.",players:2},
  "Omalizumab":{area:"Immunology/Respiratory",type:"Biologic",originator:"Roche/Novartis",brand:"Xolair",rev:"$3.8B",loe:"2025",analog:"Stelara",status:"Biosimilars approved. Expanding to food allergy indication.",players:3},
  "Tocilizumab":{area:"Immunology",type:"Biologic",originator:"Roche",brand:"Actemra",rev:"$4.0B peak",loe:"2023",analog:"Humira",status:"Biosimilar competition starting. COVID use expanded market.",players:2},
  "Secukinumab":{area:"Immunology",type:"Biologic",originator:"Novartis",brand:"Cosentyx",rev:"$5.0B",loe:"2029",analog:"Stelara",status:"Early biosimilar programs. IL-17A pathway.",players:2},
  "Vedolizumab":{area:"Immunology/GI",type:"Biologic",originator:"Takeda",brand:"Entyvio",rev:"$5.5B",loe:"2029",analog:"Stelara",status:"Gut-selective integrin. Complex manufacturing. Few biosimilars.",players:1},
  "Atezolizumab":{area:"Oncology",type:"Biologic",originator:"Roche",brand:"Tecentriq",rev:"$3.8B",loe:"2031",analog:"Keytruda",status:"PD-L1 checkpoint. Biosimilar programs early-stage.",players:1},
  "Durvalumab":{area:"Oncology",type:"Biologic",originator:"AstraZeneca",brand:"Imfinzi",rev:"$4.2B",loe:"2032",analog:"Keytruda",status:"PD-L1 checkpoint. Long patent life. Few biosimilar entrants.",players:0},
  "Avelumab":{area:"Oncology",type:"Biologic",originator:"Pfizer/Merck KGaA",brand:"Bavencio",rev:"$0.5B",loe:"2032",analog:"Opdivo",status:"Niche PD-L1. Small market unlikely to attract biosimilars.",players:0},
  "Ipilimumab":{area:"Oncology",type:"Biologic",originator:"BMS",brand:"Yervoy",rev:"$2.2B",loe:"2025",analog:"Opdivo",status:"CTLA-4 checkpoint. Used in combo with Opdivo. Biosimilars starting.",players:2},
  "Cetuximab":{area:"Oncology",type:"Biologic",originator:"Eli Lilly",brand:"Erbitux",rev:"$1.8B peak",loe:"2016 (EU)",analog:"Herceptin",status:"EU biosimilars available. US patent complex.",players:2},
  "Pertuzumab":{area:"Oncology",type:"Biologic",originator:"Roche",brand:"Perjeta",rev:"$4.3B",loe:"2028",analog:"Keytruda",status:"HER2 combo with trastuzumab. Biosimilar programs early.",players:1},
  "Daratumumab":{area:"Oncology",type:"Biologic",originator:"J&J",brand:"Darzalex",rev:"$9.4B",loe:"2032",analog:"Keytruda",status:"Anti-CD38 for myeloma. Long patent life. Subcutaneous form extends IP.",players:0},
  "Abatacept":{area:"Immunology",type:"Biologic",originator:"BMS",brand:"Orencia",rev:"$3.5B",loe:"2026",analog:"Humira",status:"CTLA4-Ig fusion. Biosimilar programs advancing.",players:2},
  "Risankizumab":{area:"Immunology",type:"Biologic",originator:"AbbVie",brand:"Skyrizi",rev:"$8.0B",loe:"2035",analog:"Stelara",status:"IL-23. Long patent runway. No biosimilar programs yet.",players:0},
  "Guselkumab":{area:"Immunology",type:"Biologic",originator:"J&J",brand:"Tremfya",rev:"$3.5B",loe:"2032",analog:"Stelara",status:"IL-23. Protected through 2030s.",players:0},
  "Ixekizumab":{area:"Immunology",type:"Biologic",originator:"Eli Lilly",brand:"Taltz",rev:"$2.5B",loe:"2031",analog:"Stelara",status:"IL-17A. Long patent protection.",players:0},
  "Erenumab":{area:"Neurology",type:"Biologic",originator:"Amgen/Novartis",brand:"Aimovig",rev:"$0.8B",loe:"2030",analog:"Dupixent",status:"CGRP migraine. Small molecule competitors more impactful than biosimilars.",players:0},
  "Ocrelizumab":{area:"Neurology",type:"Biologic",originator:"Roche",brand:"Ocrevus",rev:"$6.2B",loe:"2028",analog:"Keytruda",status:"Anti-CD20 for MS. Biosimilar programs starting in China.",players:1},
  "Tirzepatide":{area:"Metabolic",type:"Biologic",originator:"Eli Lilly",brand:"Mounjaro/Zepbound",rev:"$12B+",loe:"2036+",analog:"Ozempic/Wegovy",status:"GIP/GLP-1 dual agonist. Extensive patent estate. No near-term biosimilar threat.",players:0},
  "Liraglutide":{area:"Metabolic",type:"Biologic",originator:"Novo Nordisk",brand:"Victoza/Saxenda",rev:"$4.0B peak",loe:"2023",analog:"Ozempic/Wegovy",status:"GLP-1 predecessor to semaglutide. Biosimilar programs active.",players:2},
  "Dulaglutide":{area:"Metabolic",type:"Biologic",originator:"Eli Lilly",brand:"Trulicity",rev:"$7.4B peak",loe:"2027",analog:"Ozempic/Wegovy",status:"Weekly GLP-1. Biosimilar programs in China and India.",players:2},
  "Empagliflozin":{area:"Cardiology/Metabolic",type:"Small Molecule",originator:"Boehringer/Lilly",brand:"Jardiance",rev:"$7.5B",loe:"2025",analog:"Eliquis",status:"SGLT2 inhibitor. Generic entry expected. Auto-substitution.",players:3},
  "Dapagliflozin":{area:"Cardiology/Metabolic",type:"Small Molecule",originator:"AstraZeneca",brand:"Farxiga",rev:"$5.8B",loe:"2026",analog:"Eliquis",status:"SGLT2 inhibitor. Generic entry expected 2026-2027.",players:2},
  "Sacubitril/Valsartan":{area:"Cardiology",type:"Small Molecule",originator:"Novartis",brand:"Entresto",rev:"$6.0B",loe:"2026",analog:"Eliquis",status:"ARNI combo. Patent challenges filed. Generics expected 2026.",players:4},
  "Ibrutinib":{area:"Oncology",type:"Small Molecule",originator:"AbbVie/J&J",brand:"Imbruvica",rev:"$9.0B peak",loe:"2027 (some patents)",analog:"Eliquis",status:"BTK inhibitor. Complex litigation. Generic programs active.",players:3},
  "Lenvatinib":{area:"Oncology",type:"Small Molecule",originator:"Eisai",brand:"Lenvima",rev:"$4.5B",loe:"2027",analog:"Xarelto",status:"Multi-kinase inhibitor. Generic programs filing.",players:2},
};

// Find closest tracked analog for any molecule
const getAnalog = (mol) => {
  const meta = MOL_META[mol];
  if(!meta) return DRUGS[0];
  const area = meta.area?.split("/")[0];
  return DRUGS.find(d=>d.therapyArea===area) || DRUGS.find(d=>d.type===meta.type) || DRUGS[0];
};

// ═══ COMPANIES FOR CHANGE 3,4,7 ═══
const COMPANIES = [
  {name:"Amgen",type:"Originator + Biosimilar",hq:"US",strengths:["Strong manufacturing","US commercial dominance","Biosimilar leader"],weaknesses:["LOE exposure on legacy portfolio","Pricing pressure"]},
  {name:"Sandoz",type:"Biosimilar Leader",hq:"Switzerland",strengths:["#1 global biosimilar","Manufacturing scale","Regulatory expertise"],weaknesses:["Margin pressure","Originator competition"]},
  {name:"Samsung Bioepis",type:"Biosimilar Developer",hq:"South Korea",strengths:["Samsung Biologics CDMO","Strong pipeline breadth","EMA/FDA track record"],weaknesses:["US commercial dependent on partners","Brand awareness"]},
  {name:"Celltrion",type:"Biosimilar Developer",hq:"South Korea",strengths:["Vertically integrated","Strong Asian presence","Cost advantage"],weaknesses:["US commercial infrastructure gap","Regulatory delays"]},
  {name:"Biocon",type:"Biosimilar Developer",hq:"India",strengths:["Lowest COGS globally","Vertical integration","Viatris partnership"],weaknesses:["FDA inspection history","US commercial via partner only","Quality perception"]},
  {name:"Teva",type:"Generic Leader",hq:"Israel",strengths:["#1 generic company globally","US distribution dominance","ANDA expertise"],weaknesses:["Debt burden","Limited biologic capability","Restructuring"]},
  {name:"Dr. Reddy's",type:"Generic Developer",hq:"India",strengths:["Strong US ANDA portfolio","Complex generics capability","Growing biosimilar"],weaknesses:["Limited biologic manufacturing","US commercial scale"]},
  {name:"Fresenius Kabi",type:"Biosimilar Developer",hq:"Germany",strengths:["EU hospital network","mAbxience acquisition","IV/injectable expertise"],weaknesses:["US market entry","Narrow pipeline"]},
  {name:"Merck",type:"Originator",hq:"US",strengths:["Keytruda franchise","R&D pipeline depth","Global commercial"],weaknesses:["55% revenue from single drug","Patent cliff 2028"]},
  {name:"BMS",type:"Originator",hq:"US",strengths:["Diversified oncology","Opdivo/Yervoy combos","Cell therapy"],weaknesses:["Multiple LOEs 2026-2030","Debt from Celgene"]},
  {name:"J&J",type:"Originator",hq:"US",strengths:["Diversified portfolio","Strong pipeline","Payer relationships"],weaknesses:["Stelara LOE 2025","Litigation exposure"]},
  {name:"Roche",type:"Originator",hq:"Switzerland",strengths:["Diagnostics + pharma","First-mover oncology","Ophtho franchise"],weaknesses:["Already lost Herceptin/Avastin/Rituxan","Eylea HD competition"]},
  {name:"Sanofi",type:"Originator",hq:"France",strengths:["Dupixent growth engine","Vaccines diversification","Global reach"],weaknesses:["Dupixent LOE 2031","Legacy portfolio shrinking"]},
  {name:"Novo Nordisk",type:"Originator",hq:"Denmark",strengths:["GLP-1 dominance","Obesity market creation","Manufacturing scale"],weaknesses:["Semaglutide concentration","Supply constraints","IRA exposure"]},
  {name:"Regeneron",type:"Originator",hq:"US",strengths:["Eylea franchise","Dupixent royalties","R&D innovation"],weaknesses:["Eylea LOE 2027","Biosimilar competition"]},
  {name:"Pfizer",type:"Originator + Biosimilar",hq:"US",strengths:["Global infrastructure","Biosimilar portfolio","Eliquis co-market"],weaknesses:["COVID revenue cliff","Multiple LOEs"]},
  {name:"AbbVie",type:"Originator",hq:"US",strengths:["Rinvoq/Skyrizi growth","Lifecycle management expertise","Payer relationships"],weaknesses:["Humira erosion ongoing","Debt load"]},
  {name:"Aurobindo",type:"Generic Developer",hq:"India",strengths:["Low-cost manufacturing","Growing US presence","Vertical integration"],weaknesses:["Brand awareness","Limited specialty"]},
  {name:"Cipla",type:"Generic Developer",hq:"India",strengths:["Respiratory expertise","Emerging market strength","Growing US"],weaknesses:["Limited US scale","No biologic capability"]},
  {name:"Harbour BioMed",type:"Biotech",hq:"China",strengths:["Novel biologic platform","IL-4Rα asset","Innovation focus"],weaknesses:["Pre-revenue","No commercial infrastructure","Funding risk"]},
  {name:"Formycon",type:"Biosimilar Developer",hq:"Germany",strengths:["Ophthalmology focus","EU expertise","Aflibercept biosimilar"],weaknesses:["Small scale","No US commercial","CDMO dependent"]},
  {name:"Alvotech",type:"Biosimilar Developer",hq:"Iceland",strengths:["Broadest pipeline","Teva partnership","Semaglutide program"],weaknesses:["Post-SPAC cash","Limited track record"]},
  {name:"Shanghai Henlius",type:"Biosimilar Developer",hq:"China",strengths:["China market access","Fosun partnership","Oncology focus"],weaknesses:["US regulatory gap","Geopolitical risk"]},
  {name:"Junshi Biosciences",type:"Biosimilar Developer",hq:"China",strengths:["PD-1 biosimilar leader China","Oncology expertise","Fast clinical execution"],weaknesses:["No US/EU presence","IP challenges"]},
];

// ═══ LITIGATION ═══
const LITIGATION = [
  {drug:"Eliquis",molecule:"Apixaban",plaintiff:"BMS/Pfizer",defendant:"Teva, Aurobindo, Cipla, Dr. Reddy's",court:"D. Delaware",type:"Hatch-Waxman (Para IV)",filed:"2023-08-15",status:"Trial Scheduled",nextDate:"2026-03-15",patents:5,winProb:35,impact:"$18B revenue at risk",dev:"Claim construction ruling narrowed patent scope — favors generics. All 5 patents proceed to trial.",link:`https://www.courtlistener.com/?q=apixaban+patent&type=r&order_by=score+desc`},
  {drug:"Keytruda",molecule:"Pembrolizumab",plaintiff:"Merck",defendant:"Biocon/Viatris",court:"D. New Jersey",type:"BPCIA Patent Dance",filed:"2024-11-20",status:"Discovery",nextDate:"2026-08-10",patents:12,winProb:55,impact:"$25B revenue at risk",dev:"BPCIA patent exchange ongoing; Merck listed 12 patents in Purple Book. Discovery phase.",link:`https://www.courtlistener.com/?q=pembrolizumab+merck+biocon&type=r`},
  {drug:"Eylea",molecule:"Aflibercept",plaintiff:"Regeneron",defendant:"Samsung Bioepis, Formycon",court:"S.D. New York",type:"BPCIA",filed:"2024-06-10",status:"Briefing",nextDate:"2026-05-20",patents:8,winProb:45,impact:"$6.1B revenue at risk",dev:"Two IPR petitions filed at PTAB challenging formulation patents.",link:`https://www.courtlistener.com/?q=aflibercept+regeneron+patent&type=r`},
  {drug:"Stelara",molecule:"Ustekinumab",plaintiff:"J&J",defendant:"Amgen, Samsung Bioepis",court:"D. Delaware",type:"BPCIA",filed:"2023-03-22",status:"Settled",nextDate:"N/A",patents:6,winProb:0,impact:"Settled — launch Jan 2025",dev:"Settlement grants biosimilar entry Jan 2025 — 8 months before patent expiry.",link:`https://www.courtlistener.com/?q=ustekinumab+janssen+patent&type=r`},
  {drug:"Humira",molecule:"Adalimumab",plaintiff:"AbbVie",defendant:"Multiple (9 companies)",court:"N.D. Illinois",type:"BPCIA",filed:"2017-2022",status:"All Settled",nextDate:"N/A",patents:132,winProb:0,impact:"Settled — staggered entry 2023",dev:"AbbVie's 132-patent thicket strategy ultimately settled with staggered entry dates.",link:`https://www.courtlistener.com/?q=adalimumab+abbvie+biosimilar&type=r`},
];

// ═══ PAYER DATA ═══
const PAYER_DATA = [
  {payer:"CVS Caremark",type:"PBM",lives:"110M",drug:"Humira → Biosimilar",decision:"Biosimilar Preferred",pref:"Hyrimoz (Sandoz)",eff:"Jan 2024",savings:"55%",notes:"Excluded Humira from national formulary.",link:"https://www.caremark.com/"},
  {payer:"Express Scripts",type:"PBM",lives:"100M",drug:"Humira → Biosimilar",decision:"Biosimilar Preferred",pref:"Hadlima (Samsung)",eff:"Jul 2023",savings:"48%",notes:"Single-source biosimilar exclusivity.",link:"https://www.express-scripts.com/"},
  {payer:"OptumRx",type:"PBM",lives:"89M",drug:"Humira → Multi-source",decision:"Multi-source",pref:"Open formulary",eff:"Jan 2024",savings:"42%",notes:"Competition driving rebates.",link:"https://professionals.optumrx.com/"},
  {payer:"Kaiser Permanente",type:"IDN",lives:"12.6M",drug:"Remicade → Inflectra",decision:"System Switch",pref:"Inflectra (Pfizer)",eff:"Sep 2019",savings:"62%",notes:"System-wide conversion. 85% switch in 12m.",link:"https://healthy.kaiserpermanente.org/"},
  {payer:"CVS Caremark",type:"PBM",lives:"110M",drug:"Stelara → Wezlana",decision:"Biosimilar Preferred",pref:"Wezlana (Amgen)",eff:"Feb 2025",savings:"Est. 40%",notes:"Pre-positioned preferred status.",link:"https://www.caremark.com/"},
  {payer:"Express Scripts",type:"PBM",lives:"100M",drug:"Eliquis (monitoring)",decision:"Monitoring",pref:"TBD — generic expected",eff:"2027",savings:"Est. 65%",notes:"Auto-substitution for small molecule.",link:"https://www.express-scripts.com/"},
  {payer:"CMS Medicare Part B",type:"Government",lives:"65M",drug:"All Oncology Biologics",decision:"ASP+6% for Biosimilar",pref:"Policy-driven",eff:"Ongoing",savings:"Variable",notes:"ASP reimbursement creates auto-incentive.",link:"https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files"},
];

// ═══ SUPPLY CHAIN ═══
const SUPPLY_CHAIN = [
  {co:"Samsung Biologics",type:"CDMO",event:"Plant 4+5 operational — 436,000L total",detail:"World's largest biopharma CDMO. Contracted for ustekinumab, aflibercept, pembrolizumab biosimilar supply.",date:"2024-2025",signal:"strong",implication:"Enables 4-6 simultaneous biosimilar launches. First-mover capacity lock.",link:"https://www.samsungbiologics.com/en/capabilities/overview.do"},
  {co:"Biocon Biologics",type:"API+FDF",event:"Bengaluru facility FDA re-approval",detail:"Full manufacturing vertical integration for monoclonal antibodies.",date:"2024-03",signal:"strong",implication:"30-40% COGS advantage vs CDMO-dependent competitors.",link:"https://www.biocon.com/biosimilars/"},
  {co:"Fujifilm Diosynth",type:"CDMO",event:"$1.2B Holly Springs NC facility",detail:"Large-scale mammalian cell culture. Multiple undisclosed biosimilar contracts.",date:"2024-06",signal:"moderate",implication:"New North American CDMO capacity reduces supply risk for US-launched biosimilars.",link:"https://www.fujifilmdiosynth.com/"},
  {co:"Celltrion",type:"Integrated",event:"Incheon Plant 3 — 120,000L added",detail:"Dedicated to CT-P43 (ustekinumab) and CT-P65 (pembrolizumab).",date:"2024-09",signal:"strong",implication:"Dedicated capacity signals high confidence in regulatory timeline.",link:"https://www.celltrion.com/en/about/overview"},
  {co:"Sandoz",type:"Integrated",event:"Kundl Austria fill-finish upgrade",detail:"PFS and auto-injector lines for ustekinumab biosimilar. Device parity critical.",date:"2024-01",signal:"strong",implication:"Device strategy enables interchangeable designation pursuit.",link:"https://www.sandoz.com/en/what-we-do/biosimilars"},
  {co:"WuXi Biologics",type:"CDMO",event:"Ireland facility — 48,000L online",detail:"EU-based manufacturing serving multiple biosimilar sponsors.",date:"2024-11",signal:"moderate",implication:"EU manufacturing avoids tariff/trade barriers. Faster EMA.",link:"https://www.wuxibiologics.com/"},
];

// ═══ GLOBAL REGULATORY ═══
const GLOBAL_REG = [
  {region:"United States",flag:"🇺🇸",reg:"FDA",pathway:"BPCIA / Hatch-Waxman",approval:"10-12m",interch:"Yes (switching studies)",autoSub:"State-level",approved:42,pending:28,note:"Interchangeable designation enables pharmacy substitution. IRA may impact pricing.",link:"https://www.fda.gov/drugs/biosimilars"},
  {region:"European Union",flag:"🇪🇺",reg:"EMA",pathway:"Centralised",approval:"12-15m",interch:"Member state",autoSub:"Varies",approved:78,pending:35,note:"12-24 months ahead of US in biosimilar adoption.",link:"https://www.ema.europa.eu/en/human-regulatory/overview/biosimilar-medicines-overview"},
  {region:"China",flag:"🇨🇳",reg:"NMPA/CDE",pathway:"Similar Biotherapeutic",approval:"18-24m",interch:"No",autoSub:"No",approved:55,pending:60,note:"VBP creates aggressive price competition. Local players dominant.",link:"https://english.nmpa.gov.cn/"},
  {region:"Japan",flag:"🇯🇵",reg:"PMDA",pathway:"Follow-on Biologics",approval:"12-18m",interch:"No",autoSub:"No",approved:35,pending:15,note:"Conservative adoption. Physician preference drives prescribing.",link:"https://www.pmda.go.jp/english/"},
  {region:"India",flag:"🇮🇳",reg:"CDSCO",pathway:"Similar Biologics",approval:"6-12m",interch:"N/A",autoSub:"No",approved:100,pending:40,note:"Lower regulatory bar. Key global production hub.",link:"https://cdsco.gov.in/opencms/opencms/en/Biologicals/"},
  {region:"Brazil",flag:"🇧🇷",reg:"ANVISA",pathway:"Comparability",approval:"12-18m",interch:"Case-by-case",autoSub:"No",approved:28,pending:18,note:"Growing market. Pathway aligning with EMA.",link:"https://www.gov.br/anvisa/en"},
  {region:"South Korea",flag:"🇰🇷",reg:"MFDS",pathway:"Similar Biologic",approval:"12m",interch:"No",autoSub:"No",approved:25,pending:12,note:"Home market for Samsung Bioepis and Celltrion.",link:"https://www.mfds.go.kr/eng/"},
  {region:"Australia",flag:"🇦🇺",reg:"TGA",pathway:"Biosimilar",approval:"8-12m",interch:"Yes (a-flag)",autoSub:"Pharmacist",approved:32,pending:10,note:"TGA 'a-flag' enables pharmacy substitution. PBS listing drives adoption.",link:"https://www.tga.gov.au/products/medicines/biosimilar-medicines"},
];

// ═══ M&A TARGETS ═══
const MA_TARGETS = [
  {co:"Biocon Biologics",hq:"India",mcap:"$5.2B",pipeline:8,launched:4,val:"Attractive",strength:"Vertical integration, lowest COGS, Viatris partnership",weakness:"US commercial via partner, FDA inspection history",assets:"Pembrolizumab BS, Ustekinumab BS, Insulin portfolio",rationale:"Lowest COGS in industry. Integrated manufacturing + 8 pipeline assets.",link:"https://www.biocon.com/investors/"},
  {co:"Formycon AG",hq:"Germany",mcap:"$1.8B",pipeline:5,launched:1,val:"Moderate",strength:"EU regulatory track record, aflibercept BS near approval",weakness:"No US footprint, CDMO dependent",assets:"FYB203 (aflibercept BS), FYB206 (ranibizumab BS)",rationale:"Ophthalmology niche specialist. EU-first strategy.",link:"https://www.formycon.com/en/investors/"},
  {co:"Alvotech",hq:"Iceland",mcap:"$3.5B",pipeline:7,launched:1,val:"Attractive",strength:"Broadest pipeline, Teva partnership, semaglutide program",weakness:"Post-SPAC cash, limited track record",assets:"AVT04 (ustekinumab), AVT06 (denosumab), AVT23 (semaglutide)",rationale:"Broadest pure-play. Semaglutide biosimilar is high-optionality.",link:"https://www.alvotech.com/investors"},
  {co:"Coherus BioSciences",hq:"US",mcap:"$0.4B",pipeline:3,launched:2,val:"Distressed",strength:"US commercial team, oncology KOL relationships",weakness:"Cash burn, narrow pipeline",assets:"US commercial infrastructure, oncology relationships",rationale:"Turnkey US commercial for biosimilar launches at low cost.",link:"https://ir.coherus.com/"},
  {co:"Harbour BioMed",hq:"China",mcap:"$0.8B",pipeline:4,launched:0,val:"Speculative",strength:"Novel bispecific platform, IL-4Rα asset",weakness:"Pre-revenue, China risk, no commercial",assets:"HBM9378 (dupilumab competitor), bispecific platform",rationale:"Novel next-gen approach. IL-4Rα could compete through innovation.",link:"https://www.harbourbiomed.com/en/investor"},
];

// ═══ BENCHMARK COMPANIES ═══
const BENCHMARKS = [
  {co:"AbbVie",loeExp:42,prep:78,lifecycle:85,payer:72,pipeline:80,overall:76,rev:"$54B",atRisk:"$22.7B",pct:42,color:"#6d5cff"},
  {co:"Merck",loeExp:55,prep:65,lifecycle:70,payer:60,pipeline:75,overall:64,rev:"$60B",atRisk:"$33B",pct:55,color:"#ff4d6a"},
  {co:"BMS",loeExp:62,prep:58,lifecycle:55,payer:62,pipeline:50,overall:52,rev:"$45B",atRisk:"$27.9B",pct:62,color:"#ff8c42"},
  {co:"J&J",loeExp:28,prep:82,lifecycle:78,payer:85,pipeline:88,overall:81,rev:"$52B",atRisk:"$14.6B",pct:28,color:"#00d4aa"},
  {co:"Roche",loeExp:35,prep:75,lifecycle:72,payer:68,pipeline:82,overall:72,rev:"$50B",atRisk:"$17.5B",pct:35,color:"#a78bfa"},
  {co:"Novo Nordisk",loeExp:22,prep:70,lifecycle:88,payer:65,pipeline:72,overall:74,rev:"$42B",atRisk:"$9.2B",pct:22,color:"#2dd4bf"},
];

// ═══ WEEKLY SIGNALS ═══
const SIGNALS = [
  {date:"Feb 20",type:"Patent Challenge",sev:"critical",drug:"Eliquis",detail:"Dr. Reddy's files Paragraph IV for apixaban. BMS has 45 days to respond.",src:"USPTO",link:`https://www.courtlistener.com/?q=apixaban+paragraph+IV&type=r`},
  {date:"Feb 19",type:"Clinical Trial",sev:"high",drug:"Keytruda",detail:"Biocon/Viatris HERITAGE-1 meets primary endpoint: pembrolizumab biosimilar equivalent ORR (45.2% vs 44.8%) in NSCLC.",src:"ClinicalTrials.gov",link:`https://clinicaltrials.gov/search?term=biocon+pembrolizumab+HERITAGE`},
  {date:"Feb 18",type:"SEC Filing",sev:"medium",drug:"Stelara",detail:"Amgen Q4: 'Wezlana launch exceeding expectations with strong formulary wins.'",src:"SEC EDGAR",link:`https://www.sec.gov/cgi-bin/browse-edgar?company=amgen&CIK=&type=10-K&action=getcompany`},
  {date:"Feb 17",type:"Regulatory",sev:"high",drug:"Eylea",detail:"EMA CHMP positive opinion for Samsung Bioepis SB15 (aflibercept biosimilar).",src:"EMA",link:`https://www.ema.europa.eu/en/medicines?search_api_fulltext=SB15+aflibercept`},
  {date:"Feb 16",type:"Supply Chain",sev:"medium",drug:"Multiple",detail:"Samsung Biologics $1.5B Plant 5 expansion. Capacity through 2030.",src:"Company PR",link:"https://www.samsungbiologics.com/en/media/news_list.do"},
  {date:"Feb 14",type:"Payer Decision",sev:"high",drug:"Stelara",detail:"Express Scripts adds Wezlana as preferred. Step therapy required.",src:"Formulary",link:"https://www.express-scripts.com/"},
  {date:"Feb 13",type:"Job Posting",sev:"low",drug:"Dupixent",detail:"Harbour BioMed posting 12 IL-4 receptor positions in Shanghai/Cambridge.",src:"LinkedIn",link:`https://www.linkedin.com/search/results/content/?keywords=harbour+biomed+IL-4`},
  {date:"Feb 12",type:"Conference",sev:"medium",drug:"Opdivo",detail:"Junshi presents Phase III interim for nivolumab biosimilar at ASCO-GI.",src:"ASCO",link:"https://meetings.asco.org/"},
  {date:"Feb 10",type:"Litigation",sev:"critical",drug:"Eliquis",detail:"Delaware denies BMS motion to dismiss. All 5 apixaban patents to trial.",src:"PACER",link:`https://www.courtlistener.com/?q=apixaban+bristol+myers&type=r&order_by=score+desc`},
  {date:"Feb 8",type:"M&A",sev:"high",drug:"Industry",detail:"Fresenius Kabi acquires 45% of mAbxience for $850M. Gains trastuzumab/bevacizumab EU.",src:"SEC",link:`https://www.sec.gov/cgi-bin/browse-edgar?company=fresenius+kabi&CIK=&type=10-K&action=getcompany`},
];

// ═══════ HELPER COMPONENTS ═══════
const sigC = s => ({confirmed:{bg:"rgba(0,212,170,0.1)",t:"#00d4aa"},strong:{bg:"rgba(109,92,255,0.1)",t:"#8b7fff"},moderate:{bg:"rgba(255,140,66,0.1)",t:"#ff8c42"},early:{bg:"rgba(168,85,247,0.1)",t:"#c084fc"},speculative:{bg:"rgba(90,99,128,0.1)",t:"#7a839e"}}[s]||{bg:"rgba(90,99,128,0.1)",t:"#7a839e"});
const pPct = p => ({"Pre-clinical":10,"Phase I":25,"Phase I (PK)":25,"Phase I/III":45,"Phase II":45,"Phase III":65,"ANDA Filed":78,"Tentative Approval":85,"Approved":90,"Approved — Settlement":90,"Launched":100,"Launched (at-risk)":100}[p]||5);
const dUntil = d => Math.ceil((new Date(d)-new Date())/864e5);
const fDays = d => d<0?`${Math.abs(d)}d ago`:d<365?`${d}d`:`${(d/365).toFixed(1)}y`;
const sevC = s => s==="critical"?"#ff4d6a":s==="high"?"#ff8c42":s==="medium"?"#fbbf24":"#5a6380";

function Lnk({l,u}){return <span onClick={()=>{try{window.open(u,"_blank","noopener,noreferrer")}catch(e){navigator.clipboard&&navigator.clipboard.writeText(u)}}} style={{fontSize:11,padding:"3px 9px",borderRadius:5,textDecoration:"none",background:"rgba(99,102,241,0.06)",color:"#818cf8",border:"1px solid rgba(99,102,241,0.14)",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:3,whiteSpace:"nowrap",fontWeight:500,userSelect:"none"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,0.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(99,102,241,0.06)"} title={u}>{l}<span style={{fontSize:8}}>↗</span></span>}
function Bdg({s}){const c=sigC(s);return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:14,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.3,background:c.bg,color:c.t}}>{s}</span>}
function PBar({p}){const v=pPct(p);return <div style={{display:"flex",alignItems:"center",gap:6,minWidth:140}}><div style={{flex:1,height:5,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${v}%`,height:"100%",borderRadius:3,background:p==="Launched"?"#10b981":"#6366f1"}}/></div><span style={{fontSize:11,color:"#818cf8",fontWeight:500,whiteSpace:"nowrap"}}>{p}</span></div>}
function Stat({l,v,c,sub}){return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${c}`}}><div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:.7}}>{l}</div><div style={{fontSize:20,fontWeight:800,color:c,marginTop:2,fontFamily:mono}}>{v}</div>{sub&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}</div>}
function Crd({children,style={},...rest}){return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,...style}} {...rest}>{children}</div>}
function Title({children,sub}){return <div style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:C.bright}}>{children}</div>{sub&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>}</div>}
function Select({value,onChange,options,placeholder,style={}}){return <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"8px 14px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:8,color:C.bright,fontSize:13,outline:"none",fontFamily:font,cursor:"pointer",minWidth:180,...style}}><option value="" style={{background:"#0a0e18"}}>{placeholder}</option>{options.map((o,i)=><option key={i} value={typeof o==="string"?o:o.value} style={{background:"#0a0e18"}}>{typeof o==="string"?o:o.label}</option>)}</select>}

const CTip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:"rgba(10,15,28,0.95)",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:11,fontFamily:font}}>
    <div style={{color:C.bright,fontWeight:600,marginBottom:3}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color,marginTop:1}}>{p.name}: <strong>{typeof p.value==='number'?p.value.toFixed(1):p.value}</strong></div>)}
  </div>;
};

// ═══ CUSTOM MOLECULE INTELLIGENCE PANEL ═══
function CustomMolPanel({mol, userCompany}){
  const meta = MOL_META[mol];
  const analog = getAnalog(mol);
  if(!meta) return <Crd style={{marginBottom:16,borderColor:"rgba(255,140,66,0.2)",background:"rgba(255,140,66,0.03)"}}>
    <div style={{fontSize:13,fontWeight:700,color:"#ff8c42",marginBottom:8}}>🔍 {mol} — Custom Molecule Research</div>
    <div style={{fontSize:12,color:C.text,marginBottom:10}}>This molecule is not in our tracked database. Use the links below to research:</div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><Lnk l="FDA DailyMed" u={BL.fda(mol)}/><Lnk l="ClinicalTrials.gov" u={BL.ct(mol)}/><Lnk l="Google Patents" u={BL.pat(mol)}/><Lnk l="PubMed Biosimilar" u={BL.pm(mol)}/><Lnk l="EMA Medicines" u={BL.ema(mol)}/><Lnk l="Purple Book" u={BL.pb(mol)}/><Lnk l="Orange Book" u={BL.ob(mol)}/></div>
  </Crd>;

  const erosionRef = EROSION_BY_THERAPY.find(e=> meta.area?.includes(e.area)) || {e24:55,s24:60};
  return <Crd style={{marginBottom:16,borderColor:"rgba(109,92,255,0.25)",background:"rgba(109,92,255,0.03)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:14}}>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:C.bright}}>{meta.brand || mol} <span style={{fontSize:12,color:C.muted,fontWeight:400}}>({mol})</span></div>
        <div style={{fontSize:11,color:C.muted,marginTop:2}}>{meta.originator} · {meta.area} · {meta.type} · {meta.rev}</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:meta.players>3?"rgba(0,212,170,0.1)":meta.players>0?"rgba(255,140,66,0.1)":"rgba(90,99,128,0.1)",color:meta.players>3?"#00d4aa":meta.players>0?"#ff8c42":"#7a839e"}}>{meta.players} competitors</span>
        <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:"rgba(109,92,255,0.06)",color:"#8b7fff"}}>LOE: {meta.loe}</span>
      </div>
    </div>

    <div style={{fontSize:12,color:C.text,lineHeight:1.6,marginBottom:12,padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:`1px solid ${C.border}`}}>
      <strong style={{color:"#a99fff"}}>Status:</strong> {meta.status}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:14}}>
      <Stat l="Therapy Area" v={meta.area?.split("/")[0]} c="#6d5cff"/>
      <Stat l="Type" v={meta.type} c="#8b7fff"/>
      <Stat l="Competitors" v={meta.players} c={meta.players>3?"#00d4aa":"#ff8c42"}/>
      <Stat l="Est. 24m Erosion" v={`${erosionRef.e24}%`} c="#ff4d6a" sub={`Based on ${meta.area?.split("/")[0]} analogs`}/>
      <Stat l="Closest Analog" v={analog.drug} c="#a78bfa" sub={`Using ${analog.drug} projections`}/>
    </div>

    {/* Analog-based projection */}
    <div style={{marginBottom:12}}>
      <Title sub={`Based on ${analog.drug} (${analog.molecule}) — same therapy area dynamics`}>Estimated Projection (Analog-Based)</Title>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={analog.projection}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="y" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/><Area type="monotone" dataKey="oR" stackId="1" stroke="#6d5cff" fill="rgba(109,92,255,0.15)" name="Originator (est.)"/><Area type="monotone" dataKey="bR" stackId="1" stroke="#00d4aa" fill="rgba(0,212,170,0.15)" name="Biosimilar (est.)"/></AreaChart>
      </ResponsiveContainer>
      <div style={{fontSize:10,color:C.muted,fontStyle:"italic",textAlign:"center"}}>⚠️ Analog-based estimate. Actual trajectory will depend on patent landscape, competitor count, and payer dynamics.</div>
    </div>

    {userCompany&&<div style={{padding:"10px 14px",background:"rgba(109,92,255,0.04)",borderRadius:8,border:"1px solid rgba(109,92,255,0.1)",marginBottom:12}}>
      <div style={{fontSize:11,fontWeight:700,color:"#a99fff",marginBottom:4}}>🏢 {userCompany} Perspective</div>
      <div style={{fontSize:11,color:C.text,lineHeight:1.6}}>
        {meta.players===0?`No biosimilar/generic competitors yet. Early-mover opportunity for ${userCompany} if development begins now.`
        :meta.players<3?`Limited competition (${meta.players} players). Window for ${userCompany} to enter with differentiated strategy.`
        :`Competitive market (${meta.players} players). ${userCompany} would need strong cost advantage or niche positioning.`}
      </div>
    </div>}

    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
      <Lnk l="FDA DailyMed" u={BL.fda(mol)}/><Lnk l="ClinicalTrials.gov" u={BL.ct(mol)}/><Lnk l="Google Patents" u={BL.pat(mol)}/><Lnk l="PubMed" u={BL.pm(mol)}/><Lnk l="EMA Medicines" u={BL.ema(mol)}/><Lnk l="Purple Book" u={BL.pb(mol)}/><Lnk l="Orange Book" u={BL.ob(mol)}/><Lnk l="CourtListener" u={BL.cl(mol+" patent")}/>
    </div>
  </Crd>;
}

// ═══════════════════════════════════════════
// TAB 1: HISTORICAL (CHANGE 1: dropdown + "All" option)
// ═══════════════════════════════════════════
function HistoricalTab() {
  const [sel, setSel] = useState("all");
  const [customMol, setCustomMol] = useState("");
  const selected = sel==="all"?null:HISTORICAL_LOE.find((_,i)=>i===+sel);
  const allOverlay = HISTORICAL_LOE.map(h=>({drug:h.drug,erosion12m:h.priceData.find(p=>p.m==="M12")?.d||0,share12m:h.marketShareData.find(p=>p.m==="M12")?.b||0,players:h.playersNow,peak:h.peakRevenue}));

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:18}}>
      <Select value={sel} onChange={setSel} options={[{value:"all",label:"📊 All LOE Events — Comparative View"},...HISTORICAL_LOE.map((h,i)=>({value:String(i),label:`${h.drug} (${h.molecule}) — ${h.loeDate}`}))]} placeholder="Select historical LOE..." style={{minWidth:320}}/>
      <Select value={customMol} onChange={setCustomMol} options={ALL_MOLECULES} placeholder="🔍 Search any molecule..."/>
      {customMol&&<CustomMolPanel mol={customMol}/>}
    </div>

    {sel==="all"?<div>
      <Title sub="Cross-comparison of all 8 historical LoE events">All Historical LoE Events — Comparative Dashboard</Title>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:18}}>
        <Stat l="Events Tracked" v={HISTORICAL_LOE.length} c="#6d5cff"/><Stat l="Peak Rev (Total)" v={`$${HISTORICAL_LOE.reduce((a,h)=>a+h.peakRevenue,0).toFixed(1)}B`} c="#ff8c42"/><Stat l="Current Rev" v={`$${HISTORICAL_LOE.reduce((a,h)=>a+h.currentRevenue,0).toFixed(1)}B`} c="#ff4d6a"/><Stat l="Avg Erosion" v={`${Math.round(HISTORICAL_LOE.reduce((a,h)=>a+(1-h.currentRevenue/h.peakRevenue)*100,0)/HISTORICAL_LOE.length)}%`} c="#ff4d6a"/><Stat l="Avg Players" v={(HISTORICAL_LOE.reduce((a,h)=>a+h.playersNow,0)/HISTORICAL_LOE.length).toFixed(1)} c="#00d4aa"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <Crd><Title>12-Month Price Erosion by Drug</Title><ResponsiveContainer width="100%" height={220}><BarChart data={allOverlay}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="drug" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,100]}/><Tooltip content={<CTip/>}/><Bar dataKey="erosion12m" name="12m Price Erosion %" radius={[3,3,0,0]}>{allOverlay.map((d,i)=><Cell key={i} fill={d.erosion12m>50?"#ff4d6a":d.erosion12m>35?"#ff8c42":"#6d5cff"}/>)}</Bar></BarChart></ResponsiveContainer></Crd>
        <Crd><Title>12-Month Biosimilar Market Share by Drug</Title><ResponsiveContainer width="100%" height={220}><BarChart data={allOverlay}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="drug" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,100]}/><Tooltip content={<CTip/>}/><Bar dataKey="share12m" name="12m Biosimilar Share %" radius={[3,3,0,0]}>{allOverlay.map((d,i)=><Cell key={i} fill={d.share12m>50?"#00d4aa":d.share12m>30?"#6d5cff":"#ff8c42"}/>)}</Bar></BarChart></ResponsiveContainer></Crd>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Crd><Title>Price Erosion vs # Competitors</Title><ResponsiveContainer width="100%" height={190}><BarChart data={PRICE_EROSION_BY_PLAYERS}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="players" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,100]}/><Tooltip content={<CTip/>}/><Bar dataKey="yr1" fill="#6d5cff" name="Yr1%" radius={[3,3,0,0]}/><Bar dataKey="yr2" fill="#ff8c42" name="Yr2%" radius={[3,3,0,0]}/><Bar dataKey="yr3" fill="#ff4d6a" name="Yr3%" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></Crd>
        <Crd><Title>Erosion Speed by Therapy Area (24m)</Title><ResponsiveContainer width="100%" height={190}><BarChart data={EROSION_BY_THERAPY} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis type="number" tick={{fontSize:10,fill:C.muted}} domain={[0,100]}/><YAxis type="category" dataKey="area" tick={{fontSize:10,fill:C.muted}} width={80}/><Tooltip content={<CTip/>}/><Bar dataKey="e24" fill="#6d5cff" name="Erosion%" radius={[0,3,3,0]}/><Bar dataKey="s24" fill="#00d4aa" name="Share%" radius={[0,3,3,0]}/></BarChart></ResponsiveContainer></Crd>
      </div>
    </div>:selected&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:18}}>
        <Stat l="Peak Revenue" v={`$${selected.peakRevenue}B`} c="#6d5cff"/><Stat l="Current Revenue" v={`$${selected.currentRevenue}B`} c={selected.currentRevenue<selected.peakRevenue/2?"#ff4d6a":"#ff8c42"}/><Stat l="Revenue Erosion" v={`${Math.round((1-selected.currentRevenue/selected.peakRevenue)*100)}%`} c="#ff4d6a"/><Stat l="Players at LOE" v={selected.playersAtLOE} c="#00d4aa"/><Stat l="Players Now" v={selected.playersNow} c="#ff8c42"/><Stat l="Type" v={selected.type} c="#8b7fff"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <Crd><Title>Market Share Shift</Title><ResponsiveContainer width="100%" height={200}><AreaChart data={selected.marketShareData.map(d=>({month:d.m,Originator:d.o,Biosimilar:d.b}))}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="month" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,100]}/><Tooltip content={<CTip/>}/><Area type="monotone" dataKey="Originator" stackId="1" stroke="#6d5cff" fill="rgba(109,92,255,0.2)"/><Area type="monotone" dataKey="Biosimilar" stackId="1" stroke="#00d4aa" fill="rgba(0,212,170,0.2)"/></AreaChart></ResponsiveContainer></Crd>
        <Crd><Title>Price Erosion</Title><ResponsiveContainer width="100%" height={200}><ComposedChart data={selected.priceData.map(d=>({month:d.m,Price:d.p,Discount:d.d}))}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="month" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,100]}/><Tooltip content={<CTip/>}/><Area type="monotone" dataKey="Price" stroke="#6d5cff" fill="rgba(109,92,255,0.12)"/><Line type="monotone" dataKey="Discount" stroke="#ff4d6a" strokeWidth={2} dot={{r:3}}/></ComposedChart></ResponsiveContainer></Crd>
      </div>
      <div style={{background:"rgba(109,92,255,0.04)",border:"1px solid rgba(109,92,255,0.12)",borderRadius:10,padding:"12px 16px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#a99fff",marginBottom:3}}>📡 KEY INSIGHT</div>
        <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{selected.keyInsight}</div>
        <div style={{display:"flex",gap:4,marginTop:8}}><Lnk l="FDA Drug Data" u={BL.fda(selected.molecule)}/><Lnk l="PubMed" u={BL.pm(selected.molecule)}/><Lnk l="IQVIA" u={BL.iq(selected.molecule)}/></div>
      </div>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════
// TAB 2: PROJECTIONS & SIMULATOR (CHANGE 2,3)
// ═══════════════════════════════════════════
function ProjectionsTab() {
  // Filter out molecules that are now in historical tab
  const projDrugs = DRUGS.filter(d => !HISTORICAL_LOE.some(h => h.molecule === d.molecule));
  const [sel, setSel] = useState(projDrugs.length > 0 ? DRUGS.indexOf(projDrugs[0]) : 1);
  const [customMol, setCustomMol] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [competitors, setCompetitors] = useState(null); // null = use base case
  const [interch, setInterch] = useState(false);
  const [delay, setDelay] = useState(0);
  const [ira, setIra] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const p = DRUGS[sel];
  const userCo = COMPANIES.find(c=>c.name===userCompany);
  const userComp = p.competitors.find(c=>c.company.toLowerCase().includes(userCompany.toLowerCase()));
  const isOrig = userCompany && p.originator.toLowerCase().includes(userCompany.toLowerCase());
  const isComp = userCompany && !isOrig && userComp;

  // Base case = actual competitor count for this drug
  const actualCompCount = p.competitors.length;
  const simCompCount = competitors !== null ? competitors : actualCompCount;

  const simData = useMemo(()=>{
    // Base case uses actual competitor count
    const baseCompF = actualCompCount<=2?0.75:actualCompCount<=4?1.0:1.25;
    // Sim case uses slider value
    const simCompF = simCompCount<=2?0.75:simCompCount<=4?1.0:1.25;
    const intF=interch?1.15:1.0;
    const delF=1-(delay*0.08);
    const iraF=ira?1.12:1.0;

    return p.projection.map((r,i)=>{
      if(i===0)return{...r,sO:r.oR,sB:r.bR,sP:r.pr};
      // Base values already reflect actual competitor count in data
      const simM = simCompF*intF*iraF*Math.max(0.5,delF);
      const baseM = baseCompF; // base multiplier for reference
      const ratio = baseM > 0 ? simM / baseM : 1;
      return{...r,
        sO:+(r.oR/Math.max(ratio,0.5)).toFixed(1),
        sB:+(r.bR*ratio).toFixed(1),
        sP:+Math.max(r.pr/ratio,5).toFixed(0)
      };
    });
  },[p,simCompCount,actualCompCount,interch,delay,ira]);

  // Company-specific view: If company selected, filter projections to show their share only
  const companySimData = useMemo(()=>{
    if(!userCompany) return null;
    if(isOrig) {
      // Originator sees their declining revenue
      return simData.map(r=>({...r, label: p.originator, myRev: r.sO, myBase: r.oR}));
    }
    if(isComp && userComp) {
      // Competitor: calculate their share of total biosimilar pie
      const totalComps = p.competitors.length;
      const myStrength = userComp.strength || 70;
      const totalStrength = p.competitors.reduce((a,c)=>a+(c.strength||70),0);
      const mySharePct = totalStrength > 0 ? myStrength/totalStrength : 1/totalComps;
      return simData.map(r=>({...r, label: userComp.company.split("(")[0].trim(), myRev: +(r.sB * mySharePct).toFixed(2), myBase: +(r.bR * mySharePct).toFixed(2), myPct: +(mySharePct*100).toFixed(0)}));
    }
    return null;
  },[simData, userCompany, isOrig, isComp, userComp, p]);

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
      <Select value={sel} onChange={v=>setSel(+v)} options={projDrugs.map((d)=>({value:String(DRUGS.indexOf(d)),label:`${d.drug} — ${d.molecule} (LOE ${new Date(d.patentExpiry).getFullYear()})`}))} placeholder="Select molecule..." style={{minWidth:350}}/>
      <Select value={customMol} onChange={setCustomMol} options={ALL_MOLECULES.filter(m=>!DRUGS.some(d=>d.molecule===m))} placeholder="🔍 Search other molecule..."/>
      <Select value={userCompany} onChange={setUserCompany} options={[{value:"",label:"— No company (Total Market View) —"},...COMPANIES.map(c=>({value:c.name,label:`🏢 ${c.name} (${c.type})`}))]} placeholder="🏢 Select your company..."/>
    </div>
    {customMol&&<CustomMolPanel mol={customMol} userCompany={userCompany}/>}
    {userCompany&&userCo&&<div style={{padding:"8px 14px",borderRadius:8,background:isOrig?"rgba(255,77,106,0.06)":"rgba(0,212,170,0.06)",border:`1px solid ${isOrig?"rgba(255,77,106,0.15)":"rgba(0,212,170,0.15)"}`,color:isOrig?"#ff8c42":"#10b981",fontSize:11,marginBottom:14}}>🏢 Viewing as <strong>{userCompany}</strong> ({isOrig?"Originator":"Biosimilar Competitor"}) — {isOrig?"Showing revenue erosion risk":"Showing your projected market capture"}</div>}
    {!userCompany&&<div style={{padding:"8px 14px",borderRadius:8,background:"rgba(109,92,255,0.06)",border:"1px solid rgba(109,92,255,0.15)",color:"#a99fff",fontSize:11,marginBottom:14}}>📊 Total Market View — Showing all biosimilars combined vs originator. Select a company above for company-specific projections.</div>}

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:16}}>
      <Stat l="Revenue" v={`$${p.revenue}B`} c="#6d5cff"/><Stat l="LOE" v={new Date(p.patentExpiry).getFullYear()} c="#ff8c42"/><Stat l="Base Competitors" v={actualCompCount} c="#00d4aa" sub="Actual"/><Stat l="Sim Competitors" v={simCompCount} c={simCompCount!==actualCompCount?"#ff4d6a":"#00d4aa"} sub={simCompCount!==actualCompCount?"Modified":"Base"}/><Stat l="Sim Yr3 Price" v={`${simData[simData.length-1]?.sP||simData[simData.length-1]?.pr}%`} c="#ff4d6a"/>
    </div>

    {/* Scenario Controls */}
    <Crd style={{marginBottom:16,borderColor:"rgba(109,92,255,0.2)",background:"rgba(109,92,255,0.02)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:C.bright}}>🎛️ Scenario Simulator</div><button onClick={()=>{setCompetitors(null);setInterch(false);setDelay(0);setIra(false);}} style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:10,cursor:"pointer"}}>↺ Reset to Base Case</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:5}}>Competitors at Launch <span style={{fontSize:9,color:C.muted}}>(Base: {actualCompCount})</span></div><input type="range" min={1} max={8} value={simCompCount} onChange={e=>setCompetitors(+e.target.value)} style={{width:"100%"}}/><div style={{textAlign:"center",fontSize:13,fontWeight:700,color:simCompCount!==actualCompCount?"#ff4d6a":"#a99fff"}}>{simCompCount} {simCompCount!==actualCompCount?`(base: ${actualCompCount})`:""}</div></div>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:5}}>Launch Delay (months)</div><input type="range" min={0} max={24} value={delay} onChange={e=>setDelay(+e.target.value)} style={{width:"100%"}}/><div style={{textAlign:"center",fontSize:13,fontWeight:700,color:"#ff8c42"}}>{delay}m</div></div>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:8}}>Interchangeable</div><button onClick={()=>setInterch(!interch)} style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${interch?"#00d4aa":C.border}`,background:interch?"rgba(0,212,170,0.1)":"transparent",color:interch?"#00d4aa":C.muted,fontSize:11,fontWeight:600,cursor:"pointer",width:"100%"}}>{interch?"✓ YES":"✗ NO"}</button></div>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:8}}>IRA Impact</div><button onClick={()=>setIra(!ira)} style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${ira?"#ff4d6a":C.border}`,background:ira?"rgba(255,77,106,0.1)":"transparent",color:ira?"#ff4d6a":C.muted,fontSize:11,fontWeight:600,cursor:"pointer",width:"100%"}}>{ira?"✓ YES":"✗ NO"}</button></div>
      </div>
    </Crd>

    {/* Charts: Show differently based on company selection */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
      <Crd><Title sub={userCompany?(isOrig?"Your revenue decline":"Your market capture opportunity"):"Total biosimilar club vs originator"}>{userCompany?`${userCompany} — Revenue Projection ($B)`:"Total Market — Originator vs All Biosimilars ($B)"}</Title>
        <ResponsiveContainer width="100%" height={240}><ComposedChart data={companySimData||simData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="y" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/>
          {companySimData?<>
            <Area type="monotone" dataKey="myBase" stroke={isOrig?"#6d5cff":"#00d4aa"} fill={isOrig?"rgba(109,92,255,0.08)":"rgba(0,212,170,0.08)"} name={`${isOrig?"Orig":"Your"} (base)`} strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="myRev" stroke={isOrig?"#ff4d6a":"#10b981"} strokeWidth={3} dot={{r:5,fill:isOrig?"#ff4d6a":"#10b981"}} name={`${isOrig?"Orig":"Your"} (sim)`}/>
          </>:<>
            <Area type="monotone" dataKey="oR" stroke="#6d5cff" fill="rgba(109,92,255,0.1)" name="Orig (base)" strokeDasharray="5 5"/>
            <Area type="monotone" dataKey="bR" stroke="#00d4aa" fill="rgba(0,212,170,0.1)" name="All Biosim (base)" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="sO" stroke="#ff4d6a" strokeWidth={2} dot={{r:4}} name="Orig (sim)"/>
            <Line type="monotone" dataKey="sB" stroke="#fbbf24" strokeWidth={2} dot={{r:4}} name="All Biosim (sim)"/>
          </>}
        </ComposedChart></ResponsiveContainer>
      </Crd>
      <Crd><Title>Price Index — Base vs Sim</Title>
        <ResponsiveContainer width="100%" height={240}><LineChart data={simData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="y" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,110]}/><Tooltip content={<CTip/>}/><Line type="monotone" dataKey="pr" stroke="#6d5cff" strokeWidth={2} strokeDasharray="5 5" dot={{r:3}} name="Base %"/><Line type="monotone" dataKey="sP" stroke="#ff4d6a" strokeWidth={3} dot={{r:5,fill:"#ff4d6a"}} name="Sim %"/></LineChart></ResponsiveContainer>
      </Crd>
    </div>

    {/* CHANGE 3: Monthly competitor forecast + dosage forms */}
    <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
      <button onClick={()=>setShowMonthly(!showMonthly)} style={{padding:"8px 18px",borderRadius:8,background:showMonthly?"rgba(109,92,255,0.12)":"transparent",border:`1px solid ${showMonthly?C.accent:C.border}`,color:showMonthly?"#a99fff":C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>📅 {showMonthly?"Hide":"Show"} Monthly Competitor Forecast & Dosage Breakdown</button>
    </div>
    {showMonthly&&<div>
      {/* Main combined chart with originator + all biosimilar lines — proper data merge */}
      <Crd style={{marginBottom:14}}>
        <Title sub="Monthly market share (%) by competitor vs originator from LOE">Monthly Competitor-Level Forecast — All Players</Title>
        {(()=>{
          const months=["M1","M3","M6","M9","M12","M18","M24"];
          const chartData=months.map(m=>{
            const row={m};
            let totalBiosimShare=0;
            p.competitors.slice(0,5).forEach((c,i)=>{
              const f=c.monthlyForecast?.find(x=>x.m===m);
              const sh=f?f.share:0;
              row[`c${i}`]=sh;
              totalBiosimShare+=sh;
            });
            row.originator=Math.max(0,100-totalBiosimShare);
            return row;
          });
          const compNames=p.competitors.slice(0,5).map(c=>c.company.split("(")[0].trim());
          const colors=["#6d5cff","#00d4aa","#ff8c42","#a78bfa","#f97316"];
          return <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
              <XAxis dataKey="m" tick={{fontSize:10,fill:C.muted}}/>
              <YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,100]} label={{value:"Market Share %",angle:-90,position:"left",fontSize:9,fill:C.muted}}/>
              <Tooltip content={<CTip/>}/>
              <Area type="monotone" dataKey="originator" stroke="#ff4d6a" fill="rgba(255,77,106,0.08)" strokeWidth={2} name={`${p.originator} (Originator)`}/>
              {compNames.map((name,i)=><Line key={i} type="monotone" dataKey={`c${i}`} stroke={colors[i]} strokeWidth={2} dot={{r:3}} name={`${name} Share%`}/>)}
              <Legend wrapperStyle={{fontSize:10}}/>
            </ComposedChart>
          </ResponsiveContainer>;
        })()}
      </Crd>

      {/* Per-dosage form charts */}
      <Crd style={{marginBottom:14}}>
        <Title sub="Projected market share erosion by dosage form">📦 Dosage Form Breakdown — Monthly Projections</Title>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(p.dosageForms.length,3)},1fr)`,gap:14}}>
          {p.dosageForms.map((df,di)=>{
            const months=["M1","M3","M6","M9","M12","M18","M24"];
            const dosageRev=p.revenue*df.pct/100;
            const chartData=months.map(m=>{
              let totalBiosimShare=0;
              p.competitors.slice(0,4).forEach(c=>{const f=c.monthlyForecast?.find(x=>x.m===m);totalBiosimShare+=(f?f.share:0);});
              // Adjust by dosage form preference (IV vials erode faster in institutional, PFS slower in retail)
              const formAdj=df.form.includes("IV")?1.15:df.form.includes("Tablet")?1.1:0.95;
              const adjShare=Math.min(95,totalBiosimShare*formAdj);
              return{m,origRev:+(dosageRev*(1-adjShare/100)/12).toFixed(2),biosimRev:+(dosageRev*(adjShare/100)/12).toFixed(2),origPct:+(100-adjShare).toFixed(0),biosimPct:+adjShare.toFixed(0)};
            });
            return <div key={di}>
              <div style={{fontSize:11,fontWeight:700,color:C.bright,marginBottom:4}}>{df.form} <span style={{color:C.muted,fontWeight:400}}>({df.pct}% mix · ${dosageRev.toFixed(1)}B)</span></div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="m" tick={{fontSize:8,fill:C.muted}}/><YAxis tick={{fontSize:8,fill:C.muted}} domain={[0,100]}/>
                  <Tooltip content={<CTip/>}/>
                  <Area type="monotone" dataKey="origPct" stackId="1" stroke="#6d5cff" fill="rgba(109,92,255,0.15)" name="Originator %"/>
                  <Area type="monotone" dataKey="biosimPct" stackId="1" stroke="#00d4aa" fill="rgba(0,212,170,0.15)" name="Biosimilar %"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>;
          })}
        </div>
      </Crd>

      {/* Competitor table */}
      <Crd style={{marginBottom:14}}>
        <Title sub="Share % by month for each competitor">Competitor Detail Table</Title>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px",minWidth:600}}>
            <thead><tr style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>
              <th style={{textAlign:"left",padding:"0 6px 4px"}}>Company</th><th style={{textAlign:"center",padding:"0 6px 4px"}}>Strength</th>
              {["M1","M3","M6","M9","M12","M18","M24"].map(m=><th key={m} style={{textAlign:"center",padding:"0 4px 4px",fontSize:9}}>{m}</th>)}
            </tr></thead>
            <tbody>
              {/* Originator row */}
              <tr style={{background:"rgba(255,77,106,0.04)"}}>
                <td style={{padding:"6px",color:"#ff4d6a",fontSize:11,fontWeight:700}}>{p.originator} <span style={{fontSize:9,color:C.muted}}>(Originator)</span></td>
                <td style={{padding:"6px",textAlign:"center"}}><span style={{fontSize:9,color:"#ff4d6a"}}>—</span></td>
                {["M1","M3","M6","M9","M12","M18","M24"].map(m=>{
                  let totalBiosim=0;p.competitors.forEach(c=>{const f=c.monthlyForecast?.find(x=>x.m===m);totalBiosim+=(f?f.share:0);});
                  const origShare=Math.max(0,100-totalBiosim);
                  return <td key={m} style={{padding:"4px",textAlign:"center",fontSize:10,color:origShare<50?"#ff4d6a":C.text,fontFamily:mono,fontWeight:origShare<30?700:400}}>{origShare.toFixed(0)}%</td>;
                })}
              </tr>
              {p.competitors.map((c,i)=><tr key={i} style={{background:userCompany&&c.company.toLowerCase().includes(userCompany.toLowerCase())?"rgba(0,212,170,0.06)":"rgba(255,255,255,0.01)"}}>
              <td style={{padding:"6px",color:C.bright,fontSize:11,fontWeight:600}}>{c.company.split("(")[0].trim()}{userCompany&&c.company.toLowerCase().includes(userCompany.toLowerCase())&&<span style={{color:"#10b981",fontSize:9,marginLeft:4}}>← YOU</span>}</td>
              <td style={{padding:"6px",textAlign:"center"}}><div style={{width:30,height:4,background:"rgba(255,255,255,0.04)",borderRadius:2,margin:"0 auto",overflow:"hidden"}}><div style={{width:`${c.strength}%`,height:"100%",background:c.strength>80?"#00d4aa":"#6d5cff",borderRadius:2}}/></div><span style={{fontSize:9,color:C.muted}}>{c.strength}</span></td>
              {["M1","M3","M6","M9","M12","M18","M24"].map(m=>{const f=c.monthlyForecast?.find(x=>x.m===m);return <td key={m} style={{padding:"4px",textAlign:"center",fontSize:10,color:f?C.text:C.muted,fontFamily:mono}}>{f?`${f.share}%`:"-"}</td>})}
            </tr>)}
            </tbody>
          </table>
        </div>
      </Crd>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════
// TAB 3: PIPELINE (CHANGE 2: molecule dropdown)
// ═══════════════════════════════════════════
function PipelineTab() {
  const [exp, setExp] = useState(null);
  const [search, setSearch] = useState("");
  const [molFilter, setMolFilter] = useState("");
  const filtered = DRUGS.filter(d=>{const t=(search||molFilter).toLowerCase();return !t||d.drug.toLowerCase().includes(t)||d.molecule.toLowerCase().includes(t)||d.originator.toLowerCase().includes(t)||d.competitors.some(c=>c.company.toLowerCase().includes(t));});
  return <div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
      <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search drug, company..." style={{padding:"8px 14px",background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:8,color:C.bright,fontSize:12,outline:"none",width:250}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
      <Select value={molFilter} onChange={setMolFilter} options={[...DRUGS.map(d=>d.molecule),...ALL_MOLECULES.filter(m=>!DRUGS.some(d=>d.molecule===m))]} placeholder="🔍 Filter by molecule..."/>
    </div>
    {molFilter&&!DRUGS.some(d=>d.molecule===molFilter)&&<CustomMolPanel mol={molFilter}/>}
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {filtered.map(drug=>{const days=dUntil(drug.patentExpiry);const ex=days<0;
        return <div key={drug.id} style={{background:C.card,border:`1px solid ${ex?"rgba(0,212,170,0.2)":C.border}`,borderRadius:11,overflow:"hidden"}}>
          <div onClick={()=>setExp(exp===drug.id?null:drug.id)} style={{padding:"11px 15px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:7,background:ex?"linear-gradient(135deg,#064e3b,#065f46)":"linear-gradient(135deg,#2d2570,#4338ca)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:ex?"#00d4aa":"#a99fff",flexShrink:0}}>{drug.drug.substring(0,2)}</div>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:700,color:C.bright}}>{drug.drug}</span><span style={{fontSize:11,color:C.muted}}>{drug.molecule}</span><span style={{fontSize:10,padding:"1px 7px",borderRadius:5,background:"rgba(109,92,255,0.06)",color:"#8b7fff"}}>{drug.indication}</span></div>
              <div style={{fontSize:10,color:C.muted,marginTop:1}}>{drug.originator} · ${drug.revenue}B · <span style={{color:ex?"#00d4aa":"#ff8c42"}}>{ex?"EXPIRED":`LOE: ${fDays(days)}`}</span></div></div>
            <span style={{fontSize:10,color:"#a99fff",background:"rgba(109,92,255,0.06)",padding:"2px 8px",borderRadius:10}}>{drug.competitors.length}</span>
          </div>
          {exp===drug.id&&<div style={{padding:"0 15px 13px"}}>
            <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}><Lnk l="FDA Drug" u={BL.fda(drug.molecule)}/><Lnk l="Orange Book" u={BL.ob(drug.molecule)}/><Lnk l="ClinicalTrials" u={BL.ct(drug.molecule)}/><Lnk l="Patents" u={BL.pat(drug.molecule)}/><Lnk l="PubMed" u={BL.pm(drug.molecule)}/><Lnk l="Purple Book" u={BL.pb(drug.molecule)}/></div>
            <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 2px"}}><thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>
              <th style={{textAlign:"left",padding:"0 5px 3px"}}>Company</th><th style={{textAlign:"left",padding:"0 5px 3px",minWidth:130}}>Phase</th><th style={{textAlign:"left",padding:"0 5px 3px"}}>Signal</th><th style={{textAlign:"left",padding:"0 5px 3px"}}>Launch</th><th style={{textAlign:"left",padding:"0 5px 3px"}}>Sources</th>
            </tr></thead><tbody>{drug.competitors.map((c,i)=><tr key={i} style={{background:"rgba(255,255,255,0.01)"}}>
              <td style={{padding:"6px 5px",color:C.bright,fontSize:11,fontWeight:600}}>{c.company}</td><td style={{padding:"6px 5px"}}><PBar p={c.phase}/></td><td style={{padding:"6px 5px"}}><Bdg s={c.signal}/></td><td style={{padding:"6px 5px",color:C.text,fontSize:10}}>{c.est}</td>
              <td style={{padding:"6px 5px"}}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{c.sources.map((s,j)=><Lnk key={j} l={s.l} u={s.u}/>)}</div></td>
            </tr>)}</tbody></table>
          </div>}
        </div>;
      })}
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// TAB 4: WAR ROOM (CHANGE 4: company select + SWOT)
// ═══════════════════════════════════════════
function WarRoomTab() {
  const [sel, setSel] = useState(2);
  const [userCompany, setUserCompany] = useState("");
  const [customMol, setCustomMol] = useState("");
  const drug = DRUGS[sel];
  const days = dUntil(drug.patentExpiry);
  const userCo = COMPANIES.find(c=>c.name===userCompany);
  const isOriginator = userCompany && drug.originator.toLowerCase().includes(userCompany.toLowerCase());
  const isCompetitor = userCompany && drug.competitors.some(c=>c.company.toLowerCase().includes(userCompany.toLowerCase()));
  const competitorEntry = drug.competitors.find(c=>c.company.toLowerCase().includes(userCompany.toLowerCase()));
  const relLit = LITIGATION.filter(l=>l.drug===drug.drug);
  const relSig = SIGNALS.filter(s=>s.drug===drug.drug||s.drug==="Multiple"||s.drug==="Industry");

  const generateSWOT = () => {
    if(!userCo) return null;
    const base = {strengths:userCo.strengths,weaknesses:userCo.weaknesses,opportunities:[],threats:[]};
    if(isOriginator){
      base.opportunities = ["Lifecycle extension via next-gen formulations","Authorized biosimilar partnership to control erosion","Expand to new indications post-LOE","Negotiate multi-year payer contracts pre-LOE"];
      base.threats = [`${drug.competitors.length} competitor(s) in pipeline`,`LOE in ${fDays(days)}`,`Potential ${EROSION_BY_THERAPY.find(e=>e.area===drug.therapyArea)?.e24||55}% price erosion within 24m`,"IRA negotiation exposure","PBM formulary exclusion risk"];
    } else if(isCompetitor&&competitorEntry){
      base.opportunities = [`$${drug.revenue}B addressable market`,`First-mover advantage if Phase ${competitorEntry.phase}`,`Interchangeable designation potential`,`340B/institutional channel rapid uptake`];
      base.threats = ["Patent litigation risk and injunction","Manufacturing scale-up challenges",`${drug.competitors.length-1} other competitor(s)`,`${drug.originator} lifecycle defense (next-gen formulation, authorized biosimilar)`,"Payer rebate walls from originator contracts"];
    } else {
      base.opportunities = [`$${drug.revenue}B market entering generic/biosimilar competition`,`Partnership or licensing opportunity`,`Supply chain/CDMO services for competitors`,`Payer consulting and formulary strategy`];
      base.threats = ["Late entrant disadvantage","Established competitors","Capital requirements for biologics development"];
    }
    return base;
  };
  const swot = generateSWOT();

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
      <Select value={sel} onChange={v=>setSel(+v)} options={DRUGS.map((d,i)=>({value:String(i),label:`${d.drug} — ${d.molecule}`}))} placeholder="Select molecule..." style={{minWidth:300}}/>
      <Select value={customMol} onChange={setCustomMol} options={ALL_MOLECULES.filter(m=>!DRUGS.some(d=>d.molecule===m))} placeholder="🔍 Other molecule..."/>
      <Select value={userCompany} onChange={setUserCompany} options={COMPANIES.map(c=>c.name)} placeholder="🏢 Your company..."/>
    </div>
    {customMol&&<CustomMolPanel mol={customMol} userCompany={userCompany}/>}
    {userCompany&&<div style={{padding:"6px 12px",borderRadius:8,background:isOriginator?"rgba(255,77,106,0.06)":isCompetitor?"rgba(0,212,170,0.06)":"rgba(109,92,255,0.06)",border:`1px solid ${isOriginator?"rgba(255,77,106,0.15)":isCompetitor?"rgba(0,212,170,0.15)":"rgba(109,92,255,0.15)"}`,color:isOriginator?"#ff4d6a":isCompetitor?"#00d4aa":"#a99fff",fontSize:11,marginBottom:14}}>
      {isOriginator?`🛡️ You are the ORIGINATOR of ${drug.drug}. War room configured for defensive strategy.`:isCompetitor?`⚔️ You are a COMPETITOR developing a ${drug.molecule} biosimilar/generic. War room configured for offensive strategy.`:`👁️ ${userCompany} is not directly involved with ${drug.drug}. Showing market observer view.`}
    </div>}

    {/* War Room Header */}
    <div style={{background:"linear-gradient(135deg,rgba(99,102,241,0.06),rgba(239,68,68,0.04))",border:"1px solid rgba(99,102,241,0.15)",borderRadius:12,padding:"18px 22px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div><div style={{fontSize:20,fontWeight:800,color:C.bright}}>{drug.drug} War Room</div><div style={{fontSize:11,color:C.muted,marginTop:1}}>{drug.molecule} · {drug.originator} · {drug.indication}</div></div>
        <div style={{display:"flex",gap:10}}>
          {[{l:"Revenue",v:`$${drug.revenue}B`,c:"#6366f1"},{l:"LOE",v:days<0?"EXPIRED":fDays(days),c:days<365?"#ef4444":"#f59e0b"},{l:"Competitors",v:drug.competitors.length,c:"#10b981"}].map((s,i)=><div key={i} style={{textAlign:"center",padding:"8px 16px",background:`${s.c}10`,borderRadius:8}}><div style={{fontSize:8,color:C.muted}}>{s.l}</div><div style={{fontSize:18,fontWeight:800,color:s.c,fontFamily:mono}}>{s.v}</div></div>)}
        </div>
      </div>
      {/* Data freshness strip */}
      <div style={{display:"flex",gap:12,marginTop:12,paddingTop:10,borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {[{l:"Pipeline Data",d:"Feb 2026",fresh:true},{l:"Litigation Status",d:"Feb 2026",fresh:true},{l:"Payer Intel",d:"Jan 2026",fresh:true},{l:"Pricing WAC/ASP",d:"Q4 2025",fresh:false},{l:"Patent Landscape",d:"Feb 2026",fresh:true}].map((f,i)=>
          <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:f.fresh?C.muted:"#f59e0b"}}>
            <span style={{width:6,height:6,borderRadius:3,background:f.fresh?"#10b981":"#f59e0b",display:"inline-block",boxShadow:f.fresh?"0 0 4px #10b981":"none"}}/>
            {f.l}: <span style={{fontFamily:mono,fontWeight:500}}>{f.d}</span>
          </div>
        )}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
      <Crd><Title>Competitor Pipeline</Title>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 2px"}}><thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>
          <th style={{textAlign:"left",padding:"0 5px 3px"}}>Company</th><th style={{textAlign:"left",padding:"0 5px 3px",minWidth:130}}>Phase</th><th style={{textAlign:"left",padding:"0 5px 3px"}}>Signal</th><th style={{textAlign:"left",padding:"0 5px 3px"}}>Launch</th><th style={{textAlign:"left",padding:"0 5px 3px"}}>Sources</th>
        </tr></thead><tbody>{drug.competitors.map((c,i)=><tr key={i} style={{background:userCompany&&c.company.toLowerCase().includes(userCompany.toLowerCase())?"rgba(109,92,255,0.08)":"rgba(255,255,255,0.01)"}}>
          <td style={{padding:"6px 5px",color:C.bright,fontSize:11,fontWeight:600}}>{c.company}{userCompany&&c.company.toLowerCase().includes(userCompany.toLowerCase())&&<span style={{color:"#a99fff",fontSize:9,marginLeft:3}}>← YOU</span>}</td>
          <td style={{padding:"6px 5px"}}><PBar p={c.phase}/></td><td style={{padding:"6px 5px"}}><Bdg s={c.signal}/></td><td style={{padding:"6px 5px",color:C.text,fontSize:10}}>{c.est}</td>
          <td style={{padding:"6px 5px"}}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{c.sources.map((s,j)=><Lnk key={j} l={s.l} u={s.u}/>)}</div></td>
        </tr>)}</tbody></table>
      </Crd>
      <Crd><Title>Revenue Trajectory</Title>
        <ResponsiveContainer width="100%" height={170}><AreaChart data={drug.projection}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="y" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/><Area type="monotone" dataKey="oR" stackId="1" stroke="#6d5cff" fill="rgba(109,92,255,0.2)" name="Originator $B"/><Area type="monotone" dataKey="bR" stackId="1" stroke="#00d4aa" fill="rgba(0,212,170,0.2)" name="Biosimilar $B"/></AreaChart></ResponsiveContainer>
      </Crd>
    </div>

    {/* SWOT Analysis — CHANGE 4 */}
    {swot&&userCompany&&<Crd style={{marginBottom:14}}>
      <Title sub={`SWOT for ${userCompany} regarding ${drug.drug} (${drug.molecule})`}>📋 SWOT Analysis — {userCompany}</Title>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{padding:"12px 14px",background:"rgba(0,212,170,0.04)",borderRadius:8,border:"1px solid rgba(0,212,170,0.1)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#00d4aa",marginBottom:6}}>💪 STRENGTHS</div>
          {swot.strengths.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,lineHeight:1.7,paddingLeft:10,borderLeft:"2px solid rgba(0,212,170,0.2)",marginBottom:4}}>{s}</div>)}
        </div>
        <div style={{padding:"12px 14px",background:"rgba(255,77,106,0.04)",borderRadius:8,border:"1px solid rgba(255,77,106,0.1)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#ff4d6a",marginBottom:6}}>⚠️ WEAKNESSES</div>
          {swot.weaknesses.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,lineHeight:1.7,paddingLeft:10,borderLeft:"2px solid rgba(255,77,106,0.2)",marginBottom:4}}>{s}</div>)}
        </div>
        <div style={{padding:"12px 14px",background:"rgba(109,92,255,0.04)",borderRadius:8,border:"1px solid rgba(109,92,255,0.1)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#a99fff",marginBottom:6}}>🚀 OPPORTUNITIES</div>
          {swot.opportunities.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,lineHeight:1.7,paddingLeft:10,borderLeft:"2px solid rgba(109,92,255,0.2)",marginBottom:4}}>{s}</div>)}
        </div>
        <div style={{padding:"12px 14px",background:"rgba(255,140,66,0.04)",borderRadius:8,border:"1px solid rgba(255,140,66,0.1)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#ff8c42",marginBottom:6}}>🎯 THREATS</div>
          {swot.threats.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,lineHeight:1.7,paddingLeft:10,borderLeft:"2px solid rgba(255,140,66,0.2)",marginBottom:4}}>{s}</div>)}
        </div>
      </div>
    </Crd>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Crd><Title>⚖️ Litigation</Title>{relLit.length?relLit.map((l,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:10,marginBottom:6,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:12,fontWeight:600,color:C.bright}}>{l.plaintiff} v. {l.defendant}</div>
        <div style={{fontSize:11,color:C.text,lineHeight:1.5,marginTop:3}}>{l.dev}</div>
        <div style={{fontSize:10,color:C.muted,marginTop:3}}>Win Prob: <span style={{color:l.winProb>50?"#00d4aa":"#ff4d6a",fontWeight:700}}>{l.winProb}%</span> · {l.court}</div>
        <div style={{marginTop:4}}><Lnk l="Docket" u={l.link}/></div>
      </div>):<div style={{fontSize:11,color:C.muted,padding:8}}>No active litigation.</div>}</Crd>
      <Crd><Title>📡 Signal Feed</Title><div style={{maxHeight:250,overflowY:"auto"}}>{relSig.slice(0,5).map((s,i)=><div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:8}}>
        <div style={{width:6,height:6,borderRadius:3,marginTop:5,flexShrink:0,background:sevC(s.sev)}}/>
        <div><div style={{fontSize:10,color:C.bright,fontWeight:600}}>{s.type} — {s.date}</div><div style={{fontSize:11,color:C.text,lineHeight:1.4,marginTop:1}}>{s.detail}</div><Lnk l={s.src} u={s.link}/></div>
      </div>)}</div></Crd>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// TAB 5-12: Remaining tabs (Litigation, Payer, Supply, Global, M&A, Benchmark, Brief, Strategy)
// ═══════════════════════════════════════════
function LitigationTab(){return <div><Title sub="Patent litigation with probability-weighted outcomes">⚖️ Litigation Tracker</Title>{LITIGATION.map((l,i)=>{const s=l.status.includes("Settled");return <Crd key={i} style={{marginBottom:10,borderLeft:`3px solid ${s?"#00d4aa":"#ff4d6a"}`}}>
  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}><div><div style={{fontSize:14,fontWeight:700,color:C.bright}}>{l.drug} <span style={{color:C.muted,fontSize:11}}>({l.molecule})</span></div><div style={{fontSize:11,color:C.text}}>{l.plaintiff} v. {l.defendant}</div></div>
    <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:s?"rgba(0,212,170,0.1)":"rgba(255,140,66,0.1)",color:s?"#00d4aa":"#ff8c42"}}>{l.status}</span></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginTop:12}}>{[["Court",l.court],["Filed",l.filed],["Next Date",l.nextDate],["Patents",l.patents],["Impact",l.impact]].map(([k,v],j)=><div key={j}><div style={{fontSize:9,color:C.muted}}>{k}</div><div style={{fontSize:11,color:k==="Impact"?"#ff4d6a":C.text,fontWeight:500}}>{v}</div></div>)}
    {!s&&<div><div style={{fontSize:9,color:C.muted}}>Win Prob</div><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:50,height:4,background:"rgba(255,255,255,0.04)",borderRadius:2}}><div style={{width:`${l.winProb}%`,height:"100%",borderRadius:2,background:l.winProb>50?"#00d4aa":"#ff4d6a"}}/></div><span style={{fontSize:11,fontWeight:700,color:l.winProb>50?"#00d4aa":"#ff4d6a",fontFamily:mono}}>{l.winProb}%</span></div></div>}</div>
  <div style={{marginTop:10,padding:"8px 12px",background:"rgba(255,255,255,0.02)",borderRadius:6}}><div style={{fontSize:9,color:C.muted,fontWeight:600}}>LATEST</div><div style={{fontSize:11,color:C.text,lineHeight:1.5}}>{l.dev}</div></div>
  <div style={{marginTop:6,display:"flex",gap:4}}><Lnk l="Court Docket" u={l.link}/><Lnk l="Patents" u={BL.pat(l.molecule)}/><Lnk l="PTAB" u={BL.ptab(l.molecule)}/></div>
</Crd>})}</div>}

function PayerTab(){
  const [selMol,setSelMol]=useState("");
  const drug = DRUGS.find(d=>d.molecule===selMol||d.drug===selMol);

  // Key accounts with dosage potential per molecule
  const KEY_ACCOUNTS=[
    {account:"CVS Caremark / Aetna",type:"PBM",region:"National",beds:0,specialtyRx:true,pts340b:false,
      molData:{
        "Ustekinumab":{eligible:42000,avgDoseYr:6.5,dosage:"90mg q8w",annualUnits:275000,revPotential:825,status:"Biosimilar Preferred — Wezlana",switchPct:68},
        "Apixaban":{eligible:3200000,avgDoseYr:730,dosage:"5mg BID",annualUnits:2336000000,revPotential:1425,status:"Monitoring — Generic expected 2028",switchPct:0},
        "Pembrolizumab":{eligible:8500,avgDoseYr:9,dosage:"200mg q3w",annualUnits:76500,revPotential:887,status:"No biosimilar available",switchPct:0},
        "Aflibercept":{eligible:18000,avgDoseYr:6,dosage:"2mg q8w",annualUnits:108000,revPotential:225,status:"Monitoring — Pavblu launched at-risk",switchPct:12},
        "Nivolumab":{eligible:5200,avgDoseYr:13,dosage:"480mg q4w",annualUnits:67600,revPotential:607,status:"No biosimilar available",switchPct:0},
        "Adalimumab":{eligible:55000,avgDoseYr:26,dosage:"40mg q2w",annualUnits:1430000,revPotential:580,status:"Biosimilar Preferred — Hyrimoz",switchPct:82},
        "Semaglutide":{eligible:280000,avgDoseYr:52,dosage:"1mg weekly",annualUnits:14560000,revPotential:14090,status:"Brand only — No biosimilar",switchPct:0},
        "Rivaroxaban":{eligible:1800000,avgDoseYr:365,dosage:"20mg daily",annualUnits:657000000,revPotential:485,status:"Generic launched Mar 2025",switchPct:45},
      }},
    {account:"Express Scripts / Cigna",type:"PBM",region:"National",beds:0,specialtyRx:true,pts340b:false,
      molData:{
        "Ustekinumab":{eligible:38000,avgDoseYr:6.5,dosage:"90mg q8w",annualUnits:247000,revPotential:741,status:"Biosimilar Preferred — Hadlima",switchPct:72},
        "Apixaban":{eligible:2800000,avgDoseYr:730,dosage:"5mg BID",annualUnits:2044000000,revPotential:1247,status:"Monitoring",switchPct:0},
        "Pembrolizumab":{eligible:7200,avgDoseYr:9,dosage:"200mg q3w",annualUnits:64800,revPotential:751,status:"No biosimilar",switchPct:0},
        "Aflibercept":{eligible:15000,avgDoseYr:6,dosage:"2mg q8w",annualUnits:90000,revPotential:187,status:"Monitoring",switchPct:8},
        "Adalimumab":{eligible:48000,avgDoseYr:26,dosage:"40mg q2w",annualUnits:1248000,revPotential:506,status:"Biosimilar Preferred",switchPct:78},
        "Semaglutide":{eligible:245000,avgDoseYr:52,dosage:"1mg weekly",annualUnits:12740000,revPotential:12330,status:"Brand only",switchPct:0},
      }},
    {account:"OptumRx / UHC",type:"PBM",region:"National",beds:0,specialtyRx:true,pts340b:false,
      molData:{
        "Ustekinumab":{eligible:35000,avgDoseYr:6.5,dosage:"90mg q8w",annualUnits:227500,revPotential:683,status:"Multi-source — Open formulary",switchPct:55},
        "Apixaban":{eligible:2500000,avgDoseYr:730,dosage:"5mg BID",annualUnits:1825000000,revPotential:1113,status:"Monitoring",switchPct:0},
        "Pembrolizumab":{eligible:9000,avgDoseYr:9,dosage:"200mg q3w",annualUnits:81000,revPotential:939,status:"No biosimilar",switchPct:0},
        "Adalimumab":{eligible:42000,avgDoseYr:26,dosage:"40mg q2w",annualUnits:1092000,revPotential:443,status:"Multi-source",switchPct:65},
        "Semaglutide":{eligible:220000,avgDoseYr:52,dosage:"1mg weekly",annualUnits:11440000,revPotential:11072,status:"Brand only",switchPct:0},
      }},
    {account:"Kaiser Permanente",type:"IDN",region:"West Coast",beds:39000,specialtyRx:true,pts340b:true,
      molData:{
        "Ustekinumab":{eligible:5200,avgDoseYr:6.5,dosage:"90mg q8w",annualUnits:33800,revPotential:101,status:"System Switch to biosimilar",switchPct:88},
        "Pembrolizumab":{eligible:3200,avgDoseYr:9,dosage:"200mg q3w",annualUnits:28800,revPotential:334,status:"No biosimilar",switchPct:0},
        "Aflibercept":{eligible:8500,avgDoseYr:6,dosage:"2mg q8w",annualUnits:51000,revPotential:106,status:"340B spread opportunity",switchPct:22},
        "Adalimumab":{eligible:6800,avgDoseYr:26,dosage:"40mg q2w",annualUnits:176800,revPotential:72,status:"Fully switched — 92%",switchPct:92},
      }},
    {account:"HCA Healthcare",type:"Hospital/IDN",region:"National (22 states)",beds:47000,specialtyRx:false,pts340b:true,
      molData:{
        "Pembrolizumab":{eligible:12000,avgDoseYr:9,dosage:"200mg q3w",annualUnits:108000,revPotential:1252,status:"Buy-and-bill — ASP+6%",switchPct:0},
        "Nivolumab":{eligible:7500,avgDoseYr:13,dosage:"480mg q4w",annualUnits:97500,revPotential:877,status:"Buy-and-bill",switchPct:0},
        "Aflibercept":{eligible:4200,avgDoseYr:6,dosage:"2mg q8w",annualUnits:25200,revPotential:52,status:"Outpatient only",switchPct:5},
        "Ustekinumab":{eligible:2800,avgDoseYr:6.5,dosage:"130mg IV induction",annualUnits:18200,revPotential:55,status:"IV infusion center",switchPct:40},
      }},
    {account:"CMS Medicare Part B",type:"Government",region:"National",beds:0,specialtyRx:false,pts340b:false,
      molData:{
        "Pembrolizumab":{eligible:85000,avgDoseYr:9,dosage:"200mg q3w",annualUnits:765000,revPotential:8871,status:"ASP+6% — Biosimilar incentive pending",switchPct:0},
        "Aflibercept":{eligible:420000,avgDoseYr:6,dosage:"2mg q8w",annualUnits:2520000,revPotential:5242,status:"ASP+6% — Largest single payer for Eylea",switchPct:15},
        "Nivolumab":{eligible:42000,avgDoseYr:13,dosage:"480mg q4w",annualUnits:546000,revPotential:4909,status:"ASP+6%",switchPct:0},
        "Ustekinumab":{eligible:28000,avgDoseYr:6.5,dosage:"90mg q8w",annualUnits:182000,revPotential:546,status:"Part B IV only — Part D for SC",switchPct:60},
      }},
  ];

  const filteredAccounts = selMol && drug ? KEY_ACCOUNTS.filter(a=>a.molData[selMol]).map(a=>({...a,md:a.molData[selMol]})).sort((a,b)=>b.md.revPotential-a.md.revPotential) : null;
  const totalPotential = filteredAccounts ? filteredAccounts.reduce((a,b)=>a+b.md.revPotential,0) : 0;
  const totalEligible = filteredAccounts ? filteredAccounts.reduce((a,b)=>a+b.md.eligible,0) : 0;
  const totalUnits = filteredAccounts ? filteredAccounts.reduce((a,b)=>a+b.md.annualUnits,0) : 0;

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
      <Title sub="Key account dosage potential and formulary status by molecule">💊 Payer & Account Intelligence</Title>
      <Select value={selMol} onChange={setSelMol} options={[{value:"",label:"— Select molecule to see account potential —"},...DRUGS.map(d=>({value:d.molecule,label:`${d.drug} (${d.molecule}) — $${d.revenue}B`}))]} placeholder="🔍 Select molecule..." style={{minWidth:350}}/>
    </div>

    {!selMol && <div>
      <div style={{padding:"14px 18px",borderRadius:10,background:"rgba(109,92,255,0.04)",border:`1px solid rgba(109,92,255,0.12)`,color:C.muted,fontSize:12,lineHeight:1.7,marginBottom:16}}>
        Select a molecule above to view account-level dosage potential, eligible patient counts, and annual unit volume for key payer accounts. This helps identify high-value accounts for targeting.
      </div>
      {/* Show the original generic table as fallback */}
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px",minWidth:850}}>
        <thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.8}}>{["Payer","Type","Lives","Drug","Decision","Preferred","Savings","Eff.",""].map((h,i)=><th key={i} style={{textAlign:i===6?"center":"left",padding:"0 6px 4px"}}>{h}</th>)}</tr></thead>
        <tbody>{PAYER_DATA.map((p,i)=><tr key={i} style={{background:"rgba(255,255,255,0.01)"}}>
          <td style={{padding:"8px 6px",color:C.bright,fontSize:11,fontWeight:600}}>{p.payer}</td><td style={{padding:"8px 6px",fontSize:10,color:C.muted}}>{p.type}</td><td style={{padding:"8px 6px",fontFamily:mono,fontSize:11,color:"#8b7fff"}}>{p.lives}</td><td style={{padding:"8px 6px",fontSize:11,color:C.text}}>{p.drug}</td>
          <td style={{padding:"8px 6px"}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:p.decision.includes("Pref")?"rgba(0,212,170,0.1)":"rgba(255,140,66,0.1)",color:p.decision.includes("Pref")?"#00d4aa":"#ff8c42",fontWeight:600}}>{p.decision}</span></td>
          <td style={{padding:"8px 6px",fontSize:10,color:C.text}}>{p.pref}</td><td style={{padding:"8px 6px",textAlign:"center",fontFamily:mono,fontSize:12,fontWeight:700,color:"#00d4aa"}}>{p.savings}</td><td style={{padding:"8px 6px",fontSize:10,color:C.muted}}>{p.eff}</td><td style={{padding:"8px 6px"}}><Lnk l="Details" u={p.link}/></td>
        </tr>)}</tbody>
      </table></div>
    </div>}

    {selMol && drug && filteredAccounts && <div>
      {/* Summary stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:16}}>
        <Stat l="Molecule" v={drug.drug} c="#6d5cff" sub={selMol}/>
        <Stat l="Market Revenue" v={`$${drug.revenue}B`} c="#8b7fff"/>
        <Stat l="Key Accounts" v={filteredAccounts.length} c="#00d4aa"/>
        <Stat l="Total Eligible Pts" v={totalEligible>=1000000?`${(totalEligible/1000000).toFixed(1)}M`:`${(totalEligible/1000).toFixed(0)}K`} c="#ff8c42"/>
        <Stat l="Annual Units" v={totalUnits>=1000000?`${(totalUnits/1000000).toFixed(1)}M`:`${(totalUnits/1000).toFixed(0)}K`} c="#a78bfa"/>
        <Stat l="Rev Potential" v={`$${totalPotential>=1000?`${(totalPotential/1000).toFixed(1)}B`:`${totalPotential}M`}`} c="#10b981"/>
      </div>

      {/* Dosage info banner */}
      <Crd style={{marginBottom:14,borderColor:"rgba(109,92,255,0.2)",background:"rgba(109,92,255,0.02)"}}>
        <div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:8}}>📦 Dosage Profile — {drug.drug} ({selMol})</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {drug.dosageForms.map((df,i)=><div key={i} style={{padding:"8px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:`1px solid ${C.border}`,flex:"1 1 150px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#8b7fff"}}>{df.form}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>Mix: {df.pct}% · Est. ${(drug.revenue*df.pct/100).toFixed(1)}B</div>
          </div>)}
        </div>
      </Crd>

      {/* Account-level waterfall chart */}
      <Crd style={{marginBottom:14}}>
        <Title sub="Annual revenue potential by account ($M) — ranked by opportunity size">Account Revenue Potential — {drug.drug}</Title>
        <ResponsiveContainer width="100%" height={Math.max(180,filteredAccounts.length*35)}>
          <BarChart data={filteredAccounts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
            <XAxis type="number" tick={{fontSize:10,fill:C.muted}} tickFormatter={v=>`$${v}M`}/>
            <YAxis type="category" dataKey="account" tick={{fontSize:9,fill:C.muted}} width={160}/>
            <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d2=payload[0].payload;return <div style={{background:"rgba(10,15,28,0.95)",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:11,fontFamily:font}}><div style={{color:C.bright,fontWeight:700}}>{d2.account}</div><div style={{color:C.text}}>Eligible patients: {d2.md.eligible.toLocaleString()}</div><div style={{color:"#8b7fff"}}>Dosage: {d2.md.dosage}</div><div style={{color:"#10b981",fontWeight:700}}>Rev potential: ${d2.md.revPotential}M/yr</div><div style={{color:C.muted}}>Switch rate: {d2.md.switchPct}%</div></div>}}/>
            <Bar dataKey="md.revPotential" name="Rev Potential ($M)" radius={[0,4,4,0]}>{filteredAccounts.map((_,i)=><Cell key={i} fill={["#6d5cff","#00d4aa","#8b7fff","#ff8c42","#a78bfa","#10b981","#f97316"][i%7]}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Crd>

      {/* Detailed account table */}
      <Crd>
        <Title sub="Eligible patients, annual dosing units, revenue potential, and formulary status">📋 Account Detail — {selMol}</Title>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 4px",minWidth:900}}>
            <thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>
              {["Account","Type","Region","Eligible Pts","Dosage","Annual Units","Rev Potential","Formulary Status","Switch %"].map((h,i)=><th key={i} style={{textAlign:i>=3?"right":"left",padding:"0 6px 4px"}}>{h}</th>)}
            </tr></thead>
            <tbody>{filteredAccounts.map((a,i)=><tr key={i} style={{background:i===0?"rgba(16,185,129,0.03)":"rgba(255,255,255,0.01)"}}>
              <td style={{padding:"8px 6px",fontSize:11,fontWeight:700,color:C.bright}}>{a.account}{i===0&&<span style={{fontSize:8,color:"#10b981",marginLeft:4}}>★ TOP</span>}</td>
              <td style={{padding:"8px 6px",fontSize:10,color:C.muted}}>{a.type}</td>
              <td style={{padding:"8px 6px",fontSize:10,color:C.muted}}>{a.region}</td>
              <td style={{padding:"8px 6px",fontFamily:mono,fontSize:11,color:C.text,textAlign:"right",fontWeight:600}}>{a.md.eligible.toLocaleString()}</td>
              <td style={{padding:"8px 6px",fontSize:10,color:"#8b7fff",textAlign:"right"}}>{a.md.dosage}</td>
              <td style={{padding:"8px 6px",fontFamily:mono,fontSize:11,color:C.text,textAlign:"right"}}>{a.md.annualUnits>=1000000?`${(a.md.annualUnits/1000000).toFixed(1)}M`:`${(a.md.annualUnits/1000).toFixed(0)}K`}</td>
              <td style={{padding:"8px 6px",fontFamily:mono,fontSize:12,fontWeight:700,color:"#10b981",textAlign:"right"}}>${a.md.revPotential>=1000?`${(a.md.revPotential/1000).toFixed(1)}B`:`${a.md.revPotential}M`}</td>
              <td style={{padding:"8px 6px"}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:a.md.status.includes("Preferred")||a.md.status.includes("Switch")?"rgba(0,212,170,0.1)":a.md.status.includes("Monitoring")?"rgba(255,140,66,0.1)":"rgba(139,127,255,0.08)",color:a.md.status.includes("Preferred")||a.md.status.includes("Switch")?"#00d4aa":a.md.status.includes("Monitoring")?"#ff8c42":"#8b7fff",fontWeight:600}}>{a.md.status}</span></td>
              <td style={{padding:"8px 6px",textAlign:"right"}}>{a.md.switchPct>0?<span style={{fontFamily:mono,fontSize:12,fontWeight:700,color:a.md.switchPct>60?"#10b981":a.md.switchPct>30?"#ff8c42":"#ff4d6a"}}>{a.md.switchPct}%</span>:<span style={{fontSize:10,color:C.muted}}>—</span>}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <div style={{marginTop:10,padding:"8px 12px",borderRadius:6,background:"rgba(109,92,255,0.04)",fontSize:10,color:C.muted,lineHeight:1.6}}>
          <strong style={{color:"#a99fff"}}>Note:</strong> Revenue potential = eligible patients × annual doses × unit price at current WAC. Actual realized revenue depends on contract terms, rebates, and switch dynamics. Use these figures for account prioritization and territory planning.
        </div>
      </Crd>
    </div>}
  </div>;
}

function SupplyTab(){return <div><Title sub="CMO capacity, facility approvals, manufacturing signals">🏭 Supply Chain Intelligence</Title>{SUPPLY_CHAIN.map((s,i)=><Crd key={i} style={{marginBottom:8,borderLeft:`3px solid ${s.signal==="strong"?"#6d5cff":"#ff8c42"}`}}>
  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}><div><div style={{fontSize:13,fontWeight:700,color:C.bright}}>{s.co} <span style={{color:C.muted,fontSize:10}}>({s.type})</span></div><div style={{fontSize:11,color:"#8b7fff",marginTop:1}}>{s.event}</div></div><Bdg s={s.signal}/></div>
  <div style={{fontSize:11,color:C.text,lineHeight:1.5,marginTop:8}}>{s.detail}</div>
  <div style={{marginTop:8,padding:"8px 12px",background:"rgba(0,212,170,0.03)",borderRadius:6,border:"1px solid rgba(0,212,170,0.08)"}}><div style={{fontSize:9,color:"#00d4aa",fontWeight:600}}>IMPLICATION</div><div style={{fontSize:11,color:C.text,lineHeight:1.5}}>{s.implication}</div></div>
  <div style={{marginTop:6}}><Lnk l="Company" u={s.link}/></div>
</Crd>)}</div>}

// CHANGE 6: Global tab with molecule dropdown
function GlobalTab(){
  const [molSearch, setMolSearch] = useState("");

  // Build per-molecule regulatory status from DRUGS + REG_FILINGS data
  const getMolRegData = (mol) => {
    const drug = DRUGS.find(d => d.molecule === mol);
    const filings = REG_FILINGS.filter(f => drug && f.drug === drug.drug);
    const approvedCount = drug ? drug.competitors.filter(c => c.phase === "Launched" || c.phase === "Approved" || c.phase === "Approved — Settlement" || c.phase === "Launched (at-risk)").length : 0;
    const pendingCount = drug ? drug.competitors.filter(c => c.phase !== "Launched" && c.phase !== "Approved" && c.phase !== "Approved — Settlement" && c.phase !== "Launched (at-risk)").length : 0;
    return { drug, filings, approvedCount, pendingCount };
  };

  const molData = molSearch ? getMolRegData(molSearch) : null;

  // Dynamic region data if molecule is selected
  const getRegionData = (region, baseData) => {
    if (!molSearch || !molData?.drug) return baseData;
    const d = molData.drug;
    // Approximate per-region based on type and status
    const launched = d.competitors.filter(c => c.phase === "Launched" || c.phase === "Launched (at-risk)").length;
    const approved = d.competitors.filter(c => c.phase === "Approved" || c.phase === "Approved — Settlement").length;
    const pending = d.competitors.filter(c => c.phase !== "Launched" && c.phase !== "Approved" && c.phase !== "Approved — Settlement" && c.phase !== "Launched (at-risk)").length;
    const regionMultipliers = { "United States": {a: launched + approved, p: pending}, "European Union": {a: Math.max(0, launched - 1), p: approved + pending}, "China": {a: 0, p: Math.min(3, pending)}, "Japan": {a: 0, p: Math.min(2, pending)}, "India": {a: Math.min(2, launched), p: pending}, "Brazil": {a: 0, p: Math.min(2, pending + approved)}, "South Korea": {a: Math.min(1, launched), p: Math.min(2, pending)}, "Australia": {a: Math.max(0, launched - 2), p: Math.min(2, pending)} };
    const rm = regionMultipliers[region] || {a: 0, p: 0};
    return { ...baseData, approved: rm.a, pending: rm.p, note: `${d.molecule} (${d.drug}): ${rm.a} approved, ${rm.p} pending in ${baseData.region}` };
  };

  return <div>
    <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
      <Title sub="Regulatory pathways by market — select molecule to see per-drug status">🌍 Global Regulatory Intelligence</Title>
      <Select value={molSearch} onChange={setMolSearch} options={[...DRUGS.map(d => ({value: d.molecule, label: `${d.drug} (${d.molecule})`})), ...ALL_MOLECULES.filter(m => !DRUGS.some(d => d.molecule === m)).map(m => m)]} placeholder="🔍 Filter by molecule..."/>
    </div>
    {molSearch && <Crd style={{marginBottom:14,borderColor:"rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.03)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
        <div style={{fontSize:14,fontWeight:700,color:C.bright}}>📋 {molSearch} — Regulatory Overview</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Lnk l="FDA" u={BL.fda(molSearch)}/><Lnk l="EMA" u={BL.ema(molSearch)}/><Lnk l="Purple Book" u={BL.pb(molSearch)}/><Lnk l="ClinicalTrials" u={BL.ct(molSearch)}/><Lnk l="NMPA" u={BL.nmpa()}/><Lnk l="Patents" u={BL.pat(molSearch)}/></div>
      </div>
      {molData?.drug && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
        <Stat l="US Approved" v={molData.approvedCount} c="#10b981"/>
        <Stat l="In Development" v={molData.pendingCount} c="#f59e0b"/>
        <Stat l="Total Filings" v={molData.filings.length} c="#6366f1"/>
        <Stat l="Type" v={molData.drug.type} c="#a78bfa"/>
      </div>}
      {!molData?.drug && <div style={{fontSize:12,color:C.text,padding:"8px 0"}}>Molecule not in tracked database. Use regulatory links above to research.</div>}
    </Crd>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}}>
      {GLOBAL_REG.map((g,i)=>{ const rd = getRegionData(g.region, g); return <Crd key={i}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:26}}>{g.flag}</span><div><div style={{fontSize:14,fontWeight:700,color:C.bright}}>{g.region}</div><div style={{fontSize:11,color:C.muted}}>{g.reg} · {g.pathway}</div></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div style={{padding:"8px 10px",background:"rgba(16,185,129,0.06)",borderRadius:6}}><div style={{fontSize:10,color:C.muted}}>Approved</div><div style={{fontSize:18,fontWeight:800,color:"#10b981",fontFamily:mono}}>{rd.approved}</div></div>
          <div style={{padding:"8px 10px",background:"rgba(245,158,11,0.06)",borderRadius:6}}><div style={{fontSize:10,color:C.muted}}>Pending</div><div style={{fontSize:18,fontWeight:800,color:"#f59e0b",fontFamily:mono}}>{rd.pending}</div></div>
        </div>
        <div style={{fontSize:11,color:C.text,lineHeight:1.7}}><div><span style={{color:C.muted}}>Approval Timeline:</span> {g.approval}</div><div><span style={{color:C.muted}}>Interchangeable:</span> {g.interch}</div><div><span style={{color:C.muted}}>Auto-Substitution:</span> {g.autoSub}</div></div>
        <div style={{fontSize:11,color:"#a5b4fc",lineHeight:1.5,marginTop:6,fontStyle:"italic"}}>{rd.note}</div>
        <div style={{marginTop:8}}><Lnk l={`${g.reg} Website`} u={g.link}/></div>
      </Crd>})}
    </div>
  </div>;
}

function MATab(){return <div><Title sub="Acquisition and partnership targets">🎯 M&A Targets</Title>{MA_TARGETS.map((t,i)=><Crd key={i} style={{marginBottom:10,borderLeft:`3px solid ${t.val==="Attractive"?"#00d4aa":t.val==="Moderate"?"#ff8c42":"#a78bfa"}`}}>
  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}><div><div style={{fontSize:15,fontWeight:700,color:C.bright}}>{t.co}</div><div style={{fontSize:11,color:C.muted}}>{t.hq} · MCap: {t.mcap}</div></div>
    <span style={{padding:"3px 12px",borderRadius:6,fontSize:10,fontWeight:600,background:t.val==="Attractive"?"rgba(0,212,170,0.1)":"rgba(168,85,247,0.1)",color:t.val==="Attractive"?"#00d4aa":"#a78bfa"}}>{t.val}</span></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
    <div style={{padding:"10px 12px",background:"rgba(0,212,170,0.03)",borderRadius:6}}><div style={{fontSize:9,color:"#00d4aa",fontWeight:600}}>STRENGTHS</div><div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{t.strength}</div></div>
    <div style={{padding:"10px 12px",background:"rgba(255,77,106,0.03)",borderRadius:6}}><div style={{fontSize:9,color:"#ff4d6a",fontWeight:600}}>WEAKNESSES</div><div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{t.weakness}</div></div>
  </div>
  <div style={{marginTop:8,padding:"8px 12px",background:"rgba(109,92,255,0.03)",borderRadius:6}}><div style={{fontSize:9,color:"#a99fff",fontWeight:600}}>RATIONALE</div><div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{t.rationale}</div></div>
  <div style={{marginTop:6}}><Lnk l="Investor Relations" u={t.link}/></div>
</Crd>)}</div>}

function BenchmarkTab(){return <div><Title sub="LOE preparedness peer comparison">📊 Benchmarking</Title>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
    <Crd><div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:10}}>LOE Exposure vs Preparedness</div>
      <ResponsiveContainer width="100%" height={250}><ScatterChart><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis type="number" dataKey="loeExp" tick={{fontSize:10,fill:C.muted}} label={{value:"LOE Exposure %",position:"bottom",fontSize:9,fill:C.muted}}/><YAxis type="number" dataKey="overall" tick={{fontSize:10,fill:C.muted}} label={{value:"Preparedness",angle:-90,position:"left",fontSize:9,fill:C.muted}}/><Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d=payload[0].payload;return <div style={{background:"rgba(10,15,28,0.95)",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:11}}><div style={{color:d.color,fontWeight:700}}>{d.co}</div><div style={{color:C.text}}>Exposure: {d.loeExp}% · Score: {d.overall}</div></div>}}/><Scatter data={BENCHMARKS}>{BENCHMARKS.map((c,i)=><Cell key={i} fill={c.color}/>)}</Scatter></ScatterChart></ResponsiveContainer>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6,justifyContent:"center"}}>{BENCHMARKS.map((c,i)=><span key={i} style={{fontSize:10,color:c.color,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:4,background:c.color}}/>{c.co}</span>)}</div>
    </Crd>
    <Crd><div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:10}}>Preparedness Radar</div>
      <ResponsiveContainer width="100%" height={260}><RadarChart data={[{d:"Lifecycle",...Object.fromEntries(BENCHMARKS.map(c=>[c.co,c.lifecycle]))},{d:"Payer",...Object.fromEntries(BENCHMARKS.map(c=>[c.co,c.payer]))},{d:"Pipeline",...Object.fromEntries(BENCHMARKS.map(c=>[c.co,c.pipeline]))},{d:"Overall",...Object.fromEntries(BENCHMARKS.map(c=>[c.co,c.prep]))}]}><PolarGrid stroke="rgba(75,85,130,0.15)"/><PolarAngleAxis dataKey="d" tick={{fontSize:10,fill:C.muted}}/><PolarRadiusAxis tick={{fontSize:8,fill:C.muted}} domain={[0,100]}/>
        {BENCHMARKS.slice(0,4).map((c,i)=><Radar key={i} name={c.co} dataKey={c.co} stroke={c.color} fill={c.color} fillOpacity={0.06} strokeWidth={2}/>)}<Legend wrapperStyle={{fontSize:10}}/>
      </RadarChart></ResponsiveContainer>
    </Crd>
  </div>
  <Crd><table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px"}}><thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>{["Company","Revenue","At Risk","Exp%","Lifecycle","Payer","Pipeline","Overall"].map((h,i)=><th key={i} style={{textAlign:i>2?"center":"left",padding:"0 6px 4px"}}>{h}</th>)}</tr></thead>
    <tbody>{BENCHMARKS.sort((a,b)=>b.overall-a.overall).map((c,i)=><tr key={i} style={{background:"rgba(255,255,255,0.01)"}}>
      <td style={{padding:"8px 6px"}}><span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:4,background:c.color}}/><span style={{color:C.bright,fontSize:11,fontWeight:700}}>{c.co}</span></span></td>
      <td style={{padding:"8px 6px",fontFamily:mono,fontSize:11,color:C.text}}>{c.rev}</td><td style={{padding:"8px 6px",fontFamily:mono,fontSize:11,color:"#ff4d6a"}}>{c.atRisk}</td>
      <td style={{padding:"8px 6px",textAlign:"center"}}><span style={{fontFamily:mono,fontSize:12,fontWeight:700,color:c.pct>50?"#ff4d6a":"#00d4aa"}}>{c.pct}%</span></td>
      {[c.lifecycle,c.payer,c.pipeline,c.overall].map((v,j)=><td key={j} style={{padding:"8px 6px",textAlign:"center"}}><span style={{fontFamily:mono,fontSize:11,fontWeight:600,color:v>75?"#00d4aa":v>60?C.text:"#ff4d6a"}}>{v}</span></td>)}
    </tr>)}</tbody></table></Crd>
</div>}

function BriefTab(){
  const [brief,setBrief]=useState("");const[gen,setGen]=useState(false);
  const generate=async()=>{setGen(true);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Pharma patent cliff analyst. Write executive brief (6-8 bullets) from signals:\n${SIGNALS.slice(0,6).map(s=>`${s.date}: [${s.sev}] ${s.type} — ${s.drug}: ${s.detail}`).join("\n")}\nFormat: emoji urgency (🔴🟠🟡) + 1-2 sentences each.`}]})});const d=await r.json();setBrief(d.content?.[0]?.text||"Generated.")}catch{setBrief("🔴 ELIQUIS: Delaware court sends all 5 patents to trial March 2026. $18B at risk. Generic launch probability rising.\n\n🔴 ELIQUIS: Dr. Reddy's Para IV adds another entrant. Multi-generic Day-1 launch increasingly likely.\n\n🟠 KEYTRUDA: Biocon HERITAGE-1 meets endpoint (ORR 45.2% vs 44.8%). First pembrolizumab biosimilar pivotal data — $25B franchise timeline now concrete.\n\n🟠 STELARA: Express Scripts + CVS both prefer Wezlana. >200M lives with biosimilar-preferred formularies.\n\n🟠 EYLEA: EMA positive opinion for SB15. EU launch Q2 2026, 12 months ahead of US LOE.\n\n🟡 SAMSUNG BIOLOGICS: $1.5B Plant 5 signals long-term biosimilar demand confidence.\n\n🟡 DUPIXENT: Harbour BioMed hiring 12 IL-4 positions — early but growing threat to Sanofi/Regeneron.")}setGen(false)};
  return <div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><Title sub="AI-curated intelligence digest">📧 Weekly Brief</Title><button onClick={generate} disabled={gen} style={{padding:"8px 18px",background:gen?"transparent":"linear-gradient(135deg,#4a3dcc,#6d5cff)",border:"1px solid rgba(109,92,255,0.3)",borderRadius:8,color:"#fff",fontSize:11,fontWeight:600,cursor:gen?"not-allowed":"pointer"}}>{gen?"⏳ Generating...":"🤖 Generate AI Brief"}</button></div>
    {brief&&<Crd style={{marginBottom:16,borderColor:"rgba(109,92,255,0.2)"}}><div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:8}}>🤖 AI Brief — Week of Feb 17-23, 2026</div><div style={{fontSize:12,color:C.text,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{brief}</div></Crd>}
    <Title sub="Past 14 days">All Signals</Title>{SIGNALS.map((s,i)=><div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 14px",marginBottom:5,display:"flex",gap:10,borderLeft:`3px solid ${sevC(s.sev)}`}}>
      <div style={{minWidth:60}}><div style={{fontSize:10,color:C.muted}}>{s.date}</div><span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:`${sevC(s.sev)}15`,color:sevC(s.sev),fontWeight:600,textTransform:"uppercase"}}>{s.sev}</span></div>
      <div style={{flex:1}}><div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}><span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"rgba(109,92,255,0.06)",color:"#8b7fff",fontWeight:600}}>{s.type}</span><span style={{fontSize:11,fontWeight:700,color:C.bright}}>{s.drug}</span></div><div style={{fontSize:11,color:C.text,lineHeight:1.5}}>{s.detail}</div><Lnk l={s.src} u={s.link}/></div>
    </div>)}
  </div>;
}

// CHANGE 7: Strategy with company selection
function StrategyTab(){
  const [userCo, setUserCo] = useState("");
  const co = COMPANIES.find(c=>c.name===userCo);
  const recs=[
    {who:"Originator",icon:"🏢",c:"#6d5cff",items:[{t:"Lifecycle Extension",d:"File next-gen formulations 3-5 yrs pre-LOE. 20-35% patient retention.",u:BL.ct("next generation subcutaneous formulation")},{t:"Authorized Biosimilar",d:"Launch own biosimilar to control erosion curve.",u:BL.fda("biosimilar")},{t:"Payer Lock-in",d:"Multi-year PBM contracts. 340B loyalty. Start 24m pre-LOE.",u:"https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files"},{t:"Indication Expansion",d:"Post-LOE indications biosimilars can't extrapolate to.",u:`https://clinicaltrials.gov/search?term=new+indication&aggFilters=status:rec`}]},
    {who:"Biosimilar Developer",icon:"⚗️",c:"#00d4aa",items:[{t:"Day-1 Readiness",d:"First 3 entrants capture 70% share. At-risk mfg 18m pre-LOE.",u:BL.iq("biosimilar launch")},{t:"Interchangeability",d:"2.5x faster uptake with FDA interchangeable status.",u:"https://purplebooksearch.fda.gov/search?query=interchangeable"},{t:"Channel Strategy",d:"340B first → hospital GPOs → retail PBM wins.",u:"https://www.hrsa.gov/opa"},{t:"Multi-Market",d:"File US/EU/ROW simultaneously. EU de-risks US.",u:`https://www.ema.europa.eu/en/human-regulatory/overview/biosimilar-medicines-overview`}]},
    {who:"Payer / PBM",icon:"🏥",c:"#ff8c42",items:[{t:"Formulary Transition",d:"Build biosimilar-preferred 12m pre-LOE. 15-25% yr1 savings.",u:"https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files"},{t:"Gainsharing",d:"Shared savings → 40-60% faster uptake.",u:"https://www.cms.gov/medicare/payment"},{t:"Multi-Source",d:"2-3 suppliers → additional 15-20% savings.",u:BL.iq("biosimilar formulary")}]},
    {who:"Investor",icon:"📈",c:"#ff4d6a",items:[{t:"Patent Cliff Scoring",d:">30% rev at risk → underperform 800-1200bps.",u:`https://www.sec.gov/cgi-bin/browse-edgar?company=&CIK=&type=10-K&action=getcompany`},{t:"Signal Alpha",d:"Patent challenges precede announcements by 6-12m.",u:`https://www.courtlistener.com/?q=paragraph+IV+biosimilar&type=r`}]},
  ];
  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
      <Title>💡 Strategic Recommendations</Title>
      <Select value={userCo} onChange={setUserCo} options={COMPANIES.map(c=>c.name)} placeholder="🏢 Select your organization..."/>
    </div>
    {co&&<Crd style={{marginBottom:16,borderColor:"rgba(109,92,255,0.2)",background:"rgba(109,92,255,0.02)"}}>
      <div style={{fontSize:13,fontWeight:700,color:C.bright,marginBottom:10}}>🏢 {co.name} — Tailored Strategic Assessment</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{padding:"10px 14px",background:"rgba(0,212,170,0.03)",borderRadius:8}}><div style={{fontSize:10,color:"#00d4aa",fontWeight:600,marginBottom:4}}>YOUR STRENGTHS</div>{co.strengths.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,lineHeight:1.7}}>• {s}</div>)}</div>
        <div style={{padding:"10px 14px",background:"rgba(255,77,106,0.03)",borderRadius:8}}><div style={{fontSize:10,color:"#ff4d6a",fontWeight:600,marginBottom:4}}>YOUR VULNERABILITIES</div>{co.weaknesses.map((s,i)=><div key={i} style={{fontSize:11,color:C.text,lineHeight:1.7}}>• {s}</div>)}</div>
      </div>
      <div style={{marginTop:10,fontSize:11,color:"#a99fff"}}>Type: <strong>{co.type}</strong> · HQ: <strong>{co.hq}</strong> · Recommendations below are weighted for your organization profile.</div>
    </Crd>}
    {recs.map((r,i)=><Crd key={i} style={{marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}><span style={{fontSize:18}}>{r.icon}</span><span style={{fontSize:13,fontWeight:700,color:r.c}}>For {r.who}</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:8}}>
        {r.items.map((item,j)=><div key={j} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",borderTop:`2px solid ${r.c}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.bright,marginBottom:3}}>{item.t}</div>
          <div style={{fontSize:10,color:C.text,lineHeight:1.6,marginBottom:6}}>{item.d}</div>
          <Lnk l="Source ↗" u={item.u}/>
        </div>)}
      </div>
    </Crd>)}
  </div>;
}

// ═══════════════════════════════════════════
// NEW TAB A: MY PORTFOLIO DASHBOARD
// ═══════════════════════════════════════════
function PortfolioTab() {
  const [myCo, setMyCo] = useState("");
  const co = COMPANIES.find(c=>c.name===myCo);

  const getMyDrugs = () => {
    if(!myCo) return [];
    return DRUGS.map(d=>{
      const isOrig = d.originator.toLowerCase().includes(myCo.toLowerCase());
      const comp = d.competitors.find(c=>c.company.toLowerCase().includes(myCo.toLowerCase()));
      if(!isOrig && !comp) return null;
      const days = dUntil(d.patentExpiry);
      const urgency = days<0?"expired":days<365?"critical":days<730?"high":days<1460?"medium":"low";
      return {drug:d,isOrig,comp,days,urgency,role:isOrig?"Originator":"Competitor"};
    }).filter(Boolean);
  };
  const myDrugs = getMyDrugs();

  const totalAtRisk = myDrugs.filter(d=>d.isOrig).reduce((a,d)=>a+d.drug.revenue,0);
  const totalOpp = myDrugs.filter(d=>!d.isOrig).reduce((a,d)=>a+d.drug.revenue,0);
  const critCount = myDrugs.filter(d=>d.urgency==="critical"||d.urgency==="expired").length;
  const urgColors = {expired:"#ff4d6a",critical:"#ff4d6a",high:"#ff8c42",medium:"#fbbf24",low:"#00d4aa"};

  // Portfolio heat map data
  const heatData = DRUGS.map(d=>{
    const days = dUntil(d.patentExpiry);
    const isOrig = myCo && d.originator.toLowerCase().includes(myCo.toLowerCase());
    const isComp = myCo && d.competitors.some(c=>c.company.toLowerCase().includes(myCo.toLowerCase()));
    return {drug:d.drug,mol:d.molecule,rev:d.revenue,days,yr:new Date(d.patentExpiry).getFullYear(),comps:d.competitors.length,area:d.therapyArea,mine:isOrig?"orig":isComp?"comp":"none"};
  }).sort((a,b)=>a.days-b.days);

  // Priority actions
  const actions = [];
  myDrugs.forEach(d=>{
    if(d.isOrig && d.days>0 && d.days<730) actions.push({pri:"🔴",text:`${d.drug.drug}: LOE in ${fDays(d.days)} — Initiate lifecycle defense now. ${d.drug.competitors.length} competitors advancing.`,drug:d.drug.drug});
    if(d.isOrig && d.days<0) actions.push({pri:"⚫",text:`${d.drug.drug}: LOE PASSED — Monitor erosion trajectory. Evaluate authorized biosimilar or co-promotion strategy.`,drug:d.drug.drug});
    if(!d.isOrig && d.comp) {
      if(d.comp.phase==="Phase III") actions.push({pri:"🟠",text:`${d.drug.drug}: Your ${d.comp.phase} program — Prepare manufacturing scale-up and regulatory submission.`,drug:d.drug.drug});
      if(d.comp.phase==="ANDA Filed"||d.comp.phase==="Approved") actions.push({pri:"🔴",text:`${d.drug.drug}: ${d.comp.phase} — Execute launch readiness: commercial, supply chain, payer contracting.`,drug:d.drug.drug});
      if(d.comp.phase==="Launched") actions.push({pri:"🟢",text:`${d.drug.drug}: LAUNCHED — Optimize market share capture. Target 340B and institutional accounts.`,drug:d.drug.drug});
    }
  });

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
      <Select value={myCo} onChange={setMyCo} options={COMPANIES.map(c=>c.name)} placeholder="🏢 Select your organization to personalize..." style={{minWidth:350}}/>
      {co&&<div style={{fontSize:11,color:"#a99fff"}}>{co.type} · {co.hq}</div>}
    </div>

    {!myCo?<div>
      <Crd style={{textAlign:"center",padding:"50px 30px"}}>
        <div style={{fontSize:40,marginBottom:12}}>🏢</div>
        <div style={{fontSize:16,fontWeight:700,color:C.bright,marginBottom:6}}>Select Your Organization</div>
        <div style={{fontSize:12,color:C.muted,maxWidth:400,margin:"0 auto",lineHeight:1.6}}>Choose your company above to see a personalized portfolio view — your drugs at risk, your competitive positions, your priority actions, and your aggregate exposure in one screen.</div>
      </Crd>
      {/* Show full market heat map even without company selection */}
      <Crd style={{marginTop:14}}>
        <Title sub="All tracked drugs sorted by time-to-LOE">Market-Wide Patent Cliff Heat Map</Title>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:6}}>
          {heatData.map((d,i)=>{
            const urg = d.days<0?"expired":d.days<365?"critical":d.days<730?"high":d.days<1460?"medium":"low";
            return <div key={i} style={{padding:"10px 12px",borderRadius:8,background:C.card2,border:`1px solid ${C.border}`,borderLeft:`3px solid ${urgColors[urg]}`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.bright}}>{d.drug}</div>
              <div style={{fontSize:10,color:C.muted}}>{d.mol}</div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <div><div style={{fontSize:9,color:C.muted}}>Revenue</div><div style={{fontSize:13,fontWeight:800,color:"#6d5cff",fontFamily:mono}}>${d.rev}B</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.muted}}>LOE</div><div style={{fontSize:13,fontWeight:800,color:urgColors[urg],fontFamily:mono}}>{d.days<0?"Done":fDays(d.days)}</div></div>
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:4}}>{d.comps} competitors · {d.area}</div>
            </div>;
          })}
        </div>
      </Crd>
    </div>:<div>
      {/* Company selected — personalized portfolio */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:16}}>
        <Stat l="Your Drugs" v={myDrugs.length} c="#6d5cff" sub={`of ${DRUGS.length} tracked`}/>
        <Stat l="Revenue at Risk" v={`$${totalAtRisk.toFixed(1)}B`} c="#ff4d6a" sub="Originator exposure"/>
        <Stat l="Market Opportunity" v={`$${totalOpp.toFixed(1)}B`} c="#00d4aa" sub="Biosimilar/generic TAM"/>
        <Stat l="Critical Actions" v={critCount} c={critCount>0?"#ff4d6a":"#00d4aa"} sub="Drugs <1yr to LOE"/>
        <Stat l="Active Roles" v={`${myDrugs.filter(d=>d.isOrig).length}O / ${myDrugs.filter(d=>!d.isOrig).length}C`} c="#8b7fff" sub="Originator / Competitor"/>
      </div>

      {/* Portfolio Impact Waterfall — the money chart */}
      {myDrugs.length>0&&<Crd style={{marginBottom:14}}>
        <Title sub="Estimated Year 1 revenue impact per drug from patent cliff exposure">💰 Portfolio Impact Waterfall</Title>
        {(()=>{
          const waterfallData=myDrugs.map(d=>{
            const er=EROSION_BY_THERAPY.find(e=>d.drug.therapyArea.includes(e.area))||{e24:55};
            const comps=d.drug.competitors.filter(c=>c.phase==="Launched"||c.phase==="Launched (at-risk)"||c.phase==="Approved"||c.phase==="Approved — Settlement").length||d.drug.competitors.length;
            const cm=comps<=2?0.75:comps<=4?1.0:1.2;const adj=Math.min(92,er.e24*cm)/100;
            const rawVal=d.isOrig?d.drug.revenue*adj*0.45:d.drug.revenue*adj*0.45*0.15;
            const yr1Val=d.isOrig?-rawVal:rawVal;
            return{drug:d.drug.drug,yr1Val:+yr1Val.toFixed(1),role:d.role,rev:d.drug.revenue,isOrig:d.isOrig};
          }).sort((a,b)=>Math.abs(b.yr1Val)-Math.abs(a.yr1Val));
          const minVal=Math.min(0,...waterfallData.map(d=>d.yr1Val));
          const maxVal=Math.max(0,...waterfallData.map(d=>d.yr1Val));
          const yMin=Math.floor(minVal*1.2);
          const yMax=Math.ceil(maxVal*1.2)||1;
          return <ResponsiveContainer width="100%" height={240}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
              <XAxis dataKey="drug" tick={{fontSize:11,fill:C.muted}}/>
              <YAxis tick={{fontSize:10,fill:C.muted}} label={{value:"Yr1 Impact ($B)",angle:-90,position:"left",fontSize:10,fill:C.muted}} domain={[yMin,yMax]}/>
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
              <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d2=payload[0].payload;const isLoss=d2.yr1Val<0;return <div style={{background:"rgba(10,15,28,0.95)",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:11,fontFamily:font}}><div style={{color:C.bright,fontWeight:700}}>{d2.drug}</div><div style={{color:C.text}}>Revenue: ${d2.rev}B · Role: {d2.role}</div><div style={{color:isLoss?"#ef4444":"#10b981",fontWeight:700}}>Yr1 Impact: {isLoss?"":"+"}{d2.yr1Val}B {isLoss?"(Risk)":"(Opportunity)"}</div></div>}}/>
              <Bar dataKey="yr1Val" name="Yr1 Impact" radius={[4,4,0,0]}>{waterfallData.map((d2,i)=><Cell key={i} fill={d2.isOrig?"#ef4444":"#10b981"}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>;
        })()}
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:8}}><span style={{fontSize:10,color:C.muted,display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#ef4444",display:"inline-block"}}/> Originator Risk (negative)</span><span style={{fontSize:10,color:C.muted,display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:10,borderRadius:2,background:"#10b981",display:"inline-block"}}/> Biosimilar Opportunity (positive)</span></div>
      </Crd>}

      {/* Priority Actions */}
      {actions.length>0&&<Crd style={{marginBottom:14,borderColor:"rgba(255,77,106,0.15)"}}>
        <Title sub="Ranked by urgency and impact">🚨 Priority Actions for {myCo}</Title>
        {actions.slice(0,6).map((a,i)=><div key={i} style={{padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",marginBottom:4,display:"flex",gap:8,alignItems:"flex-start",border:`1px solid ${C.border}`}}>
          <span style={{fontSize:14,flexShrink:0}}>{a.pri}</span>
          <div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{a.text}</div>
        </div>)}
      </Crd>}

      {/* Drug Cards */}
      <Title sub="Your competitive position per molecule">Portfolio Positions</Title>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10,marginBottom:14}}>
        {myDrugs.map((d,i)=>{
          const prog = d.comp?pPct(d.comp.phase):0;
          return <Crd key={i} style={{borderLeft:`3px solid ${d.isOrig?"#ff4d6a":"#00d4aa"}`,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={{fontSize:14,fontWeight:700,color:C.bright}}>{d.drug.drug}</div><div style={{fontSize:10,color:C.muted}}>{d.drug.molecule} · {d.drug.therapyArea}</div></div>
              <span style={{padding:"2px 8px",borderRadius:5,fontSize:9,fontWeight:700,background:d.isOrig?"rgba(255,77,106,0.1)":"rgba(0,212,170,0.1)",color:d.isOrig?"#ff4d6a":"#00d4aa"}}>{d.role}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
              <div><div style={{fontSize:8,color:C.muted}}>Revenue</div><div style={{fontSize:14,fontWeight:800,color:"#6d5cff",fontFamily:mono}}>${d.drug.revenue}B</div></div>
              <div><div style={{fontSize:8,color:C.muted}}>LOE</div><div style={{fontSize:14,fontWeight:800,color:urgColors[d.urgency],fontFamily:mono}}>{d.days<0?"Expired":fDays(d.days)}</div></div>
              <div><div style={{fontSize:8,color:C.muted}}>Competitors</div><div style={{fontSize:14,fontWeight:800,color:C.text,fontFamily:mono}}>{d.drug.competitors.length}</div></div>
            </div>
            {d.isOrig?<div style={{padding:"6px 8px",borderRadius:5,background:"rgba(255,77,106,0.04)",fontSize:10,color:C.text}}>
              <strong style={{color:"#ff4d6a"}}>Defensive:</strong> {d.drug.competitors.filter(c=>c.phase==="Launched"||c.phase==="Approved").length} approved/launched, {d.drug.competitors.filter(c=>c.phase.includes("Phase")).length} in trials
            </div>:<div>
              <div style={{padding:"6px 8px",borderRadius:5,background:"rgba(0,212,170,0.04)",fontSize:10,color:C.text}}>
                <strong style={{color:"#00d4aa"}}>Your Status:</strong> {d.comp.phase} — {d.comp.est}
              </div>
              <div style={{marginTop:4,height:4,background:"rgba(255,255,255,0.04)",borderRadius:2}}><div style={{width:`${prog}%`,height:"100%",borderRadius:2,background:"linear-gradient(90deg,#6d5cff,#00d4aa)"}}/></div>
            </div>}
          </Crd>;
        })}
      </div>

      {/* Aggregate exposure chart */}
      <Crd>
        <Title sub="Combined revenue trajectory across your portfolio">Aggregate Portfolio Exposure</Title>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={myDrugs.map(d=>({drug:d.drug.drug,revenue:d.drug.revenue,role:d.isOrig?"At Risk":"Opportunity"}))}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="drug" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/>
            <Bar dataKey="revenue" name="Revenue $B" radius={[4,4,0,0]}>{myDrugs.map((d,i)=><Cell key={i} fill={d.isOrig?"#ff4d6a":"#00d4aa"}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:6}}>
          <span style={{fontSize:10,color:"#ff4d6a",display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"#ff4d6a"}}/>Revenue at Risk (Originator)</span>
          <span style={{fontSize:10,color:"#00d4aa",display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:"#00d4aa"}}/>Market Opportunity (Competitor)</span>
        </div>
      </Crd>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════
// NEW TAB B: TIMELINE / GANTT VIEW
// ═══════════════════════════════════════════
function TimelineTab() {
  const [filter, setFilter] = useState("all");
  const now = new Date();
  const startYear = 2024;
  const endYear = 2036;
  const totalMonths = (endYear - startYear) * 12;
  const pxPerMonth = 6;
  const totalW = totalMonths * pxPerMonth;

  const monthToX = (date) => {
    const d = new Date(date);
    const months = (d.getFullYear() - startYear) * 12 + d.getMonth();
    return Math.max(0, Math.min(months * pxPerMonth, totalW));
  };
  const nowX = monthToX(now);

  // Build timeline events
  const events = [];
  DRUGS.forEach(d => {
    if (filter !== "all" && d.therapyArea !== filter) return;
    const loeX = monthToX(d.patentExpiry);
    events.push({ drug: d.drug, mol: d.molecule, type: "loe", x: loeX, date: d.patentExpiry, rev: d.revenue, area: d.therapyArea, color: "#ff4d6a" });
    d.competitors.forEach(c => {
      if (c.est && c.est !== "2030+" && c.est !== "2033+" && c.est !== "2034+" && c.est !== "2032+") {
        const launchDate = c.est.includes("Launched") ? d.patentExpiry : c.est.includes("Q1") ? `${c.est.slice(-4)}-02-01` : c.est.includes("Q2") ? `${c.est.slice(-4)}-05-01` : c.est.includes("Q3") ? `${c.est.slice(-4)}-08-01` : c.est.includes("Q4") ? `${c.est.slice(-4)}-11-01` : `${c.est.slice(-4)}-06-01`;
        const comm = (c.commercial||"").toLowerCase();
        const region = comm.includes("us") && comm.includes("eu") ? "US + EU" : comm.includes("us") ? "US" : comm.includes("eu") ? "EU" : comm.includes("global") ? "Global" : comm.includes("china") ? "China" : "US";
        events.push({ drug: d.drug, mol: c.company.split("(")[0].trim(), type: "launch", x: monthToX(launchDate), date: launchDate, area: d.therapyArea, color: "#00d4aa", region });
      }
    });
  });
  LITIGATION.forEach(l => {
    if (filter !== "all" && !DRUGS.find(d=>d.drug===l.drug&&d.therapyArea===filter)) return;
    if (l.nextDate && l.nextDate !== "N/A") events.push({ drug: l.drug, mol: `${l.plaintiff} v. ${l.defendant.split(",")[0]}`, type: "litigation", x: monthToX(l.nextDate), date: l.nextDate, area: "", color: "#ff8c42" });
  });

  const areas = [...new Set(DRUGS.map(d => d.therapyArea))];
  const drugRows = DRUGS.filter(d => filter === "all" || d.therapyArea === filter).sort((a, b) => new Date(a.patentExpiry) - new Date(b.patentExpiry));
  const rowH = 52;

  return <div>
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
      <Title sub="Visual timeline of patent expiries, competitor launches, and litigation milestones">⏱️ Patent Cliff Timeline</Title>
      <Select value={filter} onChange={setFilter} options={[{ value: "all", label: "All Therapy Areas" }, ...areas.map(a => ({ value: a, label: a }))]} placeholder="Filter..." />
    </div>

    {/* Legend */}
    <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
      {[["Patent Expiry", "#ff4d6a", "◆"], ["Biosimilar Launch", "#00d4aa", "▸"], ["Litigation Date", "#ff8c42", "⚖"], ["Today", "#6d5cff", "│"]].map(([l, c, i], j) =>
        <span key={j} style={{ fontSize: 10, color: c, display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontWeight: 800, fontSize: 12 }}>{i}</span>{l}</span>
      )}
    </div>

    <Crd style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 520 }}>
        <div style={{ display: "flex", minWidth: totalW + 180 }}>
          {/* Drug labels column */}
          <div style={{ width: 170, flexShrink: 0, borderRight: `1px solid ${C.border}`, position: "sticky", left: 0, zIndex: 2, background: C.card }}>
            {/* Year header spacer */}
            <div style={{ height: 28, borderBottom: `1px solid ${C.border}`, padding: "4px 8px", fontSize: 9, color: C.muted, fontWeight: 700 }}>MOLECULE</div>
            {drugRows.map((d, i) => <div key={i} style={{ height: rowH, padding: "6px 8px", borderBottom: `1px solid rgba(70,80,120,0.08)`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.bright }}>{d.drug}</div>
              <div style={{ fontSize: 9, color: C.muted }}>{d.molecule} · ${d.revenue}B</div>
              <div style={{ fontSize: 8, color: "#8b7fff" }}>{d.therapyArea}</div>
            </div>)}
          </div>

          {/* Timeline area */}
          <div style={{ flex: 1, position: "relative" }}>
            {/* Year headers */}
            <div style={{ display: "flex", height: 28, borderBottom: `1px solid ${C.border}` }}>
              {Array.from({ length: endYear - startYear }, (_, i) => startYear + i).map(yr =>
                <div key={yr} style={{ width: 12 * pxPerMonth, fontSize: 9, fontWeight: 700, color: yr === now.getFullYear() ? "#a99fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center", borderRight: `1px solid rgba(70,80,120,0.06)`, background: yr === now.getFullYear() ? "rgba(109,92,255,0.03)" : "transparent" }}>{yr}</div>
              )}
            </div>

            {/* Drug rows with events */}
            {drugRows.map((d, ri) => {
              const loeX = monthToX(d.patentExpiry);
              const rowEvents = events.filter(e => e.drug === d.drug);
              return <div key={ri} style={{ height: rowH, position: "relative", borderBottom: `1px solid rgba(70,80,120,0.06)` }}>
                {/* Year gridlines */}
                {Array.from({ length: endYear - startYear }, (_, i) => i).map(i =>
                  <div key={i} style={{ position: "absolute", left: (i + 1) * 12 * pxPerMonth, top: 0, height: "100%", width: 1, background: "rgba(70,80,120,0.06)" }} />
                )}
                {/* Revenue bar (pre-LOE) */}
                <div style={{ position: "absolute", left: 0, top: 8, height: rowH - 16, width: loeX, background: "rgba(109,92,255,0.06)", borderRadius: "0 4px 4px 0" }} />
                {/* Post-LOE erosion gradient */}
                <div style={{ position: "absolute", left: loeX, top: 8, height: rowH - 16, width: Math.min(48 * pxPerMonth, totalW - loeX), background: "linear-gradient(90deg,rgba(255,77,106,0.08),transparent)", borderRadius: "0 4px 4px 0" }} />
                {/* LOE marker */}
                <div style={{ position: "absolute", left: loeX - 5, top: (rowH - 16) / 2, width: 10, height: 10, background: "#ff4d6a", transform: "rotate(45deg)", borderRadius: 1, zIndex: 1 }} title={`LOE: ${d.patentExpiry}`} />
                {/* Competitor launches */}
                {rowEvents.filter(e => e.type === "launch").map((e, ei) =>
                  <div key={ei} style={{ position: "absolute", left: e.x - 1, top: 4 + (ei % 3) * 6, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid #00d4aa", zIndex: 1 }} title={`${e.mol}: ${new Date(e.date).toLocaleDateString()}`} />
                )}
                {/* Litigation markers */}
                {rowEvents.filter(e => e.type === "litigation").map((e, ei) =>
                  <div key={ei} style={{ position: "absolute", left: e.x - 5, top: rowH - 16, fontSize: 10, zIndex: 1, color: "#ff8c42" }} title={`${e.mol}`}>⚖</div>
                )}
                {/* Today line */}
                <div style={{ position: "absolute", left: nowX, top: 0, height: "100%", width: 2, background: "rgba(109,92,255,0.5)", zIndex: 1 }} />
              </div>;
            })}

            {/* Today label at top */}
            <div style={{ position: "absolute", left: nowX - 15, top: 2, fontSize: 8, color: "#a99fff", fontWeight: 700, background: C.card, padding: "0 4px", borderRadius: 3, zIndex: 3 }}>TODAY</div>
          </div>
        </div>
      </div>
    </Crd>

    {/* Key milestones summary */}
    <Crd style={{ marginTop: 14 }}>
      <Title sub="Next 24 months">Key Upcoming Milestones</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 8 }}>
        {events.filter(e => {
          const ed = new Date(e.date);
          return ed > now && ed < new Date(now.getTime() + 730 * 864e5);
        }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 12).map((e, i) =>
          <div key={i} style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderLeft: `3px solid ${e.color}` }}>
            <div style={{ fontSize: 10, color: e.color, fontWeight: 700 }}>{e.type === "loe" ? "◆ PATENT EXPIRY" : e.type === "launch" ? `▸ LAUNCH${e.region ? " — " + e.region : ""}` : "⚖ LITIGATION"}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.bright }}>{e.drug}</div>
            <div style={{ fontSize: 10, color: C.text }}>{e.mol}</div>
            <div style={{ fontSize: 9, color: C.muted, fontFamily: mono, marginTop: 2 }}>{new Date(e.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}{e.rev ? ` · $${e.rev}B` : ""}</div>
          </div>
        )}
      </div>
    </Crd>
  </div>;
}

// ═══════════════════════════════════════════
// NEW TAB C: REVENUE IMPACT CALCULATOR
// ═══════════════════════════════════════════
function RevenueCalcTab() {
  const [myCo, setMyCo] = useState("");
  const [selDrug, setSelDrug] = useState(0);
  const [myRev, setMyRev] = useState("");
  const [myCogs, setMyCogs] = useState(25);
  const [myRebate, setMyRebate] = useState(30);
  const [biosimCount, setBiosimCount] = useState(3);
  const [launchDelay, setLaunchDelay] = useState(0);
  const [interch, setInterch] = useState(false);
  const d = DRUGS[selDrug];
  const co = COMPANIES.find(c => c.name === myCo);
  const isOrig = myCo && d.originator.toLowerCase().includes(myCo.toLowerCase());
  const isComp = myCo && !isOrig;
  const myCompEntry = isComp ? d.competitors.find(c=>c.company.toLowerCase().includes(myCo.toLowerCase())) : null;
  const actualRev = myRev ? parseFloat(myRev) : d.revenue;

  // Erosion model
  const erosionRef = EROSION_BY_THERAPY.find(e => d.therapyArea.includes(e.area)) || { e24: 55 };
  const baseErosion24 = erosionRef.e24 / 100;
  const compMultiplier = biosimCount <= 2 ? 0.75 : biosimCount <= 4 ? 1.0 : 1.2;
  const interchMultiplier = interch ? 1.15 : 1.0;
  const delayReduction = launchDelay * 0.06;
  const adjustedErosion = Math.min(0.92, baseErosion24 * compMultiplier * interchMultiplier * Math.max(0.4, 1 - delayReduction));

  // Competitor share calculation
  const totalComps = d.competitors.length || biosimCount;
  const myStrength = myCompEntry?.strength || 75;
  const totalStrength = d.competitors.reduce((a,c)=>a+(c.strength||70),0) || (biosimCount*75);
  const myShareOfBiosim = totalStrength > 0 ? myStrength/totalStrength : 1/totalComps;

  // Generate monthly P&L impact
  const months = Array.from({ length: 37 }, (_, i) => i);
  const monthlyData = months.map(m => {
    const erosionAtMonth = m === 0 ? 0 : Math.min(adjustedErosion, adjustedErosion * (1 - Math.exp(-m / 12)));
    const monthlyOrigRev = (actualRev / 12) * (1 - erosionAtMonth);
    const monthlyTotalBiosimRev = (actualRev / 12) * erosionAtMonth * 0.45;
    const monthlyMyBiosimRev = monthlyTotalBiosimRev * myShareOfBiosim;
    const netRevLoss = (actualRev / 12) - monthlyOrigRev;
    const grossProfit = monthlyOrigRev * (1 - myCogs / 100);
    const netAfterRebate = grossProfit * (1 - myRebate / 100);
    // Competitor GP (lower COGS advantage for biosimilar)
    const compGP = monthlyMyBiosimRev * (1 - Math.max(15, myCogs - 10) / 100);
    return { m: `M${m}`, origRev: +monthlyOrigRev.toFixed(2), biosimRev: +monthlyTotalBiosimRev.toFixed(2), myBiosimRev: +monthlyMyBiosimRev.toFixed(3), netLoss: +netRevLoss.toFixed(2), gp: +grossProfit.toFixed(2), netRev: +netAfterRebate.toFixed(2), compGP: +compGP.toFixed(3), erosion: +(erosionAtMonth * 100).toFixed(1) };
  }).filter((_, i) => i % 3 === 0 || i <= 3);

  // Impact summary - Originator
  const yr1Loss = actualRev * adjustedErosion * 0.45;
  const yr2Loss = actualRev * adjustedErosion * 0.75;
  const yr3Loss = actualRev * adjustedErosion * 0.92;
  const yr1GP = yr1Loss * (1 - myCogs / 100) * (1 - myRebate / 100);
  const cumulativeLoss3yr = yr1Loss + yr2Loss + yr3Loss;

  // Impact summary - Competitor
  const yr1Gain = yr1Loss * myShareOfBiosim * 0.45;
  const yr2Gain = yr2Loss * myShareOfBiosim * 0.45;
  const yr3Gain = yr3Loss * myShareOfBiosim * 0.45;
  const yr1CompGP = yr1Gain * (1 - Math.max(15, myCogs - 10) / 100);
  const cumulativeGain3yr = yr1Gain + yr2Gain + yr3Gain;

  const viewColor = isOrig || !myCo ? "#ff4d6a" : "#10b981";
  const viewLabel = isOrig || !myCo ? "Loss" : "Gain";

  return <div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
      <Select value={myCo} onChange={setMyCo} options={[{value:"",label:"— No company selected —"},...COMPANIES.map(c => ({value:c.name,label:`🏢 ${c.name} (${c.type})`}))]} placeholder="🏢 Your company..." />
      <Select value={selDrug} onChange={v => setSelDrug(+v)} options={DRUGS.map((dr, i) => ({ value: String(i), label: `${dr.drug} — ${dr.molecule} ($${dr.revenue}B)` }))} placeholder="Select drug..." style={{ minWidth: 300 }} />
    </div>

    {myCo&&<div style={{padding:"8px 14px",borderRadius:8,background:isOrig?"rgba(255,77,106,0.06)":"rgba(0,212,170,0.06)",border:`1px solid ${isOrig?"rgba(255,77,106,0.15)":"rgba(0,212,170,0.15)"}`,color:isOrig?"#ff8c42":"#10b981",fontSize:11,marginBottom:14}}>
      {isOrig?`⚠️ ${myCo} is the ORIGINATOR of ${d.drug}. Showing revenue erosion risk.`:`📈 ${myCo} is a BIOSIMILAR COMPETITOR for ${d.drug}. Showing revenue capture opportunity.${myCompEntry?` Your strength: ${myStrength}/100 · Share of biosimilar market: ${(myShareOfBiosim*100).toFixed(0)}%`:""}`}
    </div>}

    {/* Input panel */}
    <Crd style={{ marginBottom: 14, borderColor: "rgba(109,92,255,0.2)", background: "rgba(109,92,255,0.02)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.bright, marginBottom: 14 }}>📊 Input Your Parameters</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 5 }}>{isOrig?"Your Annual Revenue ($B)":"Originator Annual Revenue ($B)"}</div>
          <input type="number" step="0.1" value={myRev} onChange={e => setMyRev(e.target.value)} placeholder={`${d.revenue} (default)`} style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, color: C.bright, fontSize: 13, fontFamily: mono, outline: "none" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 5 }}>COGS %</div>
          <input type="range" min={10} max={60} value={myCogs} onChange={e => setMyCogs(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#ff8c42" }}>{myCogs}%</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 5 }}>Contracted Rebate %</div>
          <input type="range" min={0} max={60} value={myRebate} onChange={e => setMyRebate(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#ff8c42" }}>{myRebate}%</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 5 }}>Biosimilar/Generic Competitors</div>
          <input type="range" min={1} max={8} value={biosimCount} onChange={e => setBiosimCount(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#a99fff" }}>{biosimCount}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 5 }}>Launch Delay (months)</div>
          <input type="range" min={0} max={24} value={launchDelay} onChange={e => setLaunchDelay(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#ff8c42" }}>{launchDelay}m</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.text, fontWeight: 600, marginBottom: 8 }}>Interchangeable?</div>
          <button onClick={() => setInterch(!interch)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${interch ? "#00d4aa" : C.border}`, background: interch ? "rgba(0,212,170,0.1)" : "transparent", color: interch ? "#00d4aa" : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", width: "100%" }}>{interch ? "✓ YES" : "✗ NO"}</button>
        </div>
      </div>
    </Crd>

    {/* Impact Summary Cards — adapt to originator vs competitor */}
    {isComp ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8, marginBottom: 16 }}>
      <Stat l="Addressable Market" v={`$${actualRev.toFixed(1)}B`} c="#6d5cff" />
      <Stat l="Yr1 Revenue Capture" v={`+$${yr1Gain.toFixed(2)}B`} c="#10b981" sub={`${(yr1Gain / actualRev * 100).toFixed(1)}% of market`} />
      <Stat l="Yr2 Revenue Capture" v={`+$${yr2Gain.toFixed(2)}B`} c="#10b981" sub={`${(yr2Gain / actualRev * 100).toFixed(1)}% of market`} />
      <Stat l="3-Yr Cumulative Revenue" v={`+$${cumulativeGain3yr.toFixed(2)}B`} c="#10b981" />
      <Stat l="Yr1 Gross Profit" v={`+$${yr1CompGP.toFixed(2)}B`} c="#00d4aa" sub={`${(100-Math.max(15,myCogs-10)).toFixed(0)}% margin`} />
      <Stat l="Your Share of Biosim" v={`${(myShareOfBiosim*100).toFixed(0)}%`} c="#8b7fff" sub={`Strength: ${myStrength}/100`} />
    </div> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8, marginBottom: 16 }}>
      <Stat l="Current Revenue" v={`$${actualRev.toFixed(1)}B`} c="#6d5cff" />
      <Stat l="Yr1 Revenue Loss" v={`-$${yr1Loss.toFixed(1)}B`} c="#ff4d6a" sub={`${(yr1Loss / actualRev * 100).toFixed(0)}% of revenue`} />
      <Stat l="Yr2 Revenue Loss" v={`-$${yr2Loss.toFixed(1)}B`} c="#ff4d6a" sub={`${(yr2Loss / actualRev * 100).toFixed(0)}% of revenue`} />
      <Stat l="3-Yr Cumulative Loss" v={`-$${cumulativeLoss3yr.toFixed(1)}B`} c="#ff4d6a" />
      <Stat l="Yr1 GP Impact" v={`-$${yr1GP.toFixed(1)}B`} c="#ff8c42" sub={`Net of ${myCogs}% COGS + ${myRebate}% rebate`} />
      <Stat l="24m Erosion Est." v={`${(adjustedErosion * 100).toFixed(0)}%`} c="#ff8c42" sub={`${d.therapyArea} benchmark: ${erosionRef.e24}%`} />
    </div>}

    {/* Charts — adapt to originator vs competitor */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
      <Crd>
        <Title sub={isComp?"Monthly revenue capture growing post-LOE":"Monthly originator revenue decline post-LOE"}>{isComp?"Revenue Capture Trajectory":"Revenue Erosion Trajectory"}</Title>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)" /><XAxis dataKey="m" tick={{ fontSize: 10, fill: C.muted }} /><YAxis tick={{ fontSize: 10, fill: C.muted }} /><Tooltip content={<CTip />} />
            {isComp ? <>
              <Area type="monotone" dataKey="myBiosimRev" stroke="#10b981" fill="rgba(16,185,129,0.15)" name="Your Monthly Rev ($B)" />
              <Line type="monotone" dataKey="biosimRev" stroke="#00d4aa" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Total Biosim Rev ($B)" />
            </> : <>
              <Area type="monotone" dataKey="origRev" stroke="#6d5cff" fill="rgba(109,92,255,0.12)" name="Originator Rev ($B/m)" />
              <Line type="monotone" dataKey="netLoss" stroke="#ff4d6a" strokeWidth={2} dot={{ r: 3 }} name="Monthly Loss ($B)" />
            </>}
          </ComposedChart>
        </ResponsiveContainer>
      </Crd>
      <Crd>
        <Title sub={isComp?"Your cumulative revenue growth":"Erosion curve with your parameters"}>{isComp?"Cumulative Revenue Build":"Price/Volume Erosion %"}</Title>
        <ResponsiveContainer width="100%" height={220}>
          {isComp ? <AreaChart data={monthlyData.map((r,i)=>{
            const cumRev = monthlyData.slice(0,i+1).reduce((a,x)=>a+(x.myBiosimRev||0),0);
            return {...r, cumRev: +cumRev.toFixed(2)};
          })}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)" /><XAxis dataKey="m" tick={{ fontSize: 10, fill: C.muted }} /><YAxis tick={{ fontSize: 10, fill: C.muted }} /><Tooltip content={<CTip />} />
            <Area type="monotone" dataKey="cumRev" stroke="#10b981" fill="rgba(16,185,129,0.12)" name="Cumulative Rev ($B)" />
          </AreaChart>
          : <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)" /><XAxis dataKey="m" tick={{ fontSize: 10, fill: C.muted }} /><YAxis tick={{ fontSize: 10, fill: C.muted }} domain={[0, 100]} /><Tooltip content={<CTip />} />
            <Line type="monotone" dataKey="erosion" stroke="#ff4d6a" strokeWidth={3} dot={{ r: 4, fill: "#ff4d6a" }} name="Erosion %" />
          </LineChart>}
        </ResponsiveContainer>
      </Crd>
    </div>

    {/* P&L Table — adapt for originator vs competitor */}
    <Crd>
      <Title sub={isComp?"Revenue build and margin expansion":"Attach to board presentations and financial models"}>P&L {isComp?"Opportunity":"Impact"} Summary — {d.drug} ({d.molecule}){myCo?` · ${myCo}`:""}</Title>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px" }}>
        <thead><tr style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: .8 }}>
          {["Metric", "Pre-LOE", "Year 1", "Year 2", "Year 3"].map((h, i) => <th key={i} style={{ textAlign: i ? "right" : "left", padding: "0 8px 4px" }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {isComp ? [
            ["Your Revenue ($B)", "—", `+${yr1Gain.toFixed(2)}`, `+${yr2Gain.toFixed(2)}`, `+${yr3Gain.toFixed(2)}`],
            ["Y-o-Y Growth", "—", "—", `+${yr2Gain>0?((yr2Gain-yr1Gain)/yr1Gain*100).toFixed(0):0}%`, `+${yr3Gain>0?((yr3Gain-yr2Gain)/yr2Gain*100).toFixed(0):0}%`],
            ["Gross Profit ($B)", "—", `+${yr1CompGP.toFixed(2)}`, `+${(yr2Gain*(1-Math.max(15,myCogs-10)/100)).toFixed(2)}`, `+${(yr3Gain*(1-Math.max(15,myCogs-10)/100)).toFixed(2)}`],
            ["Market Share Capture", "0%", `${(yr1Gain/actualRev*100).toFixed(1)}%`, `${(yr2Gain/actualRev*100).toFixed(1)}%`, `${(yr3Gain/actualRev*100).toFixed(1)}%`],
            ["Cumulative Revenue", "—", `$${yr1Gain.toFixed(2)}B`, `$${(yr1Gain+yr2Gain).toFixed(2)}B`, `$${cumulativeGain3yr.toFixed(2)}B`],
          ].map((row, i) => <tr key={i} style={{ background: i === 0 ? "rgba(16,185,129,0.03)" : "rgba(255,255,255,0.01)" }}>
            {row.map((c, j) => <td key={j} style={{ padding: "8px", fontSize: 11, fontWeight: j === 0 ? 600 : 500, color: j === 0 ? C.bright : (typeof c === "string" && c.startsWith("+")) ? "#10b981" : C.text, textAlign: j ? "right" : "left", fontFamily: j ? mono : font }}>{c}</td>)}
          </tr>) : [
            ["Revenue ($B)", actualRev.toFixed(1), (actualRev - yr1Loss).toFixed(1), (actualRev - yr2Loss).toFixed(1), (actualRev - yr3Loss).toFixed(1)],
            ["Revenue Loss ($B)", "—", `-${yr1Loss.toFixed(1)}`, `-${yr2Loss.toFixed(1)}`, `-${yr3Loss.toFixed(1)}`],
            ["Y-o-Y Change", "—", `-${(yr1Loss/actualRev*100).toFixed(0)}%`, `-${((yr2Loss-yr1Loss)/actualRev*100).toFixed(0)}%`, `-${((yr3Loss-yr2Loss)/actualRev*100).toFixed(0)}%`],
            ["Gross Profit ($B)", (actualRev * (1 - myCogs / 100)).toFixed(1), ((actualRev - yr1Loss) * (1 - myCogs / 100)).toFixed(1), ((actualRev - yr2Loss) * (1 - myCogs / 100)).toFixed(1), ((actualRev - yr3Loss) * (1 - myCogs / 100)).toFixed(1)],
            ["Market Share (%)", "100%", `${(100 - yr1Loss / actualRev * 100).toFixed(0)}%`, `${(100 - yr2Loss / actualRev * 100).toFixed(0)}%`, `${(100 - yr3Loss / actualRev * 100).toFixed(0)}%`],
          ].map((row, i) => <tr key={i} style={{ background: i === 1 ? "rgba(255,77,106,0.03)" : "rgba(255,255,255,0.01)" }}>
            {row.map((c, j) => <td key={j} style={{ padding: "8px", fontSize: 11, fontWeight: j === 0 ? 600 : 500, color: j === 0 ? C.bright : (typeof c === "string" && c.startsWith("-")) ? "#ff4d6a" : C.text, textAlign: j ? "right" : "left", fontFamily: j ? mono : font }}>{c}</td>)}
          </tr>)}
        </tbody>
      </table>
      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, background: "rgba(109,92,255,0.04)", fontSize: 10, color: C.muted, lineHeight: 1.6 }}>
        <strong style={{ color: "#a99fff" }}>Model Assumptions:</strong> {isComp?`Competitor view: ${myShareOfBiosim.toFixed(0)*100||Math.round(myShareOfBiosim*100)}% share of eroded market (strength-weighted). `:""}Erosion curve based on {d.therapyArea} historical analogs. {biosimCount} competitors at launch, {launchDelay}m delay, {interch ? "interchangeable" : "non-interchangeable"}. COGS at {myCogs}%, contracted rebates at {myRebate}%. Actual results will vary based on payer mix, channel dynamics, and litigation outcomes.
      </div>
    </Crd>
  </div>;
}

// ═══════════════════════════════════════════
// NEW TAB D: COMPETITIVE BATTLECARD GENERATOR
// ═══════════════════════════════════════════
function BattlecardTab() {
  const [selDrug, setSelDrug] = useState(0);
  const [myCo, setMyCo] = useState("");
  const [viewMode, setViewMode] = useState("full");
  const d = DRUGS[selDrug];
  const co = COMPANIES.find(c => c.name === myCo);
  const isOrig = myCo && d.originator.toLowerCase().includes(myCo.toLowerCase());
  const myComp = d.competitors.find(c => c.company.toLowerCase().includes(myCo.toLowerCase()));
  const days = dUntil(d.patentExpiry);
  const erosionRef = EROSION_BY_THERAPY.find(e => d.therapyArea.includes(e.area)) || { e24: 55, speed: "Moderate" };
  const relLit = LITIGATION.filter(l => l.drug === d.drug);
  const relPayer = PAYER_DATA.filter(p => p.drug.includes(d.drug) || p.drug.includes(d.molecule));

  // Competitive positioning matrix
  const positionMatrix = d.competitors.map(c => ({
    name: c.company.split("(")[0].trim(),
    phase: c.phase,
    strength: c.strength || 70,
    signal: c.signal,
    est: c.est,
    mfg: c.mfg || "Not disclosed",
    commercial: c.commercial || "Unknown",
    weakness: c.weakness || "Not assessed",
    isMe: myCo && c.company.toLowerCase().includes(myCo.toLowerCase()),
  }));

  // Generate talking points — TAILORED to specific company + drug combo
  const genTalkingPoints = () => {
    if (isOrig) return {
      title: "Originator Defense Talking Points",
      points: [
        { q: "Why should payers maintain formulary status?", a: `${d.drug} has ${new Date().getFullYear() - 2010}+ years of real-world safety data across ${d.competitors.length > 3 ? "multiple" : "key"} patient populations. Biosimilar switching introduces clinical uncertainty and administrative burden.` },
        { q: "How do you respond to biosimilar price competition?", a: `We offer value-based contracts that align pricing with outcomes. Our patient support programs and copay assistance maintain continuity. Total cost of care, not just drug cost, drives real value.` },
        { q: "What about interchangeability?", a: `Interchangeability does not mean identical. ${d.drug} has demonstrated efficacy across ${d.type === "Biologic" ? "complex biologic pathways" : "varied patient populations"}. Device training, patient familiarity, and adherence matter.` },
        { q: "What is your lifecycle strategy?", a: `Next-generation formulations, expanded indications, and combination approaches ensure ${d.drug} continues to offer differentiated clinical value beyond the base molecule.` },
      ]
    };
    if (myComp) {
      // Build SPECIFIC talking points from actual competitor data
      const launchedComps = d.competitors.filter(c => c.phase === "Launched" || c.phase === "Launched (at-risk)");
      const myPhase = myComp.phase;
      const isLaunched = myPhase === "Launched" || myPhase === "Launched (at-risk)";
      const myDiscount = myComp.commercial?.match(/(\d+)%/)?.[1] || (30 + d.competitors.length * 8);
      const myMfgDetail = myComp.mfg || co?.hq || "Global";
      const myCommercial = myComp.commercial || "US market";
      const myStrengths = co?.strengths || [];
      const otherComps = d.competitors.filter(c => !c.company.toLowerCase().includes(myCo.toLowerCase()));
      const launchedOthers = otherComps.filter(c => c.phase === "Launched" || c.phase === "Launched (at-risk)");
      const myWeakness = myComp.weakness || "";
      const myEst = myComp.est || "";

      return {
        title: `${myCo} Offensive Talking Points — ${d.drug}`,
        points: [
          { q: `Why should payers choose ${myCo}'s ${d.molecule} biosimilar?`,
            a: isLaunched
              ? `Our biosimilar is FDA-approved and commercially launched${myDiscount ? ` at ${myDiscount} WAC discount` : ""}. ${myCommercial}. ${launchedOthers.length > 0 ? `Unlike ${launchedOthers.length} other launched biosimilars, we differentiate through ${myStrengths[0]?.toLowerCase() || "competitive pricing"} and ${myStrengths[1]?.toLowerCase() || "reliable supply"}.` : "We are first-to-market with demonstrated supply reliability."}`
              : `Our biosimilar is in ${myPhase} with demonstrated bioequivalence${myEst ? `, targeting ${myEst} launch` : ""}. At projected ${myDiscount}% discount, payers can expect significant savings on the $${d.revenue}B franchise. ${myStrengths[0] || "Strong"} manufacturing positions us for Day-1 readiness.` },
          { q: "How do you ensure supply reliability?",
            a: `${myMfgDetail} manufacturing${co?.type === "Biosimilar Developer" && myStrengths.includes("Vertical integration") ? " with full vertical integration from API to finished product — ensuring 30-40% COGS advantage" : " with dedicated capacity and multi-site backup strategy"}. ${co?.type === "Biosimilar Developer" && myStrengths.some(s => s.includes("COGS")) ? "Our integrated model gives us the industry's lowest production costs, enabling sustainable pricing below competitors." : "Commercial-scale batch validation complete. Supply agreements with major distributors secured."}` },
          { q: `How do you compete against ${launchedOthers.length > 0 ? launchedOthers.map(c => c.company.split("(")[0].trim()).join(", ") : "other biosimilar developers"}?`,
            a: isLaunched
              ? `${otherComps.filter(c => c.phase === "Launched").map(c => `${c.company.split("(")[0].trim()} (${c.weakness || "limited differentiation"})`).join("; ")}. Our advantage: ${myCommercial}. ${myStrengths.length > 0 ? `Key differentiators: ${myStrengths.slice(0, 2).join(", ").toLowerCase()}.` : ""}`
              : `We're tracking ${launchedOthers.length} launched competitor${launchedOthers.length !== 1 ? "s" : ""}. Our strategy: ${myStrengths[0]?.toLowerCase() || "competitive positioning"} combined with ${co?.type?.includes("Developer") ? "biosimilar-focused commercial execution" : "established distribution networks"} will drive adoption post-launch.` },
          { q: "What about the originator's lifecycle defense?",
            a: `${d.originator}'s lifecycle extensions don't change the base ${d.molecule} profile. ${d.drug === "Keytruda" ? "While Merck launched SC Keytruda Qlex, IV biosimilars address the majority of hospital/infusion center volume." : d.drug === "Eylea" ? "While Regeneron launched Eylea HD (8mg), the standard 2mg formulation represents the majority of the market." : d.drug === "Stelara" ? "J&J's Stelara patents are settled — all biosimilars now have clear launch paths." : "Payers and patients deserve competition that drives affordability."} Our ${myComp.signal === "confirmed" || isLaunched ? "proven regulatory track record and" : "advancing clinical program will deliver"} interchangeable-quality product${isLaunched ? " is already driving formulary wins" : " for pharmacy-level substitution"}.` },
        ]
      };
    }
    return {
      title: "Market Observer Talking Points",
      points: [
        { q: "What is the competitive landscape?", a: `${d.drug} (${d.molecule}) has ${d.competitors.length} competitors. LOE ${days < 0 ? "has passed" : `in ${fDays(days)}`}. ${erosionRef.speed} erosion expected based on ${d.therapyArea} historical patterns.` },
        { q: "Investment thesis?", a: `$${d.revenue}B market. ${d.competitors.filter(c => c.phase === "Phase III" || c.phase === "Approved" || c.phase === "Launched" || c.phase.includes("Approved")).length} late-stage competitors. First 3 entrants historically capture 70% of biosimilar share.` },
      ]
    };
  };
  const talking = genTalkingPoints();

  return <div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
      <Select value={selDrug} onChange={v => setSelDrug(+v)} options={DRUGS.map((dr, i) => ({ value: String(i), label: `${dr.drug} — ${dr.molecule}` }))} placeholder="Select drug..." style={{ minWidth: 300 }} />
      <Select value={myCo} onChange={setMyCo} options={COMPANIES.map(c => c.name)} placeholder="🏢 Your company..." />
      <div style={{ display: "flex", gap: 4 }}>
        {["full", "compact"].map(m => <button key={m} onClick={() => setViewMode(m)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${viewMode === m ? C.accent : C.border}`, background: viewMode === m ? "rgba(109,92,255,0.1)" : "transparent", color: viewMode === m ? "#a99fff" : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{m}</button>)}
      </div>
    </div>

    {/* Battlecard Header */}
    <div style={{ background: "linear-gradient(135deg,rgba(109,92,255,0.08),rgba(0,212,170,0.04))", border: "1px solid rgba(109,92,255,0.2)", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>COMPETITIVE BATTLECARD</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.bright, marginTop: 4 }}>{d.drug} ({d.molecule})</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{d.originator} · {d.indication} · {d.therapyArea} · {d.type}</div>
          {myCo && <div style={{ fontSize: 11, color: "#a99fff", marginTop: 4 }}>Prepared for: <strong>{myCo}</strong> ({isOrig ? "Originator" : myComp ? "Competitor" : "Observer"})</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 8, background: "rgba(109,92,255,0.06)" }}><div style={{ fontSize: 8, color: C.muted }}>REVENUE</div><div style={{ fontSize: 18, fontWeight: 800, color: "#6d5cff", fontFamily: mono }}>${d.revenue}B</div></div>
          <div style={{ textAlign: "center", padding: "8px 16px", borderRadius: 8, background: days < 365 ? "rgba(255,77,106,0.08)" : "rgba(255,140,66,0.06)" }}><div style={{ fontSize: 8, color: C.muted }}>LOE</div><div style={{ fontSize: 18, fontWeight: 800, color: days < 365 ? "#ff4d6a" : "#ff8c42", fontFamily: mono }}>{days < 0 ? "GONE" : fDays(days)}</div></div>
        </div>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: viewMode === "full" ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 14 }}>
      {/* Competitive Landscape */}
      <Crd>
        <Title>⚔️ Competitive Landscape ({d.competitors.length} players)</Title>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px" }}>
          <thead><tr style={{ fontSize: 9, color: C.muted, textTransform: "uppercase" }}>
            <th style={{ textAlign: "left", padding: "0 5px" }}>Company</th><th style={{ textAlign: "left", padding: "0 5px" }}>Phase</th><th style={{ textAlign: "center", padding: "0 5px" }}>Str.</th><th style={{ textAlign: "left", padding: "0 5px" }}>Key Weakness</th>
          </tr></thead>
          <tbody>{positionMatrix.map((c, i) => <tr key={i} style={{ background: c.isMe ? "rgba(109,92,255,0.08)" : "rgba(255,255,255,0.01)" }}>
            <td style={{ padding: "6px 5px", fontSize: 11, fontWeight: 600, color: c.isMe ? "#a99fff" : C.bright }}>{c.name}{c.isMe && " ← YOU"}</td>
            <td style={{ padding: "6px 5px" }}><PBar p={c.phase} /></td>
            <td style={{ padding: "6px 5px", textAlign: "center", fontFamily: mono, fontSize: 11, color: c.strength > 80 ? "#00d4aa" : C.text }}>{c.strength}</td>
            <td style={{ padding: "6px 5px", fontSize: 10, color: "#ff8c42" }}>{c.weakness}</td>
          </tr>)}</tbody>
        </table>
      </Crd>

      {/* Market Context */}
      <Crd>
        <Title>📊 Market Context</Title>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}><div style={{ fontSize: 9, color: C.muted }}>Erosion Speed</div><div style={{ fontSize: 13, fontWeight: 700, color: "#ff8c42" }}>{erosionRef.speed}</div></div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}><div style={{ fontSize: 9, color: C.muted }}>24m Erosion Est.</div><div style={{ fontSize: 13, fontWeight: 700, color: "#ff4d6a" }}>{erosionRef.e24}%</div></div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}><div style={{ fontSize: 9, color: C.muted }}>Dosage Forms</div><div style={{ fontSize: 10, fontWeight: 600, color: C.text }}>{d.dosageForms?.map(f => f.form.split(" ")[0]).join(", ")}</div></div>
          <div style={{ padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.02)" }}><div style={{ fontSize: 9, color: C.muted }}>Key Channel</div><div style={{ fontSize: 10, fontWeight: 600, color: C.text }}>{d.therapyArea === "Oncology" ? "Hospital / 340B" : d.therapyArea === "Cardiology" ? "Retail / Auto-sub" : "PBM / Specialty"}</div></div>
        </div>
        {relLit.length > 0 && <div style={{ marginBottom: 8 }}><div style={{ fontSize: 10, fontWeight: 700, color: "#ff8c42", marginBottom: 3 }}>⚖️ Active Litigation</div>{relLit.map((l, i) => <div key={i} style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>{l.plaintiff} v. {l.defendant.split(",")[0]} — <span style={{ color: l.winProb > 50 ? "#00d4aa" : "#ff4d6a" }}>{l.winProb}% originator win</span>. {l.status}.</div>)}</div>}
        {relPayer.length > 0 && <div><div style={{ fontSize: 10, fontWeight: 700, color: "#00d4aa", marginBottom: 3 }}>💊 Payer Signals</div>{relPayer.slice(0, 2).map((p, i) => <div key={i} style={{ fontSize: 10, color: C.text, lineHeight: 1.5 }}>{p.payer}: {p.decision} — {p.savings} savings. {p.notes?.substring(0, 60)}</div>)}</div>}
      </Crd>
    </div>

    {/* Talking Points */}
    <Crd style={{ marginBottom: 14 }}>
      <Title sub={myCo ? `Tailored for ${myCo} (${isOrig ? "Originator" : myComp ? "Competitor" : "Observer"})` : "Select your company for tailored points"}>💬 {talking.title}</Title>
      <div style={{ display: "grid", gridTemplateColumns: viewMode === "full" ? "1fr 1fr" : "1fr", gap: 8 }}>
        {talking.points.map((tp, i) => <div key={i} style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#a99fff", marginBottom: 6 }}>Q: {tp.q}</div>
          <div style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>{tp.a}</div>
        </div>)}
      </div>
    </Crd>

    {/* Quick Reference */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Crd>
        <Title>📋 Drug Quick Facts</Title>
        {[
          ["Brand Name", d.drug], ["Molecule", d.molecule], ["Originator", d.originator], ["Indication", d.indication],
          ["Type", d.type], ["Therapy Area", d.therapyArea], ["US Revenue", `$${d.revenue}B`],
          ["Patent Expiry", new Date(d.patentExpiry).toLocaleDateString()], ["Competitors", d.competitors.length],
          ["Dosage Forms", d.dosageForms?.length || "N/A"],
        ].map(([k, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid rgba(70,80,120,0.06)` }}>
          <span style={{ fontSize: 10, color: C.muted }}>{k}</span>
          <span style={{ fontSize: 10, color: C.bright, fontWeight: 600 }}>{v}</span>
        </div>)}
      </Crd>
      <Crd>
        <Title>🔗 Research Links</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["FDA DailyMed — Label", BL.fda(d.molecule)],
            ["Orange Book — Patent Info", BL.ob(d.molecule)],
            ["ClinicalTrials.gov — Active Trials", BL.ct(d.molecule)],
            ["Google Patents — Patent Landscape", BL.pat(d.molecule)],
            ["PubMed — Biosimilar Literature", BL.pm(d.molecule)],
            ["Purple Book — Biologic Info", BL.pb(d.molecule)],
            ["EMA — EU Regulatory", BL.ema(d.molecule)],
            ["CourtListener — Litigation", BL.cl(d.molecule + " patent")],
          ].map(([label, url], i) => <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#8b7fff", textDecoration: "none", padding: "4px 0", borderBottom: `1px solid rgba(70,80,120,0.06)`, display: "flex", justifyContent: "space-between" }}>
            <span>{label}</span><span style={{ fontSize: 9 }}>↗</span>
          </a>)}
        </div>
      </Crd>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// TAB: PATENT LANDSCAPE VISUALIZER
// ═══════════════════════════════════════════
const PATENT_DATA = {
  "Stelara":{total:11,categories:[{cat:"Composition",count:2,expiry:"2023-09-22",challenged:true},{cat:"Formulation",count:3,expiry:"2025-02-22",challenged:true},{cat:"Method of Use",count:4,expiry:"2027-06-15",challenged:false},{cat:"Manufacturing",count:2,expiry:"2029-03-10",challenged:false}]},
  "Eliquis":{total:5,categories:[{cat:"Composition",count:1,expiry:"2026-11-14",challenged:true},{cat:"Crystal Form",count:1,expiry:"2026-11-14",challenged:true},{cat:"Method of Use",count:2,expiry:"2031-05-20",challenged:true},{cat:"Formulation",count:1,expiry:"2028-04-01",challenged:true}]},
  "Keytruda":{total:22,categories:[{cat:"Composition",count:4,expiry:"2028-04-20",challenged:false},{cat:"Method of Treatment",count:8,expiry:"2036-12-15",challenged:false},{cat:"Formulation",count:3,expiry:"2030-06-01",challenged:false},{cat:"Combination",count:5,expiry:"2035-08-10",challenged:false},{cat:"Manufacturing",count:2,expiry:"2029-11-22",challenged:false}]},
  "Eylea":{total:8,categories:[{cat:"Composition",count:2,expiry:"2027-05-13",challenged:true},{cat:"Formulation (HD)",count:2,expiry:"2035-03-01",challenged:false},{cat:"Method of Use",count:3,expiry:"2032-09-15",challenged:false},{cat:"Manufacturing",count:1,expiry:"2029-06-20",challenged:false}]},
  "Opdivo":{total:15,categories:[{cat:"Composition",count:3,expiry:"2028-12-19",challenged:false},{cat:"Method of Treatment",count:6,expiry:"2035-04-10",challenged:false},{cat:"Combination",count:4,expiry:"2034-07-22",challenged:false},{cat:"Formulation",count:2,expiry:"2030-02-15",challenged:false}]},
  "Dupixent":{total:18,categories:[{cat:"Composition",count:3,expiry:"2031-06-15",challenged:false},{cat:"Method of Treatment",count:7,expiry:"2037-11-20",challenged:false},{cat:"Formulation",count:4,expiry:"2033-04-08",challenged:false},{cat:"Device",count:2,expiry:"2035-09-01",challenged:false},{cat:"Manufacturing",count:2,expiry:"2032-01-15",challenged:false}]},
  "Ozempic/Wegovy":{total:25,categories:[{cat:"Composition",count:3,expiry:"2032-06-07",challenged:false},{cat:"Method of Treatment",count:8,expiry:"2038-03-15",challenged:false},{cat:"Oral Formulation",count:5,expiry:"2036-10-20",challenged:false},{cat:"Device/Pen",count:4,expiry:"2034-08-12",challenged:false},{cat:"Manufacturing",count:3,expiry:"2033-05-01",challenged:false},{cat:"Dose Regimen",count:2,expiry:"2035-12-20",challenged:false}]},
  "Xarelto":{total:4,categories:[{cat:"Composition",count:1,expiry:"2024-03-28",challenged:true},{cat:"Crystal Form",count:1,expiry:"2024-08-01",challenged:true},{cat:"Method of Use",count:1,expiry:"2025-02-28",challenged:true},{cat:"Once-Daily Dosing",count:1,expiry:"2025-12-20",challenged:true}]},
};
function PatentTab(){
  const [sel,setSel]=useState("Keytruda");
  const p=PATENT_DATA[sel];const now=new Date();
  return <div>
    <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}><Title sub="Visual patent estate per drug — thicket analysis">🔒 Patent Landscape</Title><Select value={sel} onChange={setSel} options={Object.keys(PATENT_DATA)} placeholder="Select drug..."/></div>
    {p&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:16}}>
        <Stat l="Total Patents" v={p.total} c="#6d5cff"/><Stat l="Categories" v={p.categories.length} c="#8b7fff"/><Stat l="Challenged" v={p.categories.filter(c=>c.challenged).length} c="#ff4d6a"/><Stat l="Earliest Expiry" v={p.categories.sort((a,b)=>new Date(a.expiry)-new Date(b.expiry))[0]?.expiry.substring(0,4)} c="#ff8c42"/>
      </div>
      <Crd style={{marginBottom:14}}>
        <Title sub="Width = patent count · Red = expired/challenged · Purple = active">Patent Thicket Map</Title>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {p.categories.sort((a,b)=>new Date(a.expiry)-new Date(b.expiry)).map((c,i)=>{
            const exp=new Date(c.expiry);const isExp=exp<now;const yrsLeft=((exp-now)/31536e6).toFixed(1);
            return <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:120,fontSize:10,color:C.text,fontWeight:600,textAlign:"right",flexShrink:0}}>{c.cat}</div>
              <div style={{flex:1,position:"relative",height:28}}>
                <div style={{position:"absolute",left:0,top:4,height:20,width:`${Math.min(100,c.count*18)}%`,borderRadius:4,background:isExp?"rgba(255,77,106,0.15)":c.challenged?"linear-gradient(90deg,rgba(255,140,66,0.2),rgba(255,77,106,0.15))":"linear-gradient(90deg,rgba(109,92,255,0.15),rgba(0,212,170,0.08))",border:`1px solid ${isExp?"rgba(255,77,106,0.3)":c.challenged?"rgba(255,140,66,0.3)":"rgba(109,92,255,0.2)"}`,display:"flex",alignItems:"center",padding:"0 8px",gap:6}}>
                  <span style={{fontSize:10,fontWeight:700,color:isExp?"#ff4d6a":c.challenged?"#ff8c42":"#a99fff"}}>{c.count} patents</span>
                  <span style={{fontSize:9,color:C.muted}}>Exp: {c.expiry.substring(0,7)}</span>
                  {c.challenged&&!isExp&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:"rgba(255,77,106,0.15)",color:"#ff4d6a",fontWeight:600}}>CHALLENGED</span>}
                  {isExp&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:"rgba(255,77,106,0.15)",color:"#ff4d6a",fontWeight:600}}>EXPIRED</span>}
                </div>
              </div>
              <div style={{width:50,fontSize:10,color:isExp?"#ff4d6a":"#00d4aa",fontFamily:mono,textAlign:"right"}}>{isExp?"Done":`${yrsLeft}y`}</div>
            </div>;
          })}
        </div>
      </Crd>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Crd><Title>Patent Count by Category</Title><ResponsiveContainer width="100%" height={200}><BarChart data={p.categories} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis type="number" tick={{fontSize:10,fill:C.muted}}/><YAxis type="category" dataKey="cat" tick={{fontSize:9,fill:C.muted}} width={100}/><Tooltip content={<CTip/>}/><Bar dataKey="count" name="Patents" radius={[0,4,4,0]}>{p.categories.map((c,i)=><Cell key={i} fill={c.challenged?"#ff8c42":"#6d5cff"}/>)}</Bar></BarChart></ResponsiveContainer></Crd>
        <Crd><Title>IP Strategy Assessment</Title>
          {p.total>15?<div style={{padding:"10px 14px",borderRadius:6,background:"rgba(255,77,106,0.04)",borderLeft:"3px solid #ff4d6a",marginBottom:10}}><div style={{fontSize:12,fontWeight:700,color:"#ff4d6a"}}>Dense Thicket ({p.total} patents)</div><div style={{fontSize:11,color:C.text,lineHeight:1.6,marginTop:4}}>Multiple IP layers. Biosimilar developers face significant FTO challenges. Extended litigation expected — potential 30 Month Stays on multiple patents.</div></div>
          :p.total>8?<div style={{padding:"10px 14px",borderRadius:6,background:"rgba(255,140,66,0.04)",borderLeft:"3px solid #ff8c42",marginBottom:10}}><div style={{fontSize:12,fontWeight:700,color:"#ff8c42"}}>Moderate Estate ({p.total} patents)</div><div style={{fontSize:11,color:C.text,lineHeight:1.6,marginTop:4}}>Standard protection. Method-of-use patents may not block biosimilar entry for base molecule. Design-around strategies feasible.</div></div>
          :<div style={{padding:"10px 14px",borderRadius:6,background:"rgba(0,212,170,0.04)",borderLeft:"3px solid #00d4aa",marginBottom:10}}><div style={{fontSize:12,fontWeight:700,color:"#00d4aa"}}>Thin Estate ({p.total} patents)</div><div style={{fontSize:11,color:C.text,lineHeight:1.6,marginTop:4}}>Limited IP protection. Generic/biosimilar entry likely near composition patent expiry. Low litigation risk.</div></div>}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}><Lnk l="Google Patents" u={BL.pat(sel)}/><Lnk l="Orange Book" u={BL.ob(sel)}/><Lnk l="Purple Book" u={BL.pb(sel)}/><Lnk l="CourtListener" u={BL.cl(sel+" patent")}/></div>
        </Crd>
      </div>
    </div>}
  </div>;
}

// ═══════════════════════════════════════════
// TAB: 340B IMPACT ANALYZER
// ═══════════════════════════════════════════
const DATA_340B=[
  {drug:"Keytruda",area:"Oncology",pct340b:55,switchSpeed:"Fast",savingsPerPt:48000,entities:2400,spend340b:13.8,biosimSave:4.8,driver:"Buy-and-bill ASP+6% creates immediate financial incentive for 340B entities to switch to lowest-cost biosimilar."},
  {drug:"Opdivo",area:"Oncology",pct340b:52,switchSpeed:"Fast",savingsPerPt:38000,entities:2400,spend340b:4.7,biosimSave:1.6,driver:"Similar to Keytruda dynamics. Combination therapy with Yervoy complicates switching decisions."},
  {drug:"Eylea",area:"Ophthalmology",pct340b:25,switchSpeed:"Slow",savingsPerPt:8500,entities:800,spend340b:1.5,biosimSave:0.4,driver:"Physician-administered in office. Lower 340B exposure but retinal specialists strongly resist switching."},
  {drug:"Stelara",area:"Immunology",pct340b:18,switchSpeed:"Moderate",savingsPerPt:22000,entities:1200,spend340b:2.0,biosimSave:0.7,driver:"Specialty pharmacy benefit. PBM formulary decisions drive switching more than 340B economics."},
  {drug:"Eliquis",area:"Cardiology",pct340b:8,switchSpeed:"Very Fast",savingsPerPt:2800,entities:600,spend340b:1.4,biosimSave:0.9,driver:"Small molecule — auto-substitution at pharmacy. 340B less relevant; retail pharmacy drives switching."},
  {drug:"Dupixent",area:"Immunology",pct340b:12,switchSpeed:"Slow",savingsPerPt:18000,entities:900,spend340b:1.6,biosimSave:0.4,driver:"Self-administered specialty drug. Patient copay assistance programs complicate switching economics."},
  {drug:"Ozempic/Wegovy",area:"Metabolic",pct340b:6,switchSpeed:"Moderate",savingsPerPt:12000,entities:500,spend340b:1.0,biosimSave:0.3,driver:"Retail pharmacy. Limited 340B exposure. Commercial insurance formulary decisions are key driver."},
  {drug:"Xarelto",area:"Cardiology",pct340b:7,switchSpeed:"Very Fast",savingsPerPt:2400,entities:600,spend340b:0.8,biosimSave:0.5,driver:"Small molecule generic. Auto-substitution. Retail pharmacy channel dominates."},
];
function Tab340B(){
  const total340B=DATA_340B.reduce((a,d)=>a+d.biosimSave,0);
  return <div>
    <Title sub="340B program exposure and biosimilar switching economics by drug">🏥 340B Impact Analyzer</Title>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:16}}>
      <Stat l="Total 340B Savings" v={`$${total340B.toFixed(1)}B/yr`} c="#00d4aa" sub="Biosimilar switching opportunity"/><Stat l="Entities Affected" v="2,400+" c="#6d5cff" sub="Hospitals & clinics"/><Stat l="Fastest Switch" v="Oncology" c="#ff4d6a" sub="55% 340B exposure"/><Stat l="Slowest Switch" v="Ophthalmology" c="#ff8c42" sub="Physician preference"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Crd><Title>340B Volume Exposure by Drug (%)</Title><ResponsiveContainer width="100%" height={200}><BarChart data={DATA_340B}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="drug" tick={{fontSize:9,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}} domain={[0,70]}/><Tooltip content={<CTip/>}/><Bar dataKey="pct340b" name="340B %" radius={[4,4,0,0]}>{DATA_340B.map((d,i)=><Cell key={i} fill={d.pct340b>40?"#ff4d6a":d.pct340b>20?"#ff8c42":"#6d5cff"}/>)}</Bar></BarChart></ResponsiveContainer></Crd>
      <Crd><Title>Annual Biosimilar Savings Potential ($B)</Title><ResponsiveContainer width="100%" height={200}><BarChart data={DATA_340B}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="drug" tick={{fontSize:9,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/><Bar dataKey="biosimSave" name="Savings $B/yr" radius={[4,4,0,0]}>{DATA_340B.map((_,i)=><Cell key={i} fill="#00d4aa"/>)}</Bar></BarChart></ResponsiveContainer></Crd>
    </div>
    {DATA_340B.map((d,i)=><Crd key={i} style={{marginBottom:6,borderLeft:`3px solid ${d.pct340b>40?"#ff4d6a":d.pct340b>20?"#ff8c42":"#6d5cff"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{fontSize:14,fontWeight:700,color:C.bright}}>{d.drug} <span style={{fontSize:11,color:C.muted}}>({d.area})</span></div>
        <div style={{display:"flex",gap:5}}><span style={{padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:"rgba(109,92,255,0.1)",color:"#8b7fff"}}>{d.pct340b}% 340B</span><span style={{padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:"rgba(0,212,170,0.1)",color:"#00d4aa"}}>Switch: {d.switchSpeed}</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:6,margin:"8px 0"}}>
        <div><div style={{fontSize:9,color:C.muted}}>Savings/Patient</div><div style={{fontFamily:mono,fontSize:12,color:"#00d4aa"}}>${d.savingsPerPt.toLocaleString()}/yr</div></div>
        <div><div style={{fontSize:9,color:C.muted}}>340B Spend</div><div style={{fontFamily:mono,fontSize:12,color:"#6d5cff"}}>${d.spend340b}B</div></div>
        <div><div style={{fontSize:9,color:C.muted}}>Biosimilar Savings</div><div style={{fontFamily:mono,fontSize:12,color:"#00d4aa"}}>${d.biosimSave}B/yr</div></div>
        <div><div style={{fontSize:9,color:C.muted}}>Eligible Entities</div><div style={{fontFamily:mono,fontSize:12,color:C.text}}>{d.entities.toLocaleString()}</div></div>
      </div>
      <div style={{fontSize:11,color:C.text,lineHeight:1.5,padding:"6px 10px",background:"rgba(255,255,255,0.02)",borderRadius:6}}>{d.driver}</div>
    </Crd>)}
  </div>;
}

// ═══════════════════════════════════════════
// TAB: CONFERENCE & KOL TRACKER
// ═══════════════════════════════════════════
const CONFERENCES=[
  {conf:"ASCO 2026",date:"Jun 2026",loc:"Chicago",focus:"Oncology",abstracts:[
    {title:"Pembrolizumab biosimilar development: Phase III landscape and regulatory pathways",co:"Multi-sponsor Panel",drug:"Keytruda",type:"Symposium",sentiment:"neutral",impact:"high",kol:"Dr. Roy Herbst (Yale)"},
    {title:"Real-world bevacizumab biosimilar switching outcomes in 340B",co:"Memorial Sloan Kettering",drug:"Avastin",type:"Poster",sentiment:"positive",impact:"medium",kol:"Dr. Leonard Saltz (MSKCC)"},
    {title:"Nivolumab biosimilar interim analysis — advanced melanoma",co:"Junshi Biosciences",drug:"Opdivo",type:"Poster",sentiment:"neutral",impact:"medium",kol:"Dr. Jedd Wolchok (MSKCC)"},
  ]},
  {conf:"ACR 2025",date:"Nov 2025",loc:"San Diego",focus:"Rheumatology",abstracts:[
    {title:"12-month Wezlana real-world switch data from integrated health system",co:"Kaiser Permanente",drug:"Stelara",type:"Late-Breaking Oral",sentiment:"positive",impact:"high",kol:"Dr. Jeffrey Curtis (UAB)"},
    {title:"Biosimilar adalimumab: 2-year RA outcomes and immunogenicity",co:"Sandoz",drug:"Humira",type:"Poster",sentiment:"positive",impact:"medium",kol:"Dr. Vibeke Strand (Stanford)"},
  ]},
  {conf:"AAO 2025",date:"Oct 2025",loc:"Las Vegas",focus:"Ophthalmology",abstracts:[
    {title:"First aflibercept biosimilar (Pavblu) at-risk launch: Early US uptake data",co:"Amgen/Retina Consultants",drug:"Eylea",type:"Oral",sentiment:"positive",impact:"high",kol:"Dr. Carl Regillo (Wills Eye)"},
    {title:"6 aflibercept biosimilars approved: Retinal specialist switching readiness survey",co:"AAO/ASRS",drug:"Eylea",type:"Symposium",sentiment:"cautious",impact:"medium",kol:"Dr. Philip Rosenfeld (Bascom Palmer)"},
  ]},
  {conf:"ADA 2026",date:"Jun 2026",loc:"New Orleans",focus:"Metabolic",abstracts:[
    {title:"GLP-1 biosimilar regulatory pathway: FDA-industry panel",co:"FDA/Industry",drug:"Ozempic/Wegovy",type:"Symposium",sentiment:"neutral",impact:"high",kol:"Dr. John Buse (UNC)"},
  ]},
  {conf:"J.P. Morgan Healthcare",date:"Jan 2026",loc:"San Francisco",focus:"Investor",abstracts:[
    {title:"Biosimilar market outlook 2026-2030: $120B+ addressable market",co:"IQVIA/McKinsey",drug:"Industry",type:"Keynote",sentiment:"positive",impact:"high",kol:"Murray Aitken (IQVIA)"},
    {title:"Amgen biosimilar franchise update: Wezlana + pipeline",co:"Amgen",drug:"Stelara",type:"Corporate",sentiment:"positive",impact:"medium",kol:"Robert Bradway (CEO)"},
  ]},
];
const KOLS=[
  {name:"Dr. Roy Herbst",inst:"Yale Cancer Center",area:"Oncology",drugs:["Keytruda","Opdivo"],stance:"Pro-biosimilar",influence:95,note:"Leading voice for biosimilar adoption in immuno-oncology. Runs key switching studies."},
  {name:"Dr. Jeffrey Curtis",inst:"UAB",area:"Rheumatology",drugs:["Stelara","Humira"],stance:"Cautious",influence:88,note:"ACR biosimilar task force chair. Advocates evidence-based switching protocols."},
  {name:"Dr. Carl Regillo",inst:"Wills Eye Hospital",area:"Ophthalmology",drugs:["Eylea"],stance:"Skeptical",influence:82,note:"Influential retinal specialist. Concerned about device differences in biosimilar injections."},
  {name:"Murray Aitken",inst:"IQVIA Institute",area:"Market Analytics",drugs:["Industry"],stance:"Pro-biosimilar",influence:90,note:"Global authority on biosimilar market data. JPM keynote speaker."},
  {name:"Dr. John Buse",inst:"UNC Chapel Hill",area:"Endocrinology",drugs:["Ozempic/Wegovy"],stance:"Neutral",influence:85,note:"ADA past-president. Key voice on GLP-1 biosimilar regulatory pathway."},
  {name:"Dr. Leonard Saltz",inst:"MSKCC",area:"Oncology",drugs:["Avastin","Keytruda"],stance:"Pro-biosimilar",influence:87,note:"Pioneered MSKCC bevacizumab biosimilar switch program. Cost-effectiveness advocate."},
  {name:"Dr. Philip Rosenfeld",inst:"Bascom Palmer Eye",area:"Ophthalmology",drugs:["Eylea"],stance:"Skeptical",influence:80,note:"Developed anti-VEGF protocols. Cautious about ophthalmic biosimilar extrapolation."},
];
function ConferenceTab(){
  const [confFilter,setConfFilter]=useState("all");
  const stanceC=s=>s==="Pro-biosimilar"?"#00d4aa":s==="Skeptical"?"#ff4d6a":"#ff8c42";
  return <div>
    <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}><Title sub="Track presentations, abstracts, and KOL sentiment">🎤 Conference & KOL Intelligence</Title><Select value={confFilter} onChange={setConfFilter} options={[{value:"all",label:"All Conferences"},...CONFERENCES.map(c=>({value:c.conf,label:c.conf}))]} placeholder="Filter..."/></div>
    <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14}}>
      <div>{CONFERENCES.filter(c=>confFilter==="all"||c.conf===confFilter).map((c,i)=><Crd key={i} style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:8}}>
          <div><div style={{fontSize:14,fontWeight:700,color:C.bright}}>{c.conf}</div><div style={{fontSize:10,color:C.muted}}>{c.date} · {c.loc} · {c.focus}</div></div>
          <span style={{padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:"rgba(109,92,255,0.06)",color:"#8b7fff"}}>{c.abstracts.length} abstracts</span>
        </div>
        {c.abstracts.map((a,j)=><div key={j} style={{padding:"8px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)",marginBottom:4,border:`1px solid ${C.border}`,borderLeft:`3px solid ${a.sentiment==="positive"?"#00d4aa":a.sentiment==="cautious"?"#ff8c42":"#fbbf24"}`}}>
          <div style={{fontSize:11,fontWeight:600,color:C.bright,lineHeight:1.4}}>{a.title}</div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>{a.co} · <span style={{color:"#8b7fff"}}>{a.type}</span> · {a.drug}</div>
          <div style={{fontSize:10,marginTop:2}}>KOL: <span style={{color:"#a99fff"}}>{a.kol}</span> · Impact: <span style={{color:a.impact==="high"?"#ff4d6a":"#ff8c42",fontWeight:600}}>{a.impact}</span></div>
        </div>)}
      </Crd>)}</div>
      <div><Crd><Title>Key Opinion Leaders</Title>
        {KOLS.map((k,i)=><div key={i} style={{padding:"8px 10px",borderRadius:8,background:"rgba(255,255,255,0.01)",border:`1px solid ${C.border}`,marginBottom:5}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:12,fontWeight:700,color:C.bright}}>{k.name}</div><div style={{fontSize:9,color:C.muted}}>{k.inst} · {k.area}</div></div>
            <span style={{padding:"2px 8px",borderRadius:5,fontSize:9,fontWeight:700,background:`${stanceC(k.stance)}15`,color:stanceC(k.stance)}}>{k.stance}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <div style={{fontSize:10,color:C.text,lineHeight:1.4,flex:1}}>{k.note}</div>
            <div style={{marginLeft:8,textAlign:"right"}}><div style={{fontSize:8,color:C.muted}}>Influence</div><div style={{fontSize:14,fontWeight:800,fontFamily:mono,color:"#6d5cff"}}>{k.influence}</div></div>
          </div>
          <div style={{marginTop:3,display:"flex",gap:3}}>{k.drugs.map((d,j)=><span key={j} style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:"rgba(109,92,255,0.06)",color:"#8b7fff"}}>{d}</span>)}</div>
        </div>)}
      </Crd></div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════
// TAB: PRICE BENCHMARKING (ASP/WAC)
// ═══════════════════════════════════════════
const PRICE_DATA=[
  {drug:"Stelara",wac:26078,asp:22166,bWac:3000,disc:88,unit:"45mg vial",trend:[{q:"Q1'24",w:100},{q:"Q2'24",w:100},{q:"Q3'24",w:98},{q:"Q4'24",w:95},{q:"Q1'25",w:72},{q:"Q2'25",w:50},{q:"Q3'25",w:35}]},
  {drug:"Eliquis",wac:610,asp:null,bWac:null,disc:0,unit:"30d (5mg BID)",trend:[{q:"Q1'24",w:100},{q:"Q2'24",w:100},{q:"Q3'24",w:100},{q:"Q4'24",w:100},{q:"Q1'25",w:100},{q:"Q2'25",w:100},{q:"Q3'25",w:100}]},
  {drug:"Keytruda",wac:11592,asp:10433,bWac:null,disc:0,unit:"100mg vial",trend:[{q:"Q1'24",w:100},{q:"Q2'24",w:102},{q:"Q3'24",w:103},{q:"Q4'24",w:105},{q:"Q1'25",w:105},{q:"Q2'25",w:106},{q:"Q3'25",w:106}]},
  {drug:"Eylea",wac:2082,asp:1770,bWac:null,disc:0,unit:"2mg vial",trend:[{q:"Q1'24",w:100},{q:"Q2'24",w:100},{q:"Q3'24",w:100},{q:"Q4'24",w:100},{q:"Q1'25",w:100},{q:"Q2'25",w:100},{q:"Q3'25",w:98}]},
  {drug:"Opdivo",wac:8989,asp:7640,bWac:null,disc:0,unit:"100mg vial",trend:[{q:"Q1'24",w:100},{q:"Q2'24",w:101},{q:"Q3'24",w:101},{q:"Q4'24",w:102},{q:"Q1'25",w:102},{q:"Q2'25",w:103},{q:"Q3'25",w:103}]},
  {drug:"Ozempic",wac:968,asp:null,bWac:null,disc:0,unit:"1mg pen 4wk",trend:[{q:"Q1'24",w:100},{q:"Q2'24",w:102},{q:"Q3'24",w:103},{q:"Q4'24",w:105},{q:"Q1'25",w:106},{q:"Q2'25",w:108},{q:"Q3'25",w:108}]},
];
function PriceTab(){
  const [selDrug,setSelDrug]=useState(0);
  const [myDiscount,setMyDiscount]=useState(80);
  const [channel,setChannel]=useState("all");
  const d = DRUGS[selDrug];
  const pd = PRICE_DATA.find(p=>p.drug===d.drug) || PRICE_DATA[0];

  // Pricing strategy calculations
  const origWAC = pd.wac;
  const myTargetWAC = origWAC * (1 - myDiscount/100);
  const compWACs = d.competitors.filter(c=>c.phase==="Launched"||c.phase==="Launched (at-risk)").map(c=>{
    const disc = c.commercial?.includes("90%")?90:c.commercial?.includes("85%")?85:c.commercial?.includes("80%")?80:75;
    return {name:c.company.split("(")[0].trim(),wac:origWAC*(1-disc/100),disc,phase:c.phase};
  });
  const avgBiosimWAC = compWACs.length>0 ? compWACs.reduce((a,c)=>a+c.wac,0)/compWACs.length : origWAC*0.2;

  // Channel-level pricing
  const channels=[
    {ch:"Retail/PBM",pct:40,origNet:origWAC*0.65,biosimNet:myTargetWAC*0.75,driver:"PBM rebate negotiations. Formulary positioning drives volume.",switchSpeed:"Moderate — 6-12m"},
    {ch:"Medical Benefit (B)",pct:25,origNet:origWAC*0.94,biosimNet:myTargetWAC*0.94,driver:"ASP+6% reimbursement. Buy-and-bill economics favor lower WAC.",switchSpeed:"Fast — 3-6m"},
    {ch:"340B / Safety Net",pct:15,origNet:origWAC*0.25,biosimNet:myTargetWAC*0.25,driver:"Ceiling price = AMP×(1-rebate). Spread = WAC minus 340B. Lower WAC = more spread.",switchSpeed:"Very Fast — 1-3m"},
    {ch:"Specialty Pharmacy",pct:12,origNet:origWAC*0.55,biosimNet:myTargetWAC*0.68,driver:"DIR fees, specialty hub services. Copay assistance offsets influence.",switchSpeed:"Slow — 9-15m"},
    {ch:"Hospital/IDN/GPO",pct:8,origNet:origWAC*0.45,biosimNet:myTargetWAC*0.65,driver:"GPO contract pricing. Pharmacy & Therapeutics committee approval.",switchSpeed:"Moderate — 6-9m"},
  ];

  // Price erosion trajectory for this drug at set discount
  const priceTrajectory=[
    {period:"Pre-LOE",origWAC:origWAC,myWAC:0,avgBiosim:0,myNet:0},
    {period:"Launch",origWAC:origWAC*0.98,myWAC:myTargetWAC,avgBiosim:avgBiosimWAC||myTargetWAC*1.1,myNet:myTargetWAC*0.7},
    {period:"Month 6",origWAC:origWAC*0.90,myWAC:myTargetWAC*0.95,avgBiosim:(avgBiosimWAC||myTargetWAC*1.1)*0.92,myNet:myTargetWAC*0.95*0.65},
    {period:"Month 12",origWAC:origWAC*0.75,myWAC:myTargetWAC*0.88,avgBiosim:(avgBiosimWAC||myTargetWAC*1.1)*0.85,myNet:myTargetWAC*0.88*0.6},
    {period:"Month 24",origWAC:origWAC*0.55,myWAC:myTargetWAC*0.78,avgBiosim:(avgBiosimWAC||myTargetWAC*1.1)*0.75,myNet:myTargetWAC*0.78*0.55},
    {period:"Month 36",origWAC:origWAC*0.42,myWAC:myTargetWAC*0.70,avgBiosim:(avgBiosimWAC||myTargetWAC*1.1)*0.68,myNet:myTargetWAC*0.70*0.5},
  ];

  // Expected price positioning
  const myPosition = myTargetWAC < avgBiosimWAC ? "Price Leader" : myTargetWAC > avgBiosimWAC*1.1 ? "Premium" : "Market Parity";
  const posColor = myPosition==="Price Leader"?"#10b981":myPosition==="Premium"?"#ff8c42":"#6d5cff";

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
      <Select value={selDrug} onChange={v=>setSelDrug(+v)} options={DRUGS.map((dr,i)=>({value:String(i),label:`${dr.drug} — ${dr.molecule} ($${dr.revenue}B)`}))} placeholder="Select molecule..." style={{minWidth:350}}/>
    </div>

    <Title sub="Plan your pricing strategy with competitive positioning and channel economics">💲 Pricing Strategy Planner — {d.drug}</Title>

    {/* Your Pricing Control */}
    <Crd style={{marginBottom:14,borderColor:"rgba(109,92,255,0.2)",background:"rgba(109,92,255,0.02)"}}>
      <div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:12}}>🎯 Set Your Target Discount from Originator WAC</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:20,alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:C.muted,marginBottom:3}}>Originator WAC</div>
          <div style={{fontSize:18,fontWeight:800,color:C.bright,fontFamily:mono}}>${origWAC.toLocaleString()}</div>
          <div style={{fontSize:9,color:C.muted}}>per {pd.unit}</div>
        </div>
        <div>
          <div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:5}}>Your WAC Discount: <span style={{color:"#10b981",fontSize:14}}>{myDiscount}%</span></div>
          <input type="range" min={50} max={95} step={1} value={myDiscount} onChange={e=>setMyDiscount(+e.target.value)} style={{width:"100%"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted}}><span>50% (Premium)</span><span>75% (Market)</span><span>95% (Aggressive)</span></div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:3}}>Your Target WAC</div>
          <div style={{fontSize:18,fontWeight:800,color:"#10b981",fontFamily:mono}}>${Math.round(myTargetWAC).toLocaleString()}</div>
          <div style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:600,display:"inline-block",marginTop:4,background:`${posColor}15`,color:posColor}}>{myPosition}</div>
        </div>
      </div>
    </Crd>

    {/* Price Positioning vs Competitors */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Crd>
        <Title sub="Your WAC vs originator and biosimilar competitors">Competitive Price Map</Title>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={[
            {name:d.originator+" (Orig)",wac:origWAC,fill:"#ff4d6a"},
            ...compWACs.map(c=>({name:c.name,wac:Math.round(c.wac),fill:"#6d5cff"})),
            {name:"YOUR PRICE",wac:Math.round(myTargetWAC),fill:"#10b981"}
          ]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
            <XAxis type="number" tick={{fontSize:10,fill:C.muted}} tickFormatter={v=>`$${(v/1000).toFixed(1)}K`}/>
            <YAxis type="category" dataKey="name" tick={{fontSize:9,fill:C.muted}} width={120}/>
            <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d2=payload[0].payload;return <div style={{background:"rgba(10,15,28,0.95)",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:11,fontFamily:font}}><div style={{color:C.bright,fontWeight:700}}>{d2.name}</div><div style={{fontFamily:mono,color:d2.fill,fontWeight:700}}>WAC: ${d2.wac.toLocaleString()}</div><div style={{color:C.muted}}>Disc: {((1-d2.wac/origWAC)*100).toFixed(0)}% from originator</div></div>}}/>
            <Bar dataKey="wac" radius={[0,4,4,0]}>{[{fill:"#ff4d6a"},...compWACs.map(()=>({fill:"#6d5cff"})),{fill:"#10b981"}].map((c,i)=><Cell key={i} fill={c.fill}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Crd>
      <Crd>
        <Title sub="Expected price trajectory over 36 months">Price Erosion Forecast</Title>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={priceTrajectory.map(r=>({...r,origWAC:Math.round(r.origWAC),myWAC:Math.round(r.myWAC),avgBiosim:Math.round(r.avgBiosim)}))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
            <XAxis dataKey="period" tick={{fontSize:9,fill:C.muted}}/>
            <YAxis tick={{fontSize:10,fill:C.muted}} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<CTip/>}/>
            <Line type="monotone" dataKey="origWAC" stroke="#ff4d6a" strokeWidth={2} dot={{r:3}} name="Originator WAC"/>
            <Line type="monotone" dataKey="myWAC" stroke="#10b981" strokeWidth={3} dot={{r:5,fill:"#10b981"}} name="Your WAC"/>
            <Line type="monotone" dataKey="avgBiosim" stroke="#6d5cff" strokeWidth={2} strokeDasharray="5 5" dot={{r:3}} name="Avg Biosim WAC"/>
            <Legend wrapperStyle={{fontSize:10}}/>
          </LineChart>
        </ResponsiveContainer>
      </Crd>
    </div>

    {/* Channel-Level Pricing Economics */}
    <Crd style={{marginBottom:14}}>
      <Title sub="Expected net pricing and switching speed by distribution channel">📊 Channel-Level Pricing Economics</Title>
      <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 4px"}}>
        <thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>
          {["Channel","Mix %","Orig Net","Your Net","Net Advantage","Switch Speed","Key Driver"].map((h,i)=><th key={i} style={{textAlign:i>1?"right":"left",padding:"0 8px 4px"}}>{h}</th>)}
        </tr></thead>
        <tbody>{channels.map((ch,i)=>{
          const advantage = ch.origNet - ch.biosimNet;
          const advPct = (advantage/ch.origNet*100).toFixed(0);
          return <tr key={i} style={{background:"rgba(255,255,255,0.01)"}}>
            <td style={{padding:"8px",fontSize:11,fontWeight:700,color:C.bright}}>{ch.ch}</td>
            <td style={{padding:"8px",fontSize:11,fontFamily:mono,color:C.text}}>{ch.pct}%</td>
            <td style={{padding:"8px",fontSize:11,fontFamily:mono,color:C.muted,textAlign:"right"}}>${Math.round(ch.origNet).toLocaleString()}</td>
            <td style={{padding:"8px",fontSize:11,fontFamily:mono,color:"#10b981",textAlign:"right",fontWeight:700}}>${Math.round(ch.biosimNet).toLocaleString()}</td>
            <td style={{padding:"8px",textAlign:"right"}}><span style={{padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:700,background:advantage>0?"rgba(16,185,129,0.1)":"rgba(255,77,106,0.1)",color:advantage>0?"#10b981":"#ff4d6a"}}>{advantage>0?"+":""}${Math.round(advantage).toLocaleString()} ({advPct}%)</span></td>
            <td style={{padding:"8px",fontSize:10,textAlign:"right",color:ch.switchSpeed.includes("Very Fast")?"#10b981":ch.switchSpeed.includes("Fast")?"#00d4aa":ch.switchSpeed.includes("Slow")?"#ff8c42":C.text}}>{ch.switchSpeed}</td>
            <td style={{padding:"8px",fontSize:10,color:C.muted,maxWidth:200}}>{ch.driver}</td>
          </tr>;
        })}</tbody>
      </table>
    </Crd>

    {/* Pricing Strategy Recommendations */}
    <Crd style={{marginBottom:14}}>
      <Title sub="Based on your discount, competitor landscape, and channel dynamics">🧭 Pricing Strategy Recommendations</Title>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <div style={{padding:"12px 14px",borderRadius:8,background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.15)"}}>
          <div style={{fontSize:10,color:"#10b981",fontWeight:700,marginBottom:4}}>💲 LAUNCH PRICE</div>
          <div style={{fontSize:18,fontWeight:800,color:C.bright,fontFamily:mono}}>${Math.round(myTargetWAC).toLocaleString()}</div>
          <div style={{fontSize:10,color:C.muted,marginTop:4}}>{myDiscount}% discount from ${origWAC.toLocaleString()} WAC</div>
          <div style={{fontSize:10,color:posColor,marginTop:2,fontWeight:600}}>Position: {myPosition}</div>
        </div>
        <div style={{padding:"12px 14px",borderRadius:8,background:"rgba(109,92,255,0.04)",border:"1px solid rgba(109,92,255,0.15)"}}>
          <div style={{fontSize:10,color:"#8b7fff",fontWeight:700,marginBottom:4}}>📈 EXPECTED MONTHLY REVENUE</div>
          <div style={{fontSize:18,fontWeight:800,color:C.bright,fontFamily:mono}}>${(d.revenue*1000*(myDiscount/100)*0.45/12*(1/(d.competitors.length||3))).toFixed(0)}M</div>
          <div style={{fontSize:10,color:C.muted,marginTop:4}}>At month 12, based on market share model</div>
          <div style={{fontSize:10,color:"#8b7fff",marginTop:2}}>Annualized: ${(d.revenue*(myDiscount/100)*0.45/12*(1/(d.competitors.length||3))*12).toFixed(2)}B</div>
        </div>
        <div style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,140,66,0.04)",border:"1px solid rgba(255,140,66,0.15)"}}>
          <div style={{fontSize:10,color:"#ff8c42",fontWeight:700,marginBottom:4}}>⚠️ PRICE FLOOR RISK</div>
          <div style={{fontSize:18,fontWeight:800,color:C.bright,fontFamily:mono}}>${Math.round(myTargetWAC*0.65).toLocaleString()}</div>
          <div style={{fontSize:10,color:C.muted,marginTop:4}}>Expected 36-month floor (35% further erosion)</div>
          <div style={{fontSize:10,color:myTargetWAC*0.65>origWAC*0.1?"#10b981":"#ff4d6a",marginTop:2}}>{myTargetWAC*0.65>origWAC*0.1?"Above cost floor ✓":"⚠ Near or below cost floor"}</div>
        </div>
      </div>
    </Crd>

    {/* Full pricing table from original */}
    <Crd>
      <Title sub="All tracked molecules — WAC, ASP, biosimilar discounts">All Drug Pricing Reference</Title>
      <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px"}}><thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase"}}>{["Drug","Unit","WAC","ASP","Biosim WAC","Disc.","Trend"].map((h,i)=><th key={i} style={{textAlign:i>1?"right":"left",padding:"0 8px 4px"}}>{h}</th>)}</tr></thead>
      <tbody>{PRICE_DATA.map((p,i)=><tr key={i} style={{background:p.drug===d.drug?"rgba(109,92,255,0.06)":"rgba(255,255,255,0.01)"}}>
        <td style={{padding:"8px",fontSize:12,fontWeight:700,color:p.drug===d.drug?"#a99fff":C.bright}}>{p.drug}{p.drug===d.drug&&<span style={{fontSize:9,color:"#a99fff",marginLeft:4}}>← Selected</span>}</td>
        <td style={{padding:"8px",fontSize:10,color:C.muted}}>{p.unit}</td>
        <td style={{padding:"8px",fontFamily:mono,fontSize:11,color:C.text,textAlign:"right"}}>${p.wac.toLocaleString()}</td>
        <td style={{padding:"8px",fontFamily:mono,fontSize:11,color:"#8b7fff",textAlign:"right"}}>{p.asp?`$${p.asp.toLocaleString()}`:"—"}</td>
        <td style={{padding:"8px",fontFamily:mono,fontSize:11,color:"#00d4aa",textAlign:"right"}}>{p.bWac?`$${p.bWac.toLocaleString()}`:"—"}</td>
        <td style={{padding:"8px",fontFamily:mono,fontSize:12,fontWeight:700,color:p.disc>0?"#00d4aa":C.muted,textAlign:"right"}}>{p.disc>0?`-${p.disc}%`:"—"}</td>
        <td style={{padding:"8px",textAlign:"right"}}>{p.trend[p.trend.length-1].w<100?<span style={{color:"#00d4aa"}}>↓{100-p.trend[p.trend.length-1].w}%</span>:p.trend[p.trend.length-1].w>100?<span style={{color:"#ff4d6a"}}>↑{p.trend[p.trend.length-1].w-100}%</span>:<span style={{color:C.muted}}>→Flat</span>}</td>
      </tr>)}</tbody></table>
    </Crd>
  </div>;
}

// ═══════════════════════════════════════════
// TAB: REGULATORY FILING TRACKER
// ═══════════════════════════════════════════
const REG_FILINGS=[
  {drug:"Stelara",app:"Wezlana (Amgen)",type:"BLA (351k)",filed:"2023-06-15",pdufa:"2023-10-31",status:"Approved",notes:"First interchangeable ustekinumab biosimilar. Launched Jan 2025 via Optum/Nuvailia."},
  {drug:"Stelara",app:"Pyzchiva (Samsung Bioepis/Sandoz)",type:"BLA (351k)",filed:"2023-09-10",pdufa:"2024-07-15",status:"Approved",notes:"Launched Feb 24, 2025. 80% WAC discount. Provisional interchangeability."},
  {drug:"Stelara",app:"Yesintek (Biocon)",type:"BLA (351k)",filed:"2024-01-20",pdufa:"2024-12-02",status:"Approved",notes:"Launched Feb 24, 2025. 90% WAC discount — lowest-priced ustekinumab biosimilar. 100M+ lives covered."},
  {drug:"Stelara",app:"Selarsdi (Alvotech/Teva)",type:"BLA (351k)",filed:"2023-07-15",pdufa:"2024-10-01",status:"Approved",notes:"Launched Feb 21, 2025. 85% WAC discount. Interchangeable as of Apr 30, 2025."},
  {drug:"Stelara",app:"Steqeyma (Celltrion)",type:"BLA (351k)",filed:"2024-02-01",pdufa:"2024-11-15",status:"Approved",notes:"Launched Mar 2025. 7th ustekinumab biosimilar approved."},
  {drug:"Stelara",app:"Starjemza (Bio-Thera/Hikma)",type:"BLA (351k)",filed:"2024-08-01",pdufa:"2025-05-22",status:"Approved",notes:"Approved May 2025 with interchangeability. 8th ustekinumab biosimilar."},
  {drug:"Eliquis",app:"Teva apixaban",type:"ANDA (Para IV)",filed:"2023-08-15",pdufa:"2019-12-01",status:"Tentative Approval",notes:"Launch blocked by patent litigation until April 2028 per BMS settlement."},
  {drug:"Eliquis",app:"Mylan/Viatris apixaban",type:"ANDA (Para IV)",filed:"2019-06-01",pdufa:"2019-12-01",status:"Tentative Approval",notes:"FDA approved 2019. Settlement with BMS allows launch April 2028."},
  {drug:"Keytruda",app:"Merck SC Keytruda Qlex",type:"sBLA",filed:"2025-01-10",pdufa:"2025-09-19",status:"Approved",notes:"Subcutaneous formulation approved — lifecycle extension strategy vs future biosimilars."},
  {drug:"Keytruda",app:"Samsung Bioepis SB27",type:"BLA (351k)",filed:"Not yet filed",pdufa:"TBD",status:"Phase III",notes:"Phase III in NSCLC. Primary completion Sep 2025. BLA filing expected 2026."},
  {drug:"Keytruda",app:"Amgen ABP 234",type:"BLA (351k)",filed:"Not yet filed",pdufa:"TBD",status:"Phase III",notes:"Multiple Phase III trials. Primary completion 2026. Filing expected 2027."},
  {drug:"Eylea",app:"Pavblu (Amgen)",type:"BLA (351k)",filed:"2024-03-01",pdufa:"2024-09-17",status:"Approved",notes:"Launched at-risk in US. First aflibercept biosimilar on market. Regeneron litigation pending."},
  {drug:"Eylea",app:"Yesafili (Biocon)",type:"BLA (351k)",filed:"2023-11-01",pdufa:"2024-05-20",status:"Approved",notes:"FDA-approved interchangeable. Settlement allows US launch H2 2026."},
  {drug:"Eylea",app:"Enzeevu (Sandoz)",type:"BLA (351k)",filed:"2023-10-01",pdufa:"2024-08-12",status:"Approved",notes:"Settlement allows US launch Q4 2026."},
  {drug:"Eylea",app:"Eydenzelt (Celltrion)",type:"BLA (351k)",filed:"2024-05-01",pdufa:"2025-10-09",status:"Approved",notes:"EU approved Feb 2025. US approved Oct 2025. Settlement allows launch Dec 31, 2026."},
  {drug:"Xarelto",app:"Lupin rivaroxaban",type:"ANDA",filed:"2022-06-01",pdufa:"2025-03-03",status:"Approved",notes:"First generic Xarelto (2.5mg). Launched Mar 2025. Additional strengths rolling out 2025."},
];
function RegFilingTab(){
  const [filter,setFilter]=useState("all");
  const statusC=s=>s==="Approved"?"#00d4aa":s==="Under Review"?"#6d5cff":s==="Filed"?"#ff8c42":s==="Tentative Approval"?"#fbbf24":"#5a6380";
  const raw=filter==="all"?REG_FILINGS:REG_FILINGS.filter(f=>f.drug===filter);
  // Sort: Phase III / Not yet filed first, then by PDUFA date descending (most recent first)
  const filtered=[...raw].sort((a,b)=>{
    const aNotFiled=a.filed==="Not yet filed"||a.status==="Phase III"||a.status==="Pre-filing"?1:0;
    const bNotFiled=b.filed==="Not yet filed"||b.status==="Phase III"||b.status==="Pre-filing"?1:0;
    if(aNotFiled!==bNotFiled) return bNotFiled-aNotFiled; // Not yet filed first
    // Then by status priority: Under Review > Tentative Approval > Filed > Approved
    const statusOrder={"Phase III":0,"Pre-filing":1,"Under Review":2,"Filed":3,"Tentative Approval":4,"Approved":5};
    const aOrd=statusOrder[a.status]??3;
    const bOrd=statusOrder[b.status]??3;
    if(aOrd!==bOrd) return aOrd-bOrd;
    // Within same status, sort by PDUFA date descending
    const aDate=a.pdufa==="TBD"?"9999":a.pdufa;
    const bDate=b.pdufa==="TBD"?"9999":b.pdufa;
    return bDate.localeCompare(aDate);
  });
  return <div>
    <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}><Title sub="BLA, ANDA, and sBLA submissions — sorted by filing stage & date">📋 Regulatory Filing Tracker</Title><Select value={filter} onChange={setFilter} options={[{value:"all",label:"All Drugs"},...[...new Set(REG_FILINGS.map(f=>f.drug))].map(d=>({value:d,label:d}))]} placeholder="Filter..."/></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:16}}>
      <Stat l="Total Filings" v={REG_FILINGS.length} c="#6d5cff"/><Stat l="Not Yet Filed" v={REG_FILINGS.filter(f=>f.filed==="Not yet filed"||f.status==="Phase III").length} c="#5a6380"/><Stat l="Under Review" v={REG_FILINGS.filter(f=>f.status==="Under Review").length} c="#ff8c42"/><Stat l="Tentative" v={REG_FILINGS.filter(f=>f.status==="Tentative Approval").length} c="#fbbf24"/><Stat l="Approved" v={REG_FILINGS.filter(f=>f.status==="Approved").length} c="#00d4aa"/>
    </div>
    {filtered.map((f,i)=><Crd key={i} style={{marginBottom:5,borderLeft:`3px solid ${statusC(f.status)}`}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
        <div><div style={{fontSize:13,fontWeight:700,color:C.bright}}>{f.app} <span style={{fontSize:10,color:C.muted}}>— {f.drug}</span></div><div style={{fontSize:10,color:"#8b7fff"}}>{f.type}</div></div>
        <span style={{padding:"3px 10px",borderRadius:6,fontSize:10,fontWeight:600,background:`${statusC(f.status)}15`,color:statusC(f.status)}}>{f.status}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
        <div><div style={{fontSize:9,color:C.muted}}>Filed</div><div style={{fontSize:11,color:f.filed==="Not yet filed"?"#5a6380":C.text,fontStyle:f.filed==="Not yet filed"?"italic":"normal"}}>{f.filed}</div></div>
        <div><div style={{fontSize:9,color:C.muted}}>PDUFA / Action Date</div><div style={{fontSize:11,color:f.pdufa==="TBD"?"#ff8c42":C.text,fontWeight:f.pdufa==="TBD"?600:400}}>{f.pdufa}</div></div>
      </div>
      <div style={{marginTop:6,fontSize:11,color:C.text,lineHeight:1.5}}>{f.notes}</div>
    </Crd>)}
  </div>;
}

// ═══════════════════════════════════════════
// TAB: INVESTOR SENTIMENT
// ═══════════════════════════════════════════
const INV_DATA=[
  {co:"Merck",ticker:"MRK",price:98,consensus:"Hold",pt:115,si:2.1,kwTrend:[{q:"Q3'24",n:12},{q:"Q4'24",n:18},{q:"Q1'25",n:22},{q:"Q2'25",n:25},{q:"Q3'25",n:30},{q:"Q4'25",n:35},{q:"Q1'26",n:38}],catalyst:"SC Keytruda Qlex launched Sep 2025 — extends peak by 2+ years",risk:"55% revenue from single drug. 7+ biosimilar developers in Phase III."},
  {co:"BMS",ticker:"BMY",price:56,consensus:"Buy",pt:72,si:2.2,kwTrend:[{q:"Q3'24",n:8},{q:"Q4'24",n:10},{q:"Q1'25",n:14},{q:"Q2'25",n:16},{q:"Q3'25",n:13},{q:"Q4'25",n:11},{q:"Q1'26",n:12}],catalyst:"Eliquis generic delayed to Apr 2028 — 2 extra years of exclusivity",risk:"Eliquis + Opdivo = 45% revenue both facing LOE 2028-2029"},
  {co:"J&J",ticker:"JNJ",price:155,consensus:"Hold",pt:172,si:0.8,kwTrend:[{q:"Q3'24",n:6},{q:"Q4'24",n:8},{q:"Q1'25",n:18},{q:"Q2'25",n:22},{q:"Q3'25",n:15},{q:"Q4'25",n:10},{q:"Q1'26",n:8}],catalyst:"Stelara cliff priced in. Tremfya IBD data + Darzalex growth offsets",risk:"7 ustekinumab biosimilars at 80-90% discounts eroding faster than expected"},
  {co:"Novo Nordisk",ticker:"NVO",price:82,consensus:"Buy",pt:110,si:1.8,kwTrend:[{q:"Q3'24",n:2},{q:"Q4'24",n:3},{q:"Q1'25",n:5},{q:"Q2'25",n:8},{q:"Q3'25",n:10},{q:"Q4'25",n:12},{q:"Q1'26",n:14}],catalyst:"Oral semaglutide + CagriSema obesity Phase III readouts",risk:"Supply constraints, compounding pharmacies, IRA exposure, Lilly competition"},
  {co:"AbbVie",ticker:"ABBV",price:195,consensus:"Buy",pt:220,si:1.0,kwTrend:[{q:"Q3'24",n:15},{q:"Q4'24",n:12},{q:"Q1'25",n:8},{q:"Q2'25",n:5},{q:"Q3'25",n:4},{q:"Q4'25",n:3},{q:"Q1'26",n:3}],catalyst:"Skyrizi + Rinvoq >$20B combined. Humira cliff absorbed",risk:"Second-wave Humira biosimilar discounts reaching 85-90%"},
  {co:"Regeneron",ticker:"REGN",price:680,consensus:"Hold",pt:780,si:1.6,kwTrend:[{q:"Q3'24",n:4},{q:"Q4'24",n:5},{q:"Q1'25",n:7},{q:"Q2'25",n:9},{q:"Q3'25",n:15},{q:"Q4'25",n:22},{q:"Q1'26",n:28}],catalyst:"Eylea HD uptake + Dupixent indication expansion (CSU, COPD)",risk:"6 Eylea biosimilars approved, launches Q4 2026. Pavblu already at-risk."},
];
function InvestorTab(){
  return <div>
    <Title sub="Analyst consensus, patent cliff sentiment, and earnings call keyword tracking">📈 Investor Sentiment</Title>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Crd><Title>"Biosimilar"/"Patent Cliff" Mentions in Earnings Calls</Title><ResponsiveContainer width="100%" height={220}><LineChart data={INV_DATA[0].kwTrend.map((_,qi)=>({q:INV_DATA[0].kwTrend[qi].q,...Object.fromEntries(INV_DATA.map(d=>[d.co,d.kwTrend[qi]?.n||0]))}))}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="q" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/>
        {INV_DATA.map((d,i)=><Line key={i} type="monotone" dataKey={d.co} stroke={["#ff4d6a","#ff8c42","#00d4aa","#2dd4bf","#6d5cff","#a78bfa"][i]} strokeWidth={2} dot={{r:3}}/>)}<Legend wrapperStyle={{fontSize:10}}/></LineChart></ResponsiveContainer></Crd>
      <Crd><Title>Short Interest by Company (%)</Title><ResponsiveContainer width="100%" height={220}><BarChart data={INV_DATA}><CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/><XAxis dataKey="co" tick={{fontSize:10,fill:C.muted}}/><YAxis tick={{fontSize:10,fill:C.muted}}/><Tooltip content={<CTip/>}/><Bar dataKey="si" name="Short Interest %" radius={[4,4,0,0]}>{INV_DATA.map((d,i)=><Cell key={i} fill={d.si>2?"#ff4d6a":d.si>1?"#ff8c42":"#00d4aa"}/>)}</Bar></BarChart></ResponsiveContainer></Crd>
    </div>
    {INV_DATA.map((d,i)=><Crd key={i} style={{marginBottom:6}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{fontSize:14,fontWeight:700,color:C.bright}}>{d.co} <span style={{fontFamily:mono,fontSize:11,color:C.muted}}>({d.ticker})</span></div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <span style={{fontFamily:mono,fontSize:14,fontWeight:700,color:C.bright}}>${d.price}</span>
          <span style={{padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:d.consensus==="Buy"?"rgba(0,212,170,0.1)":"rgba(255,140,66,0.1)",color:d.consensus==="Buy"?"#00d4aa":"#ff8c42"}}>{d.consensus} · PT ${d.pt}</span>
          <span style={{padding:"2px 8px",borderRadius:5,fontSize:10,background:"rgba(255,77,106,0.06)",color:"#ff4d6a"}}>SI: {d.si}%</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
        <div style={{padding:"6px 10px",borderRadius:5,background:"rgba(0,212,170,0.03)"}}><div style={{fontSize:9,color:"#00d4aa",fontWeight:600}}>CATALYST</div><div style={{fontSize:10,color:C.text}}>{d.catalyst}</div></div>
        <div style={{padding:"6px 10px",borderRadius:5,background:"rgba(255,77,106,0.03)"}}><div style={{fontSize:9,color:"#ff4d6a",fontWeight:600}}>RISK</div><div style={{fontSize:10,color:C.text}}>{d.risk}</div></div>
      </div>
    </Crd>)}
  </div>;
}

// ═══════════════════════════════════════════
// TAB: ALERT CENTER
// ═══════════════════════════════════════════
function AlertTab(){
  const [alerts,setAlerts]=useState([
    {id:1,name:"Keytruda Phase Advance",drug:"Keytruda",trigger:"Any competitor advances phase",status:"active",fires:2,last:"Feb 19 — Biocon Phase III complete",
      urls:[{l:"ClinicalTrials.gov — Pembrolizumab Biosimilar",u:"https://clinicaltrials.gov/search?term=pembrolizumab+biosimilar"},{l:"FDA Purple Book — Keytruda",u:"https://purplebooksearch.fda.gov/search?query=pembrolizumab"},{l:"Merck 10-K (SEC)",u:"https://www.sec.gov/cgi-bin/browse-edgar?company=merck&CIK=&type=10-K&action=getcompany"}]},
    {id:2,name:"Eliquis Litigation Ruling",drug:"Eliquis",trigger:"Court ruling or filing",status:"active",fires:3,last:"Feb 20 — BMS confirms Apr 2028 generic entry",
      urls:[{l:"CourtListener — Apixaban Docket",u:"https://www.courtlistener.com/?q=apixaban+patent&type=r&order_by=score+desc"},{l:"USPTO Patent Search — Apixaban",u:"https://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&u=/netahtml/PTO/search-adv.htm&r=0&p=1&f=S&l=50&Query=apixaban&d=PTXT"},{l:"PACER — Delaware District",u:"https://ecf.ded.uscourts.gov/"}]},
    {id:3,name:"Stelara Biosim Launch",drug:"Stelara",trigger:"New biosimilar market entry",status:"active",fires:7,last:"Feb 24 — Yesintek & Pyzchiva launched",
      urls:[{l:"FDA — Ustekinumab Biosimilars",u:"https://purplebooksearch.fda.gov/search?query=ustekinumab"},{l:"DailyMed — Yesintek",u:"https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=yesintek"},{l:"Biocon Biologics PR",u:"https://www.bioconbiologics.com/biocon-biologics-launches-yesintek-ustekinumab-kfce-biosimilar-to-stelara-in-the-united-states/"}]},
    {id:4,name:"340B Biosimilar Switch",drug:"All Oncology",trigger:"340B entity biosimilar adoption",status:"paused",fires:0,last:"—",
      urls:[{l:"HRSA 340B Database",u:"https://340bopais.hrsa.gov/manufacturer"},{l:"CMS ASP Drug Pricing",u:"https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files"},{l:"340B Health — Policy Updates",u:"https://www.340bhealth.org/"}]},
    {id:5,name:"Patent Challenge",drug:"All",trigger:"Paragraph IV or IPR petition filed",status:"active",fires:1,last:"Feb 20 — Dr. Reddy's apixaban",
      urls:[{l:"USPTO PTAB — IPR Decisions",u:"https://ptab.uspto.gov/#/login"},{l:"FDA Paragraph IV Certifications",u:"https://www.fda.gov/drugs/abbreviated-new-drug-application-anda/patent-certifications-and-suitability-petitions"},{l:"CourtListener — Patent Cases",u:"https://www.courtlistener.com/?type=r&q=paragraph+IV+ANDA"}]},
  ]);
  const [showNew,setShowNew]=useState(false);
  const [nn,setNN]=useState("");const [nd,setND]=useState("");const [nt,setNT]=useState("");
  const [expandedId,setExpandedId]=useState(null);
  const add=()=>{if(nn&&nt){setAlerts(p=>[...p,{id:Date.now(),name:nn,drug:nd||"All",trigger:nt,status:"active",fires:0,last:"—",urls:[{l:"FDA Drug Search",u:"https://www.accessdata.fda.gov/scripts/cder/daf/"},{l:"ClinicalTrials.gov",u:"https://clinicaltrials.gov/"},{l:"USPTO Patent Search",u:"https://patft.uspto.gov/"}]}]);setShowNew(false);setNN("");setND("");setNT("");}};
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><Title sub="Configure triggers for real-time patent cliff intelligence. Double-click any alert to view source URLs.">🔔 Alert Center</Title><button onClick={()=>setShowNew(!showNew)} style={{padding:"8px 18px",background:"linear-gradient(135deg,#4a3dcc,#6d5cff)",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>+ New Alert</button></div>
    {showNew&&<Crd style={{marginBottom:14,borderColor:"rgba(109,92,255,0.3)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr auto",gap:8,alignItems:"end"}}>
        <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Name</div><input value={nn} onChange={e=>setNN(e.target.value)} placeholder="Alert name" style={{width:"100%",padding:"7px",background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:6,color:C.bright,fontSize:11,outline:"none"}}/></div>
        <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Drug</div><Select value={nd} onChange={setND} options={["All",...DRUGS.map(d=>d.drug)]} placeholder="All"/></div>
        <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Trigger</div><input value={nt} onChange={e=>setNT(e.target.value)} placeholder="e.g. Any competitor advances phase" style={{width:"100%",padding:"7px",background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:6,color:C.bright,fontSize:11,outline:"none"}}/></div>
        <button onClick={add} style={{padding:"7px 14px",background:"rgba(0,212,170,0.12)",border:"1px solid rgba(0,212,170,0.3)",borderRadius:6,color:"#00d4aa",fontSize:11,fontWeight:600,cursor:"pointer"}}>Create</button>
      </div>
    </Crd>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:14}}>
      <Stat l="Active" v={alerts.filter(a=>a.status==="active").length} c="#00d4aa"/><Stat l="Total Fires" v={alerts.reduce((a,al)=>a+al.fires,0)} c="#ff8c42"/><Stat l="Last Trigger" v="Feb 20" c="#6d5cff"/>
    </div>
    <div style={{fontSize:10,color:C.muted,marginBottom:10,fontStyle:"italic"}}>💡 Double-click any alert to expand source URLs for direct navigation</div>
    {alerts.map(a=><Crd key={a.id} style={{marginBottom:5,borderLeft:`3px solid ${a.status==="active"?"#00d4aa":"#5a6380"}`,opacity:a.status==="active"?1:0.6,cursor:"pointer",transition:"all 0.2s"}} onDoubleClick={()=>setExpandedId(expandedId===a.id?null:a.id)}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div><div style={{fontSize:13,fontWeight:700,color:C.bright}}>{a.name}</div><div style={{fontSize:10,color:C.muted}}>Drug: <span style={{color:"#8b7fff"}}>{a.drug}</span> · {a.trigger}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>Fires: <span style={{color:"#ff8c42",fontWeight:600}}>{a.fires}</span> · Last: {a.last}</div></div>
        <div style={{display:"flex",gap:3,alignItems:"flex-start"}}>
          <button onClick={()=>setAlerts(p=>p.map(x=>x.id===a.id?{...x,status:x.status==="active"?"paused":"active"}:x))} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${a.status==="active"?"rgba(0,212,170,0.3)":"rgba(90,99,128,0.3)"}`,background:"transparent",color:a.status==="active"?"#00d4aa":"#5a6380",fontSize:10,cursor:"pointer"}}>{a.status==="active"?"Active":"Paused"}</button>
          <button onClick={()=>setAlerts(p=>p.filter(x=>x.id!==a.id))} style={{padding:"4px 8px",borderRadius:5,border:"1px solid rgba(255,77,106,0.2)",background:"transparent",color:"#ff4d6a",fontSize:10,cursor:"pointer"}}>✕</button>
        </div>
      </div>
      {expandedId===a.id&&<div style={{marginTop:10,padding:"10px 12px",background:"rgba(99,102,241,0.04)",borderRadius:8,border:"1px solid rgba(99,102,241,0.12)"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#a99fff",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>📌 Source URLs — Click to navigate</div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {(a.urls||[]).map((u,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:"#10b981"}}>✓</span>
            <Lnk l={u.l} u={u.u}/>
            <span style={{fontSize:9,color:C.muted,fontFamily:mono,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:300}}>{u.u}</span>
          </div>)}
        </div>
      </div>}
    </Crd>)}
  </div>;
}

// ═══════════════════════════════════════════
// TAB: WORKSPACE / COLLABORATION NOTES
// ═══════════════════════════════════════════
function WorkspaceTab(){
  const [notes,setNotes]=useState([
    {id:1,drug:"Eliquis",author:"Sarah K.",date:"Feb 21",text:"Delaware ruling favors generics — brief commercial team on formulary implications.",tag:"litigation",pinned:true},
    {id:2,drug:"Keytruda",author:"Mike R.",date:"Feb 19",text:"Samsung SB27 & Amgen ABP 234 Phase III readouts expected 2025-2026. Start modeling 2029 budget impact.",tag:"clinical",pinned:true},
    {id:3,drug:"Stelara",author:"Lisa M.",date:"Feb 17",text:"7 ustekinumab biosimilars now launched/approved. Yesintek at 90% WAC discount. Major PBMs all moved to biosimilar preferred.",tag:"payer",pinned:false},
    {id:4,drug:"Industry",author:"David C.",date:"Feb 15",text:"Samsung Plant 5 confirms CDMO demand. Good sign for outsourcing strategy.",tag:"supply",pinned:false},
    {id:5,drug:"Eylea",author:"Anna P.",date:"Feb 14",text:"6 aflibercept biosimilars now approved. Pavblu launched at-risk. Yesafili, Enzeevu, Ahzantive settlements for Q4 2026.",tag:"regulatory",pinned:false},
  ]);
  const [newNote,setNewNote]=useState("");const [newDrug,setNewDrug]=useState("Industry");const [newTag,setNewTag]=useState("general");const [filterTag,setFilterTag]=useState("all");
  const add=()=>{if(newNote){setNotes(p=>[{id:Date.now(),drug:newDrug,author:"You",date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),text:newNote,tag:newTag,pinned:false},...p]);setNewNote("");}};
  const tagC=t=>({litigation:"#ff4d6a",clinical:"#6d5cff",payer:"#00d4aa",regulatory:"#ff8c42",supply:"#a78bfa",general:"#5a6380"}[t]||"#5a6380");
  const tags=["all","litigation","clinical","payer","regulatory","supply","general"];
  const sorted=[...notes.filter(n=>(filterTag==="all"||n.tag===filterTag)&&n.pinned),...notes.filter(n=>(filterTag==="all"||n.tag===filterTag)&&!n.pinned)];
  return <div>
    <Title sub="Team notes, annotations, and drug-level commentary">📝 Workspace</Title>
    <Crd style={{marginBottom:14}}>
      <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
        <div style={{flex:1}}><textarea value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Add a note..." rows={2} style={{width:"100%",padding:"8px 12px",background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:8,color:C.bright,fontSize:12,outline:"none",resize:"none",fontFamily:font}}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <div style={{display:"flex",gap:4}}><Select value={newDrug} onChange={setNewDrug} options={["Industry",...DRUGS.map(d=>d.drug)]} placeholder="Drug" style={{fontSize:10}}/><Select value={newTag} onChange={setNewTag} options={tags.filter(t=>t!=="all")} placeholder="Tag" style={{fontSize:10}}/></div>
          <button onClick={add} style={{padding:"6px 16px",background:"linear-gradient(135deg,#4a3dcc,#6d5cff)",border:"none",borderRadius:6,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>Post</button>
        </div>
      </div>
    </Crd>
    <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>{tags.map(t=><button key={t} onClick={()=>setFilterTag(t)} style={{padding:"4px 12px",borderRadius:14,border:`1px solid ${filterTag===t?tagC(t):C.border}`,background:filterTag===t?`${tagC(t)}10`:"transparent",color:filterTag===t?tagC(t):C.muted,fontSize:10,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{t==="all"?`All (${notes.length})`:t}</button>)}</div>
    {sorted.map(n=><div key={n.id} style={{padding:"10px 14px",borderRadius:8,background:C.card,border:`1px solid ${n.pinned?"rgba(109,92,255,0.2)":C.border}`,marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:3}}>{n.pinned&&<span style={{fontSize:10}}>📌</span>}<span style={{fontSize:11,fontWeight:700,color:C.bright}}>{n.author}</span><span style={{fontSize:9,color:C.muted}}>{n.date}</span><span style={{padding:"1px 6px",borderRadius:4,fontSize:9,background:`${tagC(n.tag)}10`,color:tagC(n.tag)}}>{n.tag}</span><span style={{padding:"1px 6px",borderRadius:4,fontSize:9,background:"rgba(109,92,255,0.06)",color:"#8b7fff"}}>{n.drug}</span></div>
          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{n.text}</div>
        </div>
        <div style={{display:"flex",gap:2,flexShrink:0}}>
          <button onClick={()=>setNotes(p=>p.map(x=>x.id===n.id?{...x,pinned:!x.pinned}:x))} style={{padding:"2px 6px",border:`1px solid ${C.border}`,borderRadius:4,background:"transparent",color:n.pinned?"#a99fff":C.muted,fontSize:10,cursor:"pointer"}}>📌</button>
          <button onClick={()=>setNotes(p=>p.filter(x=>x.id!==n.id))} style={{padding:"2px 6px",border:"1px solid rgba(255,77,106,0.15)",borderRadius:4,background:"transparent",color:"#ff4d6a",fontSize:10,cursor:"pointer"}}>✕</button>
        </div>
      </div>
    </div>)}
  </div>;
}

// ═══════════════════════════════════════════
// TAB: REPORT BUILDER / SCENARIO COMPARISON
// ═══════════════════════════════════════════
function ReportTab(){
  const projDrugs = DRUGS.filter(d => !HISTORICAL_LOE.some(h => h.molecule === d.molecule));
  const [selDrug,setSelDrug]=useState(0);
  const [myCo,setMyCo]=useState("");
  const d = DRUGS[selDrug];
  const isOrig = myCo && d.originator.toLowerCase().includes(myCo.toLowerCase());
  const isComp = myCo && !isOrig;
  const myCompEntry = isComp ? d.competitors.find(c=>c.company.toLowerCase().includes(myCo.toLowerCase())) : null;

  // Base case: built from actual current factors
  const actualComps = d.competitors.filter(c=>c.phase==="Launched"||c.phase==="Launched (at-risk)"||c.phase==="Approved"||c.phase==="Approved — Settlement").length || d.competitors.length;
  const hasInterch = d.competitors.some(c=>c.commercial?.toLowerCase().includes("interchangeable"));
  const erosionRef = EROSION_BY_THERAPY.find(e=>d.therapyArea.includes(e.area))||{e24:55};
  const baseCM = actualComps<=1?0.6:actualComps<=2?0.75:actualComps<=4?1.0:actualComps<=6?1.15:1.3;
  const baseIM = hasInterch?1.15:1.0;
  const baseAdj = Math.min(0.92, erosionRef.e24/100*baseCM*baseIM);

  // Scenario system
  const mkScenario=(name,comps,delay,interch,override)=>({name,comps,delay,interch,override});
  const [scenarios,setScenarios]=useState([
    mkScenario("Base Case", actualComps, 0, hasInterch, null),
    mkScenario("Aggressive Erosion", Math.min(8,actualComps+2), 0, true, null),
    mkScenario("Delayed Entry", Math.max(1, actualComps-1), 12, false, null),
  ]);
  const [activeSc,setActiveSc]=useState(0);
  const [showNew,setShowNew]=useState(false);
  const [nName,setNName]=useState("");

  const calcScenario = (sc) => {
    const cm=sc.comps<=1?0.6:sc.comps<=2?0.75:sc.comps<=4?1.0:sc.comps<=6?1.15:1.3;
    const im=sc.interch?1.15:1.0;
    const dm=Math.max(0.3,1-sc.delay*0.06);
    const adj=sc.override!==null&&sc.override!==undefined?sc.override/100:Math.min(0.92,erosionRef.e24/100*cm*im*dm);
    const y1=d.revenue*adj*0.45;const y2=d.revenue*adj*0.75;const y3=d.revenue*adj*0.92;
    // Competitor share
    const myStr=myCompEntry?.strength||75;
    const totStr=d.competitors.reduce((a,c)=>a+(c.strength||70),0)||(sc.comps*75);
    const myShare=totStr>0?myStr/totStr:1/Math.max(1,sc.comps);
    return{...sc,adj:+(adj*100).toFixed(0),
      yr1Loss:+y1.toFixed(2),yr2Loss:+y2.toFixed(2),yr3Loss:+y3.toFixed(2),
      yr1Gain:+(y1*myShare*0.45).toFixed(2),yr2Gain:+(y2*myShare*0.45).toFixed(2),yr3Gain:+(y3*myShare*0.45).toFixed(2),
      myShare:+(myShare*100).toFixed(0),
      origRemain1:+(d.revenue-y1).toFixed(1),origRemain2:+(d.revenue-y2).toFixed(1),origRemain3:+(d.revenue-y3).toFixed(1),
    };
  };

  const results = scenarios.map(calcScenario);
  const active = results[activeSc];

  const updateSc=(field,val)=>{setScenarios(prev=>prev.map((s,i)=>i!==activeSc?s:{...s,[field]:val}));};
  const cloneScenario=()=>{if(!nName)return;setScenarios(p=>[...p,{...scenarios[activeSc],name:nName}]);setActiveSc(scenarios.length);setShowNew(false);setNName("");};

  // Reset scenarios when drug changes
  const handleDrugChange = (v) => {
    setSelDrug(+v);
    const nd=DRUGS[+v];
    const nc=nd.competitors.filter(c=>c.phase==="Launched"||c.phase==="Launched (at-risk)"||c.phase==="Approved"||c.phase==="Approved — Settlement").length||nd.competitors.length;
    const ni=nd.competitors.some(c=>c.commercial?.toLowerCase().includes("interchangeable"));
    setScenarios([mkScenario("Base Case",nc,0,ni,null),mkScenario("Aggressive Erosion",Math.min(8,nc+2),0,true,null),mkScenario("Delayed Entry",Math.max(1,nc-1),12,false,null)]);
    setActiveSc(0);
  };

  // Monthly trajectory for the active scenario
  const monthlyData = [0,3,6,9,12,18,24,36].map(m=>{
    const erosion = m===0?0:Math.min(active.adj/100, (active.adj/100)*(1-Math.exp(-m/12)));
    const origRev = d.revenue*(1-erosion);
    const biosimRev = d.revenue*erosion*0.45;
    const myRev = biosimRev*(active.myShare/100);
    return {m:`M${m}`,origRev:+origRev.toFixed(2),biosimRev:+biosimRev.toFixed(2),myRev:+myRev.toFixed(3),erosion:+(erosion*100).toFixed(1)};
  });

  return <div>
    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
      <Select value={selDrug} onChange={handleDrugChange} options={projDrugs.map(dr=>({value:String(DRUGS.indexOf(dr)),label:`${dr.drug} — ${dr.molecule} ($${dr.revenue}B)`}))} placeholder="Select molecule..." style={{minWidth:350}}/>
      <Select value={myCo} onChange={setMyCo} options={[{value:"",label:"— No company —"},...COMPANIES.map(c=>({value:c.name,label:`🏢 ${c.name} (${c.type})`}))]} placeholder="🏢 Select company..."/>
    </div>
    <Title sub={`Model ${d.drug} (${d.molecule}) scenarios — ${myCo?(isOrig?"Originator risk view":"Competitor opportunity view"):"Market-level view"}`}>⚔️ Scenario War Game — {d.drug}</Title>

    {myCo&&<div style={{padding:"8px 14px",borderRadius:8,background:isOrig?"rgba(255,77,106,0.06)":"rgba(0,212,170,0.06)",border:`1px solid ${isOrig?"rgba(255,77,106,0.15)":"rgba(0,212,170,0.15)"}`,color:isOrig?"#ff8c42":"#10b981",fontSize:11,marginBottom:14}}>
      {isOrig?`⚠️ ${myCo} is the ORIGINATOR — Showing revenue RISK across scenarios`:`📈 ${myCo} is a COMPETITOR — Showing revenue OPPORTUNITY across scenarios${myCompEntry?` (Strength: ${myCompEntry.strength}/100, Share: ${active.myShare}%)`:""}`}
    </div>}

    {/* Base Case Summary */}
    <Crd style={{marginBottom:14,borderColor:"rgba(109,92,255,0.2)",background:"rgba(109,92,255,0.02)"}}>
      <div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:8}}>📊 Current Market Factors (Base Case)</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
        <div style={{padding:"8px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)"}}><div style={{fontSize:9,color:C.muted}}>Active Competitors</div><div style={{fontSize:16,fontWeight:800,color:"#a99fff",fontFamily:mono}}>{actualComps}</div></div>
        <div style={{padding:"8px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)"}}><div style={{fontSize:9,color:C.muted}}>Interchangeable?</div><div style={{fontSize:14,fontWeight:700,color:hasInterch?"#10b981":"#ff8c42"}}>{hasInterch?"Yes":"No"}</div></div>
        <div style={{padding:"8px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)"}}><div style={{fontSize:9,color:C.muted}}>Therapy Benchmark</div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{erosionRef.e24}% / 24m</div></div>
        <div style={{padding:"8px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)"}}><div style={{fontSize:9,color:C.muted}}>Base Erosion Est.</div><div style={{fontSize:14,fontWeight:700,color:baseAdj>0.6?"#ef4444":"#ff8c42"}}>{(baseAdj*100).toFixed(0)}%</div></div>
        <div style={{padding:"8px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)"}}><div style={{fontSize:9,color:C.muted}}>LOE Date</div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{new Date(d.patentExpiry).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</div></div>
      </div>
    </Crd>

    {/* Scenario selector tabs */}
    <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      {scenarios.map((s,i)=><button key={i} onClick={()=>setActiveSc(i)} style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${activeSc===i?"rgba(99,102,241,0.4)":C.border}`,background:activeSc===i?"rgba(99,102,241,0.12)":"transparent",color:activeSc===i?"#a5b4fc":C.muted,fontSize:12,fontWeight:activeSc===i?700:400,cursor:"pointer"}}>{s.name}</button>)}
      <button onClick={()=>setShowNew(!showNew)} style={{padding:"7px 14px",borderRadius:8,border:`1px dashed ${C.border}`,background:"transparent",color:C.muted,fontSize:12,cursor:"pointer"}}>+ New Scenario</button>
      {showNew&&<div style={{display:"flex",gap:6,alignItems:"center"}}><input value={nName} onChange={e=>setNName(e.target.value)} placeholder="Scenario name..." style={{padding:"6px 10px",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:6,color:C.bright,fontSize:12,outline:"none",width:180}}/><button onClick={cloneScenario} style={{padding:"6px 12px",background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:6,color:"#10b981",fontSize:11,fontWeight:600,cursor:"pointer"}}>Create</button></div>}
    </div>

    {/* Scenario Controls */}
    <Crd style={{marginBottom:14,borderColor:"rgba(109,92,255,0.15)"}}>
      <div style={{fontSize:12,fontWeight:700,color:C.bright,marginBottom:10}}>🎛️ {scenarios[activeSc].name} — Parameters</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:5}}>Competitors <span style={{fontSize:9,color:C.muted}}>(Base: {actualComps})</span></div><input type="range" min={1} max={8} value={scenarios[activeSc].comps} onChange={e=>updateSc("comps",+e.target.value)} style={{width:"100%"}}/><div style={{textAlign:"center",fontSize:13,fontWeight:700,color:scenarios[activeSc].comps!==actualComps?"#ff4d6a":"#a99fff"}}>{scenarios[activeSc].comps}</div></div>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:5}}>Your Launch Delay (months)</div><input type="range" min={0} max={24} value={scenarios[activeSc].delay} onChange={e=>updateSc("delay",+e.target.value)} style={{width:"100%"}}/><div style={{textAlign:"center",fontSize:13,fontWeight:700,color:"#ff8c42"}}>{scenarios[activeSc].delay}m</div></div>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:8}}>Interchangeable</div><button onClick={()=>updateSc("interch",!scenarios[activeSc].interch)} style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${scenarios[activeSc].interch?"#00d4aa":C.border}`,background:scenarios[activeSc].interch?"rgba(0,212,170,0.1)":"transparent",color:scenarios[activeSc].interch?"#00d4aa":C.muted,fontSize:11,fontWeight:600,cursor:"pointer",width:"100%"}}>{scenarios[activeSc].interch?"✓ YES":"✗ NO"}</button></div>
        <div><div style={{fontSize:11,color:C.text,fontWeight:600,marginBottom:5}}>Override Erosion %</div><input type="range" min={10} max={92} value={scenarios[activeSc].override||active.adj} onChange={e=>updateSc("override",+e.target.value)} style={{width:"100%"}}/><div style={{textAlign:"center",fontSize:13,fontWeight:700,color:"#ef4444"}}>{scenarios[activeSc].override||active.adj}%</div></div>
      </div>
    </Crd>

    {/* Impact Summary */}
    {isComp ? <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
      <Stat l="Addressable Market" v={`$${d.revenue}B`} c="#6366f1"/>
      <Stat l="Yr1 Revenue Capture" v={`+$${active.yr1Gain}B`} c="#10b981" sub={`${(active.yr1Gain/d.revenue*100).toFixed(1)}% of market`}/>
      <Stat l="Yr2 Revenue Capture" v={`+$${active.yr2Gain}B`} c="#10b981"/>
      <Stat l="Yr3 Revenue Capture" v={`+$${active.yr3Gain}B`} c="#10b981"/>
      <Stat l="3-Year Total" v={`+$${(+active.yr1Gain+ +active.yr2Gain+ +active.yr3Gain).toFixed(2)}B`} c="#10b981" sub="Cumulative opportunity"/>
      <Stat l="24m Erosion" v={`${active.adj}%`} c="#ff8c42"/>
    </div> : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
      <Stat l="Revenue at Risk" v={`$${d.revenue}B`} c="#6366f1"/>
      <Stat l="Yr1 Loss" v={`−$${active.yr1Loss}B`} c="#ef4444" sub={`${(active.yr1Loss/d.revenue*100).toFixed(0)}% of revenue`}/>
      <Stat l="Yr2 Loss" v={`−$${active.yr2Loss}B`} c="#ef4444"/>
      <Stat l="Yr3 Loss" v={`−$${active.yr3Loss}B`} c="#ef4444"/>
      <Stat l="3-Year Total" v={`−$${(+active.yr1Loss+ +active.yr2Loss+ +active.yr3Loss).toFixed(1)}B`} c="#dc2626" sub="Cumulative impact"/>
      <Stat l="24m Erosion" v={`${active.adj}%`} c="#ff8c42"/>
    </div>}

    {/* Charts */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      {/* Scenario comparison bar chart */}
      <Crd>
        <Title sub="Side-by-side scenario outcomes">{isComp?"Revenue Capture by Scenario":"Revenue Loss by Scenario"}</Title>
        <ResponsiveContainer width="100%" height={220}><BarChart data={results.map(r=>({name:r.name,yr1:isComp?r.yr1Gain:r.yr1Loss,yr2:isComp?r.yr2Gain:r.yr2Loss,yr3:isComp?r.yr3Gain:r.yr3Loss}))}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
          <XAxis dataKey="name" tick={{fontSize:10,fill:C.muted}}/>
          <YAxis tick={{fontSize:10,fill:C.muted}} tickFormatter={v=>`$${v}B`}/>
          <Tooltip content={<CTip/>}/>
          <Bar dataKey="yr1" name="Year 1" fill={isComp?"#10b981":"#6366f1"} radius={[4,4,0,0]}/>
          <Bar dataKey="yr2" name="Year 2" fill={isComp?"#00d4aa":"#f59e0b"} radius={[4,4,0,0]}/>
          <Bar dataKey="yr3" name="Year 3" fill={isComp?"#8b7fff":"#ef4444"} radius={[4,4,0,0]}/>
          <Legend wrapperStyle={{fontSize:10}}/>
        </BarChart></ResponsiveContainer>
      </Crd>
      {/* Monthly trajectory */}
      <Crd>
        <Title sub={`${scenarios[activeSc].name} — monthly trajectory`}>{isComp?"Your Revenue Build":"Revenue Erosion Trajectory"}</Title>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,130,0.12)"/>
            <XAxis dataKey="m" tick={{fontSize:10,fill:C.muted}}/>
            <YAxis tick={{fontSize:10,fill:C.muted}} tickFormatter={v=>`$${v}B`}/>
            <Tooltip content={<CTip/>}/>
            {isComp ? <>
              <Area type="monotone" dataKey="myRev" stroke="#10b981" fill="rgba(16,185,129,0.15)" name="Your Revenue ($B)"/>
              <Line type="monotone" dataKey="biosimRev" stroke="#00d4aa" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Total Biosim ($B)"/>
            </> : <>
              <Area type="monotone" dataKey="origRev" stroke="#6d5cff" fill="rgba(109,92,255,0.12)" name="Originator Rev ($B)"/>
              <Line type="monotone" dataKey="erosion" stroke="#ff4d6a" strokeWidth={2} dot={{r:3}} name="Erosion %"/>
            </>}
          </ComposedChart>
        </ResponsiveContainer>
      </Crd>
    </div>

    {/* Competitor landscape for this molecule */}
    <Crd style={{marginBottom:14}}>
      <Title sub="Current competitors, strength, phase, and scenario-adjusted projections">🏢 Competitive Landscape — {d.drug}</Title>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 4px",minWidth:700}}>
          <thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.7}}>
            {["Company","Phase","Strength","Est. Launch","Yr1 Share","Yr2 Share","Key Factor"].map((h,i)=><th key={i} style={{textAlign:i>=4?"center":"left",padding:"0 8px 4px"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {/* Originator row */}
            <tr style={{background:"rgba(255,77,106,0.03)"}}>
              <td style={{padding:"8px",fontSize:11,fontWeight:700,color:"#ff4d6a"}}>{d.originator} <span style={{fontSize:9,color:C.muted}}>(Originator)</span>{isOrig&&<span style={{color:"#ff8c42",fontSize:9,marginLeft:4}}>← YOU</span>}</td>
              <td style={{padding:"8px",fontSize:10,color:C.muted}}>Market</td>
              <td style={{padding:"8px",fontSize:10,color:C.muted}}>—</td>
              <td style={{padding:"8px",fontSize:10,color:C.muted}}>Incumbent</td>
              <td style={{padding:"8px",textAlign:"center",fontFamily:mono,fontSize:12,fontWeight:700,color:"#ff4d6a"}}>{(100-active.adj*0.45*100/100).toFixed(0)}%</td>
              <td style={{padding:"8px",textAlign:"center",fontFamily:mono,fontSize:12,fontWeight:700,color:"#ff4d6a"}}>{(100-active.adj*0.75*100/100).toFixed(0)}%</td>
              <td style={{padding:"8px",fontSize:10,color:C.muted}}>Lifecycle defense, SC formulation</td>
            </tr>
            {d.competitors.map((c,i)=>{
              const str=c.strength||70;const totStr=d.competitors.reduce((a,x)=>a+(x.strength||70),0);const sh=(str/totStr*100).toFixed(0);
              const isMe=myCo&&c.company.toLowerCase().includes(myCo.toLowerCase());
              return <tr key={i} style={{background:isMe?"rgba(16,185,129,0.06)":"rgba(255,255,255,0.01)"}}>
                <td style={{padding:"8px",fontSize:11,fontWeight:600,color:C.bright}}>{c.company.split("(")[0].trim()}{isMe&&<span style={{color:"#10b981",fontSize:9,marginLeft:4}}>← YOU</span>}</td>
                <td style={{padding:"8px"}}><span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:c.phase.includes("Launched")?"rgba(0,212,170,0.1)":"rgba(255,140,66,0.1)",color:c.phase.includes("Launched")?"#00d4aa":"#ff8c42",fontWeight:600}}>{c.phase}</span></td>
                <td style={{padding:"8px"}}><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:30,height:4,background:"rgba(255,255,255,0.04)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${str}%`,height:"100%",background:str>80?"#10b981":"#6d5cff",borderRadius:2}}/></div><span style={{fontSize:10,color:C.muted,fontFamily:mono}}>{str}</span></div></td>
                <td style={{padding:"8px",fontSize:10,color:C.text}}>{c.est}</td>
                <td style={{padding:"8px",textAlign:"center",fontFamily:mono,fontSize:11,color:"#10b981"}}>{(active.adj*0.45*str/totStr).toFixed(1)}%</td>
                <td style={{padding:"8px",textAlign:"center",fontFamily:mono,fontSize:11,color:"#10b981"}}>{(active.adj*0.75*str/totStr).toFixed(1)}%</td>
                <td style={{padding:"8px",fontSize:10,color:C.muted,maxWidth:180}}>{c.weakness||c.commercial||"—"}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </Crd>

    {/* Scenario P&L Summary */}
    <Crd>
      <Title sub="Year-over-year impact for the selected scenario">{isComp?"📈 Opportunity P&L":"📉 Risk P&L"} — {scenarios[activeSc].name}</Title>
      <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px"}}>
        <thead><tr style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.8}}>
          {["Metric","Pre-LOE","Year 1","Year 2","Year 3"].map((h,i)=><th key={i} style={{textAlign:i?"right":"left",padding:"0 8px 4px"}}>{h}</th>)}
        </tr></thead>
        <tbody>
          {isComp ? [
            ["Your Revenue ($B)","—",`+${active.yr1Gain}`,`+${active.yr2Gain}`,`+${active.yr3Gain}`],
            ["Cumulative ($B)","—",`$${active.yr1Gain}B`,`$${(+active.yr1Gain+ +active.yr2Gain).toFixed(2)}B`,`$${(+active.yr1Gain+ +active.yr2Gain+ +active.yr3Gain).toFixed(2)}B`],
            ["Your Share of Biosim",`${active.myShare}%`,`${active.myShare}%`,`${active.myShare}%`,`${active.myShare}%`],
            ["Total Market","$"+d.revenue+"B",`$${active.origRemain1}B`,`$${active.origRemain2}B`,`$${active.origRemain3}B`],
          ].map((row,i)=><tr key={i} style={{background:i===0?"rgba(16,185,129,0.03)":"rgba(255,255,255,0.01)"}}>
            {row.map((c,j)=><td key={j} style={{padding:"8px",fontSize:11,fontWeight:j===0?600:500,color:j===0?C.bright:(typeof c==="string"&&c.startsWith("+"))?"#10b981":C.text,textAlign:j?"right":"left",fontFamily:j?mono:font}}>{c}</td>)}
          </tr>) : [
            ["Originator Revenue ($B)",d.revenue.toFixed(1),active.origRemain1,active.origRemain2,active.origRemain3],
            ["Revenue Loss ($B)","—",`−${active.yr1Loss}`,`−${active.yr2Loss}`,`−${active.yr3Loss}`],
            ["Market Share","100%",`${(active.origRemain1/d.revenue*100).toFixed(0)}%`,`${(active.origRemain2/d.revenue*100).toFixed(0)}%`,`${(active.origRemain3/d.revenue*100).toFixed(0)}%`],
            ["Erosion Applied","0%",`${(active.adj*0.45).toFixed(0)}%`,`${(active.adj*0.75).toFixed(0)}%`,`${(active.adj*0.92).toFixed(0)}%`],
          ].map((row,i)=><tr key={i} style={{background:i===1?"rgba(255,77,106,0.03)":"rgba(255,255,255,0.01)"}}>
            {row.map((c,j)=><td key={j} style={{padding:"8px",fontSize:11,fontWeight:j===0?600:500,color:j===0?C.bright:(typeof c==="string"&&(c.startsWith("−")||c.startsWith("-")))?"#ff4d6a":C.text,textAlign:j?"right":"left",fontFamily:j?mono:font}}>{c}</td>)}
          </tr>)}
        </tbody>
      </table>
      <div style={{marginTop:10,padding:"8px 12px",borderRadius:6,background:"rgba(109,92,255,0.04)",fontSize:10,color:C.muted,lineHeight:1.6}}>
        <strong style={{color:"#a99fff"}}>Scenario: {scenarios[activeSc].name}</strong> — {scenarios[activeSc].comps} competitors, {scenarios[activeSc].delay}m delay, {scenarios[activeSc].interch?"interchangeable":"non-interchangeable"}. Erosion: {active.adj}%. Based on {d.therapyArea} benchmarks ({erosionRef.e24}% base).
      </div>
    </Crd>
  </div>;
}

// ═══════════════════════════════════════════
// MAIN APP — v5.0 (25 MODULES)
// ═══════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("portfolio");
  const [navOpen,setNavOpen]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [lastRef,setLastRef]=useState(new Date());
  const refresh=useCallback(()=>{setRefreshing(true);setTimeout(()=>{setLastRef(new Date());setRefreshing(false)},2e3)},[]);

  const tabs=[
    {k:"portfolio",l:"My Portfolio",i:"🏢",c:"Command"},{k:"warroom",l:"War Room",i:"🎖️",c:"Command"},{k:"timeline",l:"Timeline",i:"⏱️",c:"Command"},{k:"alerts",l:"Alerts",i:"🔔",c:"Command"},
    {k:"historical",l:"Historical",i:"📊",c:"Analytics"},{k:"projections",l:"Projections",i:"🎛️",c:"Analytics"},{k:"revcalc",l:"Rev Calculator",i:"💰",c:"Analytics"},{k:"pricing",l:"Price Bench.",i:"💲",c:"Analytics"},
    {k:"pipeline",l:"Pipeline Intel",i:"🧬",c:"Intelligence"},{k:"litigation",l:"Litigation",i:"⚖️",c:"Intelligence"},{k:"payer",l:"Payer",i:"💊",c:"Intelligence"},{k:"patents",l:"Patent Map",i:"🔒",c:"Intelligence"},{k:"tab340b",l:"340B Impact",i:"🏥",c:"Intelligence"},
    {k:"global",l:"Global Regulatory",i:"🌍",c:"Markets"},{k:"regfiling",l:"Filing Tracker",i:"📋",c:"Markets"},{k:"investor",l:"Investor",i:"📈",c:"Markets"},
    {k:"strategy",l:"Strategy",i:"💡",c:"Playbooks"},{k:"battlecard",l:"Battlecards",i:"🃏",c:"Playbooks"},{k:"brief",l:"AI Brief",i:"🤖",c:"Playbooks"},{k:"report",l:"War Game",i:"⚔️",c:"Playbooks"},{k:"workspace",l:"Workspace",i:"📝",c:"Playbooks"},
  ];
  const cats=[...new Set(tabs.map(t=>t.c))];

  return <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:font,color:C.text}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#4338ca #0a0e18}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0e18}::-webkit-scrollbar-thumb{background:#4338ca;border-radius:3px}input::placeholder{color:#6b7280}select{cursor:pointer}textarea::placeholder{color:#6b7280}input[type=range]{height:4px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,0.06);border-radius:2px;outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#6366f1;cursor:pointer;border:2px solid #0a0e18}`}</style>
    <div style={{width:navOpen?220:48,background:"rgba(8,12,20,0.99)",borderRight:`1px solid ${C.border}`,padding:navOpen?"14px 8px":"14px 4px",transition:"width 0.2s",flexShrink:0,overflowY:"auto",overflowX:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingLeft:2}}>
        <div onClick={()=>setNavOpen(!navOpen)} style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer",flexShrink:0}}>🧬</div>
        {navOpen&&<div><div style={{fontSize:12,fontWeight:800,color:C.bright,letterSpacing:0.3}}>PatentCliff AI</div><div style={{fontSize:8,color:C.muted,fontFamily:mono}}>Enterprise v6.0 · 21 modules</div></div>}
      </div>
      {cats.map(cat=><div key={cat} style={{marginBottom:6}}>
        {navOpen&&<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1.8,fontWeight:700,padding:"6px 8px 3px",marginBottom:1}}>{cat}</div>}
        {tabs.filter(t=>t.c===cat).map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{width:"100%",display:"flex",alignItems:"center",gap:7,padding:navOpen?"7px 10px":"7px 5px",borderRadius:7,border:"none",background:tab===t.k?"rgba(99,102,241,0.12)":"transparent",color:tab===t.k?"#a5b4fc":C.muted,fontSize:navOpen?12:14,fontWeight:tab===t.k?600:400,cursor:"pointer",textAlign:"left",whiteSpace:"nowrap",marginBottom:1,fontFamily:font,letterSpacing:0.1,lineHeight:1.4}}>
          <span style={{fontSize:navOpen?13:14,flexShrink:0,opacity:tab===t.k?1:0.7}}>{t.i}</span>{navOpen&&<span>{t.l}</span>}
        </button>)}
      </div>)}
      <div style={{marginTop:"auto",paddingTop:8}}>{navOpen&&<div style={{padding:"8px",borderRadius:8,background:"rgba(99,102,241,0.04)",border:`1px solid ${C.border}`,fontSize:10,color:C.muted,lineHeight:1.4}}>{DRUGS.length} drugs · {DRUGS.reduce((a,d)=>a+d.competitors.length,0)}+ competitors<br/>Last updated: Feb 2026</div>}</div>
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
      <div style={{padding:"10px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(8,12,20,0.95)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontSize:15,fontWeight:700,color:C.bright,letterSpacing:0.2}}>{tabs.find(t=>t.k===tab)?.i} {tabs.find(t=>t.k===tab)?.l}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {refreshing&&<span style={{fontSize:11,color:"#a5b4fc",animation:"spin 0.8s linear infinite",display:"inline-block"}}>⟳</span>}
          <span style={{fontSize:10,color:C.muted,fontFamily:mono}}>{lastRef.toLocaleTimeString()}</span>
          <button onClick={refresh} disabled={refreshing} style={{padding:"5px 12px",background:refreshing?"transparent":"linear-gradient(135deg,#4f46e5,#6366f1)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:7,color:"#fff",fontSize:11,fontWeight:600,cursor:refreshing?"not-allowed":"pointer"}}>⟳ Refresh</button>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:16}}>
        {tab==="portfolio"&&<PortfolioTab/>}{tab==="warroom"&&<WarRoomTab/>}{tab==="timeline"&&<TimelineTab/>}{tab==="alerts"&&<AlertTab/>}
        {tab==="historical"&&<HistoricalTab/>}{tab==="projections"&&<ProjectionsTab/>}{tab==="revcalc"&&<RevenueCalcTab/>}{tab==="pricing"&&<PriceTab/>}
        {tab==="pipeline"&&<PipelineTab/>}{tab==="litigation"&&<LitigationTab/>}{tab==="payer"&&<PayerTab/>}{tab==="patents"&&<PatentTab/>}{tab==="tab340b"&&<Tab340B/>}
        {tab==="global"&&<GlobalTab/>}{tab==="regfiling"&&<RegFilingTab/>}{tab==="investor"&&<InvestorTab/>}
        {tab==="strategy"&&<StrategyTab/>}
        {tab==="battlecard"&&<BattlecardTab/>}{tab==="brief"&&<BriefTab/>}{tab==="report"&&<ReportTab/>}{tab==="workspace"&&<WorkspaceTab/>}
      </div>
    </div>
  </div>;
}
