# SkillPath — Skill-Evidence Career Recommender

> **"Discover Careers Through What Students Can Actually Demonstrate."**  
> *A functional, premium, futuristic EdTech web application where university career recommendations are founded on authentic student evidence — Projects + Assessed Competencies + Portfolios + Interests — not marks or GPAs alone.*

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2019-cyan.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js%20%2F%20R3F-purple.svg)](https://docs.pmnd.rs/react-three-fiber/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20(Python)-009688.svg)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Privacy](https://img.shields.io/badge/Ethics-Zero%20Surveillance-emerald.svg)](#ethical-architecture--zero-surveillance-manifesto)

---

## 1. Core Philosophy

Traditional university career counseling and automated placement algorithms rely heavily on single-number GPAs, exam percentiles, or intrusive surveillance proctoring. This approach fails both students and employers:
- **Exams measure test-cramming and theory memorization**, remaining blind to version control discipline, system design, iterative debugging, and team collaboration.
- **Single-number GPAs compress multi-dimensional human talent** into a lossy, uninterpretable score with zero career gap visibility.
- **Naive AI recommendations hallucinate confident matches** or push students into narrow boxes based on demographic correlations.

**SkillPath** re-architects career recommendations around **verifiable demonstrated evidence**:

$$\text{Student} \longrightarrow \text{Evidence} \longrightarrow \text{Demonstrated Skills} \longrightarrow \text{Career Match} \longrightarrow \text{Explainability} \longrightarrow \text{Human Review}$$

---

## 2. System Architecture & Tech Stack

```
skillpath/
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # 7 REST API endpoints + CORS + validation
│   ├── recommender.py        # Transparent skill-overlap engine with explainability
│   ├── data_loader.py        # Dataset indexing and eager-loading
│   └── requirements.txt      # fastapi, uvicorn, pydantic
├── dataset/                  # Synthetic Benchmark Prototype Data
│   ├── generate_dataset.py   # Dataset generator script
│   ├── students.json         # 10 student dossiers (7 standard + 3 edge cases)
│   └── careers.json          # 8 industry career role requirement taxonomies
└── frontend/                 # Vite + React 19 Single Page Application
    ├── index.html            # Google Fonts (Space Grotesk, Inter, JetBrains Mono)
    ├── tailwind.config.js    # Futuristic theme, neon accents, dark surfaces
    ├── src/
    │   ├── index.css         # Glassmorphism tokens, gradients, badges, noise
    │   ├── main.jsx          # React DOM entry point
    │   ├── App.jsx           # Sidebar shell, top bar, dynamic routes, AnimatePresence
    │   ├── components/
    │   │   ├── SkillNetwork3D.jsx    # Interactive Three.js/R3F 3D graph
    │   │   ├── HeroSection.jsx       # Animated hero headline & live counters
    │   │   ├── Sidebar.jsx           # Animated navigation with layoutId spring
    │   │   ├── TopBar.jsx            # Dynamic breadcrumbs & status badge
    │   │   ├── EthicsBanner.jsx      # Surveillance prohibition guarantee
    │   │   ├── MatchBar.jsx          # Animated progress bar with score colors
    │   │   ├── AnimatedCounter.jsx   # Ease-out viewport count-up numbers
    │   │   ├── FailureCasePanel.jsx  # Safety edge cases comparison panel
    │   │   └── FutureRoadmap.jsx     # Current 35% vs Future 65% scope
    │   ├── pages/
    │   │   ├── Overview.jsx          # Full interactive landing dashboard
    │   │   ├── Students.jsx          # Student talent registry (search & filter)
    │   │   ├── StudentDetail.jsx     # Deep dossier tabs (Projects, Rubrics, Portfolio, Skills)
    │   │   ├── Evidence.jsx          # 4 pillars deep-dive & GPA comparative table
    │   │   ├── Skills.jsx            # 22-skill capability taxonomy & 3D graph
    │   │   ├── CareerExplorer.jsx    # 8 career profiles with prerequisite pills
    │   │   ├── Recommendations.jsx   # Transparent matching engine & gap analysis
    │   │   ├── HumanReview.jsx       # Counselor audit desk with 5 override reasons
    │   │   └── StakeholderTradeoff.jsx # Agency vs Confidence slider & scatter plot
    │   └── utils/
    │       └── api.js                # Centralized typed API fetch client
```

### Technology Matrix
| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite (JavaScript, No TS) | Fast dev server, instant HMR, reactive rendering |
| **Styling & Design** | Tailwind CSS + Vanilla CSS Tokens | Glassmorphism, neon dark palette, tactile noise |
| **3D Visualization** | Three.js + React Three Fiber + Drei | Interactive spatial constellation of evidence $\to$ skills $\to$ roles |
| **Motion & Micro-interactions** | Framer Motion | Spring transitions, layoutId morphs, card entrances |
| **Charts & Visual Analytics** | Recharts | Evidence modality breakdowns, career alignment tracks, scatter plot |
| **Backend Engine** | Python 3.14 + FastAPI + Uvicorn | High-throughput REST API with asynchronous request lifecycle |
| **Dataset** | Synthetic JSON Benchmark | 10 realistic student dossiers + 8 career taxonomies |

---

## 3. Quick Start & Setup Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v22)
- **Python**: v3.10+ (tested on Python 3.14)

### Running the Backend

```bash
# 1. Navigate to the backend directory
cd "skillpath/backend"

# 2. Install dependencies (if not already installed)
pip install -r requirements.txt

# 3. Start the FastAPI server on port 8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API docs are automatically available at: `http://127.0.0.1:8000/docs`*

### Running the Frontend

```bash
# 1. Navigate to the frontend directory
cd "skillpath/frontend"

# 2. Install dependencies (if needed)
npm install

# 3. Launch Vite development server on port 5173
npm run dev -- --host 127.0.0.1 --port 5173
```
*Open your browser and visit: `http://127.0.0.1:5173/`*

---

## 4. The 4 Evidence Pillars

| Modality | Description | Verification Method | Representative Proof |
|---|---|---|---|
| **1. Capstone Projects** | Tangible code repos, deployed apps, and builds | Git commit histories, unit tests, deployment URLs | *NHS Patient Readmission Predictor (85% accuracy)* |
| **2. Assessed Competencies** | Standardized criterion-referenced rubrics (0–100) | Faculty, mentor, and peer milestone evaluations | *Analytical Thinking: 92/100, Problem Solving: 88/100* |
| **3. Curated Portfolios** | Deep case studies, UX prototypes, technical writes | Figma clickable prototypes, Medium blogs, Kaggle notebooks | *Transit kiosk accessibility case study with 12 users* |
| **4. Declared Ambitions** | Self-directed student interests and career targets | Student reflection surveys, elective course choices | *Expressed passion for Healthcare AI & Data Science* |

---

## 5. Transparent Matching Algorithm & Explainability

SkillPath deliberately rejects opaque neural black-boxes in favor of an **auditable, mathematical skill-overlap formula**:

$$\text{Match Score} = \left( \frac{|\text{Demonstrated Skills} \cap \text{Role Required Skills}|}{|\text{Role Required Skills}|} \right) \times 100$$

Every recommendation generated displays two complementary drawers:
1. **Why Recommended:** The exact verified evidence sources (GitHub project commits, rubrics, portfolios) backing up each matched skill.
2. **Actionable Evidence Gaps:** The exact missing prerequisite skills, coupled with concrete suggestions on the types of projects or rubrics needed to qualify.

---

## 6. Counselor Governance: Human-in-the-Loop Audit

Algorithms advise; human educators decide. SkillPath enforces institutional governance through the **Counselor Review Station** (`/review`):
- **1-Click Approval:** Confirms the recommendation with an immutable reviewer timestamp.
- **Audited Override:** Changing a recommendation requires selecting 1 of 5 validated institutional reasons:
  1. *Additional evidence not captured in system*
  2. *Student explicitly preferred another pathway*
  3. *Teacher/counselor holistic assessment*
  4. *Insufficient prerequisite foundations*
  5. *Other* (with mandatory qualitative explanation)
- **Accountability Ledger:** Real-time audit log recording every decision, reviewer name, timestamp, and qualitative rationale.

---

## 7. Handled Safety Failure Cases

SkillPath explicitly models and handles edge cases rather than failing silently:

| Student ID | Edge Scenario | Conventional Black-Box AI Failure | SkillPath Safe Handling |
|---|---|---|---|
| **`s007` (Fatima)** | **Zero Evidence Baseline** (Year 1, no projects/rubrics) | Hallucinates confident matches based on demographic bias | Flags "Zero Evidence Available", lowers score to baseline, prompts exploratory diagnostic |
| **`s008` (Jack)** | **High Ambition / Low Evidence** (Passionate for ML, but only basic web skills) | Either gives false 95% confidence or completely ignores goal | Respects ambition, scores readiness at 33%, and maps exact milestone bridge curriculum |
| **`s009` (Zoe)** | **Signal Divergence** (High UX score + Systems C++ programming) | Averages into a generic intermediate role that dilutes talent | Preserves dual top pathways (UX at 85% and Software at 78%) for counselor discussion |

---

## 8. Ethical Architecture & Zero Surveillance Manifesto

SkillPath operates under a strict **Dignity-First Privacy Boundary**:

```
[ STRICT SURVEILLANCE PROHIBITION ]
❌ NEVER Webcams or gaze tracking
❌ NEVER Keystroke logging or cadence analysis
❌ NEVER Screen capture or background process inspection
❌ NEVER Social media scraping or external data purchasing
✅ ONLY Submitted code repositories & verifiable project deliverables
✅ ONLY Transparent criterion-referenced faculty rubrics
✅ ONLY Explicit, self-declared student ambitions and portfolios
```

---

## 9. Current Scope (~35%) vs Future Roadmap (~65%)

### Completed in Current Scope (~35%)
- [x] Multi-modal evidence data model (`students.json`, `careers.json`)
- [x] Python FastAPI backend with 7 REST endpoints and transparent matching engine
- [x] Design system with custom dark futuristic palette, glassmorphism, and neon typography
- [x] Interactive Three.js / React Three Fiber 3D Skill Network with hover-linked edges
- [x] Complete feature pages: Overview, Students, Dossier, Evidence, Skills, Careers, Recommendations, Human Review, Stakeholder Trade-offs
- [x] Counselor human-in-the-loop audit station with 5 validated override reasons
- [x] Multi-stakeholder Agency vs Evidence Confidence simulator and 2D quadrant scatter plot
- [x] Failure cases handling for Zero Evidence, Ambition Gaps, and Signal Divergence

### Future Scope (~65%)
- **Phase 2 (Automated Ingestion):** GitHub Classroom & GitLab webhook listeners; Canvas & Blackboard LMS rubric sync via LTI 1.3.
- **Phase 3 (Semantic Evidence Intelligence):** Local open-weight LLMs for semantic rubric parsing; continuous gap-filling project generator.
- **Phase 4 (Enterprise Compliance):** SAML 2.0 / Shibboleth SSO; FERPA & GDPR cryptographic audit ledger; role-based access control.
- **Phase 5 (Labor Market & Alumni Tracking):** Live Lightcast / O*NET labor market demand feeds; employer ATS direct pipeline; 1, 3, and 5-year longitudinal alumni career trajectory validation.

---

## 10. License

Developed as a prototype demonstration for **Advanced Evidence-Based Career Guidance Architecture**.  
*All student and career profiles are synthetic representations designed for ethical benchmark evaluation.*
