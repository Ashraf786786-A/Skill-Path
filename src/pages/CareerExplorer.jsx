import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  TrendingUp,
  Coins,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import { fetchCareers } from '../utils/api.js';

export default function CareerExplorer() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  useEffect(() => {
    fetchCareers()
      .then((data) => {
        setCareers(data.careers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load careers:', err);
        setLoading(false);
      });
  }, []);

  const industries = ['all', ...new Set(careers.map((c) => c.industry).filter(Boolean))];

  const filteredCareers = careers.filter((c) => {
    const matchesIndustry =
      selectedIndustry === 'all' || c.industry === selectedIndustry;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Role Architectures</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Career Role Taxonomies
            </h1>
            <p className="section-subtitle">
              8 industry benchmark pathways with explicit prerequisite and preferred skill dependencies.
            </p>
          </div>

          <div className="text-xs font-mono text-surface-400 bg-surface-900/60 p-2.5 rounded-xl border border-surface-800">
            <span>Transparent Role Requirements (Zero Guesswork)</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role title, skill, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-950/80 border border-surface-700/80 rounded-xl text-xs text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 font-sans transition-colors"
            />
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-surface-400 mr-1 shrink-0" />
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 capitalize ${
                  selectedIndustry === ind
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-surface-400 hover:text-white bg-surface-900/40 border border-transparent'
                }`}
              >
                {ind === 'all' ? 'All Sectors' : ind.split('/')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Careers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
                <div className="h-6 bg-surface-800 rounded w-40" />
                <div className="h-16 bg-surface-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCareers.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card-hover p-6 rounded-3xl flex flex-col justify-between space-y-6 border-surface-700/80 group"
              >
                <div>
                  {/* Top Bar: Emoji, Title, Industry, Salary, Growth */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl p-2.5 rounded-2xl bg-surface-900 border border-surface-800">
                        {c.emoji || '💼'}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-xs font-mono text-surface-400">{c.industry}</p>
                      </div>
                    </div>

                    <span className="badge-purple text-[10px] font-mono shrink-0">
                      {c.growth} Growth
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-surface-300 leading-relaxed font-sans mt-2">
                    {c.description}
                  </p>

                  {/* Metadata Chips: Salary & Growth */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-surface-800/80 flex-wrap text-xs font-mono text-surface-400">
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{c.salaryRange}</span>
                    </span>

                    <span className="flex items-center gap-1 text-surface-400 bg-surface-900 px-2.5 py-1 rounded-lg border border-surface-800">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                      <span>Market Outlook: {c.growth}</span>
                    </span>
                  </div>

                  {/* Required Skills Section */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-surface-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      <span>Mandatory Core Skills ({c.requiredSkills.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-xs font-mono px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/30"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Skills Section */}
                  {c.preferredSkills && c.preferredSkills.length > 0 && (
                    <div className="mt-3.5 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-surface-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>Preferred / Differentiating Skills:</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.preferredSkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-xs font-mono px-2 py-0.5 rounded-md bg-surface-900 text-surface-400 border border-surface-800"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expected Evidence Modalities */}
                  {c.evidenceTypes && (
                    <div className="mt-4 p-3 rounded-xl bg-surface-900/60 border border-surface-800/80 text-[11px] font-mono text-surface-300 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                      <span>Expected Proof: {c.evidenceTypes.join(' • ')}</span>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-surface-800/80 flex items-center justify-between">
                  <Link
                    to={`/recommendations`}
                    className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Match cohort to this profile</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <span className="text-[11px] font-mono text-surface-500">
                    ID: {c.id}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
