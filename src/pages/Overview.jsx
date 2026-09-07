import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

import PageTransition from '../components/PageTransition.jsx';
import HeroSection from '../components/HeroSection.jsx';
import SkillNetwork3D from '../components/SkillNetwork3D.jsx';
import EthicsBanner from '../components/EthicsBanner.jsx';
import AnimatedCounter from '../components/AnimatedCounter.jsx';
import FailureCasePanel from '../components/FailureCasePanel.jsx';
import FutureRoadmap from '../components/FutureRoadmap.jsx';
import { fetchStats } from '../utils/api.js';

// Evidence modality distribution data for Recharts
const EVIDENCE_DIST_DATA = [
  { name: 'Projects', count: 24, fill: '#10b981', desc: 'Code repos, builds & deliverables' },
  { name: 'Competencies', count: 32, fill: '#00f0ff', desc: 'Assessed rubrics & peer reviews' },
  { name: 'Portfolios', count: 18, fill: '#8b5cf6', desc: 'Design cases & technical writes' },
  { name: 'Interests', count: 16, fill: '#f59e0b', desc: 'Explicit declared student passions' },
];

// Typical career alignment readiness
const CAREER_ALIGNMENT_DATA = [
  { career: 'Data Analyst', avgMatch: 84 },
  { career: 'Full-Stack Dev', avgMatch: 78 },
  { career: 'UX Designer', avgMatch: 72 },
  { career: 'ML Engineer', avgMatch: 68 },
  { career: 'Cloud Architect', avgMatch: 65 },
  { career: 'Cybersecurity', avgMatch: 62 },
];

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        // Fallback stats if backend offline
        setStats({
          totalStudents: 10,
          totalCareers: 8,
          totalReviews: 2,
          approvedReviews: 1,
          overriddenReviews: 1,
          failureCases: 3,
        });
        setLoading(false);
      });
  }, []);

  return (
    <PageTransition>
      <div className="space-y-10 max-w-7xl mx-auto pb-12">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Interactive 3D Skill Network Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-brand-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Three.js Graph</span>
              </div>
              <h2 className="section-title">Tri-Layer Evidence-to-Career Network</h2>
              <p className="section-subtitle">
                Rotate and inspect how student evidence translates into demonstrated skills and target career pathways.
              </p>
            </div>
            <Link
              to="/skills"
              className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>Explore full taxonomy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <SkillNetwork3D className="h-[480px] w-full" />
        </section>

        {/* 3. System Counters Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Students */}
          <div className="glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-surface-400">
                Total Cohort
              </span>
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">
                <AnimatedCounter target={stats?.totalStudents || 10} />
              </span>
              <span className="text-xs text-surface-400 font-mono">Students</span>
            </div>
            <div className="mt-2 text-xs text-brand-300/80 flex items-center gap-1.5 font-mono">
              <span>Includes 3 edge / failure cases</span>
            </div>
          </div>

          {/* Career Pathways */}
          <div className="glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-surface-400">
                Target Pathways
              </span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">
                <AnimatedCounter target={stats?.totalCareers || 8} />
              </span>
              <span className="text-xs text-surface-400 font-mono">Industry Roles</span>
            </div>
            <div className="mt-2 text-xs text-purple-300/80 flex items-center gap-1.5 font-mono">
              <span>Multi-skill role requirements</span>
            </div>
          </div>

          {/* Evidence Modalities */}
          <div className="glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-emerald/5 rounded-full blur-2xl group-hover:bg-accent-emerald/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-surface-400">
                Evidence Modalities
              </span>
              <div className="p-2.5 rounded-xl bg-accent-emerald/10 text-accent-emerald">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">
                <AnimatedCounter target={4} />
              </span>
              <span className="text-xs text-surface-400 font-mono">Input Pillars</span>
            </div>
            <div className="mt-2 text-xs text-accent-emerald/80 flex items-center gap-1.5 font-mono">
              <span>Projects, Rubrics, Portfolios, Goals</span>
            </div>
          </div>

          {/* Human Review Audits */}
          <div className="glass-card-hover p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-surface-400">
                Human Audits
              </span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white">
                <AnimatedCounter target={stats?.totalReviews || 0} />
              </span>
              <span className="text-xs text-surface-400 font-mono">Decisions Logged</span>
            </div>
            <div className="mt-2 text-xs text-amber-300/80 flex items-center gap-1.5 font-mono">
              <span>Accountable counselor overrides</span>
            </div>
          </div>
        </section>

        {/* 4. Visual Analytics: Evidence Breakdown + Alignment */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evidence Modality Distribution */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-base text-white">
                  Evidence Modality Breakdown
                </h3>
                <p className="text-xs text-surface-400 mt-0.5">
                  Verified artifacts across student cohort
                </p>
              </div>
              <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                90 Total Artifacts
              </span>
            </div>

            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={EVIDENCE_DIST_DATA} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fontSize: 12, fill: '#e2e8f0' }} width={90} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-surface-900 border border-surface-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
                            <span className="text-white font-bold">{data.name}: </span>
                            <span className="text-brand-300">{data.count} items</span>
                            <div className="text-[10px] text-surface-400 mt-1">{data.desc}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {EVIDENCE_DIST_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-800/60 text-xs font-mono text-surface-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                <span>Capstone Projects: 24</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400" />
                <span>Assessed Rubrics: 32</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Portfolio Cases: 18</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Authentic Goals: 16</span>
              </div>
            </div>
          </div>

          {/* Average Role Readiness */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-base text-white">
                  Cohort Career Alignment
                </h3>
                <p className="text-xs text-surface-400 mt-0.5">
                  Mean evidence match score across top career profiles
                </p>
              </div>
              <span className="text-xs font-mono text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-full border border-accent-emerald/20">
                Transparent Formula
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {CAREER_ALIGNMENT_DATA.map((item) => (
                <div key={item.career} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-surface-200">{item.career}</span>
                    <span className="text-brand-300 font-semibold">{item.avgMatch}% Match</span>
                  </div>
                  <div className="h-2 w-full bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-emerald rounded-full transition-all duration-700"
                      style={{ width: `${item.avgMatch}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-surface-400 flex items-center justify-between border-t border-surface-800/60 font-mono">
              <span>Match Calculation: (Matched Skills / Required Skills) × 100</span>
            </div>
          </div>
        </section>

        {/* 5. Failure Case Teaser & Quick Navigation */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Students */}
          <Link
            to="/students"
            className="glass-card-hover p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg group-hover:text-brand-300 transition-colors">
                Student Evidence Profiles
              </h3>
              <p className="text-xs text-surface-400 mt-2 leading-relaxed">
                Inspect 10 student dossiers with deep evidence breakdowns, GitHub repos, competency scores, and portfolio links.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-mono text-brand-400">
              <span>Browse 10 students</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Failure Cases Spotlight */}
          <div className="glass-card p-6 rounded-2xl border-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] to-surface-900/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-white text-lg">
                  Handled Edge Cases
                </h3>
                <span className="badge-amber text-[10px]">3 Cases</span>
              </div>
              <p className="text-xs text-surface-300 mt-2 leading-relaxed">
                System does not fail silently: explicitly models <strong className="text-white">Zero Evidence</strong> (s007), <strong className="text-white">High Interest / Low Evidence</strong> (s008), and <strong className="text-white">Conflicting Signals</strong> (s009).
              </p>
            </div>
            <Link
              to="/students/s008"
              className="mt-6 flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300"
            >
              <span>Inspect s008 failure case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Human Review */}
          <Link
            to="/review"
            className="glass-card-hover p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                Human-in-the-Loop Audit
              </h3>
              <p className="text-xs text-surface-400 mt-2 leading-relaxed">
                Counselor authority interface. Approve or override system recommendations with mandatory rationale logging.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-mono text-purple-400">
              <span>Launch audit desk</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </section>

        {/* 6. Failure Case Deep Analysis */}
        <section>
          <FailureCasePanel />
        </section>

        {/* 7. Future 65% Roadmap */}
        <section>
          <FutureRoadmap />
        </section>

        {/* 8. Ethics & Privacy Banner */}
        <section>
          <EthicsBanner mode="full" />
        </section>
      </div>
    </PageTransition>
  );
}
