import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  User,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  BarChart2,
  AlertCircle,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import { fetchFeedbackAggregate, fetchFeedback, submitFeedback } from '../utils/api.js';

const STAKEHOLDER_ICONS = {
  student:   GraduationCap,
  counselor: User,
  employer:  Building2,
};

const STAKEHOLDER_COLORS = {
  student:   'text-brand-400 bg-brand-500/10 border-brand-500/20',
  counselor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  employer:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const RATING_LABELS = {
  student:   ['relevance', 'clarity', 'fairness', 'usefulness'],
  counselor: ['accuracy', 'auditability', 'overrideClarity', 'systemTrust'],
  employer:  ['signalQuality', 'portfolioClarity', 'trustworthiness', 'relevanceToHiring'],
};

const RATING_DISPLAY = {
  relevance:          'Relevance',
  clarity:            'Clarity',
  fairness:           'Fairness',
  usefulness:         'Usefulness',
  accuracy:           'Accuracy',
  auditability:       'Auditability',
  overrideClarity:    'Override Clarity',
  systemTrust:        'System Trust',
  signalQuality:      'Signal Quality',
  portfolioClarity:   'Portfolio Clarity',
  trustworthiness:    'Trustworthiness',
  relevanceToHiring:  'Relevance to Hiring',
};

function StarRating({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={12}
          className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-surface-600'} />
      ))}
    </div>
  );
}

