import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Layers,
  FolderGit2,
  Award,
  ExternalLink,
  Target,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import EthicsBanner from '../components/EthicsBanner.jsx';

const EVIDENCE_PILLARS = [
  {
    id: 'projects',
    title: 'Capstone Projects',
    badge: 'Artifact Deliverable',
    color: 'emerald',
    icon: FolderGit2,
    summary: 'Tangible code repositories, deployed software applications, and documented engineering deliverables.',
    whyItMatters: 'Demonstrates end-to-end execution ability, version control discipline, architecture design, and real problem-solving beyond academic theory.',
    verificationMethod: 'Public Git commit histories, deployment endpoints (Vercel/AWS), unit test coverage, and code review logs.',
    example: 'Built NHS Patient Readmission Predictor using Python, Scikit-learn, and SQLite with 85% holdout accuracy.',
  },
  {
    id: 'competencies',
    title: 'Assessed Competencies',
    badge: 'Criterion Rubric',
    color: 'brand',
    icon: Award,
    summary: 'Multi-evaluator ratings evaluated against standardized criterion-referenced rubrics (0–100 scale).',
    whyItMatters: 'Evaluates soft and foundational skills — such as Analytical Thinking, Systems Design, Collaboration, and Technical Writing — that exams miss.',
    verificationMethod: 'Evaluated by faculty, peer project teammates, and industry mentors across semester milestones.',
    example: 'Analytical Thinking rubric: 92/100, Problem Solving: 88/100, Technical Communication: 75/100.',
  },
  {
    id: 'portfolios',
    title: 'Curated Portfolios',
    badge: 'Verified Case Study',
    color: 'purple',
    icon: ExternalLink,
    summary: 'Deep-dive case studies, UX design interactive prototypes, technical articles, and research publications.',
    whyItMatters: 'Reveals the narrative thought process, iterative user testing, design rationale, and communication fidelity of the student.',
    verificationMethod: 'Figma interactive prototypes, Medium technical writeups, live Kaggle notebooks, and published preprint links.',
    example: 'Interactive design prototype for accessible public transit kiosk tested with 12 diverse users.',
  },
  {
    id: 'interests',
    title: 'Declared Ambitions',
    badge: 'Student Agency',
    color: 'amber',
    icon: Target,
    summary: 'Explicit, self-declared student career directions, passions, and industry domains of interest.',
    whyItMatters: 'Preserves student autonomy and motivation. Recommendations must inspire rather than merely pigeonhole students based on past work.',
    verificationMethod: 'Periodic student reflection surveys, career preference prompts, and elective coursework selections.',
    example: 'Passionate about Healthcare Analytics, Ethical AI Governance, and Bio-informatics.',
  },
];

const COMPARISON_ROWS = [
  {
    dimension: 'Primary Signal',
    traditional: 'Aggregated GPA / Exam percentages (e.g. 3.4 / 100%)',
    evidence: 'Verifiable artifacts, Git repos, rubrics & case studies',
    verdict: 'Deep nuance vs single lossy number',
  },
  {
    dimension: 'Explainability',
    traditional: 'Black-box grade with zero insight into specific strengths',
    evidence: '100% transparent skill overlap showing exact evidence items',
    verdict: 'Clear audit trail for counselors and employers',
  },
  {
    dimension: 'Student Agency',
    traditional: 'Passive testing; student has no input into how they are evaluated',
    evidence: 'Declared ambitions actively steer career matching weights',
    verdict: 'Autonomous exploration vs algorithmic sorting',
  },
  {
    dimension: 'Workplace Readiness',
    traditional: 'Reflects test memorization; ignores Git, team rubrics, and communication',
    evidence: 'Directly mirrors real engineering, product design, and analytical workflows',
    verdict: 'Proven execution vs theoretical recall',
  },
  {
    dimension: 'Surveillance Risk',
    traditional: 'Often relies on intrusive proctoring (webcam gaze, keystroke timing)',
    evidence: 'Zero surveillance: strictly evaluates submitted work artifacts',
    verdict: 'Dignity-first privacy protection',
  },
];

export default function Evidence() {
  const [selectedPillar, setSelectedPillar] = useState(EVIDENCE_PILLARS[0]);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-12 pb-16">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Foundational Paradigm</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            The 4 Pillars of Demonstrated Evidence
          </h1>
          <p className="section-subtitle">
            Why SkillPath rejects arbitrary GPA percentiles in favor of authentic, verifiable student artifacts.
          </p>
        </div>

        {/* 4 Pillars Interactive Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EVIDENCE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = selectedPillar.id === pillar.id;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar)}
                  className={`text-left p-5 rounded-2xl transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'glass-card border-brand-400/60 bg-surface-900/90 shadow-lg shadow-brand-500/10'
                      : 'glass-card-hover border-surface-800 bg-surface-950/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-surface-900 border border-surface-700 text-white">
                        <Icon className="w-5 h-5 text-brand-400" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-900 border border-surface-800 text-surface-400">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-surface-400 mt-1.5 line-clamp-2">
                      {pillar.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-surface-800/80 text-[11px] font-mono text-brand-400 flex items-center gap-1">
                    <span>{isSelected ? 'Currently Inspecting' : 'Click to inspect'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Deep Focus Detail for Selected Pillar */}
          <motion.div
            key={selectedPillar.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 md:p-8 rounded-3xl border-brand-500/30 space-y-6 bg-gradient-to-b from-surface-900/90 to-surface-950/95"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-brand-400">
                  Modality Deep-Dive
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1">
                  {selectedPillar.title}
                </h2>
                <p className="text-sm text-surface-300 mt-1 max-w-3xl leading-relaxed">
                  {selectedPillar.summary}
                </p>
              </div>

              <span className="badge-brand text-xs font-mono">
                {selectedPillar.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800 space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-emerald" />
                  <span>Why It Matters</span>
                </span>
                <p className="text-xs text-surface-300 leading-relaxed">
                  {selectedPillar.whyItMatters}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800 space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  <span>Verification Method</span>
                </span>
                <p className="text-xs text-surface-300 leading-relaxed">
                  {selectedPillar.verificationMethod}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800 space-y-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Representative Proof</span>
                </span>
                <p className="text-xs text-surface-300 leading-relaxed italic">
                  "{selectedPillar.example}"
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contrast Table: Traditional GPA vs SkillPath Evidence */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
              Comparative Analysis
            </span>
            <h2 className="section-title">
              Traditional GPA vs Evidence-Based Recommender
            </h2>
            <p className="section-subtitle">
              Why relying on marks alone truncates student potential and misleads career counseling.
            </p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border-surface-700/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-surface-900/80 border-b border-surface-800 text-surface-400 font-mono uppercase tracking-wider">
                    <th className="p-4 w-1/4">Evaluation Dimension</th>
                    <th className="p-4 w-1/3 text-red-400/90">Exam / GPA System</th>
                    <th className="p-4 w-1/3 text-accent-emerald">SkillPath Architecture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/60">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-900/40 transition-colors">
                      <td className="p-4 font-mono font-semibold text-white">
                        {row.dimension}
                      </td>
                      <td className="p-4 text-surface-300 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </td>
                      <td className="p-4 text-surface-200">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                          <span>{row.evidence}</span>
                        </div>
                        <div className="mt-1 ml-6 text-[10px] font-mono text-brand-300">
                          Benefit: {row.verdict}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Ethics & Surveillance Boundary */}
        <section>
          <EthicsBanner mode="full" />
        </section>
      </div>
    </PageTransition>
  );
}
