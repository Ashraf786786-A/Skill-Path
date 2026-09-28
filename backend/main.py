"""
SkillPath — FastAPI Backend  (Phase 2 — v0.2.0)
=================================================
Evidence-based career recommendation API.

Endpoints (v1 — Phase 1):
  GET  /students                       - List all students
  GET  /students/{id}                  - Student detail
  GET  /careers                        - List all careers
  GET  /recommendations/{student_id}   - Compute recommendations
  POST /review                         - Save approval or override
  GET  /reviews                        - All review decisions
  GET  /stats                          - Dashboard statistics

New Endpoints (Phase 2 — v0.2.0):
  GET  /auth/tokens                    - Demo token registry (admin only)
  GET  /auth/me                        - Current user identity
  GET  /health                         - Dataset freshness & system health
  GET  /health/students                - Full health scan for all students
  GET  /health/students/{id}           - Health scan for one student
  GET  /metrics/comparison             - Marks-only vs evidence-based metrics
  GET  /metrics/comparison/{id}        - Per-student comparison
  GET  /feedback                       - All stakeholder feedback
  GET  /feedback/aggregate             - Aggregated feedback scores
  POST /feedback                       - Submit new stakeholder feedback

Authentication:
  All sensitive endpoints require  Authorization: Bearer <token>
  See /auth/tokens (admin) or README for demo tokens.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from data_loader import STUDENTS, CAREERS, STUDENTS_BY_ID, CAREERS_BY_ID
from recommender import compute_recommendations

# Phase 2 modules
from auth import (
    get_current_user, get_optional_user, require_permission,
    require_own_student, get_demo_tokens,
)
from health import (
    check_dataset_freshness, run_student_health_scan,
    detect_stale_evidence, compute_missing_evidence_fallback,
)
from metrics import (
    compare_recommenders_for_student, compute_aggregate_metrics,
)
from feedback import (
    FEEDBACK_STORE, aggregate_feedback, add_feedback, get_all_feedback,
)

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SkillPath API",
    description=(
        "Evidence-based career recommendation API — Phase 2. "
        "Uses only projects, competencies, portfolios and interests. "
        "No surveillance data. SYNTHETIC PROTOTYPE DATASET."
    ),
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory review store (Phase 1 — unchanged)
# ---------------------------------------------------------------------------

REVIEWS: dict[str, dict] = {}

VALID_OVERRIDE_REASONS = [
    "Additional evidence",
    "Student preference",
    "Teacher assessment",
    "Insufficient evidence",
    "Other",
]


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class ReviewRequest(BaseModel):
    studentId: str
    careerId: str
    action: str
    overrideReason: Optional[str] = None
    overrideNotes: Optional[str] = None
    reviewerName: Optional[str] = "Human Reviewer"


class FeedbackRequest(BaseModel):
    stakeholderType: str         # "student" | "counselor" | "employer"
    stakeholderName: str
    studentId: Optional[str] = None
    careerId: Optional[str] = None
    careerTitle: Optional[str] = None
    ratings: dict
    comment: Optional[str] = None
    wouldActOn: Optional[bool] = None
    wouldRecommendToColleague: Optional[bool] = None
    wouldUseForHiring: Optional[bool] = None
    overallQuality: Optional[int] = None
    recommendationAccurate: Optional[bool] = None


# ===========================================================================
# ROOT
# ===========================================================================

@app.get("/")
def root():
    return {
        "name":    "SkillPath API",
        "version": "0.2.0",
        "note":    "SYNTHETIC PROTOTYPE DATASET — Evidence-based, not surveillance-based.",
        "phase1_endpoints": [
            "GET /students", "GET /students/{id}", "GET /careers",
            "GET /recommendations/{id}", "POST /review",
            "GET /reviews", "GET /stats",
        ],
        "phase2_endpoints": [
            "GET /auth/me", "GET /auth/tokens",
            "GET /health", "GET /health/students", "GET /health/students/{id}",
            "GET /metrics/comparison", "GET /metrics/comparison/{id}",
            "GET /feedback", "GET /feedback/aggregate", "POST /feedback",
        ],
    }


# ===========================================================================
# PHASE 1 — CORE ENDPOINTS (now with optional auth header support)
# ===========================================================================

@app.get("/students")
def list_students(current_user: Optional[dict] = Depends(get_optional_user)):
    """
    Return all students (summary view).
    Students can call this; filtering to own record happens client-side.
    Open in prototype — add require_permission("read:all_students") in production.
    """
    summaries = []
    for s in STUDENTS:
        summaries.append({
            "id":              s["id"],
            "name":            s["name"],
            "age":             s["age"],
            "year":            s["year"],
            "avatar":          s["avatar"],
            "avatarColor":     s["avatarColor"],
            "skillCount":      len(s.get("demonstratedSkills", [])),
            "projectCount":    len(s.get("projects", [])),
            "interests":       s.get("interests", []),
            "failureCase":     s.get("failureCase"),
            "failureCaseLabel":s.get("failureCaseLabel"),
        })
    return {"students": summaries, "total": len(summaries)}


@app.get("/students/{student_id}")
def get_student(
    student_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """
    Return full student detail.
    If authenticated as a student, enforces own-record access.
    Counselors and admins can read all records.
    """
    if current_user and current_user["role"] == "student":
        require_own_student(student_id, current_user)

    student = STUDENTS_BY_ID.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found.")

    # Attach health scan
    health = run_student_health_scan(student, STUDENTS)
    reviews = REVIEWS.get(student_id, {})
    return {**student, "reviews": reviews, "healthScan": health}


@app.get("/careers")
def list_careers():
    return {"careers": CAREERS, "total": len(CAREERS)}


@app.get("/recommendations/{student_id}")
def get_recommendations(
    student_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """
    Compute transparent skill-overlap recommendations.
    Students restricted to own record. Counselors/admins see all.
    Blocked if student has insufficient evidence.
    """
    if current_user and current_user["role"] == "student":
        require_own_student(student_id, current_user)

    student = STUDENTS_BY_ID.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found.")

    # Health / evidence gate
    health = run_student_health_scan(student, STUDENTS)
    evidence_check = health["evidenceFallback"]

    if not evidence_check["hasSufficientEvidence"]:
        return {
            "studentId":   student_id,
            "studentName": student["name"],
            "recommendations": [],
            "blocked":     True,
            "blockReason": evidence_check["fallbackMessage"],
            "healthScan":  health,
            "dataLabel":   "SYNTHETIC PROTOTYPE DATASET",
        }

    recommendations = compute_recommendations(student, CAREERS)
    student_reviews  = REVIEWS.get(student_id, {})
    for rec in recommendations:
        career_id = rec["careerId"]
        review    = student_reviews.get(career_id)
        if review:
            rec["reviewStatus"] = review["status"]
            rec["reviewRecord"] = review
        else:
            rec["reviewStatus"] = "pending"
            rec["reviewRecord"] = None

    return {
        "studentId":        student_id,
        "studentName":      student["name"],
        "recommendations":  recommendations,
        "blocked":          False,
        "healthScan":       health,
        "dataLabel":        "SYNTHETIC PROTOTYPE DATASET",
        "ethicsNote": (
            "Recommendations are based solely on demonstrated projects, "
            "competencies, portfolios and interests. No surveillance data used."
        ),
        "algorithmType":    "Transparent Skill-Overlap Matching",
        "generatedAt":      datetime.now(timezone.utc).isoformat(),
    }


@app.post("/review")
def submit_review(
    review: ReviewRequest,
    current_user: dict = Depends(require_permission("write:review")),
):
    """
    Save a human review (approve or override).
    Requires: counselor or admin role.
    """
    if review.studentId not in STUDENTS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Student '{review.studentId}' not found.")
    if review.careerId not in CAREERS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Career '{review.careerId}' not found.")
    if review.action not in ("approve", "override"):
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'override'.")
    if review.action == "override":
        if not review.overrideReason:
            raise HTTPException(status_code=400, detail="Override requires a reason.")
        if review.overrideReason not in VALID_OVERRIDE_REASONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid override reason. Valid: {', '.join(VALID_OVERRIDE_REASONS)}",
            )

    record = {
        "studentId":      review.studentId,
        "careerId":       review.careerId,
        "action":         review.action,
        "overrideReason": review.overrideReason,
        "overrideNotes":  review.overrideNotes,
        "reviewerName":   current_user["displayName"],
        "reviewerRole":   current_user["role"],
        "timestamp":      datetime.now(timezone.utc).isoformat(),
        "status":         "approved" if review.action == "approve" else "overridden",
    }

    REVIEWS.setdefault(review.studentId, {})[review.careerId] = record
    return {"success": True, "message": f"Review saved: {record['status']}", "record": record}


@app.get("/reviews")
def list_all_reviews(
    current_user: dict = Depends(require_permission("read:reviews")),
):
    """Return all saved review decisions. Requires: counselor or admin role."""
    flat = []
    for student_id, career_reviews in REVIEWS.items():
        student = STUDENTS_BY_ID.get(student_id, {})
        for career_id, record in career_reviews.items():
            career = CAREERS_BY_ID.get(career_id, {})
            flat.append({
                **record,
                "studentName": student.get("name", student_id),
                "careerTitle": career.get("title", career_id),
            })
    flat.sort(key=lambda r: r["timestamp"], reverse=True)
    return {"reviews": flat, "total": len(flat)}


@app.get("/stats")
def get_stats():
    total_reviews = sum(len(v) for v in REVIEWS.values())
    approved      = sum(
        1 for reviews in REVIEWS.values()
        for r in reviews.values() if r["status"] == "approved"
    )
    return {
        "totalStudents":    len(STUDENTS),
        "totalCareers":     len(CAREERS),
        "totalReviews":     total_reviews,
        "approvedReviews":  approved,
        "overriddenReviews":total_reviews - approved,
        "pendingReviews":   len(STUDENTS) - len(REVIEWS),
        "failureCases":     sum(1 for s in STUDENTS if s.get("failureCase")),
    }


# ===========================================================================
# PHASE 2 — AUTH ENDPOINTS
# ===========================================================================

@app.get("/auth/me")
def auth_me(current_user: dict = Depends(get_current_user)):
    """Return the identity and permissions of the authenticated caller."""
    from auth import ROLE_PERMISSIONS
    role = current_user["role"]
    return {
        "user":        current_user,
        "permissions": sorted(ROLE_PERMISSIONS.get(role, set())),
    }


@app.get("/auth/tokens")
def auth_tokens(
    current_user: dict = Depends(require_permission("read:rbac_info")),
):
    """Return all demo tokens and their role/permission bindings. Admin only."""
    return {
        "tokens": get_demo_tokens(),
        "roles":  list(set(t["role"] for t in get_demo_tokens())),
        "note":   "Demo tokens only. Replace with OAuth2 / SAML 2.0 in production.",
    }


# ===========================================================================
# PHASE 2 — OPERATIONAL HEALTH ENDPOINTS
# ===========================================================================

@app.get("/health")
def system_health():
    """
    Dataset freshness and system status.
    Open endpoint — no auth required.
    """
    freshness = check_dataset_freshness()
    critical_students = [
        {"id": s["id"], "name": s["name"], "failureCase": s.get("failureCase")}
        for s in STUDENTS
        if s.get("failureCase")
    ]
    return {
        "status":            "operational",
        "version":           "0.2.0",
        "datasetFreshness":  freshness,
        "totalStudents":     len(STUDENTS),
        "criticalCases":     critical_students,
        "criticalCaseCount": len(critical_students),
        "checkedAt":         datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health/students")
def health_all_students(
    current_user: dict = Depends(require_permission("read:all_students")),
):
    """Run full health scan across all students. Requires: counselor or admin."""
    scans = [run_student_health_scan(s, STUDENTS) for s in STUDENTS]
    critical = [r for r in scans if r["overallHealth"] == "critical"]
    at_risk  = [r for r in scans if r["overallHealth"] == "at_risk"]
    healthy  = [r for r in scans if r["overallHealth"] == "healthy"]
    return {
        "totalStudents":  len(scans),
        "criticalCount":  len(critical),
        "atRiskCount":    len(at_risk),
        "healthyCount":   len(healthy),
        "scans":          scans,
        "scannedAt":      datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health/students/{student_id}")
def health_single_student(
    student_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Health scan for one student. Students restricted to own record."""
    if current_user and current_user["role"] == "student":
        require_own_student(student_id, current_user)

    student = STUDENTS_BY_ID.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found.")

    return run_student_health_scan(student, STUDENTS)


