# SPEC.md: Our Project Specification

> Project specification for SkillFit AI Navigator (`AIisMyFriend`).
> Guided by Spec-Driven Development (SDD) standards for CodeSquad AI Community Sprint.

---

## PART A: Sprint rules (set by CodeSquad, don't delete)

### A1. Stack
- React (in `src/`) + Node/Express (in `server/`) + In-Memory Session Memory + Gemini through LangChain.
- AI calls happen ONLY on the server (`server/ai/model.js`). Never from React.
- Every agent skill is a folder: `skills/<name>/SKILL.md`, name matches the folder.

### A2. Security
- API keys live in Replit Secrets or `.env`. Never in code, commits, screenshots, or chat.
- `import 'dotenv/config'` is the first line of every server file that reads settings.
- Every request is checked with zod `.safeParse()` before the AI or database is used.
- SQL/In-memory stores use parameterized queries. Never glue user text into queries.

### A3. Responsible AI
- The agent says it is an AI and never poses as a doctor, lawyer, or counselor.
- The `safety-guardrail` skill stays on. Personal info is removed before the AI sees it.
- Facts come from verified sources and O*NET occupational standards, or the agent says "I don't know".
- Anything high-stakes gets a path to a real person (phone, website, office).

### A4. Scope
- Two weeks. One core user journey. At most 3 must-have features.
- Live on Replit / Render by demo day, with a backup screen recording.

---

## PART B: Our project

### 1. Team and one-liner
- **Team name:** AIisMyFriend
- **App name:** SkillFit AI Navigator
- **One sentence:** We help frontline and administrative workers (who) map their real-world skills into 3 realistic, AI-augmented job directions (do what) by using AI to translate messy daily task descriptions into practical tool workflows and ready-to-use action prompts (result).

### 2. Problem
- **Problem statement:** Frontline workers keep hearing they're getting replaced by AI, but nobody shows them how their actual skills connect to new tools. People panic thinking they need to learn Python. In reality, handling chaos and organizing work are the exact skills needed to run AI tools.
- **Theme:** Workforce Transition & Future of Work
- **Evidence it's real:** Over 65% of administrative and customer-facing support roles are experiencing AI automation pressure, yet fewer than 15% of workers receive employer guidance on everyday productivity tools.

### 3. User
- **Main user:** Marcus, 38, medical receptionist & office coordinator at an outpatient clinic in Greater New York. Handles patient check-ins, angry billing disputes, and doctor scheduling with zero CS background.
- **What they do today without our app:** Doomscrolling job boards where every listing demands buzzwords like "AI strategist," or taking 20-year-old career quizzes that suggest becoming a file clerk.
- **Device and language(s):** Budget Android smartphone during a 25-minute bus commute home, or shared family laptop; English (Spanish toggle in Phase 2).

### 4. Goals
| Goal | How we'll measure it | Target |
|---|---|---|
| Speed to Career Direction | Time from opening web app to viewing 3 tailored Role Cards | Under 5 minutes |
| O*NET Alignment | Suggested roles mapped to grounded occupational clusters | 100% grounded (zero fake buzzwords) |
| Actionable Immediate Utility | Role cards include verified free tools and 1-click clipboard prompt | 3 verified tools + 1 prompt per card |

### 5. Features
| Priority | Feature | Ticket | Skill(s) |
|---|---|---|---|
| Must | 5-Question Task Intake Web Form (zero tech jargon) | 004 | `safety-guardrail` |
| Must | AI Skill Mapping Pipeline returning 3 structured Role Cards | 005 | `skill-navigator` |
| Must | Dynamic Role Deck with Unsplash visuals & 1-click prompt copy | 006 | `skill-navigator` |
| Nice to have | "Adjust My Focus" button to recalibrate preferences in memory | 007 | `skill-navigator` |
| Not now | User accounts, resume PDF parsing, database persistence, job board scrapers | n/a | n/a |

### 6. Agent and skills
- **Agent name and voice:** SkillFit Navigator: sharp, encouraging, realistic, and practical like a veteran career strategist; 8th-grade reading level.
- **Starter skills we keep:** `safety-guardrail` (strips personal info: phone, email, SSN; redirects crisis topics).
- **New skills we'll write:** `skill-navigator` (analyzes unstructured task descriptions, extracts core competencies, matches to O*NET career clusters, pairs with verified free AI tools, generates actionable prompts and visual keywords).
- **The agent must NEVER:** Suggest fake buzzwords like "Prompt Engineer", claim to guarantee employment, offer medical/legal counsel, or expose backend API keys.

### 7. Data
| Store | What's in it | Where the data comes from | Who keeps it up to date |
|---|---|---|---|
| Session Memory | Current user answers & active generated role cards | User form submission | Volatile client/server session (cleared on tab close) |
| Curated AI Tools | Free/freemium tools catalog (Whisper, ChatGPT Free, Claude Free, Gemini Flash) | Verified developer specifications | Team AIisMyFriend |

### 8. Privacy and governance
- **Personal info our app could touch:** Freeform text descriptions of everyday workplace routines.
- **How we protect it:** `safety-guardrail` scrubs PII before the model sees it. Session-only in-memory processing with zero database writes; 100% data ephemerality.
- **What we tell users up front:** "Zero database. 100% session memory. Your inputs are never stored, sold, or shared."
- **Who on the team is responsible:** Danilo Andiel (Product Owner & Engineer).

### 9. Out of scope (not in these two weeks)
- User logins, OAuth, database persistence, resume file uploads, automated job applications, paid AI subscription models.

### 10. Open questions
- None for MVP. All quota and availability risks neutralized via 4-tier fallback cascade.
