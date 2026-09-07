import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  Scale,
  User,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import PageTransition from '../components/PageTransition.jsx';

// 10 students mapped onto Agency (Stated Interest Clarity) vs Evidence Confidence
const QUADRANT_STUDENTS = [
  { id: 's001', name: 'Aisha Patel', agency: 88, confidence: 92, status: 'High Alignment', type: 'standard' },
  { id: 's002', name: 'Marcus Chen', agency: 90, confidence: 88, status: 'High Alignment', type: 'standard' },
  { id: 's003', name: 'Elena Rostova', agency: 85, confidence: 86, status: 'High Alignment', type: 'standard' },
  { id: 's004', name: 'David Kim', agency: 78, confidence: 82, status: 'Strong Evidence', type: 'standard' },
  { id: 's005', name: 'Priya Sharma', agency: 92, confidence: 85, status: 'High Alignment', type: 'standard' },
  { id: 's006', name: 'Liam O’Connor', agency: 80, confidence: 75, status: 'Balanced', type: 'standard' },
  { id: 's007', name: 'Fatima Al-Sayed', agency: 45, confidence: 12, status: 'Zero Evidence', type: 'edge' },
  { id: 's008', name: 'Jack Campbell', agency: 95, confidence: 25, status: 'Aspiration Gap', type: 'edge' },
  { id: 's009', name: 'Zoe Tremblay', agency: 86, confidence: 70, status: 'Conflicting Signals', type: 'edge' },
  { id: 's010', name: 'Tariq Mansoor', agency: 82, confidence: 84, status: 'Strong Evidence', type: 'standard' },
];

const STAKEHOLDER_PERSPECTIVES = [
  {
    id: 'student',
    title: 'Student Perspective',
    icon: GraduationCap,
    color: 'brand',
    corePriority: 'Aspiration, Autonomy & Identity',
    quote: "Don't lock me into a box based solely on what I built in my first term. Let my emerging passions guide what I can become.",
    keyDemands: [
      'Freedom to declare new interests without punishment',
      'Clear, actionable gap analysis on what projects to build next',
      'No surveillance monitoring or dignity-violating proctoring',
    ],
  },
  {
    id: 'counselor',
    title: 'Counselor Perspective',
    icon: User,
    color: 'emerald',
    corePriority: 'Holistic Guidance & Accountability',
    quote: 'Algorithms should never make final determinations on a human life. We need explainable proof and the power to override when context demands.',
    keyDemands: [
      'Full visibility into the exact formula and evidence breakdown',
      'Mandatory audited override workflows to prevent silent algorithm drift',
      'Safe handling of failure cases so struggling students receive intervention',
    ],
  },
  {
    id: 'employer',
    title: 'Employer Perspective',
    icon: Briefcase,
    color: 'purple',
    corePriority: 'Verifiable Execution & Competency',
    quote: 'We cannot hire based on wishful thinking or exam cramming. We need to see code commits, rubrics, and demonstrable team deliverables.',
    keyDemands: [
      'Public Git repositories and deployed capstone builds',
      'Standardized criterion rubrics evaluated across milestones',
      'Direct mapping between university skills and industry job requirements',
    ],
  },
];

