import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

const FAILURE_CASES = [
  {
    id: 's007',
    studentName: 'Fatima Al-Sayed',
    type: 'no_evidence',
    label: 'Zero Evidence Baseline',
    scenario: 'Student in Year 1 with no submitted capstone projects, zero rubrics, and only vague general interests.',
    naiveAIFailure: 'A black-box LLM or collaborative filtering model hallucinates confident career matches based on demographics or random keyword extrapolation.',
    skillPathHandling: 'SkillPath refuses to make confident predictions. It explicitly flags "Zero Evidence Available", lowers confidence to baseline, and recommends exploratory introductory coursework.',
    counselorAction: 'Schedule an intake diagnostic session to help the student identify a foundational project to build.',
  },
  {
    id: 's008',
    studentName: 'Jack Campbell',
    type: 'high_interest_low_evidence',
    label: 'High Ambition / Low Evidence Gap',
    scenario: 'Student expresses strong ambition for Machine Learning & AI, but submitted evidence consists solely of basic Python scripting and introductory web design.',
    naiveAIFailure: 'Model either tells the student they are already 95% ready for an ML Engineer job (setting them up for rejection), or completely ignores their stated interest.',
    skillPathHandling: 'SkillPath acknowledges the ambition respectfully, scores ML readiness accurately at 33%, and generates concrete milestone gaps: "Build PyTorch model, complete statistics rubric".',
    counselorAction: 'Structure a bridge curriculum: connect student with advanced math tutor and recommend open-source ML project.',
  },
  {
    id: 's009',
    studentName: 'Zoe Tremblay',
    type: 'conflicting_evidence',
    label: 'Cross-Domain Signal Divergence',
    scenario: 'Student demonstrates high UI/UX design competency (95/100 Figma) alongside backend Systems Programming projects (C++/Rust code repo).',
    naiveAIFailure: 'Averaging algorithms produce a muddy, confused intermediate recommendation (e.g. generic IT support) that fails to leverage either strength.',
    skillPathHandling: 'SkillPath preserves dual distinct pathways (UX Designer at 85% AND Software Developer at 78%) and flags the divergence for human counselor exploration.',
    counselorAction: 'Counselor explores hybrid roles (e.g. Creative Technologist or Design Systems Engineer) that unite both strengths.',
  },
];

export default function FailureCasePanel() {
  const [selectedCase, setSelectedCase] = useState(FAILURE_CASES[1]); // s008 by default

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border-amber-500/30 space-y-6 bg-gradient-to-b from-surface-900/90 to-surface-950/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-xl text-white">
                Safety-Critical Failure Cases
              </h3>
              <span className="badge-amber text-[10px] font-mono">
                Institutional Safety
              </span>
            </div>
            <p className="text-xs text-surface-400 mt-0.5">
              How SkillPath prevents silent algorithmic failure and guides counselor intervention.
            </p>
          </div>
        </div>

        {/* Case selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {FAILURE_CASES.map((fc) => (
            <button
              key={fc.id}
              onClick={() => setSelectedCase(fc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                selectedCase.id === fc.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-surface-400 hover:text-white bg-surface-900/60 border border-surface-800'
              }`}
            >
              {fc.id}: {fc.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Focus detail for selected failure case */}
      <motion.div
        key={selectedCase.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6 pt-2"
      >
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-900/80 border border-surface-800 flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              Target Student Profile:
            </span>
            <div className="text-sm font-bold font-mono text-white">
              {selectedCase.studentName} ({selectedCase.id}) • {selectedCase.label}
            </div>
          </div>

          <Link
            to={`/students/${selectedCase.id}`}
            className="btn-ghost text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-mono"
          >
            <span>View Full Student Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scenario description */}
        <div className="text-xs text-surface-300 font-sans leading-relaxed">
          <strong className="text-white font-mono uppercase text-[11px] block mb-1">
            Real-World Scenario:
          </strong>
          {selectedCase.scenario}
        </div>

        {/* Contrast Grid: Naive AI vs SkillPath Handling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>How Naive Black-Box AI Fails</span>
            </div>
            <p className="text-xs text-surface-300 leading-relaxed font-sans">
              {selectedCase.naiveAIFailure}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              <span>How SkillPath Safely Intervenes</span>
            </div>
            <p className="text-xs text-surface-300 leading-relaxed font-sans">
              {selectedCase.skillPathHandling}
            </p>
          </div>
        </div>

        {/* Recommended Counselor Action */}
        <div className="p-4 rounded-2xl bg-surface-900/60 border border-surface-800 text-xs font-mono text-surface-300 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">
              Prescribed Human Counselor Action:
            </strong>
            <span>{selectedCase.counselorAction}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
