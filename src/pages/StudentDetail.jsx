import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FolderGit2,
  Award,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Layers,
  FileCode,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import MatchBar from '../components/MatchBar.jsx';
import { fetchStudent } from '../utils/api.js';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'competencies' | 'portfolio' | 'skills'

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchStudent(id)
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load student dossier:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-surface-800 rounded" />
          <div className="h-48 bg-surface-800 rounded-3xl" />
          <div className="h-96 bg-surface-800 rounded-3xl" />
        </div>
      </PageTransition>
    );
  }

  if (!student) {
    return (
      <PageTransition>
        <div className="max-w-xl mx-auto text-center py-20 space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Student Record Not Found</h2>
          <p className="text-surface-400 text-sm">
            Could not find student dossier for ID: <code className="text-brand-400">{id}</code>
          </p>
          <Link to="/students" className="btn-secondary inline-block text-xs">
            Back to Registry
          </Link>
        </div>
      </PageTransition>
    );
  }

  const isFailure = !!student.failureCase;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Back Link */}
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-xs font-mono text-surface-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Registry</span>
        </Link>

        {/* Student Dossier Header Card */}
        <div className="relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 border-surface-700/80">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: student.avatarColor || '#6366f1' }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Left: Avatar + Identity */}
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-2xl text-white shadow-xl border border-white/20"
                style={{ backgroundColor: student.avatarColor || '#6366f1' }}
              >
                {student.avatar || student.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {student.name}
                  </h1>
                  <span className="text-xs font-mono text-surface-400 bg-surface-900 px-2 py-0.5 rounded border border-surface-800">
                    {student.id}
                  </span>
                  {isFailure && (
                    <span className="badge-amber text-xs flex items-center gap-1 font-mono">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{student.failureCaseLabel || 'Edge Case Profile'}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-surface-400">
                  {student.year} • {student.age} Years Old • Verified Evidence Dossier
                </p>

                {/* Declared Interests pills */}
                {student.interests && (
                  <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                      Declared Ambitions:
                    </span>
                    {student.interests.map((interest) => (
                      <span
                        key={interest}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Launch CTA */}
            <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3">
              <Link
                to={`/recommendations?student=${student.id}`}
                className="btn-primary text-xs flex items-center justify-center gap-2 font-semibold"
              >
                <Compass className="w-4 h-4" />
                <span>Run Career Match</span>
              </Link>

              <Link
                to={`/review?student=${student.id}`}
                className="btn-secondary text-xs flex items-center justify-center gap-2 font-semibold"
              >
                <UserCheck className="w-4 h-4 text-brand-400" />
                <span>Counselor Audit</span>
              </Link>
            </div>
          </div>

          {/* Failure Case Alert Banner if applicable */}
          {isFailure && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">
                  Handled Edge Scenario: {student.failureCaseLabel}
                </strong>
                <span>
                  {student.failureCase === 'no_evidence' &&
                    'This student has no project or competency records yet. SkillPath detects this and recommends foundational exploratory pathways rather than hallucinations.'}
                  {student.failureCase === 'high_interest_low_evidence' &&
                    'Student expresses high ambition in an advanced area, but current verified evidence supports a different skill foundation. SkillPath flags the gap for counselor guidance.'}
                  {student.failureCase === 'conflicting_evidence' &&
                    'Signals span conflicting domains (e.g. Creative Arts vs Systems Engineering). SkillPath displays dual match possibilities and flags for counselor dialogue.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dossier Tabs Header */}
        <div className="flex items-center gap-2 border-b border-surface-800 pb-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-accent-emerald" />
            <span>Capstone Projects ({student.projects?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('competencies')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'competencies'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-brand-400" />
            <span>Assessed Competencies</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-purple-400" />
            <span>Portfolios & Links ({student.portfolioLinks?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Demonstrated Skills ({student.demonstratedSkills?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Capstone Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {(!student.projects || student.projects.length === 0) ? (
              <div className="glass-card p-12 text-center rounded-2xl space-y-2">
                <FolderGit2 className="w-8 h-8 text-surface-600 mx-auto" />
                <p className="text-surface-400 font-mono text-xs">
                  Zero verified capstone projects registered.
                </p>
                <p className="text-[11px] text-surface-500">
                  Student needs to submit repo or artifact proof to demonstrate applied capabilities.
                </p>
              </div>
            ) : (
              student.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-2xl space-y-4 border-surface-700/80"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-surface-300 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    {proj.evidenceLink && (
                      <a
                        href={`https://${proj.evidenceLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-900 text-brand-400 border border-surface-700 hover:border-brand-500 text-xs font-mono transition-colors shrink-0 self-start"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>{proj.evidenceLink}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Outcome Highlight */}
                  {proj.outcome && (
                    <div className="p-3 rounded-xl bg-surface-900/60 border border-surface-800/80 text-xs font-mono text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0" />
                      <span>Outcome: {proj.outcome}</span>
                    </div>
                  )}

                  {/* Demonstrated Skills in this project */}
                  {proj.skills && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                        Demonstrated Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.skills.map((sk) => (
                          <span
                            key={sk}
                            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-accent-emerald/10 text-emerald-300 border border-accent-emerald/30"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Assessed Competencies */}
        {activeTab === 'competencies' && (
          <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Criterion-Referenced Rubric Assessments
              </h3>
              <p className="text-xs text-surface-400 mt-1">
                Faculty, mentor and peer evaluated competency ratings (normalized 0–100 scale).
              </p>
            </div>

            {(!student.competencies || Object.keys(student.competencies).length === 0) ? (
              <div className="text-center py-12 text-surface-500 font-mono text-xs">
                No rubric assessments recorded yet for this student.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {Object.entries(student.competencies).map(([compName, score]) => (
                  <div
                    key={compName}
                    className="p-4 rounded-xl bg-surface-900/60 border border-surface-800/80 space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-surface-200 font-semibold">{compName}</span>
                      <span
                        className={`font-bold ${
                          score >= 80
                            ? 'text-accent-emerald'
                            : score >= 65
                            ? 'text-brand-300'
                            : 'text-amber-300'
                        }`}
                      >
                        {score} / 100
                      </span>
                    </div>

                    <div className="h-2 w-full bg-surface-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          score >= 80
                            ? 'bg-accent-emerald'
                            : score >= 65
                            ? 'bg-brand-400'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-surface-500">
                      <span>Threshold: 60 (Competent)</span>
                      <span>{score >= 80 ? 'Exemplary' : score >= 65 ? 'Proficient' : 'Developing'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Portfolios & External Links */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            {(!student.portfolioLinks || student.portfolioLinks.length === 0) ? (
              <div className="glass-card p-12 text-center rounded-2xl text-surface-500 font-mono text-xs">
                No external portfolio repositories or design links provided.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.portfolioLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-5 rounded-2xl flex items-center justify-between gap-4 border-surface-700/80 group"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-white group-hover:text-purple-300 transition-colors">
                        {link.label}
                      </span>
                      <p className="text-[11px] font-mono text-surface-400 mt-0.5 truncate max-w-xs">
                        {link.url}
                      </p>
                    </div>

                    <a
                      href={`https://${link.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Demonstrated Skills Cloud */}
        {activeTab === 'skills' && (
          <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Demonstrated Skill Inventory
              </h3>
              <p className="text-xs text-surface-400 mt-1">
                Extracted directly from code deliverables, rubrics, and project outcomes.
              </p>
            </div>

            {(!student.demonstratedSkills || student.demonstratedSkills.length === 0) ? (
              <div className="text-center py-12 text-surface-500 font-mono text-xs">
                Zero demonstrated skills recorded.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-2">
                {student.demonstratedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-brand-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
