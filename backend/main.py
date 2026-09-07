"""
SkillPath — FastAPI Backend
============================
Evidence-based career recommendation API.

Endpoints:
  GET  /students                      - List all students
  GET  /students/{id}                 - Student detail
  GET  /careers                       - List all careers
  GET  /recommendations/{student_id}  - Compute recommendations
  POST /review                        - Save approval or override

Reviews are stored in-memory for this prototype.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from data_loader import STUDENTS, CAREERS, STUDENTS_BY_ID, CAREERS_BY_ID
from recommender import compute_recommendations

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SkillPath API",
    description=(
        "Evidence-based career recommendation API. "
        "Uses only projects, competencies, portfolios and interests. "
        "No surveillance data. SYNTHETIC PROTOTYPE DATASET."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory review store
# format: { student_id: { career_id: ReviewRecord } }
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
    action: str            # "approve" | "override"
    overrideReason: Optional[str] = None
    overrideNotes: Optional[str] = None
    reviewerName: Optional[str] = "Human Reviewer"


class ReviewRecord(BaseModel):
    studentId: str
    careerId: str
    action: str
    overrideReason: Optional[str]
    overrideNotes: Optional[str]
    reviewerName: str
    timestamp: str
    status: str            # "approved" | "overridden" | "pending"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "SkillPath API",
        "version": "0.1.0",
        "note": "SYNTHETIC PROTOTYPE DATASET — Evidence-based, not surveillance-based.",
        "endpoints": [
            "GET /students",
            "GET /students/{id}",
            "GET /careers",
            "GET /recommendations/{student_id}",
            "POST /review",
        ],
    }


@app.get("/students")
def list_students():
    """Return all students (summary view — no competency detail)."""
    summaries = []
    for s in STUDENTS:
        summaries.append({
            "id": s["id"],
            "name": s["name"],
            "age": s["age"],
            "year": s["year"],
            "avatar": s["avatar"],
            "avatarColor": s["avatarColor"],
            "skillCount": len(s.get("demonstratedSkills", [])),
            "projectCount": len(s.get("projects", [])),
            "interests": s.get("interests", []),
            "failureCase": s.get("failureCase"),
            "failureCaseLabel": s.get("failureCaseLabel"),
        })
    return {"students": summaries, "total": len(summaries)}


@app.get("/students/{student_id}")
def get_student(student_id: str):
    """Return full student detail including projects, competencies, portfolio."""
    student = STUDENTS_BY_ID.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found.")

    # Attach any existing review records
    reviews = REVIEWS.get(student_id, {})
    return {**student, "reviews": reviews}


@app.get("/careers")
def list_careers():
    """Return all career roles."""
    return {"careers": CAREERS, "total": len(CAREERS)}


@app.get("/recommendations/{student_id}")
def get_recommendations(student_id: str):
    """
    Compute transparent skill-overlap recommendations for a student.

    Formula: score = matched_required_skills / total_required_skills * 100
    Every score is fully explainable — no black-box AI.
    """
    student = STUDENTS_BY_ID.get(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found.")

    recommendations = compute_recommendations(student, CAREERS)

    # Attach review status to each recommendation
    student_reviews = REVIEWS.get(student_id, {})
    for rec in recommendations:
        career_id = rec["careerId"]
        review = student_reviews.get(career_id)
        if review:
            rec["reviewStatus"] = review["status"]
            rec["reviewRecord"] = review
        else:
            rec["reviewStatus"] = "pending"
            rec["reviewRecord"] = None

    return {
        "studentId": student_id,
        "studentName": student["name"],
        "recommendations": recommendations,
        "dataLabel": "SYNTHETIC PROTOTYPE DATASET",
        "ethicsNote": (
            "Recommendations are based solely on demonstrated projects, "
            "competencies, portfolios and interests. "
            "No surveillance data used."
        ),
        "algorithmType": "Transparent Skill-Overlap Matching",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/review")
def submit_review(review: ReviewRequest):
    """
    Save a human review decision (approve or override) for a recommendation.

    Override requires a reason from the approved list.
    """
    # Validate student
    if review.studentId not in STUDENTS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Student '{review.studentId}' not found.")

    # Validate career
    if review.careerId not in CAREERS_BY_ID:
        raise HTTPException(status_code=404, detail=f"Career '{review.careerId}' not found.")

    # Validate action
    if review.action not in ("approve", "override"):
        raise HTTPException(status_code=400, detail="Action must be 'approve' or 'override'.")

    # Override requires a reason
    if review.action == "override":
        if not review.overrideReason:
            raise HTTPException(
                status_code=400,
                detail="Override requires a reason. "
                       f"Valid reasons: {', '.join(VALID_OVERRIDE_REASONS)}",
            )
        if review.overrideReason not in VALID_OVERRIDE_REASONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid override reason. Valid: {', '.join(VALID_OVERRIDE_REASONS)}",
            )

    # Build record
    record = {
        "studentId": review.studentId,
        "careerId": review.careerId,
        "action": review.action,
        "overrideReason": review.overrideReason,
        "overrideNotes": review.overrideNotes,
        "reviewerName": review.reviewerName or "Human Reviewer",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "approved" if review.action == "approve" else "overridden",
    }

    # Store in memory
    if review.studentId not in REVIEWS:
        REVIEWS[review.studentId] = {}
    REVIEWS[review.studentId][review.careerId] = record

    return {
        "success": True,
        "message": f"Review saved: {record['status']}",
        "record": record,
    }


@app.get("/reviews")
def list_all_reviews():
    """Return all saved review decisions (for Human Review dashboard)."""
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
    """Dashboard stats for the Overview page."""
    total_reviews = sum(len(v) for v in REVIEWS.values())
    approved = sum(
        1 for reviews in REVIEWS.values()
        for r in reviews.values()
        if r["status"] == "approved"
    )
    overridden = total_reviews - approved

    return {
        "totalStudents": len(STUDENTS),
        "totalCareers": len(CAREERS),
        "totalReviews": total_reviews,
        "approvedReviews": approved,
        "overriddenReviews": overridden,
        "pendingReviews": len(STUDENTS) - len(REVIEWS),
        "failureCases": sum(1 for s in STUDENTS if s.get("failureCase")),
    }
