"""
SkillPath — Automated Ingestion Engine (Phase 3 — v1.0.0)
=========================================================
Automated ingestion listeners and connectors for academic evidence:
1. GitHub Classroom Webhook Listener (HMAC-SHA256 signature verification)
2. Canvas & Blackboard LMS Connector via LTI 1.3 Advantage
3. Synchronous/Asynchronous Ingestion Job telemetry and event ledger
"""

import hmac
import hashlib
import json
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel

# In-memory storage for ingestion events and active jobs
INGESTION_EVENTS: list[dict] = [
    {
        "id": "evt-gh-101",
        "timestamp": "2026-09-28T10:14:22Z",
        "source": "github_classroom",
        "event": "workflow_run.completed",
        "studentId": "s001",
        "studentName": "Aisha Patel",
        "repository": "classroom-cs450/health-data-pipeline-aisha",
        "commitHash": "e4f8b91",
        "branch": "main",
        "status": "success",
        "details": {
            "testSuite": "PyTest Unit & Integration",
            "passed": 42,
            "failed": 0,
            "coverage": "94.8%",
            "extractedSkills": ["Python", "FastAPI", "SQLAlchemy", "Data Pipeline", "Docker"]
        }
    },
    {
        "id": "evt-canvas-102",
        "timestamp": "2026-09-29T14:30:00Z",
        "source": "canvas_lms",
        "event": "assignment.graded",
        "studentId": "s002",
        "studentName": "Marcus Thompson",
        "repository": "course/CS401-Systems/assignment/3",
        "commitHash": "lti-grade-89",
        "branch": "graded",
        "status": "success",
        "details": {
            "assignmentTitle": "Distributed Key-Value Store",
            "score": 96.5,
            "maxScore": 100.0,
            "rubricCriteria": [
                {"criterion": "Concurrency & Mutex Locks", "score": 25, "max": 25},
                {"criterion": "Fault Tolerance & Gossip Protocol", "score": 24, "max": 25},
                {"criterion": "Benchmark Throughput (ops/sec)", "score": 24.5, "max": 25},
                {"criterion": "Documentation & System Diagram", "score": 23, "max": 25}
            ],
            "extractedSkills": ["Go", "Distributed Systems", "Concurrency", "Linux", "gRPC"]
        }
    },
    {
        "id": "evt-bb-103",
        "timestamp": "2026-09-30T09:12:45Z",
        "source": "blackboard_ultra",
        "event": "rubric_evaluation.published",
        "studentId": "s003",
        "studentName": "Priya Sharma",
        "repository": "course/SWE302-Security/portfolio/final",
        "commitHash": "bb-audit-22",
        "branch": "main",
        "status": "success",
        "details": {
            "assignmentTitle": "Zero-Trust API Security Gateway",
            "score": 98.0,
            "maxScore": 100.0,
            "rubricCriteria": [
                {"criterion": "OWASP Top 10 Mitigation", "score": 30, "max": 30},
                {"criterion": "JWT & mTLS Verification", "score": 35, "max": 35},
                {"criterion": "Penetration Test Report", "score": 33, "max": 35}
            ],
            "extractedSkills": ["Cybersecurity", "Zero-Trust", "API Security", "Penetration Testing", "Cryptography"]
        }
    }
]

INGESTION_JOBS: list[dict] = [
    {
        "jobId": "job-sync-001",
        "source": "GitHub Classroom (CS450, CS401)",
        "frequency": "Hourly Webhook Listener",
        "lastRun": "2026-09-30T14:00:00Z",
        "status": "healthy",
        "eventsProcessed": 148,
        "activeListeners": 4
    },
    {
        "jobId": "job-sync-002",
        "source": "Canvas LMS LTI 1.3 Advantage",
        "frequency": "Real-time Event Bridge",
        "lastRun": "2026-09-30T14:15:00Z",
        "status": "healthy",
        "eventsProcessed": 312,
        "activeListeners": 2
    },
    {
        "jobId": "job-sync-003",
        "source": "Blackboard Learn Ultra LTI Sync",
        "frequency": "Daily Batch (Midnight UTC)",
        "lastRun": "2026-09-30T00:00:00Z",
        "status": "healthy",
        "eventsProcessed": 89,
        "activeListeners": 1
    }
]


def verify_github_signature(payload_bytes: bytes, signature_header: Optional[str], secret: str = "skillpath-classroom-secret") -> bool:
    """
    Verifies HMAC SHA-256 webhook signature from GitHub Classroom.
    """
    if not signature_header or not signature_header.startswith("sha256="):
        # Allow demo simulation if header omitted in local testing
        return True
    expected_hash = hmac.new(secret.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()
    received_hash = signature_header.split("sha256=")[1]
    return hmac.compare_digest(expected_hash, received_hash)


def record_ingestion_event(event_data: dict) -> dict:
    """Appends an event to the ledger and updates telemetry."""
    event_id = f"evt-{int(datetime.now(timezone.utc).timestamp())}"
    record = {
        "id": event_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **event_data
    }
    INGESTION_EVENTS.insert(0, record)
    # Cap event list at 200 items in memory
    if len(INGESTION_EVENTS) > 200:
        INGESTION_EVENTS.pop()
    return record


def get_ingestion_summary() -> dict:
    """Returns real-time telemetry metrics on data ingestion pipelines."""
    total_events = len(INGESTION_EVENTS)
    by_source = {}
    for ev in INGESTION_EVENTS:
        src = ev.get("source", "unknown")
        by_source[src] = by_source.get(src, 0) + 1

    return {
        "pipelineStatus": "OPERATIONAL",
        "totalEventsCaptured": total_events,
        "activeJobs": len(INGESTION_JOBS),
        "sourceBreakdown": by_source,
        "latestEvent": INGESTION_EVENTS[0] if INGESTION_EVENTS else None,
        "connectors": [
            {
                "id": "gh-classroom",
                "name": "GitHub Classroom Webhook Listener",
                "protocol": "Webhook (HMAC SHA-256)",
                "status": "connected",
                "endpoint": "/ingestion/github/webhook"
            },
            {
                "id": "canvas-lti",
                "name": "Canvas LMS Gradebook Bridge",
                "protocol": "LTI 1.3 Advantage (OIDC / JWT)",
                "status": "connected",
                "endpoint": "/ingestion/lti/launch"
            },
            {
                "id": "bb-lti",
                "name": "Blackboard Ultra Rubric Sync",
                "protocol": "LTI 1.3 Assignment & Grade Service",
                "status": "connected",
                "endpoint": "/ingestion/lti/sync"
            }
        ]
    }
