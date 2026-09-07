import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Fingerprint, MapPin, MessageSquare, Activity } from 'lucide-react';

const NEVER_COLLECTED = [
  { icon: Eye,            label: 'Webcam monitoring' },
  { icon: Fingerprint,    label: 'Keystroke tracking' },
  { icon: MapPin,         label: 'Location tracking' },
  { icon: Activity,       label: 'Facial / emotion monitoring' },
  { icon: MessageSquare,  label: 'Private messages' },
  { icon: EyeOff,         label: 'Punitive behaviour scoring' },
];

export default function EthicsBanner({ compact = false }) {
  if (compact) {
    return (
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/[0.07]
                   border border-emerald-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Shield size={14} className="text-emerald-400 shrink-0" />
        <span className="text-xs text-emerald-300/80 font-medium">
          Evidence-based, not surveillance-based.
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Shield size={20} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Ethical Data Policy</h3>
          <p className="text-xs text-emerald-400/80 font-medium">
            Evidence-based, not surveillance-based.
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        SkillPath uses only <span className="text-slate-200 font-medium">projects</span>,{' '}
        <span className="text-slate-200 font-medium">assessed competencies</span>,{' '}
        <span className="text-slate-200 font-medium">portfolios</span>,{' '}
        <span className="text-slate-200 font-medium">interests</span>, and{' '}
        <span className="text-slate-200 font-medium">career role requirements</span>.
      </p>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400/70 mb-2">
          Never collected
        </p>
        <div className="grid grid-cols-2 gap-2">
          {NEVER_COLLECTED.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs text-slate-500"
            >
              <item.icon size={12} className="text-red-400/50 shrink-0" />
              <span className="line-through decoration-red-400/30">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
