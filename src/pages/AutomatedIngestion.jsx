import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Radio,
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  Shield,
  ArrowRight,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import {
  fetchIngestionSummary,
  fetchIngestionEvents,
  simulateIngestion,
  triggerLtiSync,
} from '../utils/api.js';

export default function AutomatedIngestion() {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Simulation form state
  const [simSource, setSimSource] = useState('github_classroom');
  const [simStudentId, setSimStudentId] = useState('s001');
  const [simTitle, setSimTitle] = useState('Real-Time Healthcare Telemetry & ETL Microservice');
  const [simScore, setSimScore] = useState(96.5);
  const [simSkills, setSimSkills] = useState('Python, FastAPI, Docker, PostgreSQL, Redis');

  const loadData = async () => {
    try {
      const [sumRes, evtRes] = await Promise.all([
        fetchIngestionSummary().catch(() => null),
        fetchIngestionEvents(20).catch(() => ({ events: [] })),
      ]);
      if (sumRes) setSummary(sumRes);
      if (evtRes && evtRes.events) setEvents(evtRes.events);
    } catch (err) {
      console.error('Error loading ingestion data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setSimulating(true);
    setSuccessMsg('');
    try {
      const skillsArray = simSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await simulateIngestion({
        source: simSource,
        studentId: simStudentId,
        assignmentTitle: simTitle,
        score: parseFloat(simScore) || 90.0,
        technologies: skillsArray,
        repository: simSource === 'github_classroom' ? 'classroom-cs490/enterprise-capstone' : undefined,
      });
      setSuccessMsg(res.message || 'Evidence ingested successfully!');
      await loadData();
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleLtiSync = async () => {
    setSyncing(true);
    try {
      await triggerLtiSync();
      setSuccessMsg('LTI 1.3 Advantage sync completed. Gradebooks & rubrics updated.');
      await loadData();
    } catch (err) {
      console.error('LTI sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Phase 3 Enterprise Integration
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Webhooks Active
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Automated Evidence Ingestion
            </h1>
            <p className="text-sm text-surface-400 mt-0.5">
              Real-time webhook listeners for GitHub Classroom and Canvas/Blackboard LMS via LTI 1.3 Advantage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLtiSync}
              disabled={syncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-850 hover:bg-surface-800 border border-white/10 text-xs font-medium text-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={syncing ? 'animate-spin text-brand-400' : ''} />
              {syncing ? 'Syncing LMS...' : 'Trigger LTI 1.3 Sync'}
            </button>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-xs text-surface-400 hover:text-white transition-colors"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                onClick={() => setSuccessMsg('')}
                className="text-emerald-400 hover:text-white text-[11px] underline ml-4"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Pipeline Status</span>
              <Radio size={14} className="text-emerald-400 animate-pulse" />
            </div>
            <p className="text-xl font-bold font-display text-emerald-400 mt-2">
              {summary?.pipelineStatus || 'OPERATIONAL'}
            </p>
            <p className="text-[11px] text-surface-400 mt-1">3 Active Webhook Listeners</p>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Total Events Ingested</span>
              <Layers size={14} className="text-brand-400" />
            </div>
            <p className="text-xl font-bold font-display text-white mt-2">
              {summary?.totalEventsCaptured || events.length || 0}
            </p>
            <p className="text-[11px] text-surface-400 mt-1">Commits & Gradebook syncs</p>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Connected Protocols</span>
              <Shield size={14} className="text-purple-400" />
            </div>
            <p className="text-xl font-bold font-display text-purple-300 mt-2">
              HMAC + LTI 1.3
            </p>
            <p className="text-[11px] text-surface-400 mt-1">Cryptographic authentication</p>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between text-surface-400 text-xs">
              <span>Sync Frequency</span>
              <Cpu size={14} className="text-accent-cyan" />
            </div>
            <p className="text-xl font-bold font-display text-accent-cyan mt-2">
              Sub-Second
            </p>
            <p className="text-[11px] text-surface-400 mt-1">Continuous event bridge</p>
          </div>
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-white">
                <GitPullRequest size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">GitHub Classroom</p>
                <p className="text-[11px] text-surface-400">Webhook HMAC SHA-256</p>
              </div>
            </div>
            <div className="mt-3 text-xs space-y-1.5 text-surface-300">
              <div className="flex justify-between">
                <span className="text-surface-500">Endpoint:</span>
                <span className="font-mono text-[11px] text-brand-300">/ingestion/github/webhook</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Events:</span>
                <span>push, workflow_run, PR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Status:</span>
                <span className="text-emerald-400 font-medium">● Connected</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Canvas LMS</p>
                <p className="text-[11px] text-surface-400">LTI 1.3 Advantage (OIDC / AGS)</p>
              </div>
            </div>
            <div className="mt-3 text-xs space-y-1.5 text-surface-300">
              <div className="flex justify-between">
                <span className="text-surface-500">Endpoint:</span>
                <span className="font-mono text-[11px] text-orange-300">/ingestion/lti/launch</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Integration:</span>
                <span>Gradebook Rubric Sync</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Status:</span>
                <span className="text-emerald-400 font-medium">● Connected</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Terminal size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Blackboard Ultra</p>
                <p className="text-[11px] text-surface-400">LTI Assignment & Grade Service</p>
              </div>
            </div>
            <div className="mt-3 text-xs space-y-1.5 text-surface-300">
              <div className="flex justify-between">
                <span className="text-surface-500">Endpoint:</span>
                <span className="font-mono text-[11px] text-cyan-300">/ingestion/lti/sync</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Integration:</span>
                <span>Rubric Criteria Ledger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Status:</span>
                <span className="text-emerald-400 font-medium">● Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Section: Simulator & Event Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Webhook Simulator */}
          <div className="lg:col-span-5 glass p-5 rounded-2xl border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-4">
              <Send size={16} className="text-brand-400" />
              <h2 className="text-base font-semibold text-white">Interactive Webhook Simulator</h2>
            </div>
            <p className="text-xs text-surface-400 mb-4">
              Simulate an incoming automated payload from an institutional LMS or GitHub repository to test the ingestion pipeline.
            </p>

            <form onSubmit={handleSimulate} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  Source Protocol
                </label>
                <select
                  value={simSource}
                  onChange={(e) => setSimSource(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="github_classroom">GitHub Classroom (Webhook HMAC-SHA256)</option>
                  <option value="canvas_lms">Canvas LMS (LTI 1.3 Advantage)</option>
                  <option value="blackboard_ultra">Blackboard Learn Ultra (AGS Sync)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  Target Student
                </label>
                <select
                  value={simStudentId}
                  onChange={(e) => setSimStudentId(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="s001">Aisha Patel (s001 - Health Data Science)</option>
                  <option value="s002">Marcus Thompson (s002 - Distributed Systems)</option>
                  <option value="s003">Priya Sharma (s003 - Cybersecurity)</option>
                  <option value="s004">Omar Ali (s004 - Cloud / DevOps)</option>
                  <option value="s005">Sophie Chen (s005 - AI / UX)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  Assignment / Project Title
                </label>
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                    Graded Score (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={simScore}
                    onChange={(e) => setSimScore(e.target.value)}
                    className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                    Format
                  </label>
                  <div className="bg-surface-900/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-surface-400 flex items-center justify-between">
                    <span>Automated Pass</span>
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  Extracted Technologies (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={simSkills}
                  onChange={(e) => setSimSkills(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white text-xs font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
              >
                {simulating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Ingesting Payload...
                  </>
                ) : (
                  <>
                    <Send size={13} /> Dispatch Simulated Webhook
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Live Ingestion Event Ledger */}
          <div className="lg:col-span-7 glass p-5 rounded-2xl border border-white/[0.08] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Live Ingestion Event Stream</h2>
              </div>
              <span className="text-[11px] text-surface-400 font-mono">
                Showing {events.length} captured events
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[460px] space-y-3 pr-1">
              {events.map((evt, idx) => (
                <motion.div
                  key={evt.id || idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-3.5 rounded-xl bg-surface-900/80 border border-white/[0.06] text-xs hover:border-brand-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-white">
                        {evt.details?.assignmentTitle || evt.repository || evt.event}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-surface-500">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-surface-800 text-[10px] font-mono text-brand-300">
                      {evt.source.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-800 text-[10px] text-surface-300">
                      Student: {evt.studentName || evt.studentId}
                    </span>
                    {evt.commitHash && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-mono text-purple-300">
                        Commit: {evt.commitHash}
                      </span>
                    )}
                    {evt.details?.score && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-semibold text-emerald-400">
                        {evt.details.score}%
                      </span>
                    )}
                  </div>

                  {/* Extracted skills badges */}
                  {evt.details?.extractedSkills && evt.details.extractedSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/[0.04]">
                      <span className="text-[10px] text-surface-500">Skills Ingested:</span>
                      {evt.details.extractedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-1.5 py-0.5 rounded bg-brand-500/10 text-[10px] text-brand-300 border border-brand-500/20"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {events.length === 0 && (
                <div className="py-12 text-center text-surface-500 text-xs">
                  No ingestion events recorded yet. Dispatch a simulated webhook above to populate!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
