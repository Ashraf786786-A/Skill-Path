import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Compass, UserCheck } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter.jsx';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-b from-surface-900/80 via-surface-950/90 to-surface-950/95 backdrop-blur-xl p-8 md:p-12 mb-10 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[400px] h-[200px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Tagline Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider mb-6 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
        <span>Evidence-First Career Architecture</span>
        <span className="text-surface-500">•</span>
        <span className="text-surface-400">Zero Surveillance</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-4xl"
      >
        Discover Careers Through What Students Can{' '}
        <span className="text-gradient-brand">Actually Demonstrate.</span>
      </motion.h1>

      {/* Philosophy Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-base sm:text-lg text-surface-300 max-w-3xl leading-relaxed font-sans"
      >
        Moving beyond static GPA grades to recommend careers grounded in tangible{' '}
        <span className="text-brand-300 font-medium">Projects</span>,{' '}
        <span className="text-accent-emerald font-medium">Assessed Competencies</span>,{' '}
        <span className="text-purple-300 font-medium">Portfolios</span>, and{' '}
        <span className="text-amber-300 font-medium">Authentic Interests</span> matched directly to real-world career taxonomies.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center gap-4"
      >
        <Link
          to="/recommendations"
          className="btn-primary inline-flex items-center gap-2 group text-sm font-semibold"
        >
          <span>Run Evidence Matcher</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          to="/review"
          className="btn-secondary inline-flex items-center gap-2 text-sm font-semibold"
        >
          <UserCheck className="w-4 h-4 text-brand-400" />
          <span>Human-in-the-Loop Audit</span>
        </Link>

        <Link
          to="/skills"
          className="btn-ghost inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white"
        >
          <Compass className="w-4 h-4" />
          <span>Explore 3D Skill Graph</span>
        </Link>
      </motion.div>

      {/* Metrics Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 pt-8 border-t border-surface-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6"
      >
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center">
            <AnimatedCounter target={10} />
            <span className="text-brand-400 text-xl font-normal ml-0.5">stu</span>
          </div>
          <p className="text-xs text-surface-400 font-mono uppercase tracking-wider">
            Curated Student Profiles
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center">
            <AnimatedCounter target={8} />
            <span className="text-accent-emerald text-xl font-normal ml-0.5">roles</span>
          </div>
          <p className="text-xs text-surface-400 font-mono uppercase tracking-wider">
            Mapped Career Taxonomies
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center">
            <AnimatedCounter target={4} />
            <span className="text-purple-400 text-xl font-normal ml-0.5">sources</span>
          </div>
          <p className="text-xs text-surface-400 font-mono uppercase tracking-wider">
            Multi-Modal Evidence Types
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center">
            <AnimatedCounter target={100} />
            <span className="text-brand-400 text-xl font-normal ml-0.5">%</span>
          </div>
          <p className="text-xs text-surface-400 font-mono uppercase tracking-wider">
            Explainable (Zero Black-Box)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
