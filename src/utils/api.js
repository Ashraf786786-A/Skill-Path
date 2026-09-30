const API_BASE = 'http://127.0.0.1:8000';

// ---------------------------------------------------------------------------
// Demo tokens registry (Phase 2 — RBAC)
// In a real app these would be obtained via OAuth2 login flow.
// ---------------------------------------------------------------------------
export const DEMO_TOKENS = {
  counselor: 'counselor-token-jane',
  admin:     'admin-token-system',
  employer:  'employer-token-techcorp',
  student:   'student-token-aisha',
};

// Active session token — counselor by default for full demo access
let _activeToken = DEMO_TOKENS.counselor;

export function setActiveToken(token)  { _activeToken = token; }
export function getActiveToken()       { return _activeToken; }
export function setRoleToken(role)     { _activeToken = DEMO_TOKENS[role] || DEMO_TOKENS.counselor; }

// ---------------------------------------------------------------------------
// Core fetch helper (with auth header)
// ---------------------------------------------------------------------------
async function apiFetch(path, options = {}, requireAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (_activeToken || requireAuth) {
    headers['Authorization'] = `Bearer ${_activeToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { headers, ...options });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Phase 1 — Core API (unchanged)
// ---------------------------------------------------------------------------
export const fetchStudents           = ()   => apiFetch('/students');
export const fetchStudent            = (id) => apiFetch(`/students/${id}`);
export const fetchCareers            = ()   => apiFetch('/careers');
export const fetchRecommendations    = (id) => apiFetch(`/recommendations/${id}`);
export const fetchStats              = ()   => apiFetch('/stats');
export const fetchReviews            = ()   => apiFetch('/reviews', {}, true);
export const submitReview            = (data) => apiFetch('/review', {
  method: 'POST',
  body: JSON.stringify(data),
}, true);

// ---------------------------------------------------------------------------
// Phase 2 — Auth
// ---------------------------------------------------------------------------
export const fetchAuthMe             = ()   => apiFetch('/auth/me', {}, true);
export const fetchAuthTokens         = ()   => apiFetch('/auth/tokens', {}, true);

// ---------------------------------------------------------------------------
// Phase 2 — Operational Health
// ---------------------------------------------------------------------------
export const fetchSystemHealth       = ()   => apiFetch('/health');
export const fetchAllStudentHealth   = ()   => apiFetch('/health/students', {}, true);
export const fetchStudentHealth      = (id) => apiFetch(`/health/students/${id}`);

// ---------------------------------------------------------------------------
// Phase 2 — Metrics / Baseline Comparison
// ---------------------------------------------------------------------------
export const fetchMetricsAll         = ()   => apiFetch('/metrics/comparison', {}, true);
export const fetchMetricsStudent     = (id) => apiFetch(`/metrics/comparison/${id}`, {}, true);

// ---------------------------------------------------------------------------
// Phase 2 — Stakeholder Feedback
// ---------------------------------------------------------------------------
export const fetchFeedback           = ()   => apiFetch('/feedback', {}, true);
export const fetchFeedbackAggregate  = ()   => apiFetch('/feedback/aggregate', {}, true);
export const submitFeedback          = (data) => apiFetch('/feedback', {
  method: 'POST',
  body: JSON.stringify(data),
}, true);

// ---------------------------------------------------------------------------
// Phase 3 — Automated Ingestion (Classroom & LMS)
// ---------------------------------------------------------------------------
export const fetchIngestionSummary   = ()   => apiFetch('/ingestion/summary');
export const fetchIngestionEvents    = (limit = 50) => apiFetch(`/ingestion/events?limit=${limit}`);
export const simulateIngestion       = (data) => apiFetch('/ingestion/simulate', {
  method: 'POST',
  body: JSON.stringify(data),
}, true);
export const triggerLtiSync          = ()   => apiFetch('/ingestion/lti/sync', { method: 'POST' });

// ---------------------------------------------------------------------------
// Phase 3 — Semantic Intelligence
// ---------------------------------------------------------------------------
export const fetchSemanticModels     = ()   => apiFetch('/semantic/models');
export const extractSemanticRubric   = (data) => apiFetch('/semantic/extract', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const batchAnalyzeCohort      = ()   => apiFetch('/semantic/batch-analyze', {
  method: 'POST',
}, true);

// ---------------------------------------------------------------------------
// Phase 3 — Enterprise Compliance & Cryptographic Audit
// ---------------------------------------------------------------------------
export const fetchAuditLedger        = ()   => apiFetch('/compliance/audit-ledger', {}, true);
export const verifyAuditLedger       = ()   => apiFetch('/compliance/verify-ledger', { method: 'POST' });
export const simulateTamperAttack    = ()   => apiFetch('/compliance/tamper-test', { method: 'POST' });
export const restoreAuditLedger      = ()   => apiFetch('/compliance/restore-ledger', { method: 'POST' });
export const simulateSamlLogin       = (data) => apiFetch('/compliance/sso/login', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const exportFerpaDossier      = (studentId) => apiFetch(`/compliance/export-dossier/${studentId}`, {
  method: 'POST',
}, true);
export const anonymizeStudent        = (studentId) => apiFetch(`/compliance/anonymize/${studentId}`, {
  method: 'POST',
}, true);

// ---------------------------------------------------------------------------
// Phase 3 — Labor Market Telemetry (Lightcast & O*NET)
// ---------------------------------------------------------------------------
export const fetchMarketDemand       = ()   => apiFetch('/telemetry/market-demand');
export const fetchStudentMarketGap   = (studentId, careerId) => {
  const url = careerId ? `/telemetry/market-gap/${studentId}?career_id=${careerId}` : `/telemetry/market-gap/${studentId}`;
  return apiFetch(url);
};

// ---------------------------------------------------------------------------
// Unified api object
// ---------------------------------------------------------------------------
export const api = {
  // Phase 1
  getStudents:        fetchStudents,
  getStudent:         fetchStudent,
  getCareers:         fetchCareers,
  getRecommendations: fetchRecommendations,
  getStats:           fetchStats,
  getReviews:         fetchReviews,
  submitReview,

  // Phase 2 — Auth
  getAuthMe:          fetchAuthMe,
  getAuthTokens:      fetchAuthTokens,
  setRoleToken,
  setActiveToken,
  getActiveToken,

  // Phase 2 — Health
  getSystemHealth:    fetchSystemHealth,
  getAllStudentHealth: fetchAllStudentHealth,
  getStudentHealth:   fetchStudentHealth,

  // Phase 2 — Metrics
  getMetricsAll:      fetchMetricsAll,
  getMetricsStudent:  fetchMetricsStudent,

  // Phase 2 — Feedback
  getFeedback:        fetchFeedback,
  getFeedbackAggregate: fetchFeedbackAggregate,
  submitFeedback,

  // Phase 3 — Automated Ingestion
  getIngestionSummary: fetchIngestionSummary,
  getIngestionEvents:  fetchIngestionEvents,
  simulateIngestion,
  triggerLtiSync,

  // Phase 3 — Semantic Intelligence
  getSemanticModels:   fetchSemanticModels,
  extractSemanticRubric,
  batchAnalyzeCohort,

  // Phase 3 — Enterprise Compliance
  getAuditLedger:      fetchAuditLedger,
  verifyAuditLedger,
  simulateTamperAttack,
  restoreAuditLedger,
  simulateSamlLogin,
  exportFerpaDossier,
  anonymizeStudent,

  // Phase 3 — Labor Market Telemetry
  getMarketDemand:     fetchMarketDemand,
  getStudentMarketGap: fetchStudentMarketGap,
};

export default api;
