"""
SkillPath — Synthetic Prototype Dataset Generator
==================================================
Generates:
  - students.json  (10 synthetic students)
  - careers.json   (8 career roles)

NOTE: All data is entirely synthetic and is used only to demonstrate
the SkillPath evidence-based career recommendation prototype.
Label: SYNTHETIC PROTOTYPE DATASET
"""

import json
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------------------------
# CAREER ROLES
# ---------------------------------------------------------------------------

careers = [
    {
        "id": "c001",
        "title": "Data Analyst",
        "emoji": "📊",
        "description": "Transforms raw data into actionable business insights using statistical analysis and visualisation tools.",
        "industry": "Technology / Business Intelligence",
        "requiredSkills": ["Python", "Data Analysis", "Data Visualisation", "SQL", "Statistics"],
        "preferredSkills": ["Machine Learning", "Tableau", "Power BI", "Excel", "R"],
        "evidenceTypes": ["data projects", "analysis portfolios", "SQL assessments"],
        "salaryRange": "£28,000 – £55,000",
        "growth": "High"
    },
    {
        "id": "c002",
        "title": "Software Developer",
        "emoji": "💻",
        "description": "Designs, builds and maintains software systems and applications using modern programming languages and frameworks.",
        "industry": "Technology",
        "requiredSkills": ["Python", "JavaScript", "Problem Solving", "Version Control", "Algorithms"],
        "preferredSkills": ["React", "Node.js", "Docker", "REST APIs", "Testing"],
        "evidenceTypes": ["coding projects", "GitHub portfolio", "hackathon participation"],
        "salaryRange": "£32,000 – £70,000",
        "growth": "High"
    },
    {
        "id": "c003",
        "title": "UX Designer",
        "emoji": "🎨",
        "description": "Creates intuitive, accessible digital experiences through user research, wireframing and iterative design.",
        "industry": "Design / Technology",
        "requiredSkills": ["UI/UX Design", "User Research", "Wireframing", "Prototyping", "Figma"],
        "preferredSkills": ["HTML/CSS", "Accessibility", "Design Systems", "User Testing", "Motion Design"],
        "evidenceTypes": ["design portfolios", "usability studies", "wireframe projects"],
        "salaryRange": "£28,000 – £60,000",
        "growth": "Medium-High"
    },
    {
        "id": "c004",
        "title": "Cybersecurity Analyst",
        "emoji": "🔐",
        "description": "Protects digital systems and networks by identifying vulnerabilities, monitoring threats and implementing security measures.",
        "industry": "Technology / Security",
        "requiredSkills": ["Network Security", "Threat Analysis", "Linux", "Python", "Risk Assessment"],
        "preferredSkills": ["Penetration Testing", "SIEM Tools", "Cryptography", "Incident Response", "Compliance"],
        "evidenceTypes": ["CTF competitions", "security audits", "network projects"],
        "salaryRange": "£35,000 – £75,000",
        "growth": "Very High"
    },
    {
        "id": "c005",
        "title": "Machine Learning Engineer",
        "emoji": "🤖",
        "description": "Builds and deploys machine learning models and AI systems that power intelligent applications.",
        "industry": "Technology / AI",
        "requiredSkills": ["Python", "Machine Learning", "Statistics", "Data Analysis", "Algorithms"],
        "preferredSkills": ["TensorFlow", "PyTorch", "MLOps", "Cloud Platforms", "Feature Engineering"],
        "evidenceTypes": ["ML projects", "Kaggle competitions", "research papers"],
        "salaryRange": "£45,000 – £95,000",
        "growth": "Very High"
    },
    {
        "id": "c006",
        "title": "Digital Marketing Analyst",
        "emoji": "📈",
        "description": "Drives business growth through data-informed digital campaigns, SEO strategy and performance analytics.",
        "industry": "Marketing / Business",
        "requiredSkills": ["Data Analysis", "Marketing Strategy", "Communication", "Statistics", "Content Creation"],
        "preferredSkills": ["SEO", "Google Analytics", "Social Media", "A/B Testing", "CRM Systems"],
        "evidenceTypes": ["campaign projects", "analytics reports", "content portfolios"],
        "salaryRange": "£24,000 – £50,000",
        "growth": "Medium"
    },
    {
        "id": "c007",
        "title": "Cloud Solutions Architect",
        "emoji": "☁️",
        "description": "Designs scalable, secure cloud infrastructure and guides organisations through digital transformation.",
        "industry": "Technology / Cloud",
        "requiredSkills": ["Cloud Platforms", "Network Security", "Linux", "Problem Solving", "System Design"],
        "preferredSkills": ["AWS", "Azure", "Terraform", "Docker", "Kubernetes"],
        "evidenceTypes": ["cloud deployment projects", "architecture designs", "certifications"],
        "salaryRange": "£55,000 – £110,000",
        "growth": "Very High"
    },
    {
        "id": "c008",
        "title": "Biomedical Data Scientist",
        "emoji": "🧬",
        "description": "Applies data science and bioinformatics to analyse biological datasets and support medical research.",
        "industry": "Healthcare / Science",
        "requiredSkills": ["Python", "Statistics", "Data Analysis", "Research Methods", "Machine Learning"],
        "preferredSkills": ["R", "Bioinformatics", "Clinical Data", "Genomics", "Scientific Writing"],
        "evidenceTypes": ["research projects", "biology coursework", "data analysis portfolios"],
        "salaryRange": "£32,000 – £65,000",
        "growth": "High"
    }
]


