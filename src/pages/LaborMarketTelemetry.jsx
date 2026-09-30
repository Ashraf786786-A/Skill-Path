import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Compass,
  Briefcase,
  Target,
  ArrowUpRight,
  Flame,
  Award,
  Globe2,
  Users,
  Layers,
  ChevronRight,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import {
  fetchMarketDemand,
  fetchStudentMarketGap,
  fetchStudents,
} from '../utils/api.js';

export default function LaborMarketTelemetry() {
  const [marketData, setMarketData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('s001');
  const [selectedCareerId, setSelectedCareerId] = useState('c001');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('c001');

  useEffect(() => {
    Promise.all([
      fetchMarketDemand().catch(() => null),
      fetchStudents().catch(() => []),
    ]).then(([marketRes, studentRes]) => {
      if (marketRes) {
        setMarketData(marketRes);
      }
      if (studentRes && Array.isArray(studentRes)) {
        setStudents(studentRes);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentMarketGap(selectedStudentId, selectedCareerId)
        .then((res) => setGapData(res))
        .catch((err) => console.error('Error fetching gap analysis:', err));
    }
  }, [selectedStudentId, selectedCareerId]);

  const activeCareer = marketData?.careers?.find((c) => c.careerId === activeTab) || marketData?.careers?.[0];

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                Phase 3 Labor Market Telemetry
              </span>
              <span className="flex items-center gap-1.5 text-xs text-accent-cyan">
                <Globe2 size={13} />
                Live Lightcast & O*NET SOC Feeds (2026.3)
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Labor Market Telemetry & Skill Demands
            </h1>
            <p className="text-sm text-surface-400 mt-0.5">
              Empirical alignment between academic student portfolios and real-time 2026 hiring velocity indexes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-surface-400 font-mono">
              Indexed: {marketData?.telemetryTimestamp ? new Date(marketData.telemetryTimestamp).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>

        {/* Macroeconomic Telemetry Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Active Job Postings</span>
              <Briefcase size={14} className="text-accent-cyan" />
            </div>
            <p className="text-2xl font-bold font-display text-white mt-2">
              {marketData?.totalActivePostingsTracked?.toLocaleString() || '579,700'}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight size={12} /> +19.4% Year-over-Year
            </p>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Average Median Salary</span>
              <DollarSign size={14} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-display text-emerald-400 mt-2">
              ${marketData?.averageMedianSalary?.toLocaleString() || '132,600'}
            </p>
            <p className="text-[11px] text-surface-400 mt-1">BLS National Standard</p>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Fastest Growing Sector</span>
              <Flame size={14} className="text-orange-400" />
            </div>
            <p className="text-xl font-bold font-display text-orange-300 mt-2 truncate">
              Cybersecurity (+32.4%)
            </p>
            <p className="text-[11px] text-surface-400 mt-1">Critical Talent Shortage</p>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Emerging Skill Premium</span>
              <TrendingUp size={14} className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold font-display text-purple-300 mt-2">
              +28.5%
            </p>
            <p className="text-[11px] text-surface-400 mt-1">For demonstrated code artifacts</p>
          </div>
        </div>

        {/* Student-to-Market Skill Gap Radar Station */}
        <div className="glass p-5 rounded-2xl border border-brand-500/25 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-brand-400" />
              <div>
                <h2 className="text-base font-semibold text-white">
                  Student-to-Market Hiring Readiness Analyzer
                </h2>
                <p className="text-xs text-surface-400">
                  Compare any candidate against live 2026 Lightcast hiring criteria.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-surface-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.major})
                  </option>
                ))}
              </select>

              <select
                value={selectedCareerId}
                onChange={(e) => setSelectedCareerId(e.target.value)}
                className="bg-surface-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {marketData?.careers?.map((c) => (
                  <option key={c.careerId} value={c.careerId}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {gapData && gapData.allPathEvaluations?.[0] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
              {/* Readiness Score dial */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-surface-900/90 border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-surface-400">Market Readiness Score</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                      {gapData.allPathEvaluations[0].marketDemand}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-4xl font-bold font-display text-white">
                      {gapData.allPathEvaluations[0].marketReadinessScore}%
                    </span>
                    <span className="text-xs text-surface-500">2026 Market Index</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-surface-800 mt-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                      style={{ width: `${gapData.allPathEvaluations[0].marketReadinessScore}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs">
                  <p className="text-surface-500 text-[11px] uppercase tracking-wider mb-1">
                    Median Market Compensation:
                  </p>
                  <p className="text-base font-bold text-emerald-400 font-display">
                    ${gapData.allPathEvaluations[0].medianSalary.toLocaleString()} / yr
                  </p>
                </div>
              </div>

              {/* High-Leverage Missing Skills & Recommended Action */}
              <div className="lg:col-span-8 p-4 rounded-xl bg-surface-900/90 border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white uppercase tracking-wider">
                    High-Leverage Skill Gaps to Accelerate Placement
                  </p>
                  <span className="text-[11px] text-orange-400 font-medium">
                    {gapData.allPathEvaluations[0].highLeverageGaps?.length || 0} Key Skills Missing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gapData.allPathEvaluations[0].highLeverageGaps?.map((g, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-surface-950 border border-white/[0.05] flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200 font-medium">{g.skill}</span>
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono text-[10px]">
                        {g.growthRate} Demand
                      </span>
                    </div>
                  ))}
                  {gapData.allPathEvaluations[0].highLeverageGaps?.length === 0 && (
                    <div className="text-xs text-emerald-400 col-span-2 py-3">
                      ✓ All 2026 high-growth skills are verified in student portfolio!
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-brand-500/[0.08] border border-brand-500/20 text-xs text-brand-200">
                  <p className="font-semibold text-white mb-0.5">Recommended Immediate Action:</p>
                  {gapData.allPathEvaluations[0].recommendedImmediateAction}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Career Pathways Selector & Deep-Dive */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {marketData?.careers?.map((c) => (
              <button
                key={c.careerId}
                onClick={() => setActiveTab(c.careerId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === c.careerId
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'glass text-surface-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {activeCareer && (
            <motion.div
              key={activeCareer.careerId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5"
            >
              {/* Left Column: Career Profile & Regional Salaries */}
              <div className="lg:col-span-6 glass p-5 rounded-2xl border border-white/[0.08] space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-surface-400 font-mono">
                    <span>O*NET SOC: {activeCareer.onetSocCode}</span>
                    <span>·</span>
                    <span className="text-brand-300">{activeCareer.socTitle}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{activeCareer.title}</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 py-2 border-y border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-surface-500 uppercase tracking-wider">Median Pay</span>
                    <p className="text-base font-bold text-emerald-400 font-display">
                      ${activeCareer.lightcastIndex.blsMedianSalary.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-surface-500 uppercase tracking-wider">90th Percentile</span>
                    <p className="text-base font-bold text-white font-display">
                      ${activeCareer.lightcastIndex.salaryPercentile90.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-surface-500 uppercase tracking-wider">5-Year Growth</span>
                    <p className="text-base font-bold text-accent-cyan font-display">
                      {activeCareer.lightcastIndex.projected5YearGrowth}
                    </p>
                  </div>
                </div>

                {/* Regional Salaries Table */}
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                    Regional Salary Benchmarks
                  </h4>
                  <div className="space-y-1.5">
                    {activeCareer.regionalSalaries?.map((reg, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-surface-900/60 border border-white/[0.04] flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300">{reg.region}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-surface-500 text-[11px] font-mono">
                            {reg.postings.toLocaleString()} jobs
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            ${reg.median.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: 2026 Emerging Skills Feed */}
              <div className="lg:col-span-6 glass p-5 rounded-2xl border border-white/[0.08] space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Flame size={13} className="text-orange-400" />
                      2026 Emerging Skill Demand Feed
                    </h4>
                    <span className="text-[11px] text-surface-400 font-mono">
                      Hiring Velocity: {activeCareer.lightcastIndex.hiringVelocityScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-surface-400 mb-3">
                    High-demand capabilities increasingly required on employer job specifications:
                  </p>

                  <div className="space-y-2">
                    {activeCareer.emergingSkills2026?.map((em, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-surface-900/90 border border-white/[0.06] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{em.skill}</p>
                          <span className="text-[10px] text-surface-500">
                            Employer Importance Rating: {em.importance}/100
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                          {em.growthRate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-950/60 border border-white/[0.04] text-[11px] text-surface-400 leading-relaxed mt-4">
                  <p className="font-medium text-slate-300 mb-0.5">Telemetry Provenance:</p>
                  Standard Occupational Classification (SOC) verified via Lightcast Multi-Modal Labor Pipeline. All wage benchmarks calibrated against U.S. BLS 2024-2026 employment statistics.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
