"""
SkillPath — Server-Enforced Role-Based Access Control (RBAC)
============================================================
Implements token-based authentication with three institutional roles:

  student    - Can view own profile and recommendations only
  counselor  - Can read all data and submit human reviews
  admin      - Full access including metrics and stakeholder validation data

Tokens are simple signed JWT-style base64 encoded strings for prototype purposes.
In production, replace with SAML 2.0 / Shibboleth or OAuth2.
"""

import base64
import json
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# ---------------------------------------------------------------------------
# Static credential store (prototype — in production: database + bcrypt hashes)
# ---------------------------------------------------------------------------

USERS: dict[str, dict] = {
    "student-token-aisha": {
        "userId": "u001",
        "username": "aisha.patel",
        "role": "student",
        "studentId": "s001",         # which student they own
        "displayName": "Aisha Patel",
    },
    "student-token-marcus": {
        "userId": "u002",
        "username": "marcus.thompson",
        "role": "student",
        "studentId": "s002",
        "displayName": "Marcus Thompson",
    },
    "student-token-priya": {
        "userId": "u003",
        "username": "priya.sharma",
        "role": "student",
        "studentId": "s003",
        "displayName": "Priya Sharma",
    },
    "student-token-omar": {
        "userId": "u004",
        "username": "omar.ali",
        "role": "student",
        "studentId": "s004",
        "displayName": "Omar Ali",
    },
    "student-token-sophie": {
        "userId": "u005",
        "username": "sophie.chen",
        "role": "student",
        "studentId": "s005",
        "displayName": "Sophie Chen",
    },
    # Counselors
    "counselor-token-jane": {
        "userId": "c001",
        "username": "jane.miller",
        "role": "counselor",
        "studentId": None,
        "displayName": "Dr. Jane Miller",
    },
    "counselor-token-raj": {
        "userId": "c002",
        "username": "raj.verma",
        "role": "counselor",
        "studentId": None,
        "displayName": "Prof. Raj Verma",
    },
    # Employers
    "employer-token-techcorp": {
        "userId": "e001",
        "username": "techcorp.hr",
        "role": "employer",
        "studentId": None,
        "displayName": "TechCorp HR — Sarah Okonjo",
    },
    "employer-token-datainc": {
        "userId": "e002",
        "username": "datainc.recruiter",
        "role": "employer",
        "studentId": None,
        "displayName": "DataInc Recruiter — James Whitfield",
    },
    # Admin
    "admin-token-system": {
        "userId": "a001",
        "username": "system.admin",
        "role": "admin",
        "studentId": None,
        "displayName": "System Administrator",
    },
}

# ---------------------------------------------------------------------------
# Role capability matrix
# ---------------------------------------------------------------------------

ROLE_PERMISSIONS: dict[str, set] = {
    "student": {
        "read:own_profile",
        "read:own_recommendations",
        "read:careers",
    },
    "counselor": {
        "read:all_students",
        "read:all_recommendations",
        "read:careers",
        "write:review",
        "read:reviews",
        "read:metrics",
        "read:stakeholder_feedback",
        "write:stakeholder_feedback",
    },
    "employer": {
        "read:careers",
        "write:stakeholder_feedback",
        "read:stakeholder_feedback",
    },
    "admin": {
        "read:all_students",
        "read:all_recommendations",
        "read:careers",
        "write:review",
        "read:reviews",
        "read:metrics",
        "read:stakeholder_feedback",
        "write:stakeholder_feedback",
        "read:rbac_info",
        "write:admin",
    },
}


# ---------------------------------------------------------------------------
# Token bearer scheme
# ---------------------------------------------------------------------------

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    """
    Extract and validate the Bearer token.
    Returns the user dict if valid, raises 401 if missing/invalid.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Bearer token. Include 'Authorization: Bearer <token>' header.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    user = USERS.get(token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: '{token}'. Use a valid demo token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Optional[dict]:
    """Returns user if authenticated, or None if no token (for public endpoints)."""
    if not credentials:
        return None
    return USERS.get(credentials.credentials)


def require_permission(permission: str):
    """FastAPI dependency factory — checks role permission after authentication."""
    def _checker(current_user: dict = Depends(get_current_user)) -> dict:
        role = current_user["role"]
        allowed = ROLE_PERMISSIONS.get(role, set())
        if permission not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Role '{role}' does not have permission '{permission}'. "
                    f"Required role: counselor, employer, or admin."
                ),
            )
        return current_user
    return _checker


def require_own_student(student_id: str, current_user: dict) -> None:
    """Students can only read their own profile. Counselors/admins can read all."""
    role = current_user["role"]
    if role == "student":
        if current_user.get("studentId") != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Students may only access their own profile. "
                    f"You are linked to '{current_user.get('studentId')}', "
                    f"not '{student_id}'."
                ),
            )


def get_demo_tokens() -> list[dict]:
    """Return the demo token registry for the /auth/tokens endpoint."""
    return [
        {
            "token": token,
            "role": info["role"],
            "displayName": info["displayName"],
            "username": info["username"],
            "permissions": sorted(ROLE_PERMISSIONS.get(info["role"], set())),
        }
        for token, info in USERS.items()
    ]
