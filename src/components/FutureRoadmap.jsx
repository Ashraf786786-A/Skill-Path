import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  GitBranch,
  BrainCircuit,
  Lock,
  Network,
  TrendingUp,
} from 'lucide-react';

const CURRENT_35_FEATURES = [
  'Evidence-based data model (Projects + Rubrics + Portfolios + Interests)',
  'FastAPI backend with transparent mathematical skill-overlap engine',
  'Interactive Three.js 3D Skill Constellation with hover-linked edges',
  'Human-in-the-loop counselor audit desk with 5 validated override reasons',
  'Stakeholder Trade-off Simulator (Student Agency vs Evidence Confidence)',
  'Zero surveillance guarantee (no webcam tracking, no keystroke logging)',
  'Safety-critical edge case handling (Zero evidence, Ambition gaps, Cross-domain)',
];

const FUTURE_65_ROADMAP = [
  {
    phase: 'Phase 2 (Next 20%)',
    title: 'Automated LMS & Git Webhook Ingestion',
    icon: GitBranch,
    timeline: 'Q3 2026',
    items: [
      'GitHub Classroom & GitLab CI/CD direct webhook parsing',
      'Canvas & Blackboard LMS rubric evaluation import via LTI 1.3',
      'Automated pull request code quality & commit frequency extraction',
    ],
  },
  {
    phase: 'Phase 3 (Next 20%)',
    title: 'Semantic Rubric & Evidence Intelligence',
    icon: BrainCircuit,
    timeline: 'Q4 2026',
    items: [
      'Local open-weight LLM for semantic rubric-to-skill alignment',
      'Deep semantic code architecture analysis without grading bias',
      'Continuous student gap-filling project recommendation generator',
    ],
  },
  {
    phase: 'Phase 4 (Next 15%)',
    title: 'Institutional SSO, FERPA & Enterprise Compliance',
    icon: Lock,
    timeline: 'Q1 2027',
    items: [
      'SAML 2.0 / Shibboleth university identity provider federation',
      'Role-based access control (Student, Advisor, Department Dean, Registrar)',
      'Strict FERPA & GDPR cryptographic audit log immutability',
    ],
  },
  {
    phase: 'Phase 5 (Next 10%)',
    title: 'Live Labor Market & Alumni Outcome Tracking',
    icon: Network,
    timeline: 'Q2 2027',
    items: [
      'Live job market ontology synchronization (Lightcast & O*NET APIs)',
      'Employer ATS direct pipeline for verified student evidence portfolios',
      'Longitudinal alumni 1-year, 3-year, and 5-year career impact tracking',
    ],
  },
];

export default function FutureRoadmap() {
  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border-brand-500/30 space-y-8 bg-gradient-to-b from-surface-900/90 to-surface-950/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Product Architecture Scope</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-white">
            Current Build (~35%) vs Future Roadmap (~65%)
          </h3>
          <p className="text-xs text-surface-400 mt-1">
            SkillPath prototype represents the core evidence architecture. Future milestones scale to institutional automation.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-xl bg-accent-emerald/15 text-emerald-300 border border-accent-emerald/30 font-bold">
            35% Operational
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30">
            65% Future Scope
          </span>
        </div>
      </div>

      {/* Currently Built (~35%) Highlights */}
      <div className="p-5 rounded-2xl bg-surface-900/80 border border-surface-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-accent-emerald">
          <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
          <span>Currently Built & Verified (~35% Scope)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans text-surface-300">
          {CURRENT_35_FEATURES.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-accent-emerald font-bold">✓</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Remaining 65% Roadmap Grid */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold block">
          Remaining 65% Implementation Milestones:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FUTURE_65_ROADMAP.map((mile, idx) => {
            const Icon = mile.icon;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface-900/60 border border-surface-800/90 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
                      {mile.phase}
                    </span>
                    <span className="text-[11px] font-mono text-surface-500">
                      {mile.timeline}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-display font-bold text-white mb-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{mile.title}</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-surface-300 font-sans">
                    {mile.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-surface-500 text-xs">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
