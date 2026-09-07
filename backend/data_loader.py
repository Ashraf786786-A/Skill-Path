"""
SkillPath — Data Loader
Loads students.json and careers.json from the dataset directory.
"""

import json
import os

DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "dataset")


def load_students() -> list[dict]:
    path = os.path.join(DATASET_DIR, "students.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_careers() -> list[dict]:
    path = os.path.join(DATASET_DIR, "careers.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# Eager-load at import time for fast responses
STUDENTS: list[dict] = load_students()
CAREERS: list[dict] = load_careers()

STUDENTS_BY_ID: dict[str, dict] = {s["id"]: s for s in STUDENTS}
CAREERS_BY_ID: dict[str, dict] = {c["id"]: c for c in CAREERS}
