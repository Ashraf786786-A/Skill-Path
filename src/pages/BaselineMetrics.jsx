import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Target,
  Info,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
         BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

import PageTransition from '../components/PageTransition.jsx';
import { fetchMetricsAll } from '../utils/api.js';

function MetricPill({ label, value, delta }) {
  const isPositive = delta >= 0.01;
  const isNegative = delta <= -0.01;
  return (
    <div className="glass rounded-xl border border-surface-700/40 p-4 text-center">
      <p className="text-xs text-surface-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{(value * 100).toFixed(1)}%</p>
      {delta != null && (
        <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
          isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-surface-400'
        }`}>
          {isPositive ? <TrendingUp size={10} /> : isNegative ? <TrendingDown size={10} /> : <Minus size={10} />}
          {isPositive ? '+' : ''}{(delta * 100).toFixed(1)}% vs marks-only
        </div>
      )}
    </div>
  );
}

function VerdictBadge({ verdict }) {
  const color = verdict?.includes('significantly')
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : verdict?.includes('moderately')
    ? 'text-brand-400 bg-brand-500/10 border-brand-500/30'
    : 'text-surface-300 bg-surface-800 border-surface-700';
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${color}`}>{verdict}</span>
  );
}

function StudentComparisonCard({ result, index }) {
  const [expanded, setExpanded] = useState(false);
  const evF1     = result.evidenceBased.f1;
  const marksF1  = result.marksOnly.f1;
  const delta    = result.improvement.f1Delta;
  const isImproved = delta >= 0;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl border border-surface-700/40 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-surface-800/20 transition-colors">
        <div className="flex-1">
          <p className="font-medium text-white text-sm">{result.studentName}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-surface-400">
              Evidence F1: <span className="text-white font-semibold">{(evF1 * 100).toFixed(0)}%</span>
            </span>
            <span className="text-xs text-surface-400">
              Marks F1: <span className="text-surface-300">{(marksF1 * 100).toFixed(0)}%</span>
            </span>
            <VerdictBadge verdict={result.improvement.verdict} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-sm font-bold ${isImproved ? 'text-emerald-400' : 'text-red-400'}`}>
            {isImproved ? '+' : ''}{(delta * 100).toFixed(0)}%
          </span>
          {expanded ? <ChevronUp size={14} className="text-surface-500" /> : <ChevronDown size={14} className="text-surface-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-surface-700/30 pt-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Marks Only */}
                <div>
                  <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">Marks-Only Recommender</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'Precision', val: result.marksOnly.precision },
                      { label: 'Recall',    val: result.marksOnly.recall },
                      { label: 'F1 Score',  val: result.marksOnly.f1 },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-surface-400">{m.label}</span>
                          <span className="text-surface-300">{(m.val * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-surface-700 rounded-full">
                          <div className="h-full bg-surface-500 rounded-full" style={{ width: `${m.val * 100}%` }} />
                        </div>
                      </div>
                    ))}
                    <p className="text-surface-500 pt-1">{result.marksOnly.method}</p>
                  </div>
                </div>

                {/* Evidence Based */}
                <div>
                  <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-3">Evidence-Based (SkillPath)</p>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'Precision', val: result.evidenceBased.precision, delta: result.improvement.precisionDelta },
                      { label: 'Recall',    val: result.evidenceBased.recall,    delta: result.improvement.recallDelta },
                      { label: 'F1 Score',  val: result.evidenceBased.f1,        delta: result.improvement.f1Delta },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-surface-400">{m.label}</span>
                          <span className="text-white font-medium">{(m.val * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-surface-700 rounded-full">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${m.val * 100}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full" />
                        </div>
                      </div>
                    ))}
                    <p className="text-surface-500 pt-1">{result.evidenceBased.method}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-700/30 text-xs text-surface-400">
                <span className="font-medium text-surface-300">Ground truth: </span>
                {result.groundTruth.length > 0
                  ? `${result.groundTruth.length} career(s) classified as relevant (${result.groundTruth.join(', ')})`
                  : 'No careers classified as relevant for this student profile'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl border border-surface-700 p-3 text-xs">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-surface-300">{p.name}:</span>
          <span className="text-white font-medium">{(p.value * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function BaselineMetrics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    fetchMetricsAll()
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="glass rounded-xl border border-red-500/30 p-6 text-red-300 text-sm">
          Failed to load metrics: {error}
        </div>
      </PageTransition>
    );
  }

  const agg = data?.aggregate?.macroAverage;
  const perStudent = data?.perStudent || [];

  // Chart data
  const barData = perStudent.map(r => ({
    name: r.studentName.split(' ')[0],
    'Marks F1':    r.marksOnly.f1,
    'Evidence F1': r.evidenceBased.f1,
  }));

  const radarData = [
    { metric: 'Precision', marks: agg?.marksOnly.precision || 0, evidence: agg?.evidenceBased.precision || 0 },
    { metric: 'Recall',    marks: agg?.marksOnly.recall    || 0, evidence: agg?.evidenceBased.recall    || 0 },
    { metric: 'F1 Score',  marks: agg?.marksOnly.f1        || 0, evidence: agg?.evidenceBased.f1        || 0 },
  ];

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <BarChart2 size={20} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Baseline Comparison Metrics</h1>
          </div>
          <p className="text-surface-400 text-sm max-w-xl">
            Precision / Recall / F1 comparison — marks-only legacy recommender vs
            SkillPath evidence-based system. Ground truth derived from student interests,
            skill overlap ≥ 40%, and high competency scores.
          </p>
        </div>

        {/* Aggregate Metrics Row */}
        {agg && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-brand-400" />
              <h2 className="font-semibold text-white">Macro-Averaged Metrics ({perStudent.length} students)</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <MetricPill label="Precision (Evidence)" value={agg.evidenceBased.precision}
                delta={agg.improvement.precisionDelta} />
              <MetricPill label="Recall (Evidence)"    value={agg.evidenceBased.recall}
                delta={agg.improvement.recallDelta} />
              <MetricPill label="F1 Score (Evidence)"  value={agg.evidenceBased.f1}
                delta={agg.improvement.f1Delta} />
            </div>
            <div className="glass rounded-xl border border-surface-700/40 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Info size={12} className="text-surface-400" />
                <p className="text-xs text-surface-400">Marks-Only Baseline</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                {[
                  { label: 'Precision', val: agg.marksOnly.precision },
                  { label: 'Recall',    val: agg.marksOnly.recall },
                  { label: 'F1 Score',  val: agg.marksOnly.f1 },
                ].map(m => (
                  <div key={m.label}>
                    <span className="text-surface-400">{m.label}: </span>
                    <span className="text-surface-300 font-semibold">{(m.val * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="glass rounded-2xl border border-surface-700/40 p-5">
            <h3 className="font-medium text-white text-sm mb-4">F1 Score — Per Student</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[0,1]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
                <Bar dataKey="Marks F1" fill="#4B5563" radius={[3,3,0,0]} />
                <Bar dataKey="Evidence F1" fill="#6366f1" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar chart */}
          <div className="glass rounded-2xl border border-surface-700/40 p-5">
            <h3 className="font-medium text-white text-sm mb-4">Quality Profile — Aggregate</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Radar name="Marks-Only" dataKey="marks" stroke="#4B5563" fill="#4B5563" fillOpacity={0.3} />
                <Radar name="Evidence-Based" dataKey="evidence" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#9CA3AF' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-Student Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-brand-400" />
            <h2 className="font-semibold text-white">Per-Student Breakdown</h2>
          </div>
          <div className="space-y-3">
            {perStudent
              .sort((a, b) => b.improvement.f1Delta - a.improvement.f1Delta)
              .map((r, i) => <StudentComparisonCard key={r.studentId} result={r} index={i} />)}
          </div>
        </div>

        {/* Methodology */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="glass rounded-xl border border-surface-700/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info size={14} className="text-brand-400" />
            <h3 className="text-sm font-medium text-white">Methodology</h3>
          </div>
          <p className="text-xs text-surface-400 leading-relaxed">{data?.methodology}</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-surface-400">
            <div>
              <p className="text-surface-300 font-medium mb-1">Precision</p>
              <p>|recommended ∩ relevant| / |recommended| — of what we recommend, how much is right?</p>
            </div>
            <div>
              <p className="text-surface-300 font-medium mb-1">Recall</p>
              <p>|recommended ∩ relevant| / |relevant| — of what's right, how much do we find?</p>
            </div>
            <div>
              <p className="text-surface-300 font-medium mb-1">F1 Score</p>
              <p>Harmonic mean of P × R. Penalises systems that sacrifice one for the other.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
