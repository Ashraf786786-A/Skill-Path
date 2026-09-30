import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  GitBranch,
  BrainCircuit,
  Lock,
  Network,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const PHASE_ACCOMPLISHMENTS = [
  {
    phase: 'Phase 1: Foundation (35%)',
    badge: '100% Complete',
    color: 'emerald',
    icon: CheckCircle2,
    items: [
      'Multi-modal evidence data model (Projects, Rubrics, Portfolios, Aspirations)',
      'Transparent mathematical skill-overlap algorithm (FastAPI backend)',
      '13-view interactive React 19 dashboard with 3D Three.js constellation',
      'Counselor review desk with 5-category override taxonomy and audit ledger',
      'Zero-surveillance ethical guarantee with edge-case handling',
    ],
  },
  {
    phase: 'Phase 2: Trust & Safety (35%)',
    badge: '100% Complete',
    color: 'purple',
    icon: ShieldCheck,
    items: [
      'Server-enforced Role-Based Access Control (RBAC) with 4 roles & Bearer tokens',
      'Operational failure detection: 90-day stale alarms & 2-pillar fallbacks',
      'Empirical Information Retrieval benchmark: Precision, Recall, and F1 vs. GPA',
      'Multi-stakeholder validation layer with Student, Counselor, and Employer ratings',
      'Academic aging monitors for Year 3/4 graduation milestones',
    ],
  },
  {
    phase: 'Phase 3: Enterprise Integration (30%)',
    badge: '100% Complete',
    color: 'cyan',
    icon: Zap,
    items: [
      'Automated Ingestion: GitHub Classroom HMAC webhooks & Canvas/Blackboard LTI 1.3',
      'Semantic Intelligence: Open-weight LLM project rubric extraction (Llama-3, Mistral, Gemma)',
      'Enterprise Compliance: SHA-256 blockchain audit ledger, SAML 2.0 / Shibboleth SSO',
      'Labor Market Telemetry: Live Lightcast & O*NET real-time skill demand feeds',
      'FERPA & GDPR Article 17/20 data portability & cryptographic pseudonymization',
    ],
    links: [
      { to: '/ingestion', label: 'Ingestion Engine' },
      { to: '/semantic', label: 'Semantic Rubric' },
      { to: '/compliance', label: 'Compliance & Audit' },
      { to: '/telemetry', label: 'Market Telemetry' },
    ],
  },
];

export default function FutureRoadmap() {
  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border-emerald-500/30 space-y-8 bg-gradient-to-b from-surface-900/90 to-surface-950/95">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Product Architecture Scope</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-white">
            100% Phase 1, 2 & 3 Completed — Production Ready
          </h3>
          <p className="text-xs text-surface-400 mt-1">
            SkillPath has delivered all foundational, defensibility, and enterprise integration milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-lg shadow-emerald-500/20">
            100% Enterprise Verified
          </span>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PHASE_ACCOMPLISHMENTS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-900/70 border border-white/[0.08] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
                    {p.phase}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {p.badge}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-surface-300 font-sans mt-3">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {p.links && (
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
                  {p.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      to={link.to}
                      className="px-2.5 py-1 rounded-lg bg-surface-800 hover:bg-surface-700 text-[11px] text-accent-cyan font-medium flex items-center gap-1 border border-white/5 transition-colors"
                    >
                      {link.label} <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
