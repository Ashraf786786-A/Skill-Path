import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  History,
  Send,
  X,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import { fetchStudents, fetchCareers, fetchReviews, submitReview } from '../utils/api.js';

const VALID_OVERRIDE_REASONS = [
  'Additional evidence not captured in system',
  'Student explicitly preferred another pathway',
  'Teacher/counselor holistic assessment',
  'Insufficient prerequisite foundations',
  'Other',
];

export default function HumanReview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [careers, setCareers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [studentId, setStudentId] = useState(searchParams.get('student') || 's001');
  const [careerId, setCareerId] = useState(searchParams.get('career') || 'c001');
  const [reviewerName, setReviewerName] = useState('Counselor Jane Miller');

  // Override Modal state
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState(VALID_OVERRIDE_REASONS[0]);
  const [overrideNotes, setOverrideNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load students, careers, and existing reviews
  useEffect(() => {
    Promise.all([fetchStudents(), fetchCareers(), fetchReviews()])
      .then(([studentsRes, careersRes, reviewsRes]) => {
        setStudents(studentsRes.students || []);
        setCareers(careersRes.careers || []);
        setReviews(reviewsRes.reviews || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load review workspace:', err);
        setLoading(false);
      });
  }, []);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const res = await submitReview({
        studentId,
        careerId,
        action: 'approve',
        reviewerName,
      });
      setNotification({
        type: 'success',
        message: `Approved: ${selectedStudent?.name} → ${selectedCareer?.title}`,
      });
      // Refresh reviews
      const updated = await fetchReviews();
      setReviews(updated.reviews || []);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to submit approval',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitReview({
        studentId,
        careerId,
        action: 'override',
        overrideReason,
        overrideNotes,
        reviewerName,
      });
      setNotification({
        type: 'success',
        message: `Override recorded: ${selectedStudent?.name} → ${selectedCareer?.title}`,
      });
      setIsOverrideModalOpen(false);
      setOverrideNotes('');
      // Refresh reviews
      const updated = await fetchReviews();
      setReviews(updated.reviews || []);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to submit override',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStudent = students.find((s) => s.id === studentId);
  const selectedCareer = careers.find((c) => c.id === careerId);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-10 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider mb-2">
              <UserCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>Counselor Governance Desk</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Human-in-the-Loop Audit
            </h1>
            <p className="section-subtitle">
              Algorithms advise, humans decide. Mandatory rationale tracking ensures institutional accountability.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-900/60 border border-surface-800 text-xs font-mono text-surface-400">
            <span>Audit Trail: {reviews.length} Decisions Logged</span>
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-surface-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Interactive Decision Desk Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border-surface-700/80 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">
              Review & Audit Station
            </h2>
            <span className="badge-brand text-xs font-mono">
              Active Session
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-surface-400">
                Target Student
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-400"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.name} {s.failureCase ? '(!)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Career Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-surface-400">
                Recommended Pathway
              </label>
              <select
                value={careerId}
                onChange={(e) => setCareerId(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-400"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Reviewer Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-surface-400">
                Reviewer Signature
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-400"
                placeholder="e.g. Counselor Jane Miller"
              />
            </div>
          </div>

          {/* Context Preview Banner */}
          {selectedStudent && selectedCareer && (
            <div className="p-4 rounded-2xl bg-surface-900/80 border border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-surface-400 font-mono">
                  Evaluating recommendation pairing:
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-brand-300">{selectedStudent.name}</span>
                  <span className="text-surface-500">→</span>
                  <span className="text-purple-300">
                    {selectedCareer.emoji} {selectedCareer.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="btn-primary text-xs flex items-center gap-1.5 font-semibold bg-accent-emerald hover:bg-emerald-600 border-emerald-500"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Recommendation</span>
                </button>

                <button
                  onClick={() => setIsOverrideModalOpen(true)}
                  disabled={submitting}
                  className="btn-secondary text-xs flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-200 border-amber-500/40 hover:border-amber-500"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Override Recommendation</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Historical Audit Trail Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-400" />
              <h3 className="font-display font-bold text-lg text-white">
                Accountability Audit Log
              </h3>
            </div>
            <span className="text-xs font-mono text-surface-400">
              Immutable counselor decision ledger
            </span>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border-surface-700/80">
            {reviews.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-surface-500">
                No human review actions logged yet. Approve or override a match above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-surface-900/80 border-b border-surface-800 text-surface-400 font-mono uppercase tracking-wider">
                      <th className="p-3.5">Timestamp</th>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Career Role</th>
                      <th className="p-3.5">Decision</th>
                      <th className="p-3.5">Reviewer</th>
                      <th className="p-3.5">Rationale / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800/60">
                    {reviews.map((rev, idx) => {
                      const isApprove = rev.status === 'approved';

                      return (
                        <tr key={idx} className="hover:bg-surface-900/40 transition-colors">
                          <td className="p-3.5 font-mono text-surface-400 text-[11px] whitespace-nowrap">
                            {new Date(rev.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-white">
                            {rev.studentName}
                          </td>
                          <td className="p-3.5 text-surface-200">
                            {rev.careerTitle}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                                isApprove
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {rev.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-surface-300">
                            {rev.reviewerName}
                          </td>
                          <td className="p-3.5 text-surface-300 max-w-xs">
                            {isApprove ? (
                              <span className="text-surface-500 italic">Confirmed match</span>
                            ) : (
                              <div>
                                <div className="font-semibold text-amber-300">
                                  {rev.overrideReason}
                                </div>
                                {rev.overrideNotes && (
                                  <div className="text-[11px] text-surface-400 mt-0.5 truncate">
                                    "{rev.overrideNotes}"
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Override Modal */}
        <AnimatePresence>
          {isOverrideModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card max-w-lg w-full p-6 md:p-8 rounded-3xl border-amber-500/40 shadow-2xl space-y-5 bg-surface-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-display font-bold text-lg text-white">
                      Counselor Override Rationale
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOverrideModalOpen(false)}
                    className="p-1 rounded-lg text-surface-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-surface-300 font-sans leading-relaxed">
                  Institutional policy requires an explicit, audited reason whenever a counselor overrides the evidence-based recommendation for{' '}
                  <strong className="text-white">{selectedStudent?.name}</strong>.
                </p>

                <form onSubmit={handleOverrideSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-surface-400">
                      Validated Override Reason *
                    </label>
                    <select
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full bg-surface-950 border border-surface-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    >
                      {VALID_OVERRIDE_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-surface-400">
                      Counselor Qualitative Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={overrideNotes}
                      onChange={(e) => setOverrideNotes(e.target.value)}
                      placeholder="e.g. Met with student in 1-on-1 session; student demonstrated undocumented extracurricular project..."
                      className="w-full bg-surface-950 border border-surface-700 rounded-xl p-3 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOverrideModalOpen(false)}
                      className="btn-ghost text-xs text-surface-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary text-xs bg-amber-500 hover:bg-amber-600 border-amber-400 text-surface-950 font-bold"
                    >
                      {submitting ? 'Logging...' : 'Confirm Audited Override'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
