const API_BASE = 'http://127.0.0.1:8000';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }
  return res.json();
}

export const fetchStudents = () => apiFetch('/students');
export const fetchStudent = (id) => apiFetch(`/students/${id}`);
export const fetchCareers = () => apiFetch('/careers');
export const fetchRecommendations = (studentId) => apiFetch(`/recommendations/${studentId}`);
export const fetchStats = () => apiFetch('/stats');
export const fetchReviews = () => apiFetch('/reviews');
export const submitReview = (data) =>
  apiFetch('/review', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const api = {
  getStudents: fetchStudents,
  getStudent: fetchStudent,
  getCareers: fetchCareers,
  getRecommendations: fetchRecommendations,
  getStats: fetchStats,
  getReviews: fetchReviews,
  submitReview,
};

export default api;
