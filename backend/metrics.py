"""
SkillPath — Baseline Comparison Engine
=======================================
Implements a measurable metrics comparison between:

  (A) Marks-Only Recommender:
      Simulates the legacy approach — ranks careers purely by simulated GPA/exam
      percentile, ignoring projects, portfolios, and rubrics.

  (B) Evidence-Based Recommender (current SkillPath):
      The transparent skill-overlap formula already in recommender.py.

Metrics computed:
  - Precision: Of recommended careers, how many are truly relevant?
  - Recall:    Of truly relevant careers, how many were recommended?
  - F1 Score:  Harmonic mean of precision and recall.

Ground truth is defined by student declared interests and competency scores >= 70,
acting as a proxy for "what the student is genuinely suited for."
"""

from typing import Optional


# ---------------------------------------------------------------------------
# Ground truth builder
# ---------------------------------------------------------------------------

def build_ground_truth(student: dict, careers: list[dict]) -> list[str]:
    """
    Determine 'truly relevant' career IDs for a student using:
      1. Interest keyword overlap with career title/industry/description
      2. At least 40% skill overlap with required skills
      3. At least one high competency (>= 70) present

    This acts as the benchmark 'relevant set' for precision/recall calculation.
    """
    student_skills_lower = {s.lower() for s in student.get("demonstratedSkills", [])}
    interests = [i.lower() for i in student.get("interests", [])]
    competencies = student.get("competencies", {})
    has_strong_competency = any(v >= 70 for v in competencies.values())

    relevant = []
    for career in careers:
        required = career.get("requiredSkills", [])
        if not required:
            continue

        # Interest overlap
        career_text = " ".join([
            career.get("title", ""),
            career.get("industry", ""),
            career.get("description", ""),
        ]).lower()
        interest_match = any(
            any(word in career_text for word in interest.split())
            for interest in interests
        )

        # Skill overlap >= 40%
        matched = sum(1 for s in required if s.lower() in student_skills_lower)
        skill_ratio = matched / len(required) if required else 0

        # Career qualifies as truly relevant if both conditions hold
        if interest_match and skill_ratio >= 0.40 and has_strong_competency:
            relevant.append(career["id"])
        elif skill_ratio >= 0.60:   # high skill overlap even without interest
            relevant.append(career["id"])

    return relevant


# ---------------------------------------------------------------------------
# Marks-only (legacy) recommender simulation
# ---------------------------------------------------------------------------

# Simulated GPA-to-career affinity scores (marks-only, no evidence)
# These are heuristic approximations of how a GPA-rank algorithm would behave:
# high GPA → generic top-ranking careers (Data Analyst, Software Developer)
# regardless of actual demonstrated skill evidence.

MARKS_CAREER_AFFINITY: dict[str, float] = {
    "c001": 0.82,   # Data Analyst — top ranked by GPA systems
    "c002": 0.79,   # Software Developer — second most common marks recommendation
    "c003": 0.45,   # UX Designer — rarely recommended by GPA systems
    "c004": 0.71,   # ML Engineer — recommended for high-maths scorers
    "c005": 0.38,   # Cybersecurity Analyst — rarely in marks-based top 3
    "c006": 0.62,   # Cloud Architect — moderate
    "c007": 0.55,   # Digital Marketing Analyst — lower marks affinity
    "c008": 0.67,   # Biomedical Data Scientist — moderate
}


def compute_marks_only_recommendations(student: dict, careers: list[dict]) -> list[str]:
    """
    Simulate a marks-only recommendation by:
      1. Averaging competency scores as a GPA proxy
      2. Weighting each career by the static MARKS_CAREER_AFFINITY
      3. Returning top 3 career IDs

    This intentionally ignores projects, portfolios, and actual skill evidence.
    """
    competencies = student.get("competencies", {})
    gpa_proxy = (
        sum(competencies.values()) / len(competencies)
        if competencies else 50.0
    )
    # Normalise GPA to 0-1 scale
    gpa_normalised = gpa_proxy / 100.0

    scored = []
    for career in careers:
        affinity = MARKS_CAREER_AFFINITY.get(career["id"], 0.5)
        # Marks-only score: purely GPA × fixed affinity — no skill evidence
        marks_score = gpa_normalised * affinity * 100
        scored.append((career["id"], marks_score))

    scored.sort(key=lambda x: x[1], reverse=True)
    return [cid for cid, _ in scored[:3]]


# ---------------------------------------------------------------------------
# Evidence-based recommender top-3 extractor
# ---------------------------------------------------------------------------

def compute_evidence_based_top3(student: dict, careers: list[dict]) -> list[str]:
    """
    Run the SkillPath evidence-based recommender (transparent skill overlap)
    and return top 3 career IDs.
    """
    from recommender import compute_recommendations
    recs = compute_recommendations(student, careers)
    return [r["careerId"] for r in recs]


