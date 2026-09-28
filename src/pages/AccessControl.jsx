import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import { fetchAuthMe, fetchAuthTokens, setRoleToken, DEMO_TOKENS } from '../utils/api.js';

const ROLE_COLORS = {
  student:   'text-brand-400  bg-brand-500/10  border-brand-500/25',
  counselor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  employer:  'text-purple-400 bg-purple-500/10 border-purple-500/25',
  admin:     'text-amber-400  bg-amber-500/10  border-amber-500/25',
};

const ROLE_DESCRIPTIONS = {
  student:   'Can view own profile and recommendations only. Cannot access other students or metrics.',
  counselor: 'Can read all students, submit reviews, access metrics, and validate stakeholder feedback.',
  employer:  'Can view career profiles, submit feedback, and read aggregated feedback scores.',
  admin:     'Full system access including RBAC registry and all metrics. System administration only.',
};

function PermissionBadge({ perm }) {
  const [action, resource] = perm.split(':');
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-surface-700 bg-surface-800">
      {action === 'read'
        ? <Eye size={10} className="text-surface-400" />
        : <Lock size={10} className="text-brand-400" />}
      <span className="text-surface-300">{perm}</span>
    </span>
  );
}

function TokenCard({ token, onActivate, isActive }) {
  const [showToken, setShowToken] = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const roleColor = ROLE_COLORS[token.role] || '';

  return (
    <motion.div layout
      className={`glass rounded-xl border transition-all ${
        isActive ? 'border-brand-500/40 ring-1 ring-brand-500/20' : 'border-surface-700/40'
      }`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${roleColor}`}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-white text-sm">{token.displayName}</p>
                {isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300">
                    Active Session
                  </span>
                )}
              </div>
              <p className="text-surface-400 text-xs">{token.username}</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${roleColor}`}>
            {token.role}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-surface-800 border border-surface-700 rounded-lg px-3 py-1.5 text-xs font-mono text-surface-300">
            {showToken ? token.token : '•'.repeat(Math.min(token.token.length, 32))}
          </div>
          <button onClick={() => setShowToken(!showToken)}
            className="p-1.5 rounded-lg border border-surface-700 text-surface-400 hover:text-white transition-colors">
            {showToken ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          <button onClick={() => onActivate(token.role)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isActive
                ? 'border-brand-500/30 bg-brand-500/10 text-brand-300 cursor-default'
                : 'border-surface-600 text-surface-300 hover:border-brand-500/50 hover:text-brand-400'
            }`}>
            {isActive ? <><Unlock size={10} className="inline mr-1" />Active</> : 'Activate'}
          </button>
        </div>

        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1.5 text-xs text-surface-400 hover:text-white transition-colors">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {token.permissions.length} permissions
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-surface-700/30 pt-3 space-y-3">
              <p className="text-xs text-surface-400">{ROLE_DESCRIPTIONS[token.role]}</p>
              <div className="flex flex-wrap gap-2">
                {token.permissions.map(p => <PermissionBadge key={p} perm={p} />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AccessControl() {
  const [identity, setIdentity]     = useState(null);
  const [tokens, setTokens]         = useState([]);
  const [activeRole, setActiveRole] = useState('counselor');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [notification, setNotif]    = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchAuthMe(), fetchAuthTokens()])
      .then(([me, tokData]) => {
        setIdentity(me);
        setTokens(tokData.tokens || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, []);

  const handleActivate = (role) => {
    setRoleToken(role);
    setActiveRole(role);
    setNotif({ type: 'success', message: `Session switched to ${role} role. Re-loading identity...` });
    setTimeout(() => {
      fetchAuthMe()
        .then(me => { setIdentity(me); setNotif(null); })
        .catch(() => setNotif({ type: 'error', message: 'Failed to reload identity.' }));
    }, 400);
  };

  const roleGroups = {
    student:   tokens.filter(t => t.role === 'student'),
    counselor: tokens.filter(t => t.role === 'counselor'),
    employer:  tokens.filter(t => t.role === 'employer'),
    admin:     tokens.filter(t => t.role === 'admin'),
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Key size={20} className="text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Role-Based Access Control</h1>
          </div>
          <p className="text-surface-400 text-sm max-w-xl">
            Server-enforced RBAC via Bearer token authentication. Phase 2 replaces mock UI
            dropdowns with actual access checks on every protected API endpoint.
          </p>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
                notification.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}>
              {notification.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Identity Panel */}
        {identity && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl border p-5 ${ROLE_COLORS[identity.user?.role] || 'border-surface-700'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${ROLE_COLORS[identity.user?.role] || ''}`}>
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-surface-400 mb-0.5">Active Session Identity</p>
                <p className="font-bold text-white">{identity.user?.displayName}</p>
                <p className="text-xs text-surface-400">{identity.user?.username} · <span className="capitalize">{identity.user?.role}</span></p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(identity.permissions || []).map(p => <PermissionBadge key={p} perm={p} />)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="glass rounded-xl border border-red-500/30 p-4 text-red-300 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Token Registry */}
        {!loading && tokens.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} className="text-brand-400" />
              <h2 className="font-semibold text-white">Demo Token Registry</h2>
              <span className="text-xs text-surface-500">({tokens.length} demo accounts)</span>
            </div>

            <div className="space-y-6">
              {Object.entries(roleGroups).map(([role, roleTokens]) =>
                roleTokens.length > 0 && (
                  <div key={role}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-2 w-2 rounded-full ${
                        role === 'student'   ? 'bg-brand-400' :
                        role === 'counselor' ? 'bg-emerald-400' :
                        role === 'employer'  ? 'bg-purple-400' : 'bg-amber-400'
                      }`} />
                      <h3 className="text-sm font-medium text-surface-300 capitalize">{role} Accounts</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roleTokens.map(t => (
                        <TokenCard key={t.token} token={t}
                          isActive={t.token === DEMO_TOKENS[activeRole]}
                          onActivate={handleActivate} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Architecture Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass rounded-xl border border-surface-700/40 p-5">
          <h3 className="font-medium text-white text-sm mb-3 flex items-center gap-2">
            <Lock size={14} className="text-brand-400" /> How Server-Enforced RBAC Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-surface-400">
            <div>
              <p className="text-surface-300 font-medium mb-1">1. Token Validation</p>
              <p>Every protected request passes through <code className="text-brand-300">get_current_user()</code> — FastAPI's dependency injection. Invalid tokens return HTTP 401.</p>
            </div>
            <div>
              <p className="text-surface-300 font-medium mb-1">2. Permission Check</p>
              <p><code className="text-brand-300">require_permission("write:review")</code> wraps sensitive endpoints. Wrong role returns HTTP 403 — not a UI hide.</p>
            </div>
            <div>
              <p className="text-surface-300 font-medium mb-1">3. Own-Record Isolation</p>
              <p>Students are checked against <code className="text-brand-300">require_own_student()</code>. Accessing another student's record returns HTTP 403 at the server layer.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
