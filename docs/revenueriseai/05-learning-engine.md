# RevenueRiseAI — Learning Engine & Skill Graph Architecture

**Document Version:** 1.0.0
**Author:** Lead Curriculum Architect & Learning Systems Engineer
**Status:** Approved Architectural Proposal

---

## 1. Pedagogical Architecture & Graph-Based Learning

Conventional e-learning platforms present static, linear video playlists. RevenueRiseAI organizes knowledge as a **Directed Acyclic Graph (DAG)** of granular, testable **Skill Nodes**.

```
[ Beginner Assessment / Diagnostic ]
                 |
                 v
       +-------------------+
       |    SKILL GRAPH    |
       +-------------------+
                 |
                 +---> [ Node A: Relational Schema Basics ]
                 |          |
                 |          v
                 +---> [ Node B: SQL Basic SELECT & Filter ]
                 |          |
                 |          v
                 +---> [ Node C: Multi-Table INNER/LEFT JOINs ]
                 |          |
                 |          v
                 +---> [ Node D: Aggregations & GROUP BY ]
                 |          |
                 |          v
                 +---> [ Node E: Window Functions (LEAD/LAG/RANK) ] (PREREQ: C & D)
                            |
                            v
                 [ Node F: Query Optimization & Partitioning ]
                            |
                            v
                 [ CAPSTONE: SQL Specialist Certification ]
```

---

## 2. Dynamic Learning Path Generator

When a user enrolls or sets a target career role (e.g., *Data Analyst*, *BI Developer*, *Quantitative Strategist*), the **Learning Path Generator** computes the optimal path:

1. **Target Goal Analysis**: Identifies all prerequisite skill nodes required by the target role.
2. **Current Mastery Subtraction**: Compares the target graph against the user's verified `UserSkillProgress` state.
3. **Topological Sort**: Computes the shortest, unblocked dependency sequence for rapid mastery.
4. **Adaptive Remediation**: If a user fails an assessment for Node E, the engine dynamically injects targeted practice modules for Node C or D before allowing a re-attempt.

---

## 3. Assessment & Code Evaluation Engine

To prevent credential inflation and ensure genuine real-world capability, assessments are evaluated through multi-mode server-side test runners:

### 3.1 Evaluation Modalities

| Assessment Type | Evaluation Mechanism | Execution Environment |
|-----------------|----------------------|-----------------------|
| **SQL Queries** | Deterministic Result Table Comparison against Gold-Standard queries | In-Memory SQLite / DuckDB WebAssembly / PostgreSQL |
| **Python Data Scripts** | Unit Test Assertions (PyTest / Pyodide runner) evaluating DataFrame schema and output values | Sandboxed WebAssembly Worker / Isolated Cloud Container |
| **Spreadsheet Modeling** | Cell formula inspection and multi-scenario numerical output matching | Formula Parser / In-Memory Grid Engine |
| **Scenario Case Studies** | Rubric-based structured evaluation with multi-turn AI Mentor questioning | AI Structured Output Evaluator |

### 3.2 Anti-Plagiarism & Integrity Controls
- Randomized parameterization of dataset values per user assessment session.
- Client focus-loss tracking and time-window restrictions.
- Cryptographic hash verification of code submission checkpoints.

---

## 4. Spaced Repetition & Retention Engine

Mastery degrades over time without continuous retrieval practice. RevenueRiseAI implements an enhanced SuperMemo-2 (SM-2) spaced repetition algorithm:

$$I(n) = I(n-1) \times EF$$

Where:
- $I(n)$ is the interval (in days) until the next practice challenge.
- $EF$ is the Easiness Factor, adjusted dynamically based on user response accuracy ($0 \le q \le 5$):

$$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$

When a user logs in, the **Daily Focus Panel** highlights 1–3 micro-drills from skills nearing memory decay.

---

## 5. Certification Pathway & Issuance

```
Step 1: Complete 100% of Core Course Modules
                 |
                 v
Step 2: Complete 3 Verified Practical Labs
                 |
                 v
Step 3: Timed Proctored Capstone Assessment (Score >= 80%)
                 |
                 v
Step 4: Cryptographic Certificate Minting (HMAC SHA-256 Signature)
                 |
                 v
Step 5: Public Verified Credential URL (/portfolio/{username}/certificates/{certId})
```
