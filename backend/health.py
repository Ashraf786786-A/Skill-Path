"""
SkillPath — Operational Health & Failure State Detection
=========================================================
Detects and manages:
  1. Stale data        — student records not updated in > 90 days
  2. Missing evidence  — students with no projects or rubrics
  3. Aging transitions — students approaching year-end without recommendations
  4. Dataset freshness — backend data load timestamp tracking
"""

from datetime import datetime, timezone, timedelta
from typing import Optional


# ---------------------------------------------------------------------------
# Thresholds (configurable)
# ---------------------------------------------------------------------------

STALE_DATA_DAYS          = 90    # evidence older than 90 days = stale
AGING_TRANSITION_DAYS    = 30    # within 30 days of year-end = transition risk
MINIMUM_EVIDENCE_ITEMS   = 1     # at least 1 project required
MINIMUM_RUBRIC_SCORE     = 50    # rubrics below this = weak evidence
DATA_LOADED_AT           = datetime.now(timezone.utc)   # module import = server start


# ---------------------------------------------------------------------------
# Stale data detection
# ---------------------------------------------------------------------------

def detect_stale_evidence(student: dict) -> Optional[dict]:
    """
    Check if a student's evidence is stale (no update within STALE_DATA_DAYS).
    Since the prototype dataset doesn't carry real timestamps, we simulate
    staleness using the 'year' field and 'failureCase' flags as proxies.
    """
    year_str = student.get("year", "")
    failure_case = student.get("failureCase")

    # Year 1 students with no evidence are treated as stale by definition
    if year_str == "Year 1" and not student.get("projects"):
        return {
            "type": "stale_evidence",
            "severity": "critical",
            "label": "No evidence on record",
            "message": (
                f"{student['name']} is in Year 1 with zero submitted evidence. "
                f"Evidence baseline missing — recommendations cannot be generated."
            ),
            "lastUpdatedDays": None,
            "threshold": STALE_DATA_DAYS,
            "action": "Request student to submit at least one project and complete one competency rubric.",
        }

    # Students with failureCase=no_evidence
    if failure_case == "no_evidence":
        return {
            "type": "stale_evidence",
            "severity": "critical",
            "label": "Critical: Zero Evidence State",
            "message": (
                f"{student['name']} has no demonstrable evidence in any pillar. "
                f"The evidence record is effectively empty."
            ),
            "lastUpdatedDays": 120,   # simulated: 120 days since last activity
            "threshold": STALE_DATA_DAYS,
            "action": "Flag for urgent counselor outreach. Block automated recommendations.",
        }

    # Students with high interest but low evidence flagged as borderline stale
    if failure_case == "high_interest_low_evidence":
        return {
            "type": "stale_evidence",
            "severity": "warning",
            "label": "Warning: Stated interests not backed by evidence",
            "message": (
                f"{student['name']} has declared career interests but has not "
                f"submitted project evidence in the past {STALE_DATA_DAYS} days."
            ),
            "lastUpdatedDays": 65,    # simulated
            "threshold": STALE_DATA_DAYS,
            "action": "Encourage student to build at least one project aligned with stated interests.",
        }

    return None


# ---------------------------------------------------------------------------
# Missing evidence fallback
# ---------------------------------------------------------------------------

def compute_missing_evidence_fallback(student: dict) -> dict:
    """
    When a student has no or incomplete evidence, compute a safe fallback
    recommendation state — never silently produce a fake high score.
    """
    projects = student.get("projects", [])
    competencies = student.get("competencies", {})
    portfolio = student.get("portfolioLinks", [])
    skills = student.get("demonstratedSkills", [])

    missing_pillars = []
    if not projects:
        missing_pillars.append("Capstone Projects (0 submitted)")
    if not competencies:
        missing_pillars.append("Competency Rubrics (0 assessed)")
    if not portfolio:
        missing_pillars.append("Portfolio Links (0 added)")
    if not skills:
        missing_pillars.append("Demonstrated Skills (0 verified)")

    has_minimum = len(missing_pillars) < 3  # at least 2 pillars present

    weak_competencies = {
        k: v for k, v in competencies.items()
        if v < MINIMUM_RUBRIC_SCORE
    }

    return {
        "hasSufficientEvidence": has_minimum,
        "missingPillars": missing_pillars,
        "weakCompetencies": weak_competencies,
        "safeRecommendationState": "blocked" if not has_minimum else "partial",
        "evidenceSummary": {
            "projectCount": len(projects),
            "competencyCount": len(competencies),
            "portfolioCount": len(portfolio),
            "skillCount": len(skills),
        },
        "fallbackMessage": (
            "Insufficient evidence to generate a reliable recommendation. "
            "Missing pillars: " + (", ".join(missing_pillars) if missing_pillars else "None")
        ) if not has_minimum else None,
    }


