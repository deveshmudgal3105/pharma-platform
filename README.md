# 🧬 Patent Cliff Intelligence Platform

A comprehensive pharma benchmarking tool that tracks off-patent drugs, competitor pipelines, pricing dynamics, and market signals.

## 9 Modules Included

| Module | Description |
|--------|-------------|
| 📊 **Historical Analytics** | 5-year LoE lookback with market share & price erosion curves |
| 📈 **Projections** | Revenue, price, and volume projections for upcoming LoE events |
| 🧬 **Pipeline Intelligence** | 10+ drugs, 40+ competitors, multi-source signal tracking |
| ⚔️ **Competitive War Room** | Battle cards with SWOT, radar charts, defense scoring |
| 🎛️ **Financial Simulator** | Interactive what-if modeling with sensitivity matrices |
| 🚨 **Early Warning System** | Severity-ranked alerts from 8+ data sources |
| 🏛️ **Regulatory & Litigation** | Global filing tracker (6 agencies) + patent litigation monitor |
| 🎯 **Strategic Recommendations** | Tailored playbooks for originators, biosimilars, payers, investors |
| 📋 **Executive Briefing & API** | AI-powered C-suite briefings + integration showcase |

---

## Quick Setup (MacBook)

### Prerequisites
- **Node.js** (v18 or later) — install from https://nodejs.org or via Homebrew

### Install & Run

```bash
# 1. Open Terminal and navigate to the project folder
cd patent-cliff-intelligence

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open automatically at **http://localhost:3000**

### Build for Production

```bash
npm run build       # Creates optimized build in /dist
npm run preview     # Preview the production build
```

---

## Project Structure

```
patent-cliff-intelligence/
├── index.html          # Entry HTML
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
└── src/
    ├── main.jsx        # React entry point
    ├── data.js         # All data constants & helpers
    └── App.jsx         # All 9 modules + main shell
```

## Tech Stack

- **React 18** — UI framework
- **Recharts** — Charts & visualizations
- **Vite** — Build tool (fast HMR)
- **Claude API** — AI-powered executive briefings (optional)

## Notes

- All source links throughout the dashboard point to real databases (FDA, ClinicalTrials.gov, SEC EDGAR, PubMed, Google Patents, etc.)
- The AI Executive Briefing feature requires access to the Anthropic API
- Data is representative/illustrative — connect to real APIs for production use