# ---------------------------------------------------------------------------
# Precision / Recall / F1 calculator
# ---------------------------------------------------------------------------

def precision_recall_f1(
    recommended: list[str],
    relevant: list[str],
) -> dict:
    """
    Compute information retrieval metrics.

    Precision = |recommended ∩ relevant| / |recommended|
    Recall    = |recommended ∩ relevant| / |relevant|
    F1        = 2 × (P × R) / (P + R)
    """
    if not recommended or not relevant:
        return {"precision": 0.0, "recall": 0.0, "f1": 0.0, "truePositives": 0}

    recommended_set = set(recommended)
    relevant_set = set(relevant)
    true_positives = recommended_set & relevant_set
    tp = len(true_positives)

    precision = tp / len(recommended_set)
    recall    = tp / len(relevant_set)
    f1        = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

    return {
        "precision":       round(precision, 3),
        "recall":          round(recall, 3),
        "f1":              round(f1, 3),
        "truePositives":   tp,
        "recommended":     list(recommended_set),
        "relevant":        list(relevant_set),
        "correctMatches":  list(true_positives),
    }


# ---------------------------------------------------------------------------
# Full comparison for a single student
# ---------------------------------------------------------------------------

def compare_recommenders_for_student(
    student: dict,
    careers: list[dict],
) -> dict:
    """
    Run both recommenders against the same student and return side-by-side metrics.
    """
    ground_truth    = build_ground_truth(student, careers)
    marks_top3      = compute_marks_only_recommendations(student, careers)
    evidence_top3   = compute_evidence_based_top3(student, careers)

    marks_metrics    = precision_recall_f1(marks_top3, ground_truth)
    evidence_metrics = precision_recall_f1(evidence_top3, ground_truth)

    improvement_f1 = round(evidence_metrics["f1"] - marks_metrics["f1"], 3)

    return {
        "studentId":        student["id"],
        "studentName":      student["name"],
        "groundTruth":      ground_truth,
        "marksOnly": {
            "top3Recommended": marks_top3,
            **marks_metrics,
            "method": "GPA proxy × static career affinity (no skill evidence)",
        },
        "evidenceBased": {
            "top3Recommended": evidence_top3,
            **evidence_metrics,
            "method": "Transparent skill-overlap (projects + rubrics + portfolio + interests)",
        },
        "improvement": {
            "f1Delta":         improvement_f1,
            "precisionDelta":  round(evidence_metrics["precision"] - marks_metrics["precision"], 3),
            "recallDelta":     round(evidence_metrics["recall"] - marks_metrics["recall"], 3),
            "verdict": (
                "Evidence-based significantly outperforms marks-only"
                if improvement_f1 >= 0.2
                else (
                    "Evidence-based moderately outperforms marks-only"
                    if improvement_f1 >= 0.05
                    else (
                        "Marginal difference — student has strong general skills"
                        if improvement_f1 >= 0
                        else "Marks-only marginally better for this student profile"
                    )
                )
            ),
        },
    }


# ---------------------------------------------------------------------------
# Aggregate comparison across all students
# ---------------------------------------------------------------------------

def compute_aggregate_metrics(student_results: list[dict]) -> dict:
    """Macro-averaged precision, recall, F1 across all students."""
    if not student_results:
        return {}

    marks_p = [r["marksOnly"]["precision"] for r in student_results]
    marks_r = [r["marksOnly"]["recall"] for r in student_results]
    marks_f = [r["marksOnly"]["f1"] for r in student_results]

    ev_p = [r["evidenceBased"]["precision"] for r in student_results]
    ev_r = [r["evidenceBased"]["recall"] for r in student_results]
    ev_f = [r["evidenceBased"]["f1"] for r in student_results]

    def avg(lst): return round(sum(lst) / len(lst), 3) if lst else 0.0

    return {
        "studentCount": len(student_results),
        "macroAverage": {
            "marksOnly": {
                "precision": avg(marks_p),
                "recall":    avg(marks_r),
                "f1":        avg(marks_f),
            },
            "evidenceBased": {
                "precision": avg(ev_p),
                "recall":    avg(ev_r),
                "f1":        avg(ev_f),
            },
            "improvement": {
                "f1Delta":        round(avg(ev_f) - avg(marks_f), 3),
                "precisionDelta": round(avg(ev_p) - avg(marks_p), 3),
                "recallDelta":    round(avg(ev_r) - avg(marks_r), 3),
            },
        },
        "interpretationNote": (
            "Macro-average equally weights each student. "
            "Evidence-based should outperform marks-only for students with "
            "non-standard skill profiles (UX + Systems, Healthcare Data, etc.)."
        ),
    }
