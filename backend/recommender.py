"""
SkillPath — Transparent Skill-Overlap Recommender
===================================================
Implements a simple, fully explainable skill-overlap matching algorithm.

Algorithm:
    score = (matched_required_skills / total_required_skills) * 100

Every recommendation includes:
  - matchScore         : 0-100 percentage
  - matchedSkills      : skills the student has demonstrated
  - gapSkills          : required skills the student is missing
  - preferredMatched   : preferred skills also matched (bonus context)
  - evidenceBreakdown  : per-evidence-type contribution
  - explanation        : human-readable "Why recommended" text
  - confidenceLevel    : High / Medium / Low based on score
  - failureCase        : edge case category if applicable

No machine learning. No black-box scores. Fully transparent.
"""

from typing import Optional


# ---------------------------------------------------------------------------
# Core matching logic
# ---------------------------------------------------------------------------

def _overlap(student_skills: list[str], target_skills: list[str]) -> list[str]:
    """Return skills present in both lists (case-insensitive)."""
    student_set = {s.lower() for s in student_skills}
    return [t for t in target_skills if t.lower() in student_set]


def _gap(student_skills: list[str], target_skills: list[str]) -> list[str]:
    """Return skills in target that the student is missing."""
    student_set = {s.lower() for s in student_skills}
    return [t for t in target_skills if t.lower() not in student_set]


def _skills_from_projects(projects: list[dict]) -> list[str]:
    """Collect all skills evidenced by projects."""
    skills = []
    for p in projects:
        skills.extend(p.get("skills", []))
    return list(set(skills))


def _build_evidence_breakdown(
    student: dict,
    matched_skills: list[str],
    career: dict,
) -> dict:
    """
    Show which evidence source contributed each matched skill.
    Returns a dict with:
      projects, competencies, portfolioLinks, interests
    """
    project_skills = set(_skills_from_projects(student.get("projects", [])))
    competency_skills = set(student.get("competencies", {}).keys())
    interest_keywords = set(student.get("interests", []))
    portfolio_evidence = student.get("portfolioLinks", [])

    project_contrib = [s for s in matched_skills if s in project_skills]
    competency_contrib = [s for s in matched_skills if s in competency_skills]
    interest_contrib = [s for s in matched_skills
                        if any(kw.lower() in s.lower() or s.lower() in kw.lower()
                               for kw in interest_keywords)]

    return {
        "projectEvidence": {
            "skills": project_contrib,
            "projects": [
                {"title": p["title"], "outcome": p.get("outcome", "")}
                for p in student.get("projects", [])
                if any(sk in project_skills for sk in matched_skills)
            ],
            "count": len(project_contrib),
        },
        "competencyEvidence": {
            "skills": competency_contrib,
            "assessments": {
                k: v for k, v in student.get("competencies", {}).items()
                if v >= 70
            },
            "count": len(competency_contrib),
        },
        "portfolioEvidence": {
            "links": portfolio_evidence,
            "count": len(portfolio_evidence),
        },
        "interestAlignment": {
            "interests": student.get("interests", []),
            "aligned": interest_contrib,
            "alignmentScore": _interest_alignment_score(student, career),
        },
    }


def _interest_alignment_score(student: dict, career: dict) -> int:
    """
    Score how well the student's interests align with the career (0-100).
    Checks keyword overlap between student interests and career title/industry/evidenceTypes.
    """
    interests = [i.lower() for i in student.get("interests", [])]
    career_text = " ".join([
        career.get("title", ""),
        career.get("industry", ""),
        career.get("description", ""),
        " ".join(career.get("evidenceTypes", [])),
    ]).lower()

    matched = sum(
        1 for interest in interests
        if any(word in career_text for word in interest.split())
    )
    if not interests:
        return 0
    return min(100, int((matched / len(interests)) * 100))


def _confidence_level(score: float) -> str:
    if score >= 70:
        return "High"
    elif score >= 45:
        return "Medium"
    else:
        return "Low"


