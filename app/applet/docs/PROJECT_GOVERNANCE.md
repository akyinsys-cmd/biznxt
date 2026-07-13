# BIZNXT 3.0 – Master Development Rules & Project Governance
## Document Class: Technical Architecture & Standards | Version: 1.0 (Phase 1 Baseline)

---

## 1. Governance Objectives & Scope
This governance blueprint establishes the development guidelines, design patterns, security protocols, and quality benchmarks for the BizNxt 3.0 platform (the Entrepreneur Operating System / Business Success Platform). All current and future development, engineering contributors, and system integrators must comply with these directives to ensure maximum scalability, high performance, robust security, and technical consistency.

---

## 2. Platform Architecture & Modular Design

To support a scalable multi-portal environment (Customer Portal, Research Executive Panel, BSM Panel, Partner Workspace, and Admin Console), the system utilizes a **Clean Architecture** with strict Separation of Concerns (SoC).

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      Presentation Layer                     │
 │      (React App / Tailwind CSS UI Components & State)       │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │                     Service & Controller                    │
 │               (API Handlers / Express Routers)              │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │                    Domain & Business Logic                  │
 │      (Role Validators, Business Rules, AI Pipelines)       │
 └──────────────────────────────┬──────────────────────────────┘
                                │
 ┌──────────────────────────────▼──────────────────────────────┐
 │                        Data Provider                        │
 │         (Firestore Clients, External Partner APIs)          │
 └─────────────────────────────────────────────────────────────┘
```

### 2.1 Code Reusability Rules
- **No Logical Duplication:** Common business rules (such as SLA timers, pricing multipliers, and status transitions) must reside in shared core service helper files.
- **Dumb Presentation Components:** UI components must focus entirely on visual styling, state rendering, and user feedback. They must not contain direct database transactions or custom AI query formatting.
- **Framework Uniformity:** Follow standard React Vite project design patterns. All files must use TypeScript with strict typing.

---

## 3. Database Architecture & Firestore Governance

BizNxt relies on Cloud Firestore as its primary transactional database. The schema structure and operations must adhere to highly optimized NoSQL patterns.

### 3.1 Data Integrity & Writing Rules
- **Schema-Based Ingestion:** Every document write must be validated against its strict type interface declared in the central database schema models.
- **Soft Deletes Only:** No operational document (User profile, Task, Project, Report, Payment) may be physically deleted. The system must append `{ isDeleted: true, deletedAt: Timestamp, deletedBy: String }` and query engines must filter out soft-deleted documents.
- **Audit Logs:** Every transition of a global workflow state (e.g., `In Progress` -> `In Review`) must trigger an immutable audit log entry in the `audit_logs` collection containing:
  ```json
  {
    "id": "uuid-v4",
    "resourceId": "document-id",
    "resourceType": "research_request|transaction|task",
    "changedBy": "user-uid",
    "changedByRole": "research_executive|admin|customer",
    "oldValue": "state-before",
    "newValue": "state-after",
    "timestamp": "Timestamp",
    "ipAddress": "String"
  }
  ```

### 3.2 Read & Write Cost Optimization
- **Read-Heavy De-normalization:** Embed metadata (like user's name and avatar) inside transaction or project records to avoid complex, expensive double-read queries on the client.
- **Pre-computed Aggregations:** Run background triggers to maintain rolling counts (e.g., `activeTaskCount`, `completedReportCount`) on client profile records instead of performing real-time collection counts.
- **Pagination Standard:** All dashboard tables, audit logs, and lead queues must use cursor-based pagination (`startAfter`) with a deterministic order limit (default: 20 records per page).

---

## 4. Platform Security & Guardrails

The system operates on a zero-trust model, ensuring customer intellectual property and operational logs are fully isolated.

### 4.1 Access Control Guidelines
- **Least Privilege Access:** Access to documents is governed strictly by authenticated Firebase UID or custom claims.
- **Service Route Proxies:** To protect proprietary business logic, the application uses server-side API proxy routes (`/api/*`) to handle sensitive integrations (such as Google GenAI, Stripe, or payment processors). API keys and credentials must never exist in the client browser memory.
- **MIME & File Security:** Storage uploads must be restricted to explicitly allowed MIME types (e.g., `application/pdf`, `image/png`, `image/jpeg`). Direct execution or storage of executables, scripts, or active macro-enabled files is forbidden.

---

## 5. Enterprise AI Engine Integration Rules

Google Gemini serves as our core internal intelligence engine. The following guardrails protect the integrity of the platform:

- **Strict Server-Side Logic:** All calls to the Google GenAI SDK (`@google/genai`) are executed inside secure Express middleware handlers.
- **No Raw AI Deliveries:** Outputs relating to financial models, legal structures, licensing roadmaps, or GTM timelines must be marked with a `Requires Review` flag. They must pass through the Quality Control (QC) gateway and receive human sign-off before becoming visible in the client portal.
- **The Confidence Stamp:** Every AI outcome must produce associated confidence metadata (Confidence Score, logical assumptions, and data gaps) to prevent blind reliance on machine estimations.

---

## 6. Development Quality Gateways

To ensure production-grade stability, every new feature or module must pass three mandatory technical validation gates before merging.

### 6.1 Gate 1: Syntax & Linter Validation
- Runs automated structural validation (via `npm run lint`) to catch syntax errors, missing package declarations, broken imports, or type errors.

### 6.2 Gate 2: Structural Verification & Compilation
- Runs the build pipeline (via `npm run build`) to ensure there are no build-time failures, bundle size exceptions, or compilation warnings.

### 6.3 Gate 3: UI/UX Completeness Audit
- **Adaptive Layouts:** Interfaces must be verified across dynamic device breakpoints: Android Mobile, Tablet, Desktop.
- **Graceful States:** Components must declare explicit visual states for **Loading** (via elegant skeleton cards/spinners), **Empty State** (featuring clear illustrations and contextual CTAs), and **Error State** (with trace IDs and troubleshooting support paths).

---

## 7. Versioning & Future-Readiness

The BizNxt platform must be developed with a global growth path, ensuring international expansion is built into its foundational design.

- **Semantic Versioning:** Follow standard `MAJOR.MINOR.PATCH` increments. Every API change or schema migration must be accompanied by detailed migration notes.
- **Multi-Currency & Regionalization Engine:** All price labels, tax variables, and transaction ledgers must support currency codes (e.g., INR, AED, USD) and regional taxation logic (e.g., GST, VAT).
- **Internationalization (i18n):** Hardcoded UI text is strictly prohibited. All user-facing strings must be defined inside localized JSON dictionaries to support translation scaling (English, Hindi, Arabic, etc.).