# ---------------------------------------------------------------------------
# Aging transition detection
# ---------------------------------------------------------------------------

YEAR_ORDER = {"Year 1": 1, "Year 2": 2, "Year 3": 3, "Year 4": 4}

def detect_aging_transition(student: dict, all_students: list[dict]) -> Optional[dict]:
    """
    Detect if a student is approaching a year-end transition without
    a completed recommendation cycle — a critical window for intervention.
    """
    year_str = student.get("year", "")
    year_level = YEAR_ORDER.get(year_str, 0)
    student_name = student.get("name", "Unknown")

    # Final year students without strong evidence are highest risk
    if year_level >= 3:
        projects = student.get("projects", [])
        skills = student.get("demonstratedSkills", [])
        competencies = student.get("competencies", {})

        high_competencies = {k: v for k, v in competencies.items() if v >= 70}

        if len(projects) < 2 or len(skills) < 4:
            return {
                "type": "aging_transition",
                "severity": "high",
                "label": f"Final Year Transition Risk — {year_str}",
                "message": (
                    f"{student_name} is in {year_str} with only {len(projects)} project(s) "
                    f"and {len(skills)} verified skill(s). "
                    f"Graduation without a career recommendation is at risk."
                ),
                "yearLevel": year_level,
                "daysToTransition": AGING_TRANSITION_DAYS,
                "recommendedAction": (
                    "Schedule emergency counselor session. "
                    "Prioritise completing at least 1 more capstone project and "
                    "ensuring 3+ high-scoring competency rubrics are submitted."
                ),
            }

    # Second year students without any projects = early warning
    if year_level == 2 and not student.get("projects"):
        return {
            "type": "aging_transition",
            "severity": "medium",
            "label": "Year 2 — No Projects Submitted",
            "message": (
                f"{student_name} is entering their second year with no project evidence. "
                f"Trajectory tracking recommends 1-2 projects by end of Year 2."
            ),
            "yearLevel": year_level,
            "daysToTransition": AGING_TRANSITION_DAYS * 4,
            "recommendedAction": "Assign guided project brief. Link to campus hackathon calendar.",
        }

    return None


# ---------------------------------------------------------------------------
# Dataset freshness check
# ---------------------------------------------------------------------------

def check_dataset_freshness() -> dict:
    """
    Report the age of the backend's loaded dataset since server start.
    In production, this would compare against a database last-write timestamp.
    """
    now = datetime.now(timezone.utc)
    age_seconds = (now - DATA_LOADED_AT).total_seconds()
    age_hours = age_seconds / 3600

    is_fresh = age_hours < 24   # fresh if loaded within last 24 hours
    is_stale = age_hours >= 24 * STALE_DATA_DAYS / 30  # proportional stale check

    return {
        "dataLoadedAt": DATA_LOADED_AT.isoformat(),
        "ageHours": round(age_hours, 2),
        "isFresh": is_fresh,
        "isStale": is_stale,
        "status": "fresh" if is_fresh else ("stale" if is_stale else "aging"),
        "note": (
            "Dataset loaded at server start. "
            "In production, would sync with LMS webhooks (Canvas/Blackboard LTI 1.3)."
        ),
    }


# ---------------------------------------------------------------------------
# Full health scan for a single student
# ---------------------------------------------------------------------------

def run_student_health_scan(student: dict, all_students: list[dict]) -> dict:
    """
    Run all health checks for a single student and return a unified report.
    """
    stale = detect_stale_evidence(student)
    missing = compute_missing_evidence_fallback(student)
    aging = detect_aging_transition(student, all_students)

    alerts = []
    if stale:
        alerts.append(stale)
    if aging:
        alerts.append(aging)
    if not missing["hasSufficientEvidence"]:
        alerts.append({
            "type": "missing_evidence",
            "severity": "critical",
            "label": "Insufficient Evidence for Recommendation",
            "message": missing["fallbackMessage"],
        })

    overall_health = "healthy"
    if any(a["severity"] == "critical" for a in alerts):
        overall_health = "critical"
    elif any(a["severity"] in ("warning", "high", "medium") for a in alerts):
        overall_health = "at_risk"

    return {
        "studentId": student["id"],
        "studentName": student["name"],
        "overallHealth": overall_health,
        "alerts": alerts,
        "alertCount": len(alerts),
        "evidenceFallback": missing,
        "scannedAt": datetime.now(timezone.utc).isoformat(),
    }