def _build_explanation(
    student: dict,
    career: dict,
    matched: list[str],
    gaps: list[str],
    score: float,
    interest_score: int,
) -> dict:
    """Build the human-readable 'Why recommended' explanation."""
    student_name = student["name"].split()[0]
    career_title = career["title"]

    why_lines = []
    if matched:
        why_lines.append(
            f"{student_name} has demonstrated {len(matched)} of the "
            f"{len(career['requiredSkills'])} required skills for {career_title}."
        )
    if student.get("projects"):
        project_titles = [p["title"] for p in student["projects"][:2]]
        why_lines.append(
            f"Project evidence: {' | '.join(project_titles)}."
        )
    if interest_score >= 50:
        why_lines.append(
            f"Interest alignment of {interest_score}% supports this pathway."
        )

    gap_lines = []
    if gaps:
        gap_lines.append(
            f"{len(gaps)} required skill(s) not yet evidenced: {', '.join(gaps[:4])}."
        )
        if len(gaps) > len(matched):
            gap_lines.append(
                "Student would benefit from targeted projects in missing skill areas."
            )

    return {
        "whyRecommended": why_lines,
        "evidenceGaps": gap_lines,
        "summary": (
            f"{score:.0f}% evidence match based on {len(matched)} demonstrated "
            f"skills out of {len(career['requiredSkills'])} required."
        ),
    }


def _detect_failure_case(
    student: dict,
    score: float,
    interest_score: int,
) -> Optional[dict]:
    """Identify and label edge case failure scenarios."""
    failure_case = student.get("failureCase")

    if failure_case == "no_evidence":
        return {
            "type": "no_evidence",
            "label": "Insufficient Evidence",
            "severity": "critical",
            "message": student.get("failureCaseDescription", ""),
            "action": "Student must submit project and portfolio evidence before a recommendation can be generated.",
        }

    if failure_case == "high_interest_low_evidence":
        return {
            "type": "high_interest_low_evidence",
            "label": "Evidence Gap",
            "severity": "warning",
            "message": student.get("failureCaseDescription", ""),
            "action": "Encourage student to complete original projects to back up their stated interests.",
            "interestScore": interest_score,
            "evidenceScore": score,
        }

    if failure_case == "conflicting_evidence":
        return {
            "type": "conflicting_evidence",
            "label": "Conflicting Evidence — Human Review Required",
            "severity": "review",
            "message": student.get("failureCaseDescription", ""),
            "action": "Refer to human counsellor for pathway decision.",
        }

    # Auto-detect: high interest but low score
    if interest_score >= 70 and score < 40 and not failure_case:
        return {
            "type": "high_interest_low_evidence",
            "label": "Evidence Gap Detected",
            "severity": "warning",
            "message": f"Interest alignment is {interest_score}% but evidence match is only {score:.0f}%.",
            "action": "Student should build projects that demonstrate relevant skills.",
            "interestScore": interest_score,
            "evidenceScore": score,
        }

    return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def compute_recommendations(student: dict, careers: list[dict]) -> list[dict]:
    """
    Compute transparent skill-overlap recommendations for a single student
    against all career roles.

    Returns top 3 matches sorted by score (descending).
    """
    student_skills = student.get("demonstratedSkills", [])
    results = []

    for career in careers:
        required = career.get("requiredSkills", [])
        preferred = career.get("preferredSkills", [])

        if not required:
            continue

        matched = _overlap(student_skills, required)
        gaps = _gap(student_skills, required)
        preferred_matched = _overlap(student_skills, preferred)

        # Core transparent formula
        score = (len(matched) / len(required)) * 100
        interest_score = _interest_alignment_score(student, career)
        confidence = _confidence_level(score)
        failure = _detect_failure_case(student, score, interest_score)

        evidence = _build_evidence_breakdown(student, matched, career)
        explanation = _build_explanation(
            student, career, matched, gaps, score, interest_score
        )

        results.append({
            "careerId": career["id"],
            "careerTitle": career["title"],
            "careerEmoji": career.get("emoji", ""),
            "matchScore": round(score, 1),
            "interestAlignmentScore": interest_score,
            "confidenceLevel": confidence,
            "matchedSkills": matched,
            "gapSkills": gaps,
            "preferredMatched": preferred_matched,
            "evidenceBreakdown": evidence,
            "explanation": explanation,
            "failureCase": failure,
            "algorithmNote": (
                f"Score = {len(matched)} matched required skills "
                f"÷ {len(required)} total required skills × 100 = {score:.1f}%"
            ),
        })

    # Sort by match score descending
    results.sort(key=lambda r: r["matchScore"], reverse=True)
    return results[:3]