# ===========================================================================
# PHASE 2 — METRICS / BASELINE COMPARISON ENDPOINTS
# ===========================================================================

@app.get("/metrics/comparison")
def metrics_all_students(
    current_user: dict = Depends(require_permission("read:metrics")),
):
    """
    Precision/Recall/F1 comparison — marks-only vs evidence-based — for ALL students.
    Requires: counselor or admin role.
    """
    results = [
        compare_recommenders_for_student(s, CAREERS)
        for s in STUDENTS
    ]
    aggregate = compute_aggregate_metrics(results)
    return {
        "aggregate":        aggregate,
        "perStudent":       results,
        "methodology": (
            "Ground truth derived from student interests × skill overlap ≥ 40% × "
            "high competency (≥70). Marks-only uses GPA proxy × static career affinity. "
            "Evidence-based uses transparent skill-overlap formula."
        ),
        "generatedAt":      datetime.now(timezone.utc).isoformat(),
    }


@app.get("/metrics/comparison/{student_id}")
def metrics_single_student(
    student_id: str,
    current_user: dict = Depends(require_permission("read:metrics")),
):
    """Metrics comparison for a single student. Requires: counselor or admin."""
    student = STUDENTS_BY_ID.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found.")
    return compare_recommenders_for_student(student, CAREERS)


