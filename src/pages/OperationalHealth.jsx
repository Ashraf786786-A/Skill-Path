import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  User,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import { fetchSystemHealth, fetchAllStudentHealth } from '../utils/api.js';

const SEVERITY_STYLES = {
  critical: 'bg-red-500/10 border-red-500/30 text-red-300',
  high:     'bg-orange-500/10 border-orange-500/30 text-orange-300',
  warning:  'bg-amber-500/10 border-amber-500/30 text-amber-300',
  medium:   'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  review:   'bg-purple-500/10 border-purple-500/30 text-purple-300',
};

const HEALTH_STATUS_STYLES = {
  healthy:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  at_risk:  'text-amber-400 bg-amber-500/10 border-amber-500/25',
  critical: 'text-red-400 bg-red-500/10 border-red-500/25',
};

function AlertCard({ alert }) {
  const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.warning;
  return (
    <div className={`rounded-lg border p-3 text-xs ${style}`}>
      <div className="flex items-start gap-2">
        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold mb-0.5">{alert.label}</p>
          <p className="opacity-80">{alert.message}</p>
          {alert.action && (
            <p className="mt-1.5 opacity-60 italic">→ {alert.action}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentHealthCard({ scan, index }) {
  const [expanded, setExpanded] = useState(scan.overallHealth !== 'healthy');
  const style = HEALTH_STATUS_STYLES[scan.overallHealth] || '';

  const ev = scan.evidenceFallback || {};

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass rounded-xl border border-surface-700/40 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-surface-800/20 transition-colors">
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize ${style}`}>
          {scan.overallHealth.replace('_', ' ')}
        </div>
        <div className="flex-1">
          <p className="font-medium text-white text-sm">{scan.studentName}</p>
          <p className="text-xs text-surface-400">{scan.alertCount} alert{scan.alertCount !== 1 ? 's' : ''} · {ev.evidenceSummary?.projectCount || 0} projects · {ev.evidenceSummary?.skillCount || 0} skills</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {ev.hasSufficientEvidence
            ? <CheckCircle2 size={14} className="text-emerald-400" />
            : <XCircle size={14} className="text-red-400" />}
          <span className="text-surface-400">{ev.safeRecommendationState || 'unknown'}</span>
          {expanded ? <ChevronUp size={14} className="text-surface-500" /> : <ChevronDown size={14} className="text-surface-500" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-surface-700/30 pt-4 space-y-3">
              {/* Evidence pillars */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Projects',      val: ev.evidenceSummary?.projectCount },
                  { label: 'Competencies',  val: ev.evidenceSummary?.competencyCount },
                  { label: 'Portfolio',     val: ev.evidenceSummary?.portfolioCount },
                  { label: 'Skills',        val: ev.evidenceSummary?.skillCount },
                ].map(p => (
                  <div key={p.label} className={`rounded-lg p-2 text-center ${
                    p.val > 0 ? 'bg-surface-800/60' : 'bg-red-500/5 border border-red-500/20'
                  }`}>
                    <p className={`text-lg font-bold ${p.val > 0 ? 'text-white' : 'text-red-400'}`}>{p.val ?? 0}</p>
                    <p className="text-xs text-surface-400">{p.label}</p>
                  </div>
                ))}
              </div>

              {/* Missing pillars */}
              {ev.missingPillars?.length > 0 && (
                <div className="text-xs text-red-300 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                  <p className="font-medium mb-1">Missing Evidence Pillars:</p>
                  <ul className="space-y-0.5">
                    {ev.missingPillars.map(p => <li key={p} className="opacity-80">• {p}</li>)}
                  </ul>
                </div>
              )}

              {/* Alerts */}
              {scan.alerts?.length > 0 && (
                <div className="space-y-2">
                  {scan.alerts.map((a, i) => <AlertCard key={i} alert={a} />)}
                </div>
              )}

              {scan.overallHealth === 'healthy' && (
                <div className="text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> All evidence pillars present. Recommendations enabled.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OperationalHealth() {
  const [system, setSystem]   = useState(null);
  const [scans, setScans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [sys, health] = await Promise.all([fetchSystemHealth(), fetchAllStudentHealth()]);
      setSystem(sys);
      setScans(health.scans || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRefresh = () => { setRefreshing(true); load(); };

  const criticalCount = scans.filter(s => s.overallHealth === 'critical').length;
  const atRiskCount   = scans.filter(s => s.overallHealth === 'at_risk').length;
  const healthyCount  = scans.filter(s => s.overallHealth === 'healthy').length;

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Activity size={20} className="text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Operational Health Monitor</h1>
            </div>
            <p className="text-surface-400 text-sm max-w-xl">
              Stale data detection, missing evidence fallbacks, and aging-transition alerts.
              Phase 2 operational safety layer — prevents silent bad recommendations.
            </p>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-surface-700 text-surface-300 hover:text-white hover:border-surface-500 transition-all disabled:opacity-50">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh Scan
          </button>
        </div>

        {/* System Status Bar */}
        {system && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-surface-700/40 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Database size={16} className="text-brand-400" />
              <h2 className="font-semibold text-white text-sm">Dataset Freshness</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                system.datasetFreshness?.status === 'fresh'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>{system.datasetFreshness?.status || 'unknown'}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-surface-400 text-xs">Data Loaded At</p>
                <p className="text-white font-medium text-xs mt-0.5">
                  {system.datasetFreshness?.dataLoadedAt
                    ? new Date(system.datasetFreshness.dataLoadedAt).toLocaleTimeString()
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-surface-400 text-xs">Age (hours)</p>
                <p className="text-white font-medium">{system.datasetFreshness?.ageHours ?? '—'}</p>
              </div>
              <div>
                <p className="text-surface-400 text-xs">Critical Cases</p>
                <p className="text-red-400 font-bold text-lg">{system.criticalCaseCount ?? 0}</p>
              </div>
              <div>
                <p className="text-surface-400 text-xs">Note</p>
                <p className="text-surface-300 text-xs mt-0.5">{system.datasetFreshness?.note}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Tiles */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Critical', count: criticalCount, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/25', icon: XCircle },
            { label: 'At Risk',  count: atRiskCount,   color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25', icon: AlertTriangle },
            { label: 'Healthy',  count: healthyCount,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25', icon: CheckCircle2 },
          ].map(t => {
            const Icon = t.icon;
            return (
              <motion.div key={t.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`glass rounded-xl border p-4 text-center ${t.bg}`}>
                <Icon size={20} className={`${t.color} mx-auto mb-2`} />
                <p className={`text-3xl font-bold ${t.color}`}>{t.count}</p>
                <p className="text-xs text-surface-400 mt-1">{t.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Per-Student Scans */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-brand-400" />
            <h2 className="font-semibold text-white">Per-Student Health Scan</h2>
            <span className="text-xs text-surface-500">({scans.length} students)</span>
          </div>

          {/* Sort critical first */}
          <div className="space-y-3">
            {[...scans]
              .sort((a, b) => {
                const order = { critical: 0, at_risk: 1, healthy: 2 };
                return (order[a.overallHealth] ?? 3) - (order[b.overallHealth] ?? 3);
              })
              .map((scan, i) => (
                <StudentHealthCard key={scan.studentId} scan={scan} index={i} />
              ))}
          </div>
        </div>

        {/* Thresholds Reference */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass rounded-xl border border-surface-700/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-brand-400" />
            <h3 className="text-sm font-medium text-white">Detection Thresholds</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-surface-400">
            <div>
              <p className="text-surface-300 font-medium mb-1">Stale Evidence</p>
              <p>No update in &gt;90 days. Triggers counselor outreach flag and blocks automated recommendation.</p>
            </div>
            <div>
              <p className="text-surface-300 font-medium mb-1">Missing Evidence Fallback</p>
              <p>Fewer than 2 of 4 evidence pillars present. Recommendation enters "partial" or "blocked" state.</p>
            </div>
            <div>
              <p className="text-surface-300 font-medium mb-1">Aging Transition</p>
              <p>Year 3+ students with &lt;2 projects or &lt;4 skills. Within 30-day graduation window = high risk.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
