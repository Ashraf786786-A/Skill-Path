import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  Award,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  TrendingUp,
  Layers,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import MatchBar from '../components/MatchBar.jsx';
import { fetchStudents, fetchRecommendations } from '../utils/api.js';

export default function Recommendations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(
    searchParams.get('student') || 's001'
  );
  const [recData, setRecData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState('c001'); // expanded by default

  // Load student list for the selector
  useEffect(() => {
    fetchStudents()
      .then((data) => {
        setStudents(data.students || []);
        if (!searchParams.get('student') && data.students?.length > 0) {
          setSelectedStudentId(data.students[0].id);
        }
      })
      .catch((err) => console.error('Failed to load students:', err));
  }, []);

  // Fetch recommendations whenever selected student changes
  useEffect(() => {
    if (!selectedStudentId) return;
    setLoading(true);
    fetchRecommendations(selectedStudentId)
      .then((data) => {
        setRecData(data);
        if (data.recommendations?.length > 0) {
          setExpandedCard(data.recommendations[0].careerId);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load recommendations:', err);
        setLoading(false);
      });
  }, [selectedStudentId]);

  const handleStudentChange = (id) => {
    setSelectedStudentId(id);
    setSearchParams({ student: id });
  };

  const selectedStudentObj = students.find((s) => s.id === selectedStudentId);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>Transparent Matching Engine</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Evidence-Based Recommendations
            </h1>
            <p className="section-subtitle">
              Every score is mathematically derived from verified skills. Zero black-box neural guessing.
            </p>
          </div>

          {/* Transparent Formula Badge */}
          <div className="p-3 rounded-2xl bg-surface-900/80 border border-surface-800 text-xs font-mono text-surface-300 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-brand-400 font-bold">
              Algorithm: Skill Overlap
            </div>
            <div className="text-white">
              Score = (Matched Skills / Required Skills) × 100
            </div>
          </div>
        </div>

        {/* Student Selector Bar */}
        <div className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-surface-700/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-surface-400 uppercase tracking-wider">
              Evaluating Student:
            </span>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="bg-surface-950 border border-surface-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-400 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="bg-surface-900 text-white">
                  {s.id}: {s.name} {s.failureCase ? `(${s.failureCaseLabel || 'Edge Case'})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Failure Case Indicator if current student is edge case */}
          {selectedStudentObj?.failureCase && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Edge Case: {selectedStudentObj.failureCaseLabel || selectedStudentObj.failureCase}
              </span>
            </div>
          )}
        </div>

        {/* Recommendations List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 glass-card rounded-3xl bg-surface-800" />
            ))}
          </div>
        ) : !recData || recData.recommendations?.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl space-y-3">
            <HelpCircle className="w-8 h-8 text-surface-500 mx-auto" />
            <h3 className="text-white font-bold">No Career Recommendations Available</h3>
            <p className="text-xs text-surface-400">
              Check student evidence records or select another student profile.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {recData.recommendations.map((rec, index) => {
              const isExpanded = expandedCard === rec.careerId;
              const hasReview = rec.reviewStatus && rec.reviewStatus !== 'pending';

              return (
                <motion.div
                  key={rec.careerId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`glass-card rounded-3xl overflow-hidden border transition-all ${
                    index === 0
                      ? 'border-brand-500/40 shadow-xl shadow-brand-500/5'
                      : 'border-surface-700/80'
                  }`}
                >
                  {/* Card Header Strip */}
                  <div className="p-6 md:p-7 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Rank, Emoji, Title, Industry */}
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                            index === 0
                              ? 'bg-brand-500 text-surface-950 shadow-md shadow-brand-500/40'
                              : 'bg-surface-800 text-surface-300'
                          }`}
                        >
                          #{index + 1}
                        </span>

                        <div className="text-2xl p-2 rounded-xl bg-surface-900 border border-surface-800">
                          {rec.emoji || '💼'}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-display font-bold text-xl text-white">
                              {rec.careerTitle}
                            </h2>
                            {index === 0 && (
                              <span className="badge-brand text-[10px] font-mono">
                                Top Evidence Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-surface-400">
                            {rec.industry}
                          </p>
                        </div>
                      </div>

                      {/* Right: Review Status Badge & Toggle Button */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {rec.reviewStatus === 'approved' && (
                          <span className="badge-emerald text-xs font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Counselor Approved</span>
                          </span>
                        )}
                        {rec.reviewStatus === 'overridden' && (
                          <span className="badge-amber text-xs font-mono flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Overridden</span>
                          </span>
                        )}
                        {rec.reviewStatus === 'pending' && (
                          <span className="text-xs font-mono text-surface-500 bg-surface-900 px-2.5 py-1 rounded-lg border border-surface-800">
                            Audit Pending
                          </span>
                        )}

                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : rec.careerId)}
                          className="p-2 rounded-xl bg-surface-900 border border-surface-700 hover:border-brand-500 text-surface-300 hover:text-white transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <MatchBar score={rec.score} label="Role Prerequisite Match" />
                    </div>
                  </div>

                  {/* Expandable Explainability Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-surface-800 bg-surface-950/60 p-6 md:p-7 space-y-6"
                      >
                        {/* Two Columns: Why Recommended (Strengths) vs Evidence Gaps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Column 1: Why Recommended */}
                          <div className="p-5 rounded-2xl bg-surface-900/60 border border-emerald-500/20 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                              <span>Why Recommended (Demonstrated Proof)</span>
                            </div>

                            <ul className="space-y-2 text-xs text-surface-300 font-sans">
                              {rec.whyRecommended?.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-accent-emerald font-bold">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Matched skills pills */}
                            <div className="pt-2 border-t border-surface-800/80 space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400">
                                Verified Matched Skills:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {rec.matchedRequiredSkills?.map((skill) => (
                                  <span
                                    key={skill}
                                    className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                                  >
                                    ✓ {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Evidence Gaps */}
                          <div className="p-5 rounded-2xl bg-surface-900/60 border border-amber-500/20 space-y-3">
                            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              <span>Actionable Evidence Gaps</span>
                            </div>

                            <ul className="space-y-2 text-xs text-surface-300 font-sans">
                              {rec.evidenceGaps?.length === 0 ? (
                                <li className="text-emerald-400 font-mono">
                                  No prerequisite gaps! Student demonstrates 100% of required competencies.
                                </li>
                              ) : (
                                rec.evidenceGaps?.map((gap, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-amber-400 font-bold">•</span>
                                    <span>{gap}</span>
                                  </li>
                                ))
                              )}
                            </ul>

                            {/* Missing skills pills */}
                            {rec.missingRequiredSkills?.length > 0 && (
                              <div className="pt-2 border-t border-surface-800/80 space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400">
                                  Missing Prerequisites:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {rec.missingRequiredSkills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                    >
                                      Needs: {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Audit Details if already reviewed */}
                        {rec.reviewRecord && (
                          <div className="p-4 rounded-xl bg-surface-900 border border-surface-800 text-xs font-mono space-y-1 text-surface-300">
                            <div className="text-brand-400 font-bold">
                              Counselor Audit Log:
                            </div>
                            <div>
                              Decision: <strong className="text-white uppercase">{rec.reviewRecord.status}</strong> by {rec.reviewRecord.reviewerName}
                            </div>
                            {rec.reviewRecord.overrideReason && (
                              <div>Reason: {rec.reviewRecord.overrideReason}</div>
                            )}
                            {rec.reviewRecord.overrideNotes && (
                              <div className="italic text-surface-400">"{rec.reviewRecord.overrideNotes}"</div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <Link
                            to={`/review?student=${selectedStudentId}&career=${rec.careerId}`}
                            className="btn-secondary text-xs flex items-center gap-2 font-semibold"
                          >
                            <UserCheck className="w-4 h-4 text-brand-400" />
                            <span>Submit Human Counselor Decision</span>
                          </Link>

                          <Link
                            to={`/students/${selectedStudentId}`}
                            className="text-xs font-mono text-surface-400 hover:text-white flex items-center gap-1"
                          >
                            <span>Inspect Source Student Artifacts</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
