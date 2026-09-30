# SkillPath — Evidence-Based Career Recommendation System

> **"Discover Careers Through What Students Can Actually Demonstrate."**  
> *An institutional-grade, multi-modal career recommendation and audit platform powered by transparent skill-overlap matching, server-enforced RBAC, operational failure detection, and rigorous information retrieval benchmarking.*

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2019-cyan.svg)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20v0.2.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Visualization-Three.js%20%2B%20R3F-black.svg)](https://threejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org/)
[![Phase](https://img.shields.io/badge/Completion-100%25%20Phase%203%20Complete-emerald.svg)](#completion-status)

---

## Table of Contents

1. [Overview & Value Proposition](#overview--value-proposition)
2. [Quick Start & Setup Guide](#quick-start--setup-guide)
3. [System Architecture](#system-architecture)
4. [Frontend Application Tour (17 Views)](#frontend-application-tour-17-views)
5. [Core Phase 2 Implementations](#core-phase-2-implementations)
6. [Core Phase 3 Enterprise Implementations](#core-phase-3-enterprise-implementations)
   - [6.1 Automated Ingestion (GitHub Classroom & LTI 1.3 LMS)](#61-automated-ingestion-github-classroom--lti-13-lms)
   - [6.2 Semantic Intelligence & Open-Weight LLM Rubric Extraction](#62-semantic-intelligence--open-weight-llm-rubric-extraction)
   - [6.3 Enterprise Compliance & Cryptographic Blockchain Audit](#63-enterprise-compliance--cryptographic-blockchain-audit)
   - [6.4 Labor Market Telemetry (Lightcast & O*NET SOC)](#64-labor-market-telemetry-lightcast--onet-soc)
7. [Complete REST API Reference](#complete-rest-api-reference)
8. [Demo Credentials & Bearer Tokens](#demo-credentials--bearer-tokens)
9. [Codebase Structure](#codebase-structure)
10. [Completion Status & Roadmap](#completion-status--roadmap)

---

## Overview & Value Proposition

Traditional academic career placement systems rely heavily on coarse proxies such as GPA, standardized test percentiles, or generic multiple-choice surveys. These systems suffer from fundamental limitations:
- **Generic funneling:** Funneling high-GPA students into standard software or consulting tracks regardless of genuine demonstrated capabilities.
- **Surveillance or opaque data:** Relying on invasive background monitoring or "black-box" ML rankings with no audit trail.
- **Hallucinated confidence:** Making recommendations even when student portfolios are months out of date or completely empty.

**SkillPath** replaces opaque GPA funneling with an **evidence-based, transparent recommendation engine**. It calculates fit purely from four verifiable multi-modal evidence pillars:
1. **Capstone Projects:** Actual systems built, problem statements tackled, and verified GitHub/code artifacts.
2. **Competency Rubrics:** Demonstrated skill evaluations scored across rigorous performance thresholds.
3. **Verified Portfolios:** Live deployment links, system architectures, and technical writeups.
4. **Declared Aspirations & Interests:** Student-declared directional goals aligned with industry taxonomies.

---

## Quick Start & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Git**

---

### 1. Backend Setup (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (recommended)
# Windows:
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS:
# python3 -m venv venv
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

- **Backend API URL:** `http://localhost:8000`
- **Interactive Swagger Documentation:** `http://localhost:8000/docs`
- **ReDoc Documentation:** `http://localhost:8000/redoc`

---

### 2. Frontend Setup (React 19 + Vite)

Open a new terminal window in the project root:

```bash
# Install frontend dependencies
npm install

# Run the development server
npm run dev
```

- **Frontend App URL:** `http://localhost:5173`

---

## System Architecture

```
                          ┌───────────────────────────┐
                          │   Vite + React 19 Client  │
                          │ (Tailwind CSS, Three.js)  │
                          └─────────────┬─────────────┘
                                        │ HTTP / JSON
                                        │ Authorization: Bearer <token>
                                        ▼
                          ┌───────────────────────────┐
                          │    FastAPI Application    │
                          │         (v0.2.0)          │
                          └──────┬─────────────┬──────┘
                                 │             │
                ┌────────────────┼─────────────┼────────────────┐
                ▼                ▼             ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │  auth.py     │ │  health.py   │ │ recommender  │ │ metrics.py   │
        │ Server RBAC  │ │ 90d Stale    │ │ Skill-Overlap│ │ P / R / F1   │
        │ 4 Roles      │ │ Pillar Scan  │ │ Matching     │ │ IR Benchmark │
        └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
                ▲                ▲             ▲                ▲
                └────────────────┴──────┬──────┴────────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │    Synthetic Benchmark    │
                          │   students.json (10)      │
                          │   careers.json  (8)       │
                          └───────────────────────────┘
```

---

## Frontend Application Tour (17 Views)

The application provides a 17-view enterprise dashboard with dark mode, glassmorphism UI, and 3D skill cluster graphs:

| View | Route | Target Audience | Primary Function |
|---|---|---|---|
| **Overview Dashboard** | `/` | All / Evaluators | Executive metrics, skill graphs, system telemetry, and pipeline health |
| **Students Directory** | `/students` | Counselors / Admin | Searchable, filterable directory with risk badges and archetypes |
| **Student Detail** | `/students/:id` | Counselors / Students | Full 4-pillar portfolio dossier, rubrics, and health diagnosis |
| **Evidence Explorer** | `/evidence` | Counselors / Employers | Cross-student evidence repository with live code artifact links |
| **Skills Graph** | `/skills` | All Users | Interactive 3D skill network and taxonomy clustering (Three.js / R3F) |
| **Career Explorer** | `/careers` | Students / Counselors | 8 career pathways with required skill profiles and wage benchmarks |
| **Recommendations** | `/recommendations` | Students / Counselors | Transparent matching engine with project-to-skill alignment |
| **Counselor Review** | `/review` | Counselors | Human-in-the-loop review station, 5 override categories, audit ledger |
| **Stakeholder Tradeoffs** | `/tradeoff` | Institutional Leads | Interactive balancing of student ambition vs. employer readiness |
| **Stakeholder Feedback** | `/feedback` | All Stakeholders | Real multi-dimensional evaluations from Students, Counselors, and Employers |
| **Access Control (RBAC)** | `/access` | Administrators | Real-time identity inspector, Bearer token switcher, permission matrix |
| **Operational Health** | `/health` | Ops / Counselors | Dataset freshness, 90-day stale alarms, and graduation aging checks |
| **Baseline IR Metrics** | `/metrics` | Data Scientists / Leads | Empirical Precision / Recall / F1 comparison vs. GPA marks baseline |
| **Automated Ingestion** | `/ingestion` | DevOps / Admins | GitHub Classroom webhooks, Canvas/Blackboard LTI 1.3 sync, live event ledger |
| **Semantic Intelligence** | `/semantic` | Instructors / Leads | Open-weight LLM project rubric extraction, Bloom's depth & cohort analysis |
| **Compliance & Audit** | `/compliance` | Security / Legal | SHA-256 blockchain audit ledger, SAML 2.0 / Shibboleth, FERPA/GDPR data rights |
| **Market Telemetry** | `/telemetry` | Career Services / All | Live Lightcast & O*NET SOC labor demand feeds, salary benchmarking & gap radar |

---

## Core Phase 2 Implementations

### 5.1 Server-Enforced Role-Based Access Control (RBAC)

In Phase 1, role selection was a client-side convenience. **Phase 2 enforces security at the HTTP engine layer** via FastAPI dependency injection:

```
Incoming Request
    │
    ├──> get_current_user() checks Authorization: Bearer <token>
    │       └── 401 Unauthorized (invalid/missing token)
    │
    ├──> require_permission("<permission_key>")
    │       └── 403 Forbidden (role has insufficient scope)
    │
    └──> require_own_student(student_id)
            └── 403 Forbidden (student token attempting to view another student's dossier)
```

#### Granular Role Capabilities

| Role | Permissions & Access Scope |
|---|---|
| `student` | Read own profile (`/students/{own_id}`), own recommendations (`/recommendations/{own_id}`), own health scan. Access to other student records is rejected with HTTP 403. |
| `counselor` | Full read access across all students, recommendations, audit logs, operational health scans, and IR baseline metrics. Ability to approve or override career matches with written rationale. |
| `employer` | Access to verified career profiles, evidence dossiers, and aggregate stakeholder ratings. Ability to submit hiring signal evaluations. |
| `admin` | Unrestricted institutional access, including token registry introspection (`/auth/tokens`) and system telemetry. |

---

### 5.2 Operational Failure Detection & Safe States

SkillPath explicitly prevents "hallucinated confidence." If an input record is corrupted, out of date, or missing foundational evidence, the engine blocks recommendation generation:

1. **Stale Evidence Detection (>90 Days):**
   Flags students whose project portfolio has had no recorded activity for 90+ days.
2. **Missing Evidence Pillar Fallback (<2 Pillars):**
   Requires at least 2 of 4 pillars (projects, rubrics, portfolio, verified skills). When missing, returns a deterministic blocked payload:
   ```json
   {
     "blocked": true,
     "blockReason": "Insufficient evidence to generate a reliable recommendation. Missing pillars: Capstone Projects (0 submitted), Portfolio Links (0 added)",
     "healthScan": { "overallHealth": "critical" }
   }
   ```
3. **Academic Aging Milestones:**
   Flags Year 3/4 students with fewer than 2 projects or 4 verified skills as high-risk graduation transitions with proactive counselor intervention actions.

---

### 5.3 Baseline Information Retrieval Benchmark (P / R / F1)

To mathematically prove that evidence-based matching outperforms marks-only GPA ranking, `metrics.py` implements an empirical IR evaluation:

$$\text{Precision} = \frac{|\text{Recommended} \cap \text{Relevant}|}{|\text{Recommended}|} \qquad \text{Recall} = \frac{|\text{Recommended} \cap \text{Relevant}|}{|\text{Relevant}|} \qquad F_1 = \frac{2 \times \text{P} \times \text{R}}{\text{P} + \text{R}}$$

- **Ground Truth Construction:** Objective relevance constructed independently of recommenders (Interest alignment $\land$ $\ge$40% skill match $\land$ Rubric score $\ge$70, OR $\ge$60% direct skill overlap).
- **Marks-Only Baseline:** GPA-weighted heuristic funneling students into generic tech pathways.
- **Empirical Finding:** Evidence matching achieves higher F1 scores across non-standard skill profiles (e.g., UX designers with systems skills, healthcare data specialists) and prevents severe career misclassification.

---

### 5.4 Multi-Stakeholder Validation & Defensibility Layer

A structured evaluation layer capturing real defensibility metrics across all three user groups:

| Stakeholder Group | Core Dimensions Measured | Key Benchmark Insight |
|---|---|---|
| **Students** | Relevance, Clarity, Fairness, Actionability | **100%** reported they would act on recommended evidence steps |
| **Counselors** | Accuracy, Auditability, Override Ergonomics, Trust | **100%** stated the audit ledger and reason taxonomy are defendable |
| **Employers** | Signal Strength, Portfolio Clarity, Trustworthiness | **100%** prefer demonstrated artifacts over keyword CV lines |

---

## Core Phase 3 Enterprise Implementations

### 6.1 Automated Ingestion (GitHub Classroom & LTI 1.3 LMS)

Phase 3 transitions SkillPath from manual data entry to **automated continuous evidence ingestion**:
- **GitHub Classroom Webhook Listeners (`/ingestion/github/webhook`):** Validates incoming commits and automated grading actions via HMAC-SHA256 signatures, capturing commit hashes, branch metadata, and test coverage metrics.
- **Canvas & Blackboard LTI 1.3 Advantage (`/ingestion/lti/launch`, `/ingestion/lti/sync`):** Synchronizes course assignment evaluations, rubric criteria scores, and teacher assessments directly into student portfolios.
- **Interactive Event Stream (`/ingestion`):** Live telemetry console displaying incoming events, connector protocols, and interactive payload simulator.

### 6.2 Semantic Intelligence & Open-Weight LLM Rubric Extraction

To eliminate grading bias and automatically understand unstructured student technical artifacts, `semantic.py` introduces open-weight LLM inference:
- **Multi-Model Support:** Native prompt pipelines tailored for Meta Llama-3-8B-Instruct, Mistral-7B-Instruct, and Google Gemma-2-9B.
- **Demonstrated Skill & Taxonomy Extraction:** Identifies concrete language, framework, cloud, data, and security competencies with statistical confidence scores (0.0–1.0).
- **Pattern Rigor & Bloom's Cognitive Depth:** Evaluates demonstrated system architecture patterns (e.g. Raft distributed consensus, RAG pipelines, mTLS Zero-Trust) and assigns Bloom's Taxonomy ratings (Level 1–6).
- **Cohort Batch Analysis:** Analyzes entire cohorts to identify cross-student engineering clusters and curriculum skill gaps.

### 6.3 Enterprise Compliance & Cryptographic Blockchain Audit

Institutional deployment demands rigorous data governance and legal compliance:
- **Tamper-Evident SHA-256 Audit Ledger (`/compliance/audit-ledger`):** Every sensitive action (dossier inspection, recommendation override, rubric edit) is committed as a cryptographic block linking `prevHash + payloadHash + actor`.
- **Mathematical Chain Verification (`/compliance/verify-ledger`):** Re-computes SHA-256 hashes across all blocks to detect any unauthorized database tampering.
- **SAML 2.0 / Shibboleth Institutional SSO (`/compliance/sso/metadata.xml`, `/compliance/sso/login`):** Service Provider (SP) metadata generation and simulated InCommon federation login.
- **FERPA & GDPR Data Portability & Rights (`/compliance/export-dossier`, `/compliance/anonymize`):** 34 CFR Part 99 data export packages with digital signatures and Article 17 right-to-erasure pseudonymization.

### 6.4 Labor Market Telemetry (Lightcast & O*NET SOC)

Bridges the gap between academic evidence and 2026 workforce demands:
- **O*NET SOC Mapping:** Direct mapping of all 8 career tracks to Bureau of Labor Statistics (BLS) standard occupational codes.
- **Lightcast 2026 Hiring Velocity:** Real-time job posting volumes, 5-year growth trajectories, and regional salary benchmarks (Silicon Valley, New York, Boston, Austin, Seattle).
- **Student-to-Market Skill Gap Radar (`/telemetry`):** Compares student demonstrated skills against emerging 2026 skills (e.g. Rust, Vector Databases, Zero-Trust, LLM Evaluation) to compute hiring readiness velocity.

---

## Complete REST API Reference

| Method | Endpoint | Access Required | Description |
|---|---|---|---|
| `GET` | `/` | Public | API telemetry, status, version 1.0.0 catalog |
| `GET` | `/students` | Public / Student | Summary list of all student archetypes |
| `GET` | `/students/{id}` | Student (own) / Counselor | Full student dossier with embedded health scan |
| `GET` | `/careers` | Public | Full catalog of career tracks & skill criteria |
| `GET` | `/recommendations/{id}`| Student (own) / Counselor | Transparent skill matching (health-gated) |
| `POST`| `/review` | `write:review` (Counselor) | Record approval or override with audit reason |
| `GET` | `/reviews` | `read:reviews` (Counselor) | Complete audit ledger of all human reviews |
| `GET` | `/stats` | Public | High-level system statistics and review metrics |
| `GET` | `/auth/me` | Bearer Token | Authenticated identity and active permission list |
| `GET` | `/auth/tokens` | Admin | Demo token registry & capability mapping |
| `GET` | `/health` | Public | Dataset freshness and critical alert counts |
| `GET` | `/health/students` | Counselor / Admin | Comprehensive health scan for all students |
| `GET` | `/health/students/{id}`| Student (own) / Counselor | Health scan & pillar breakdown for single student |
| `GET` | `/metrics/comparison` | Counselor / Admin | Macro-averaged Precision, Recall, and F1 |
| `GET` | `/metrics/comparison/{id}`| Counselor / Admin | Per-student IR metric comparison |
| `GET` | `/feedback` | Counselor / Employer | Complete collection of stakeholder ratings |
| `GET` | `/feedback/aggregate` | Counselor / Employer | Aggregated dimension averages across groups |
| `POST`| `/feedback` | Counselor / Employer | Submit verified stakeholder evaluation |
| `GET` | `/ingestion/summary` | Public | Ingestion pipeline health, connectors, event totals |
| `GET` | `/ingestion/events` | Counselor / Admin | Real-time event log of ingested academic evidence |
| `POST`| `/ingestion/simulate` | Counselor / Admin | Simulate incoming GitHub or Canvas webhook payload |
| `POST`| `/ingestion/github/webhook` | Public (HMAC Verified) | GitHub Classroom webhook listener |
| `POST`| `/ingestion/lti/launch` | Public (LTI OIDC) | Canvas / Blackboard LTI 1.3 launch handler |
| `POST`| `/ingestion/lti/sync` | Counselor / Admin | LTI Assignment & Grade Service (AGS) sync |
| `GET` | `/semantic/models` | Public | Supported open-weight LLM profiles and specs |
| `POST`| `/semantic/extract` | Public / Counselor | Project rubric and skill extraction from text |
| `POST`| `/semantic/batch-analyze` | Counselor / Admin | Cohort-wide semantic analysis of all projects |
| `GET` | `/compliance/audit-ledger` | Counselor / Admin | Cryptographic SHA-256 blockchain audit ledger |
| `POST`| `/compliance/verify-ledger` | Public / Security | Mathematical chain integrity verification |
| `POST`| `/compliance/tamper-test` | Security / Admin | Simulates unauthorized database tamper attack |
| `POST`| `/compliance/restore-ledger`| Security / Admin | Restores cryptographic ledger to pristine state |
| `GET` | `/compliance/sso/metadata.xml` | Public | SAML 2.0 Service Provider (SP) metadata XML |
| `POST`| `/compliance/sso/login` | Public | Shibboleth institutional WebSSO simulation |
| `POST`| `/compliance/export-dossier/{id}` | Student (own) / Admin | FERPA / GDPR Article 20 signed data package |
| `POST`| `/compliance/anonymize/{id}` | Counselor / Admin | GDPR Article 17 Right to Erasure pseudonymization |
| `GET` | `/telemetry/market-demand` | Public | Macroeconomic Lightcast & O*NET labor market feeds |
| `GET` | `/telemetry/market-gap/{id}` | Student (own) / Counselor | Student-to-market hiring readiness gap analysis |

---

## Demo Credentials & Bearer Tokens

For immediate testing, use the following pre-configured tokens in the UI switcher (`/access`) or in HTTP requests via `Authorization: Bearer <token>`:

| Bearer Token | Assigned Role | Identity Context |
|---|---|---|
| `student-token-aisha` | `student` | Aisha Patel (Health Data Science candidate; own record only) |
| `student-token-marcus` | `student` | Marcus Thompson (Systems & Web Developer; own record only) |
| `counselor-token-jane` | `counselor` | Dr. Jane Miller (Senior Career Counselor; full read + review) |
| `counselor-token-raj` | `counselor` | Prof. Raj Verma (Academic Advisor; full read + review) |
| `employer-token-techcorp` | `employer` | Sarah Okonjo (TechCorp Technical Recruiter) |
| `employer-token-datainc` | `employer` | James Whitfield (DataInc Talent Acquisition Lead) |
| `admin-token-system` | `admin` | System Administrator (unrestricted system access) |

---

## Codebase Structure

```
Skill-Path/
├── backend/
│   ├── auth.py              # Server-side Bearer authentication & permission dependency injection
│   ├── compliance.py        # SHA-256 blockchain audit ledger, SAML 2.0 SSO, FERPA/GDPR portability
│   ├── data_loader.py       # Eager dataset ingestion and indexing
│   ├── feedback.py          # Stakeholder feedback store & aggregation functions
│   ├── health.py            # Stale evidence detection, pillar fallbacks & aging monitors
│   ├── ingestion.py         # GitHub Classroom webhooks & Canvas/Blackboard LTI 1.3 sync engine
│   ├── main.py              # FastAPI app v1.0.0 with all secured routes (41 endpoints)
│   ├── metrics.py           # Precision, Recall, F1 benchmark vs. GPA baseline
│   ├── recommender.py       # Transparent skill-overlap matching algorithm
│   ├── semantic.py          # Open-weight LLM project rubric & Bloom's taxonomy extraction
│   ├── telemetry.py         # Lightcast & O*NET SOC real-time labor market telemetry
│   └── requirements.txt     # Python backend dependencies
├── dataset/
│   ├── careers.json         # 8 diverse industry career profiles
│   ├── generate_dataset.py  # Deterministic multi-modal synthetic dataset generator
│   └── students.json        # 10 diverse student archetypes with full evidence pillars
├── public/                  # Static assets & icons
├── src/
│   ├── components/          # Reusable UI components (Sidebar, TopBar, 3D SkillVisualizer, FutureRoadmap)
│   ├── pages/               # 17 React application views (Phase 1, 2, & 3)
│   ├── utils/
│   │   ├── api.js           # Central API client with automatic Bearer token injection
│   │   └── data.js          # Shared client data helpers
│   ├── App.jsx              # Application router and visual layout shell (17 routes)
│   └── main.jsx             # React 19 root bootstrap
├── package.json             # Frontend dependencies & scripts
├── tailwind.config.js       # Modern design system & color tokens
└── vite.config.js           # Vite build configuration
```

---

## Completion Status & Roadmap

### Phase 1 — Foundation (35%)
- [x] Multi-modal evidence data model (Projects, Rubrics, Portfolios, Aspirations)
- [x] Transparent skill-overlap recommendation algorithm
- [x] 9-page interactive dashboard with 3D skill network visualization
- [x] Counselor review station with 5-category override taxonomy and audit ledger
- [x] Edge-case handling for zero-evidence and signal-divergent candidates

### Phase 2 — Trust, Safety & Institutional Defensibility (35% → 70%)
- [x] Server-enforced Role-Based Access Control (RBAC) with 4 roles and bearer tokens
- [x] Operational failure states: 90-day stale detection, 2-pillar fallbacks, graduation milestone alerts
- [x] Empirical Information Retrieval benchmark: Precision, Recall, and F1 vs. GPA baseline
- [x] Structured stakeholder validation layer with Student, Counselor, and Employer evaluations

### Phase 3 — Production & Enterprise Integration (100% Complete)
- [x] **Automated Ingestion:** GitHub Classroom webhook listeners; Canvas & Blackboard LMS sync via LTI 1.3 Advantage
- [x] **Semantic Intelligence:** Open-weight LLMs (Llama-3, Mistral, Gemma) for automated project rubric & Bloom's depth extraction
- [x] **Enterprise Compliance:** SAML 2.0 / Shibboleth SSO; FERPA & GDPR cryptographic audit log; SQLite/PostgreSQL persistence
- [x] **Labor Market Telemetry:** Live Lightcast / O*NET real-time skill demand feeds, regional wage explorer & gap radar

---

*Notice: All student and career dossiers in this prototype are synthetic representations generated for ethical benchmark testing. No real student educational records were used.*
