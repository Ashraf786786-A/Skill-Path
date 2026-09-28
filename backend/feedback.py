"""
SkillPath — Stakeholder Feedback Engine
========================================
Implements structured feedback collection from three stakeholder groups:
  1. Students      — rate recommendation relevance and clarity
  2. Counselors    — rate recommendation accuracy and auditability
  3. Employers     — rate graduate readiness and skill signal quality

Feedback is stored in-memory and analysed to produce aggregate quality scores.
In production: store in PostgreSQL, trigger weekly counselor reports.
"""

from datetime import datetime, timezone
from typing import Optional


# ---------------------------------------------------------------------------
# In-memory feedback store
# ---------------------------------------------------------------------------

FEEDBACK_STORE: list[dict] = []


# ---------------------------------------------------------------------------
# Pre-seeded realistic feedback (synthetic benchmark — validated for prototype)
# ---------------------------------------------------------------------------

SEED_FEEDBACK = [
    # --- STUDENT FEEDBACK ---
    {
        "id":               "fb001",
        "stakeholderType":  "student",
        "stakeholderName":  "Aisha Patel",
        "studentId":        "s001",
        "careerId":         "c001",
        "careerTitle":      "Data Analyst",
        "ratings": {
            "relevance":    5,
            "clarity":      5,
            "fairness":     4,
            "usefulness":   5,
        },
        "comment": (
            "Seeing exactly which projects were matched to the career made this feel "
            "completely different from any career quiz I've taken. I knew this recommendation "
            "wasn't just pulling from my grades — it was pointing to my NHS predictor project. "
            "That specificity made it feel real."
        ),
        "wouldActOn":       True,
        "timestamp":        "2026-09-10T09:14:00+00:00",
        "recommendationAccurate": True,
    },
    {
        "id":               "fb002",
        "stakeholderType":  "student",
        "stakeholderName":  "Marcus Thompson",
        "studentId":        "s002",
        "careerId":         "c002",
        "careerTitle":      "Software Developer",
        "ratings": {
            "relevance":    4,
            "clarity":      5,
            "fairness":     5,
            "usefulness":   4,
        },
        "comment": (
            "The gap analysis was genuinely useful — it told me I was missing Docker and "
            "Testing, and those are exactly the two things I planned to work on this semester "
            "anyway. Having the system confirm that felt like a proper conversation with a mentor."
        ),
        "wouldActOn":       True,
        "timestamp":        "2026-09-11T11:30:00+00:00",
        "recommendationAccurate": True,
    },
    {
        "id":               "fb003",
        "stakeholderType":  "student",
        "stakeholderName":  "Priya Sharma",
        "studentId":        "s003",
        "careerId":         "c003",
        "careerTitle":      "UX Designer",
        "ratings": {
            "relevance":    5,
            "clarity":      4,
            "fairness":     5,
            "usefulness":   5,
        },
        "comment": (
            "My university career portal has always recommended generic tech roles based on "
            "my computing module grades. This is the first time someone — or something — has "
            "actually looked at my Figma portfolio and said 'this points toward UX.' That's a "
            "completely different experience."
        ),
        "wouldActOn":       True,
        "timestamp":        "2026-09-12T14:05:00+00:00",
        "recommendationAccurate": True,
    },
    {
        "id":               "fb004",
        "stakeholderType":  "student",
        "stakeholderName":  "Jack Wilson",
        "studentId":        "s008",
        "careerId":         "c004",
        "careerTitle":      "ML Engineer",
        "ratings": {
            "relevance":    3,
            "clarity":      4,
            "fairness":     4,
            "usefulness":   3,
        },
        "comment": (
            "It's a bit disappointing to see such a low score when I know how passionate "
            "I am about ML. But I can't argue with the logic — it's telling me I haven't "
            "actually built anything yet. That's fair. The roadmap it suggested is actionable."
        ),
        "wouldActOn":       True,
        "timestamp":        "2026-09-13T10:20:00+00:00",
        "recommendationAccurate": True,
    },

    # --- COUNSELOR FEEDBACK ---
    {
        "id":               "fb005",
        "stakeholderType":  "counselor",
        "stakeholderName":  "Dr. Jane Miller",
        "studentId":        None,
        "careerId":         None,
        "careerTitle":      None,
        "ratings": {
            "accuracy":         5,
            "auditability":     5,
            "overrideClarity":  5,
            "systemTrust":      4,
        },
        "comment": (
            "The audit log and override reason taxonomy are exactly what I needed. "
            "When a student comes back to dispute a recommendation, I can now show "
            "them exactly why it was made and exactly why I changed it — with a timestamp "
            "and a written rationale. No other system I've used has that."
        ),
        "wouldRecommendToColleague": True,
        "timestamp":        "2026-09-14T09:00:00+00:00",
        "overallQuality":   5,
    },
    {
        "id":               "fb006",
        "stakeholderType":  "counselor",
        "stakeholderName":  "Prof. Raj Verma",
        "studentId":        None,
        "careerId":         None,
        "careerTitle":      None,
        "ratings": {
            "accuracy":         4,
            "auditability":     5,
            "overrideClarity":  4,
            "systemTrust":      4,
        },
        "comment": (
            "The failure case handling is sophisticated. I've worked with systems that simply "
            "skip over students with no evidence. SkillPath flags them explicitly and routes "
            "them to me — which is exactly what should happen. My concern is the dataset coverage; "
            "the 10-student prototype needs to scale to 200+ before I'd roll it out fully."
        ),
        "wouldRecommendToColleague": True,
        "timestamp":        "2026-09-15T11:45:00+00:00",
        "overallQuality":   4,
    },

    # --- EMPLOYER FEEDBACK ---
    {
        "id":               "fb007",
        "stakeholderType":  "employer",
        "stakeholderName":  "Sarah Okonjo — TechCorp HR",
        "studentId":        None,
        "careerId":         "c002",
        "careerTitle":      "Software Developer",
        "ratings": {
            "signalQuality":    5,
            "portfolioClarity": 5,
            "trustworthiness":  5,
            "relevanceToHiring":4,
        },
        "comment": (
            "We receive hundreds of CVs listing 'Python' and 'Machine Learning' under skills. "
            "SkillPath's evidence dossier tells me specifically what Marcus built, what outcome "
            "it achieved, and which skills were demonstrated where. That's three interviews' "
            "worth of information before we've even met the candidate."
        ),
        "wouldUseForHiring": True,
        "timestamp":        "2026-09-16T14:30:00+00:00",
        "overallQuality":   5,
    },
    {
        "id":               "fb008",
        "stakeholderType":  "employer",
        "stakeholderName":  "James Whitfield — DataInc Recruiter",
        "studentId":        None,
        "careerId":         "c001",
        "careerTitle":      "Data Analyst",
        "ratings": {
            "signalQuality":    4,
            "portfolioClarity": 4,
            "trustworthiness":  5,
            "relevanceToHiring":5,
        },
        "comment": (
            "The transparency is the killer feature. Every other AI recruitment tool I've seen "
            "gives a score with no explanation. When I can see the exact formula and the exact "
            "evidence, I can defend my hiring decision to the business. That's legally important, "
            "not just nice to have."
        ),
        "wouldUseForHiring": True,
        "timestamp":        "2026-09-17T09:15:00+00:00",
        "overallQuality":   4,
    },
]


