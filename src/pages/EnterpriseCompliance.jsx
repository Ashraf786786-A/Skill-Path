import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Database,
  FileCheck2,
  Download,
  UserX,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import {
  fetchAuditLedger,
  verifyAuditLedger,
  simulateTamperAttack,
  restoreAuditLedger,
  simulateSamlLogin,
  exportFerpaDossier,
  anonymizeStudent,
  setActiveToken,
} from '../utils/api.js';

export default function EnterpriseCompliance() {
  const [ledger, setLedger] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // SAML SSO state
  const [ssoInstitution, setSsoInstitution] = useState('berkeley.edu');
  const [ssoAffiliation, setSsoAffiliation] = useState('faculty');
  const [ssoUsername, setSsoUsername] = useState('dr.jane.miller');
  const [ssoResult, setSsoResult] = useState(null);

  // FERPA / GDPR Export state
  const [selectedStudent, setSelectedStudent] = useState('s001');
  const [exportedDossier, setExportedDossier] = useState(null);
  const [anonymizeMsg, setAnonymizeMsg] = useState('');

  const loadLedger = async () => {
    try {
      const res = await fetchAuditLedger().catch(() => ({ chain: [] }));
      if (res && res.chain) setLedger(res.chain);
    } catch (err) {
      console.error('Error loading audit ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setStatusMessage('');
    try {
      const res = await verifyAuditLedger();
      setVerification(res);
      if (res.valid) {
        setStatusMessage('Blockchain cryptographic verification successful. All Merkle hash pointers valid.');
      } else {
        setStatusMessage('TAMPERING DETECTED! Cryptographic hash mismatch identified.');
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleTamperTest = async () => {
    setTampering(true);
    try {
      const res = await simulateTamperAttack();
      setStatusMessage(res.message);
      await loadLedger();
      // Auto-trigger verification to reveal the breach!
      const verifyRes = await verifyAuditLedger();
      setVerification(verifyRes);
    } catch (err) {
      console.error('Tamper attack error:', err);
    } finally {
      setTampering(false);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreAuditLedger();
      setStatusMessage('Audit ledger restored to pristine signed state.');
      setVerification(null);
      await loadLedger();
    } catch (err) {
      console.error('Restore error:', err);
    }
  };

  const handleSsoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await simulateSamlLogin({
        institution: ssoInstitution,
        affiliation: ssoAffiliation,
        username: ssoUsername,
      });
      setSsoResult(res);
      if (res.bearerToken) {
        setActiveToken(res.bearerToken);
      }
      setStatusMessage(`Authenticated via Shibboleth SAML 2.0 WebSSO as ${res.attributes.displayName}.`);
      await loadLedger();
    } catch (err) {
      console.error('SAML login error:', err);
    }
  };

  const handleExportDossier = async () => {
    try {
      const res = await exportFerpaDossier(selectedStudent);
      setExportedDossier(res);
      setStatusMessage(`FERPA/GDPR Article 20 export package generated for ${res.studentName}.`);
      await loadLedger();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleAnonymize = async () => {
    if (!confirm('Are you sure you want to anonymize this student PII under GDPR Article 17?')) return;
    try {
      const res = await anonymizeStudent(selectedStudent);
      setAnonymizeMsg(res.message);
      setStatusMessage(res.message);
      await loadLedger();
    } catch (err) {
      console.error('Anonymize error:', err);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Phase 3 Enterprise Compliance
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck size={13} />
                FERPA & GDPR Cryptographic Audit Ledger
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Enterprise Governance & Security Audit
            </h1>
            <p className="text-sm text-surface-400 mt-0.5">
              Tamper-evident SHA-256 cryptographic blockchain ledger, SAML 2.0 / Shibboleth SSO, and student data rights.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              <ShieldCheck size={14} className={verifying ? 'animate-spin' : ''} />
              {verifying ? 'Verifying Chain...' : 'Verify Cryptographic Integrity'}
            </button>
            <button
              onClick={handleTamperTest}
              disabled={tampering}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-300 transition-colors"
              title="Test attack detection"
            >
              <ShieldAlert size={14} />
              Simulate Tamper
            </button>
            {verification && !verification.valid && (
              <button
                onClick={handleRestore}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-850 hover:bg-surface-800 border border-white/10 text-xs text-white transition-colors"
              >
                <RefreshCw size={13} /> Restore
              </button>
            )}
          </div>
        </div>

        {/* Status / Alert Banner */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                verification && !verification.valid
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {verification && !verification.valid ? (
                  <AlertTriangle size={15} className="text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                )}
                <span className="font-medium">{statusMessage}</span>
              </div>
              <button
                onClick={() => setStatusMessage('')}
                className="text-[11px] underline opacity-80 hover:opacity-100 ml-4"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Summary Card */}
        {verification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border glass ${
              verification.valid ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 'border-red-500/40 bg-red-500/[0.05]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    verification.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {verification.valid ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {verification.valid ? 'Cryptographic Chain Validated' : 'Cryptographic Integrity Broken!'}
                  </p>
                  <p className="text-xs text-surface-400">
                    {verification.blocksCount} blocks checked from Genesis to Tip · Re-computed SHA-256 hashes match.
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  verification.valid
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                STATUS: {verification.status}
              </span>
            </div>

            {verification.tamperedBlocks?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-red-500/20 space-y-2">
                <p className="text-xs font-semibold text-red-400">Corrupted Block Diagnostics:</p>
                {verification.tamperedBlocks.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-mono text-red-200">
                    Block #{t.index}: {t.reason} (Expected: {t.expectedHash?.slice(0, 16)}... Found: {t.foundHash?.slice(0, 16)}...)
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Cryptographic Ledger Blockchain Viewer */}
        <div className="glass p-5 rounded-2xl border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-brand-400" />
              <h2 className="text-base font-semibold text-white">
                Immutable Cryptographic Block Chain
              </h2>
            </div>
            <span className="text-xs font-mono text-surface-400">
              {ledger.length} Block{ledger.length !== 1 ? 's' : ''} in Ledger
            </span>
          </div>

          <div className="space-y-3 overflow-x-auto">
            {ledger.map((b, i) => (
              <motion.div
                key={b.index || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-3.5 rounded-xl bg-surface-900/90 border border-white/[0.06] text-xs hover:border-brand-500/30 transition-all font-mono"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold text-[11px]">
                      BLOCK #{b.index}
                    </span>
                    <span className="text-white font-sans font-semibold text-xs">{b.action}</span>
                  </div>
                  <span className="text-[10px] text-surface-500">
                    {new Date(b.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-surface-400 py-1.5 border-y border-white/[0.04]">
                  <div>
                    <span className="text-surface-500">Actor:</span>{' '}
                    <span className="text-slate-200">{b.actor}</span> ({b.role})
                  </div>
                  <div>
                    <span className="text-surface-500">Target:</span>{' '}
                    <span className="text-slate-200">{b.target}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-surface-500">Prev:</span>{' '}
                    <span className="text-surface-400">{b.prevHash?.slice(0, 16)}...</span>
                  </div>
                  <div className="truncate">
                    <span className="text-surface-500">Hash:</span>{' '}
                    <span className="text-emerald-400">{b.hash?.slice(0, 16)}...</span>
                  </div>
                </div>

                {b.payload && (
                  <div className="mt-2 text-[10px] text-surface-400 bg-surface-950/60 p-2 rounded-lg truncate">
                    Payload: {JSON.stringify(b.payload)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lower Two Columns: SAML 2.0 SSO & FERPA Rights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SAML 2.0 / Shibboleth Institutional SSO */}
          <div className="glass p-5 rounded-2xl border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-purple-400" />
                <h2 className="text-base font-semibold text-white">
                  SAML 2.0 / Shibboleth Institutional SSO
                </h2>
              </div>
              <a
                href="http://127.0.0.1:8000/compliance/sso/metadata.xml"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 underline"
              >
                <FileCode size={12} /> SP Metadata.xml
              </a>
            </div>
            <p className="text-xs text-surface-400">
              Enterprise single sign-on federated with university InCommon identity providers (IdP).
            </p>

            <form onSubmit={handleSsoSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  University / Federation Entity
                </label>
                <select
                  value={ssoInstitution}
                  onChange={(e) => setSsoInstitution(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="berkeley.edu">UC Berkeley (urn:mace:incommon:berkeley.edu)</option>
                  <option value="stanford.edu">Stanford University (urn:mace:incommon:stanford.edu)</option>
                  <option value="mit.edu">MIT (urn:mace:incommon:mit.edu)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                    Affiliation
                  </label>
                  <select
                    value={ssoAffiliation}
                    onChange={(e) => setSsoAffiliation(e.target.value)}
                    className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="faculty">Faculty / Counselor</option>
                    <option value="student">Enrolled Student</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={ssoUsername}
                    onChange={(e) => setSsoUsername(e.target.value)}
                    className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Lock size={13} /> Authenticate via Shibboleth WebSSO
              </button>
            </form>

            {ssoResult && (
              <div className="p-3 rounded-xl bg-surface-900 border border-white/[0.06] text-xs space-y-1 font-mono">
                <p className="text-emerald-400 font-semibold font-sans">
                  SAML Assertion Validated
                </p>
                <p className="text-surface-400 text-[11px]">
                  Principal: {ssoResult.attributes?.eduPersonPrincipalName}
                </p>
                <p className="text-surface-400 text-[11px]">
                  Scoped Affiliation: {ssoResult.attributes?.eduPersonScopedAffiliation}
                </p>
                <p className="text-surface-400 text-[11px]">
                  Active Role: {ssoResult.assignedRole}
                </p>
              </div>
            )}
          </div>

          {/* FERPA & GDPR Rights Management */}
          <div className="glass p-5 rounded-2xl border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck2 size={16} className="text-accent-cyan" />
              <h2 className="text-base font-semibold text-white">
                FERPA & GDPR Rights Management
              </h2>
            </div>
            <p className="text-xs text-surface-400">
              34 CFR Part 99 Data Portability (Article 20) and Right to Erasure / Pseudonymization (Article 17).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="s001">Aisha Patel (s001)</option>
                  <option value="s002">Marcus Thompson (s002)</option>
                  <option value="s003">Priya Sharma (s003)</option>
                  <option value="s004">Omar Ali (s004)</option>
                  <option value="s005">Sophie Chen (s005)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportDossier}
                  className="py-2.5 px-3 rounded-xl bg-surface-850 hover:bg-surface-800 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={13} /> Export Article 20 Package
                </button>
                <button
                  type="button"
                  onClick={handleAnonymize}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <UserX size={13} /> GDPR Pseudonymize
                </button>
              </div>

              {exportedDossier && (
                <div className="p-3 rounded-xl bg-surface-900 border border-white/[0.06] space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-sans font-semibold">
                      Cryptographically Signed Package
                    </span>
                    <span className="text-surface-500">FERPA Part 99</span>
                  </div>
                  <div className="text-[10px] text-surface-400 break-all bg-surface-950/80 p-2 rounded">
                    Signature: {exportedDossier.cryptographicDigitalSignature}
                  </div>
                  <p className="text-[11px] text-surface-400 font-sans">
                    Includes 4 evidence pillars, project repositories, rubric assessments, and custodian retention schedules.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