function AggregateCard({ type, data }) {
  const Icon  = STAKEHOLDER_ICONS[type] || User;
  const color = STAKEHOLDER_COLORS[type] || '';
  const labels = RATING_LABELS[type] || [];

  if (!data) return null;

  const avgKeys = labels.map(k => {
    const capKey = 'avg' + k.charAt(0).toUpperCase() + k.slice(1);
    return { label: RATING_DISPLAY[k] || k, value: data[capKey] };
  });

  const overallKey = type === 'student' ? null : data.avgOverallQuality;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-surface-700/40">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 rounded-xl border ${color}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="font-semibold text-white capitalize">{type} Feedback</p>
          <p className="text-xs text-surface-400">{data.count} response{data.count !== 1 ? 's' : ''}</p>
        </div>
        {overallKey && (
          <div className="ml-auto flex items-center gap-1.5">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-white">{overallKey.toFixed(1)}</span>
            <span className="text-surface-400 text-xs">/5</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {avgKeys.map(({ label, value }) => value != null && (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-surface-400">{label}</span>
              <span className="text-white font-medium">{value.toFixed(1)} / 5</span>
            </div>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(value / 5) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {type === 'student' && (
        <div className="mt-4 pt-4 border-t border-surface-700/40 flex gap-4 text-xs">
          <span className="text-surface-400">Would act on: <span className="text-emerald-400 font-semibold">{Math.round((data.wouldActOnRate || 0) * 100)}%</span></span>
          <span className="text-surface-400">Accurate: <span className="text-brand-400 font-semibold">{Math.round((data.accuracyRate || 0) * 100)}%</span></span>
        </div>
      )}
      {type === 'counselor' && (
        <div className="mt-4 pt-4 border-t border-surface-700/40 text-xs">
          <span className="text-surface-400">Would recommend to colleague: <span className="text-emerald-400 font-semibold">{Math.round((data.wouldRecommendRate || 0) * 100)}%</span></span>
        </div>
      )}
      {type === 'employer' && (
        <div className="mt-4 pt-4 border-t border-surface-700/40 text-xs">
          <span className="text-surface-400">Would use for hiring: <span className="text-emerald-400 font-semibold">{Math.round((data.wouldUseForHiringRate || 0) * 100)}%</span></span>
        </div>
      )}
    </motion.div>
  );
}

function FeedbackCard({ fb, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon  = STAKEHOLDER_ICONS[fb.stakeholderType] || User;
  const color = STAKEHOLDER_COLORS[fb.stakeholderType] || '';
  const labels = RATING_LABELS[fb.stakeholderType] || [];

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl border border-surface-700/40 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-surface-800/30 transition-colors">
        <div className={`p-2 rounded-lg border flex-shrink-0 ${color}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white text-sm">{fb.stakeholderName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${color}`}>{fb.stakeholderType}</span>
            {fb.careerTitle && (
              <span className="text-xs text-surface-400">→ {fb.careerTitle}</span>
            )}
          </div>
          <p className="text-surface-300 text-xs mt-1 line-clamp-2">{fb.comment}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {fb.ratings && (
            <StarRating value={Math.round(
              Object.values(fb.ratings).reduce((a, b) => a + b, 0) / Object.values(fb.ratings).length
            )} />
          )}
          {expanded ? <ChevronUp size={14} className="text-surface-400" /> : <ChevronDown size={14} className="text-surface-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-surface-700/30 pt-4 space-y-4">
              <blockquote className="text-surface-200 text-sm italic leading-relaxed border-l-2 border-brand-500/50 pl-3">
                "{fb.comment}"
              </blockquote>
              {fb.ratings && (
                <div className="grid grid-cols-2 gap-2">
                  {labels.map(k => fb.ratings[k] != null && (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-surface-400">{RATING_DISPLAY[k] || k}</span>
                      <StarRating value={fb.ratings[k]} />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-4 text-xs flex-wrap">
                {fb.wouldActOn != null && (
                  <span className={`flex items-center gap-1 ${fb.wouldActOn ? 'text-emerald-400' : 'text-red-400'}`}>
                    <ThumbsUp size={10} /> Would act on this
                  </span>
                )}
                {fb.wouldUseForHiring != null && (
                  <span className={`flex items-center gap-1 ${fb.wouldUseForHiring ? 'text-emerald-400' : 'text-red-400'}`}>
                    <CheckCircle2 size={10} /> Would use for hiring
                  </span>
                )}
                {fb.wouldRecommendToColleague != null && (
                  <span className={`flex items-center gap-1 ${fb.wouldRecommendToColleague ? 'text-emerald-400' : 'text-red-400'}`}>
                    <CheckCircle2 size={10} /> Would recommend to colleague
                  </span>
                )}
              </div>
              <p className="text-surface-500 text-xs">{new Date(fb.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StakeholderFeedback() {
  const [aggregate, setAggregate] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [submitNotif, setSubmitNotif] = useState(null);

  // New feedback form
  const [showForm, setShowForm]   = useState(false);
  const [formType, setFormType]   = useState('student');
  const [formName, setFormName]   = useState('');
  const [formComment, setFormComment] = useState('');
  const [formRatings, setFormRatings] = useState({ relevance: 4, clarity: 4, fairness: 4, usefulness: 4 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetchFeedbackAggregate(), fetchFeedback()])
      .then(([agg, fb]) => {
        setAggregate(agg.aggregate);
        setFeedbackList(fb.feedback || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? feedbackList : feedbackList.filter(f => f.stakeholderType === filter);

  const handleFormTypeChange = (type) => {
    setFormType(type);
    const defaults = RATING_LABELS[type] || [];
    const ratings = {};
    defaults.forEach(k => { ratings[k] = 4; });
    setFormRatings(ratings);
  };

  const handleSubmit = async () => {
    if (!formName || !formComment) return;
    setSubmitting(true);
    try {
      await submitFeedback({
        stakeholderType: formType,
        stakeholderName: formName,
        ratings: formRatings,
        comment: formComment,
        wouldActOn: formType === 'student' ? true : null,
        wouldUseForHiring: formType === 'employer' ? true : null,
        wouldRecommendToColleague: formType === 'counselor' ? true : null,
      });
      setSubmitNotif({ type: 'success', message: 'Thank you. Your feedback has been recorded.' });
      setShowForm(false);
      setFormName(''); setFormComment('');
      // Refresh
      const [agg, fb] = await Promise.all([fetchFeedbackAggregate(), fetchFeedback()]);
      setAggregate(agg.aggregate);
      setFeedbackList(fb.feedback || []);
    } catch (e) {
      setSubmitNotif({ type: 'error', message: e.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitNotif(null), 5000);
    }
  };

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
              <div className="p-2 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                <MessageSquare size={20} className="text-brand-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Stakeholder Validation</h1>
            </div>
            <p className="text-surface-400 text-sm max-w-xl">
              Real feedback from students, counselors, and employers validating recommendation
              quality. Phase 2 feature — replaces assumption-based quality claims.
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm">
            <Send size={14} /> Submit Feedback
          </button>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {submitNotif && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                submitNotif.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}>
              {submitNotif.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {submitNotif.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl border border-brand-500/20 p-6 space-y-5">
              <h3 className="font-semibold text-white">Submit Stakeholder Feedback</h3>
              <div className="grid grid-cols-3 gap-3">
                {['student','counselor','employer'].map(t => (
                  <button key={t} onClick={() => handleFormTypeChange(t)}
                    className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                      formType === t
                        ? 'border-brand-500/50 bg-brand-500/10 text-brand-300'
                        : 'border-surface-700 text-surface-400 hover:border-surface-500'
                    }`}>{t}</button>
                ))}
              </div>
              <input value={formName} onChange={e => setFormName(e.target.value)}
                placeholder="Your name / organisation"
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500/50" />
              <div className="grid grid-cols-2 gap-3">
                {(RATING_LABELS[formType] || []).map(k => (
                  <div key={k}>
                    <label className="text-xs text-surface-400 mb-1 block">{RATING_DISPLAY[k] || k}</label>
                    <input type="range" min={1} max={5} value={formRatings[k] || 3}
                      onChange={e => setFormRatings(prev => ({ ...prev, [k]: Number(e.target.value) }))}
                      className="w-full accent-brand-500" />
                    <div className="flex justify-between text-xs text-surface-500">
                      <span>1</span><span className="text-brand-400 font-medium">{formRatings[k] || 3}</span><span>5</span>
                    </div>
                  </div>
                ))}
              </div>
              <textarea value={formComment} onChange={e => setFormComment(e.target.value)}
                placeholder="Share your experience with SkillPath's recommendations..."
                rows={4}
                className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500/50 resize-none" />
              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={submitting || !formName || !formComment}
                  className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50">
                  {submitting ? 'Submitting...' : <><Send size={14} /> Submit</>}
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl border border-surface-700 text-surface-400 text-sm hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aggregate Score Cards */}
        {aggregate && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} className="text-brand-400" />
              <h2 className="font-semibold text-white">Aggregate Quality Scores</h2>
              <span className="text-xs text-surface-500 ml-1">({feedbackList.length} total responses)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AggregateCard type="student"   data={aggregate.student}   />
              <AggregateCard type="counselor" data={aggregate.counselor} />
              <AggregateCard type="employer"  data={aggregate.employer}  />
            </div>
          </div>
        )}

        {/* Individual Feedback */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-brand-400" />
              <h2 className="font-semibold text-white">Individual Responses</h2>
            </div>
            <div className="flex gap-2">
              {['all','student','counselor','employer'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? 'bg-brand-500/20 border border-brand-500/30 text-brand-300'
                      : 'border border-surface-700 text-surface-400 hover:text-white'
                  }`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((fb, i) => (
              <FeedbackCard key={fb.id} fb={fb} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-surface-500">
                No {filter !== 'all' ? filter : ''} feedback collected yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