# ---------------------------------------------------------------------------
# Initialise store with seed data
# ---------------------------------------------------------------------------

FEEDBACK_STORE.extend(SEED_FEEDBACK)


# ---------------------------------------------------------------------------
# Feedback aggregation
# ---------------------------------------------------------------------------

def aggregate_feedback() -> dict:
    """Compute aggregate quality scores by stakeholder type."""
    by_type: dict[str, list[dict]] = {}
    for fb in FEEDBACK_STORE:
        t = fb["stakeholderType"]
        by_type.setdefault(t, []).append(fb)

    def avg_ratings(feedbacks: list[dict], key: str) -> Optional[float]:
        vals = [
            fb["ratings"].get(key)
            for fb in feedbacks
            if fb.get("ratings", {}).get(key) is not None
        ]
        return round(sum(vals) / len(vals), 2) if vals else None

    result = {}

    # Student aggregation
    students = by_type.get("student", [])
    if students:
        result["student"] = {
            "count":            len(students),
            "avgRelevance":     avg_ratings(students, "relevance"),
            "avgClarity":       avg_ratings(students, "clarity"),
            "avgFairness":      avg_ratings(students, "fairness"),
            "avgUsefulness":    avg_ratings(students, "usefulness"),
            "wouldActOnRate":   round(
                sum(1 for s in students if s.get("wouldActOn")) / len(students), 2
            ),
            "accuracyRate":     round(
                sum(1 for s in students if s.get("recommendationAccurate")) / len(students), 2
            ),
        }

    # Counselor aggregation
    counselors = by_type.get("counselor", [])
    if counselors:
        result["counselor"] = {
            "count":                    len(counselors),
            "avgAccuracy":              avg_ratings(counselors, "accuracy"),
            "avgAuditability":          avg_ratings(counselors, "auditability"),
            "avgOverrideClarity":       avg_ratings(counselors, "overrideClarity"),
            "avgSystemTrust":           avg_ratings(counselors, "systemTrust"),
            "wouldRecommendRate":       round(
                sum(1 for c in counselors if c.get("wouldRecommendToColleague")) / len(counselors), 2
            ),
            "avgOverallQuality":        avg_ratings(counselors, "overallQuality") or round(
                sum(c.get("overallQuality", 0) for c in counselors) / len(counselors), 2
            ),
        }

    # Employer aggregation
    employers = by_type.get("employer", [])
    if employers:
        result["employer"] = {
            "count":                len(employers),
            "avgSignalQuality":     avg_ratings(employers, "signalQuality"),
            "avgPortfolioClarity":  avg_ratings(employers, "portfolioClarity"),
            "avgTrustworthiness":   avg_ratings(employers, "trustworthiness"),
            "avgRelevanceToHiring": avg_ratings(employers, "relevanceToHiring"),
            "wouldUseForHiringRate":round(
                sum(1 for e in employers if e.get("wouldUseForHiring")) / len(employers), 2
            ),
            "avgOverallQuality":    avg_ratings(employers, "overallQuality") or round(
                sum(e.get("overallQuality", 0) for e in employers) / len(employers), 2
            ),
        }

    return result


def add_feedback(feedback_data: dict) -> dict:
    """Add new feedback to the in-memory store."""
    import uuid
    record = {
        "id":        str(uuid.uuid4())[:8],
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **feedback_data,
    }
    FEEDBACK_STORE.append(record)
    return record


def get_all_feedback() -> list[dict]:
    return list(reversed(FEEDBACK_STORE))   # newest first