export default function StakeholderTradeoff() {
  const [agencyWeight, setAgencyWeight] = useState(40); // 0 to 100
  const evidenceWeight = 100 - agencyWeight;
  const [selectedPerspective, setSelectedPerspective] = useState(
    STAKEHOLDER_PERSPECTIVES[0]
  );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5 text-accent-emerald" />
              <span>Multi-Stakeholder Governance</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Agency vs Evidence Confidence Matrix
            </h1>
            <p className="section-subtitle">
              Analyzing the fundamental tension between student self-directed ambition and verified proof.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-900/60 border border-surface-800 text-xs font-mono text-surface-400">
            <span>Dual-Metric Balancing Engine</span>
          </div>
        </div>

        {/* Dynamic Weight Tuning Slider */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border-surface-700/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Recommendation Weight Simulator
              </h2>
              <p className="text-xs text-surface-400 mt-0.5">
                Simulate how shifting the algorithmic balance influences recommendation bias.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-amber-400">Agency: {agencyWeight}%</span>
              <span className="text-surface-600">|</span>
              <span className="text-accent-emerald">Evidence Proof: {evidenceWeight}%</span>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-2">
            <input
              type="range"
              min="10"
              max="90"
              value={agencyWeight}
              onChange={(e) => setAgencyWeight(Number(e.target.value))}
              className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-400"
            />

            <div className="flex justify-between text-[11px] font-mono text-surface-400 pt-1">
              <span>← High Evidence / Low Agency (Strict Meritocracy)</span>
              <span>Balanced (Default 40/60)</span>
              <span>High Agency / Low Evidence (Pure Aspiration) →</span>
            </div>
          </div>

          {/* Dynamic Impact Summary Callout */}
          <div className="p-4 rounded-2xl bg-surface-900/80 border border-surface-800 text-xs font-mono text-surface-300">
            {agencyWeight > 65 ? (
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Aspiration-Biased Mode:</strong> Students with high ambitions but minimal evidence (like Jack Campbell, s008) receive aspirational recommendations. Risk of missing prerequisite foundations.
                </span>
              </div>
            ) : agencyWeight < 30 ? (
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Strict Evidence Mode:</strong> Recommendations heavily prioritize existing GitHub repos and rubrics. Students are strongly protected from failure, but may feel restricted from exploring new fields.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-brand-300">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-400" />
                <span>
                  <strong>Optimal Synergistic Equilibrium:</strong> Verified deliverables establish prerequisite viability, while declared interests break ties and steer personalized learning trajectories.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2D Quadrant Scatter Plot (Agency vs Evidence Confidence) */}
        <section className="glass-card p-6 md:p-8 rounded-3xl border-surface-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Cohort Quadrant Distribution
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">
                X: Student Agency Score (0–100) • Y: Verified Evidence Confidence (0–100)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-accent-emerald">
                <span className="w-2 h-2 rounded-full bg-accent-emerald" /> Standard
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Handled Edge Case
              </span>
            </div>
          </div>

          <div className="h-[320px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <XAxis
                  type="number"
                  dataKey="agency"
                  name="Student Agency"
                  domain={[0, 100]}
                  unit="%"
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'Student Agency (Ambition Clarity)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="confidence"
                  name="Evidence Confidence"
                  domain={[0, 100]}
                  unit="%"
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: 'Verified Evidence Confidence', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-surface-900 border border-surface-700 p-3 rounded-xl shadow-xl text-xs font-mono space-y-1">
                          <div className="font-bold text-white">{d.name} ({d.id})</div>
                          <div className="text-brand-300">Agency: {d.agency}%</div>
                          <div className="text-emerald-300">Evidence Proof: {d.confidence}%</div>
                          <div className="text-[10px] text-amber-400 mt-1 uppercase">{d.status}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Students" data={QUADRANT_STUDENTS}>
                  {QUADRANT_STUDENTS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === 'edge' ? '#f59e0b' : '#10b981'}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Stakeholder Perspectives Section */}
        <section className="space-y-6">
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              Tri-Stakeholder Ethical Perspectives
            </h3>
            <p className="section-subtitle">
              How different participants experience and evaluate the system's fairness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STAKEHOLDER_PERSPECTIVES.map((persp) => {
              const Icon = persp.icon;
              const isSelected = selectedPerspective.id === persp.id;

              return (
                <button
                  key={persp.id}
                  onClick={() => setSelectedPerspective(persp)}
                  className={`text-left p-6 rounded-3xl transition-all flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'glass-card border-brand-400/60 bg-surface-900/90 shadow-xl shadow-brand-500/10'
                      : 'glass-card-hover border-surface-800 bg-surface-950/60'
                  }`}
                >
                  <div>
                    <div className="p-3 rounded-2xl bg-surface-900 border border-surface-700 text-brand-400 w-fit mb-3">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4 className="font-display font-bold text-lg text-white">
                      {persp.title}
                    </h4>
                    <p className="text-xs font-mono text-brand-400 mt-0.5">
                      Priority: {persp.corePriority}
                    </p>

                    <p className="text-xs text-surface-300 italic mt-3 leading-relaxed">
                      "{persp.quote}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-surface-800/80 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                      Core Demands:
                    </span>
                    <ul className="space-y-1 text-[11px] text-surface-400 font-sans">
                      {persp.keyDemands.map((demand, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-brand-400" />
                          <span>{demand}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