# ---------------------------------------------------------------------------
# STUDENTS
# ---------------------------------------------------------------------------

students = [
    {
        "id": "s001",
        "name": "Aisha Patel",
        "age": 20,
        "year": "Year 2",
        "avatar": "AP",
        "avatarColor": "#6366f1",
        "demonstratedSkills": ["Python", "Data Analysis", "Data Visualisation", "SQL", "Statistics", "Machine Learning"],
        "interests": ["Data Science", "AI", "Healthcare Analytics"],
        "projects": [
            {
                "title": "NHS Patient Readmission Predictor",
                "description": "Built a logistic regression model on synthetic NHS data to predict 30-day patient readmission rates.",
                "skills": ["Python", "Machine Learning", "Statistics", "Data Analysis"],
                "outcome": "85% accuracy on holdout set; presented at university symposium",
                "evidenceLink": "github.com/aisha/nhs-predictor"
            },
            {
                "title": "COVID-19 UK Trends Dashboard",
                "description": "Interactive Plotly dashboard visualising regional COVID-19 trends with real ONS data.",
                "skills": ["Python", "Data Visualisation", "SQL"],
                "outcome": "1,200+ views; featured in student showcase",
                "evidenceLink": "github.com/aisha/covid-dashboard"
            }
        ],
        "competencies": {
            "Analytical Thinking": 92,
            "Problem Solving": 88,
            "Communication": 75,
            "Collaboration": 80,
            "Technical Writing": 70
        },
        "portfolioLinks": [
            {"label": "GitHub Profile", "url": "github.com/aisha-patel"},
            {"label": "Kaggle Notebooks", "url": "kaggle.com/aishapatel"},
            {"label": "Research Blog", "url": "aisha-ds.medium.com"}
        ],
        "failureCase": None
    },
    {
        "id": "s002",
        "name": "Marcus Thompson",
        "age": 21,
        "year": "Year 3",
        "avatar": "MT",
        "avatarColor": "#10b981",
        "demonstratedSkills": ["JavaScript", "React", "Python", "Problem Solving", "Version Control", "REST APIs"],
        "interests": ["Web Development", "Open Source", "Game Development"],
        "projects": [
            {
                "title": "Open Source Task Manager",
                "description": "Full-stack productivity app with React frontend and FastAPI backend; 45 GitHub stars.",
                "skills": ["JavaScript", "React", "Python", "REST APIs", "Version Control"],
                "outcome": "45 GitHub stars; 3 external contributors",
                "evidenceLink": "github.com/marcus/taskflow"
            },
            {
                "title": "Browser-Based 2D Game Engine",
                "description": "Canvas-based game engine in vanilla JS with physics simulation and collision detection.",
                "skills": ["JavaScript", "Algorithms", "Problem Solving"],
                "outcome": "Used by 2 other students for final projects",
                "evidenceLink": "github.com/marcus/canvas-engine"
            }
        ],
        "competencies": {
            "Problem Solving": 95,
            "Collaboration": 90,
            "Analytical Thinking": 82,
            "Communication": 78,
            "Technical Writing": 65
        },
        "portfolioLinks": [
            {"label": "GitHub Portfolio", "url": "github.com/marcus-dev"},
            {"label": "Personal Website", "url": "marcusthompson.dev"}
        ],
        "failureCase": None
    },
    {
        "id": "s003",
        "name": "Sofia Reyes",
        "age": 19,
        "year": "Year 1",
        "avatar": "SR",
        "avatarColor": "#f59e0b",
        "demonstratedSkills": ["Figma", "UI/UX Design", "User Research", "Wireframing", "HTML/CSS"],
        "interests": ["Product Design", "Accessibility", "Social Impact Tech"],
        "projects": [
            {
                "title": "Accessible Banking App Redesign",
                "description": "Complete UX overhaul of a high-street bank's mobile app with WCAG 2.1 AA compliance in mind.",
                "skills": ["UI/UX Design", "User Research", "Wireframing", "Accessibility", "Figma"],
                "outcome": "Presented to real UX team; received internship offer",
                "evidenceLink": "figma.com/sofia/banking-redesign"
            }
        ],
        "competencies": {
            "Creativity": 95,
            "Communication": 90,
            "Analytical Thinking": 72,
            "Collaboration": 85,
            "Problem Solving": 80
        },
        "portfolioLinks": [
            {"label": "Figma Portfolio", "url": "figma.com/@sofia-reyes"},
            {"label": "Behance", "url": "behance.net/sofiareyes"}
        ],
        "failureCase": None
    },
    {
        "id": "s004",
        "name": "James Okafor",
        "age": 22,
        "year": "Year 3",
        "avatar": "JO",
        "avatarColor": "#ef4444",
        "demonstratedSkills": ["Linux", "Network Security", "Python", "Risk Assessment", "Threat Analysis"],
        "interests": ["Cybersecurity", "Ethical Hacking", "Privacy Advocacy"],
        "projects": [
            {
                "title": "University Network Vulnerability Audit",
                "description": "Conducted ethical penetration test of university's internal network with IT department permission.",
                "skills": ["Network Security", "Threat Analysis", "Linux", "Risk Assessment"],
                "outcome": "Identified 3 critical vulnerabilities; patch recommendations adopted",
                "evidenceLink": "github.com/james/vuln-audit"
            },
            {
                "title": "CTF Competition — Top 5%",
                "description": "Competed in national Capture The Flag cybersecurity competition, placing in top 5%.",
                "skills": ["Python", "Network Security", "Cryptography"],
                "outcome": "Top 5% nationally (230 teams)",
                "evidenceLink": "ctftime.org/user/james-okafor"
            }
        ],
        "competencies": {
            "Analytical Thinking": 90,
            "Problem Solving": 92,
            "Risk Assessment": 88,
            "Communication": 70,
            "Technical Writing": 75
        },
        "portfolioLinks": [
            {"label": "CTFtime Profile", "url": "ctftime.org/user/james-okafor"},
            {"label": "Security Blog", "url": "james-sec.hashnode.dev"}
        ],
        "failureCase": None
    },
    {
        "id": "s005",
        "name": "Priya Sharma",
        "age": 20,
        "year": "Year 2",
        "avatar": "PS",
        "avatarColor": "#8b5cf6",
        "demonstratedSkills": ["Python", "R", "Statistics", "Research Methods", "Data Analysis"],
        "interests": ["Bioinformatics", "Genomics", "Public Health"],
        "projects": [
            {
                "title": "Genomic Variant Analysis Pipeline",
                "description": "Automated pipeline to analyse SNP data from public genomic datasets using Python and BioPython.",
                "skills": ["Python", "Statistics", "Research Methods", "Data Analysis"],
                "outcome": "Pipeline processes 1M variants in <5 minutes; peer-reviewed write-up submitted",
                "evidenceLink": "github.com/priya/genomic-pipeline"
            }
        ],
        "competencies": {
            "Analytical Thinking": 94,
            "Research Methods": 90,
            "Technical Writing": 88,
            "Problem Solving": 82,
            "Communication": 76
        },
        "portfolioLinks": [
            {"label": "GitHub", "url": "github.com/priya-sharma-bio"},
            {"label": "ResearchGate", "url": "researchgate.net/priya-sharma"}
        ],
        "failureCase": None
    },
    {
        "id": "s006",
        "name": "Liam Chen",
        "age": 21,
        "year": "Year 2",
        "avatar": "LC",
        "avatarColor": "#06b6d4",
        "demonstratedSkills": ["AWS", "Linux", "Docker", "System Design", "Problem Solving"],
        "interests": ["Cloud Computing", "DevOps", "Infrastructure"],
        "projects": [
            {
                "title": "Serverless Image Processing Pipeline",
                "description": "AWS Lambda + S3 pipeline that automatically resizes and tags images on upload.",
                "skills": ["AWS", "Python", "System Design", "Docker"],
                "outcome": "Handles 10,000 images/day; deployed to production for student society",
                "evidenceLink": "github.com/liam/serverless-pipeline"
            }
        ],
        "competencies": {
            "Problem Solving": 87,
            "Analytical Thinking": 83,
            "Collaboration": 79,
            "Communication": 72,
            "Technical Writing": 68
        },
        "portfolioLinks": [
            {"label": "GitHub", "url": "github.com/liam-cloud"},
            {"label": "AWS Certification", "url": "credly.com/liam-chen-aws"}
        ],
        "failureCase": None
    },
    {
        "id": "s007",
        "name": "Zara Ahmed",
        "age": 20,
        "year": "Year 2",
        "avatar": "ZA",
        "avatarColor": "#ec4899",
        "demonstratedSkills": ["Communication", "Content Creation", "Social Media"],
        "interests": ["Digital Marketing", "Data Analytics", "Brand Strategy"],
        "projects": [],
        "competencies": {
            "Communication": 85,
            "Creativity": 80,
            "Collaboration": 75,
            "Problem Solving": 50,
            "Analytical Thinking": 45
        },
        "portfolioLinks": [],
        "failureCase": "no_evidence",
        "failureCaseLabel": "No Evidence",
        "failureCaseDescription": "Zara has strong interests in digital marketing and good communication skills, but has not yet submitted any technical projects, portfolio work, or evidence of data analysis competency. Recommendation is insufficient until evidence is provided."
    },
    {
        "id": "s008",
        "name": "Ethan Kowalski",
        "age": 21,
        "year": "Year 2",
        "avatar": "EK",
        "avatarColor": "#f97316",
        "demonstratedSkills": ["Python", "Data Analysis"],
        "interests": ["Machine Learning", "AI", "Robotics", "Deep Learning"],
        "projects": [
            {
                "title": "Intro to ML — Tutorial Replications",
                "description": "Replicated 3 standard ML tutorials from textbooks (no original work).",
                "skills": ["Python"],
                "outcome": "Completed course exercises; no original contribution",
                "evidenceLink": None
            }
        ],
        "competencies": {
            "Analytical Thinking": 60,
            "Problem Solving": 55,
            "Communication": 65,
            "Collaboration": 70,
            "Technical Writing": 50
        },
        "portfolioLinks": [],
        "failureCase": "high_interest_low_evidence",
        "failureCaseLabel": "Evidence Gap",
        "failureCaseDescription": "Ethan has very high interest in Machine Learning and AI (90%+ interest alignment) but has not demonstrated the required skills through original projects. Tutorial replications do not constitute sufficient evidence. Requires original ML project before a strong recommendation can be made."
    },
    {
        "id": "s009",
        "name": "Nadia Osei",
        "age": 22,
        "year": "Year 3",
        "avatar": "NO",
        "avatarColor": "#14b8a6",
        "demonstratedSkills": ["Python", "Data Analysis", "UI/UX Design", "Figma", "SQL", "User Research", "JavaScript"],
        "interests": ["Data Science", "Product Design", "HCI", "Accessibility"],
        "projects": [
            {
                "title": "Data-Driven UX Research Dashboard",
                "description": "Built a Figma-to-code dashboard combining user research analytics with a polished UI.",
                "skills": ["Python", "Data Analysis", "UI/UX Design", "JavaScript", "Figma"],
                "outcome": "Awarded 'Best Interdisciplinary Project' at faculty showcase",
                "evidenceLink": "github.com/nadia/ux-dashboard"
            }
        ],
        "competencies": {
            "Analytical Thinking": 88,
            "Creativity": 90,
            "Communication": 85,
            "Problem Solving": 82,
            "Collaboration": 87
        },
        "portfolioLinks": [
            {"label": "GitHub", "url": "github.com/nadia-osei"},
            {"label": "Figma Portfolio", "url": "figma.com/@nadia-osei"}
        ],
        "failureCase": "conflicting_evidence",
        "failureCaseLabel": "Conflicting Evidence",
        "failureCaseDescription": "Nadia's skill profile equally matches both Data Analyst and UX Designer pathways. Her evidence is strong for both, creating a genuine conflict. Interest alignment favours UX Design (85%) but evidence confidence favours Data Analysis (78%). Requires human counsellor review to determine best pathway."
    },
    {
        "id": "s010",
        "name": "Oliver Singh",
        "age": 19,
        "year": "Year 1",
        "avatar": "OS",
        "avatarColor": "#84cc16",
        "demonstratedSkills": ["Python", "JavaScript", "Problem Solving", "Data Visualisation", "SQL", "Version Control"],
        "interests": ["Full-Stack Development", "Data Science", "Startups"],
        "projects": [
            {
                "title": "Student Budget Tracker App",
                "description": "Full-stack web app for student budget tracking with data visualisation and shared budgets.",
                "skills": ["Python", "JavaScript", "SQL", "Data Visualisation", "Version Control"],
                "outcome": "200+ active users at university; featured in student newspaper",
                "evidenceLink": "github.com/oliver/budget-app"
            }
        ],
        "competencies": {
            "Problem Solving": 85,
            "Analytical Thinking": 80,
            "Communication": 82,
            "Collaboration": 78,
            "Technical Writing": 60
        },
        "portfolioLinks": [
            {"label": "GitHub", "url": "github.com/oliver-singh-dev"},
            {"label": "Product Hunt", "url": "producthunt.com/@oliver_singh"}
        ],
        "failureCase": None
    }
]


# ---------------------------------------------------------------------------
# WRITE FILES
# ---------------------------------------------------------------------------

def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✓ Written: {filename}  ({len(data)} records)")


if __name__ == "__main__":
    print("\n🎓 SkillPath — Synthetic Prototype Dataset Generator")
    print("=" * 52)
    print("⚠️  SYNTHETIC PROTOTYPE DATASET — Not real student data\n")

    write_json("careers.json", careers)
    write_json("students.json", students)

    print("\n✅ Dataset generation complete.")
    print(f"   Students : {len(students)}")
    print(f"   Careers  : {len(careers)}")
    print(f"   Location : {OUTPUT_DIR}\n")
