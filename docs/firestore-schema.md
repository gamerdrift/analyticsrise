# Firestore Database Schema Definition

This document details the collections, documents, nested sub-schemas, and indexing patterns deployed in Cloud Firestore for **AnalyticsRise**.

---

## Database Architecture Outline

Firestore is configured as a NoSQL document database, utilizing root-level collections for primary entity sets to allow fast query operations and simplified access rules.

```
/users/{userId}          --> Profile, Telemetry, Achievements
/missions/{missionId}    --> Hands-on simulator tasks & rewards
/courses/{courseId}      --> Structured syllabus & modules list
/datasets/{datasetId}    --> SQL tables catalogs and mock file details
/certificates/{certId}   --> Cryptographically verifiable credentials
/submissions/{subId}     --> Time-limited exam query results & scores
/companies/{companyId}   --> Profile details for recruiting firms
/jobs/{jobId}            --> Career board opportunity details
```

---

## 1. Users Collection (`/users/{userId}`)

Each document represents a user account and tracks user progress telemetry.

```json
{
  "profile": {
    "displayName": "Jane Doe",
    "email": "jane.doe@analyticsrise.com",
    "avatarUrl": "https://storage.googleapis.com/.../avatars/user123.jpg",
    "role": "student" // student, instructor, admin, recruiter, enterprise
  },
  "telemetry": {
    "xp": 1250,
    "points": 450,
    "level": 3,
    "streak": 5,
    "lastActiveDate": "2026-06-30" // ISO YYYY-MM-DD
  },
  "achievements": [
    {
      "id": "sql_master",
      "name": "SQL Console Novice",
      "earnedAt": "2026-06-29T18:24:00Z"
    }
  ]
}
```

---

## 2. Missions Collection (`/missions/{missionId}`)

Represents modular challenges integrated inside simulators.

```json
{
  "title": "Excel Churn Analysis",
  "description": "Model customer subscription churn rates in the Excel sandbox.",
  "type": "excel", // excel, sql, powerbi, tableau
  "difficulty": "intermediate", // beginner, intermediate, advanced
  "xpReward": 150,
  "pointsReward": 50,
  "isCompleted": false,
  "order": 1
}
```

---

## 3. Courses Collection (`/courses/{courseId}`)

Defines the structure of lessons, tutorials, and simulator-based labs.

```json
{
  "title": "Relational SQL Query Optimization",
  "description": "Learn to optimize queries, write subqueries, and structure database schemas.",
  "category": "SQL Mastery",
  "level": "intermediate",
  "instructor": "John Smith",
  "thumbnail": "/images/courses/sql-opt.png",
  "duration": 6, // hours
  "students": 1420,
  "rating": 4.8,
  "modules": [
    {
      "id": "module_1",
      "title": "Understanding Query Indexes",
      "description": "How database indexes accelerate reads.",
      "order": 1,
      "lessons": [
        {
          "id": "lesson_1_1",
          "title": "Query Planning & Explains",
          "content": "Syllabus text content in markdown format...",
          "duration": 15, // minutes
          "exercises": [
            {
              "id": "ex_1_1_1",
              "title": "Create a B-Tree Index",
              "description": "Optimize a customer table read index query.",
              "type": "lab",
              "difficulty": "medium"
            }
          ]
        }
      ]
    }
  ],
  "createdAt": "2026-06-28T09:00:00Z",
  "updatedAt": "2026-06-30T12:00:00Z"
}
```

---

## 4. Datasets Collection (`/datasets/{datasetId}`)

Holds metadata details of clean sandbox files and schemas.

```json
{
  "title": "E-Commerce Transactions 2026",
  "description": "10,000 transaction records containing payment method and order values.",
  "category": "Retail Operations",
  "source": "Mock Generator Engine",
  "rows": 10000,
  "columns": 12,
  "fileSize": "1.2 MB",
  "downloadUrl": "https://storage.googleapis.com/.../datasets/ecom_2026.csv",
  "usedInCourses": ["course_sql_101"],
  "createdAt": "2026-06-28T09:00:00Z"
}
```

---

## 5. Certificates Collection (`/certificates/{certId}`)

Cryptographically verifiable credentials issued to learners.

```json
{
  "userId": "user_uid_123",
  "courseId": "course_sql_101",
  "title": "Enterprise SQL Query Optimization",
  "issueDate": "2026-06-29T18:24:00Z",
  "certificateUrl": "https://storage.googleapis.com/.../certificates/cert_123.pdf",
  "verificationUrl": "https://analyticsrise.com/verify/sha256-9b83a2...",
  "isValid": true
}
```

---

## 6. Submissions Collection (`/submissions/{subId}`)

Tracks results of quiz completions and lab exams.

```json
{
  "userId": "user_uid_123",
  "assessmentId": "assessment_opt_01",
  "score": 85,
  "percentage": 85,
  "answers": [
    {
      "questionId": "q_1",
      "answer": "CREATE INDEX idx_user ON users(id);",
      "isCorrect": true,
      "points": 10
    }
  ],
  "passed": true,
  "submittedAt": "2026-06-30T04:22:00Z"
}
```

---

## 7. Companies & Jobs Collections

Career board listings for recruiters and recruiters' corporate groups.

### Companies `/companies/{companyId}`
```json
{
  "name": "DataRise Analytics Corp",
  "logoUrl": "https://storage.googleapis.com/.../logos/datarise.png",
  "description": "Hiring firm focused on enterprise intelligence dashboards.",
  "website": "https://datarise-intelligence.example.com",
  "industry": "Consulting & Services",
  "location": "Boston, MA (Hybrid)",
  "createdAt": "2026-06-30T00:00:00Z"
}
```

### Jobs `/jobs/{jobId}`
```json
{
  "companyId": "company_datarise_123",
  "companyName": "DataRise Analytics Corp",
  "companyLogoUrl": "https://storage.googleapis.com/.../logos/datarise.png",
  "title": "Junior Business Analyst (Excel/SQL)",
  "description": "Help client operations maintain Power BI reports and Excel sheets...",
  "requirements": [
    "Proficiency in writing SQL JOIN statements",
    "Experience building Excel pivot tables"
  ],
  "salaryRange": "$65,000 - $75,000",
  "location": "Boston, MA (Hybrid)",
  "type": "full-time",
  "postedAt": "2026-06-30T01:30:00Z",
  "isActive": true
}
```
