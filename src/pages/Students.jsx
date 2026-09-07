import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  FolderGit2,
  Award,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import { fetchStudents } from '../utils/api.js';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'normal' | 'edge'

  useEffect(() => {
    fetchStudents()
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load students:', err);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.interests && s.interests.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase())));

    if (filterType === 'normal') {
      return matchesSearch && !s.failureCase;
    }
    if (filterType === 'edge') {
      return matchesSearch && !!s.failureCase;
    }
    return matchesSearch;
  });

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-brand-400" />
              <span>Evidence-Profiled Cohort</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Student Talent Registry
            </h1>
            <p className="section-subtitle">
              Inspect student dossiers verified through capstone deliverables, assessed rubrics, and published portfolios.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-surface-400 bg-surface-900/60 p-2 rounded-xl border border-surface-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-emerald" />
              <span>7 Standard</span>
            </span>
            <span className="text-surface-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>3 Edge Cases</span>
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, ID or interest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-950/80 border border-surface-700/80 rounded-xl text-xs text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 font-sans transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-surface-400 mr-1" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filterType === 'all'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'text-surface-400 hover:text-white bg-surface-900/40 border border-transparent'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilterType('normal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filterType === 'normal'
                  ? 'bg-accent-emerald/20 text-emerald-300 border border-accent-emerald/40'
                  : 'text-surface-400 hover:text-white bg-surface-900/40 border border-transparent'
              }`}
            >
              Standard Evidence
            </button>
            <button
              onClick={() => setFilterType('edge')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                filterType === 'edge'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-surface-400 hover:text-white bg-surface-900/40 border border-transparent'
              }`}
            >
              Edge / Failure Cases (3)
            </button>
          </div>
        </div>

        {/* Student Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-surface-800 rounded w-24" />
                    <div className="h-3 bg-surface-800 rounded w-16" />
                  </div>
                </div>
                <div className="h-16 bg-surface-800 rounded" />
              </div>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl space-y-3">
            <Users className="w-8 h-8 text-surface-500 mx-auto" />
            <p className="text-surface-300 font-semibold">No students match your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="btn-secondary text-xs"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((s, index) => {
              const isFailure = !!s.failureCase;

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`glass-card-hover p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group ${
                    isFailure ? 'border-amber-500/30' : ''
                  }`}
                >
                  {/* Subtle Top glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20"
                    style={{ backgroundColor: s.avatarColor || '#6366f1' }}
                  />

                  {/* Header info */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-white shadow-lg border border-white/10 text-sm"
                          style={{ backgroundColor: s.avatarColor || '#6366f1' }}
                        >
                          {s.avatar || s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                              {s.name}
                            </h3>
                            <span className="text-[10px] font-mono text-surface-500">
                              {s.id}
                            </span>
                          </div>
                          <p className="text-xs text-surface-400 font-mono">
                            {s.year} • {s.age} yrs
                          </p>
                        </div>
                      </div>

                      {/* Badge if failure case */}
                      {isFailure && (
                        <span className="badge-amber text-[10px] flex items-center gap-1 font-mono">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Edge Case</span>
                        </span>
                      )}
                    </div>

                    {/* Failure Case Notice if applicable */}
                    {isFailure && (
                      <div className="mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-mono">
                        {s.failureCaseLabel || 'Special edge case handled'}
                      </div>
                    )}

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 my-4">
                      <div className="bg-surface-900/60 p-2.5 rounded-xl border border-surface-800/80">
                        <div className="flex items-center gap-1.5 text-surface-400 text-[11px] font-mono">
                          <FolderGit2 className="w-3.5 h-3.5 text-accent-emerald" />
                          <span>Projects</span>
                        </div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {s.projectCount}
                        </div>
                      </div>

                      <div className="bg-surface-900/60 p-2.5 rounded-xl border border-surface-800/80">
                        <div className="flex items-center gap-1.5 text-surface-400 text-[11px] font-mono">
                          <Award className="w-3.5 h-3.5 text-brand-400" />
                          <span>Skills</span>
                        </div>
                        <div className="text-lg font-bold font-mono text-white mt-0.5">
                          {s.skillCount}
                        </div>
                      </div>
                    </div>

                    {/* Interests tags */}
                    {s.interests && s.interests.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <span className="text-[10px] font-mono text-surface-400 uppercase tracking-wider">
                          Stated Ambitions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {s.interests.map((interest) => (
                            <span
                              key={interest}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-900 text-surface-300 border border-surface-800"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-surface-800/80 flex items-center justify-between gap-2">
                    <Link
                      to={`/students/${s.id}`}
                      className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to={`/recommendations?student=${s.id}`}
                      className="btn-ghost text-[11px] px-2.5 py-1 text-surface-300 hover:text-white"
                    >
                      Run Recs
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