# ===========================================================================
# PHASE 2 — STAKEHOLDER FEEDBACK ENDPOINTS
# ===========================================================================

@app.get("/feedback")
def get_feedback(
    current_user: dict = Depends(require_permission("read:stakeholder_feedback")),
):
    """Return all stakeholder feedback. Requires: counselor, employer, or admin."""
    all_fb = get_all_feedback()
    return {
        "feedback":  all_fb,
        "total":     len(all_fb),
        "aggregate": aggregate_feedback(),
    }


@app.get("/feedback/aggregate")
def get_feedback_aggregate(
    current_user: dict = Depends(require_permission("read:stakeholder_feedback")),
):
    """Return aggregated feedback scores only. Requires: counselor, employer, or admin."""
    return {
        "aggregate":    aggregate_feedback(),
        "totalResponses": len(FEEDBACK_STORE),
        "generatedAt":  datetime.now(timezone.utc).isoformat(),
    }


@app.post("/feedback")
def submit_feedback(
    feedback: FeedbackRequest,
    current_user: dict = Depends(require_permission("write:stakeholder_feedback")),
):
    """
    Submit new stakeholder feedback.
    Requires: counselor, employer, or admin role.
    """
    valid_types = ("student", "counselor", "employer")
    if feedback.stakeholderType not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"stakeholderType must be one of: {', '.join(valid_types)}",
        )

    # Validate studentId if provided
    if feedback.studentId and feedback.studentId not in STUDENTS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Student '{feedback.studentId}' not found.")

    record = add_feedback({
        **feedback.model_dump(),
        "submittedBy": current_user["displayName"],
        "submitterRole": current_user["role"],
    })

    return {
        "success": True,
        "message": "Feedback recorded.",
        "id":      record["id"],
        "record":  record,
    }
