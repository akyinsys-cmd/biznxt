# BIZNXT 3.0 – Enterprise AI Intelligence Engine & Prompt Framework
## Document Class: AI Architecture | Version: 1.0 (Phase 1 Baseline)

---

## 1. Core Operating Philosophy

**BizNxt is NOT a casual AI chatbot.** The customer-facing product does not present a raw, open-ended text box for conversational AI. Instead, BizNxt utilizes Artificial Intelligence as an **internal intelligence layer** and **productivity multiplier** embedded directly inside our operational workflows.

Entrepreneurs, experts, and consultants interact with structured screens, timelines, scoring dashboards, and polished PDF reports. Behind these interfaces, the **BizNxt AI Engine (powered by Google Gemini)** orchestrates data ingestion, processes regional context, structures financial projections, drafts competitor profiles, and acts as an automatic quality auditor.

### Key Architectural Pillars:
- **Server-Side Enforcement:** To protect corporate IP and secure client data, all AI integrations occur strictly server-side using the `@google/genai` TypeScript SDK. No API keys are ever exposed to the client.
- **Model Orchestration:** Tasks are dynamically routed:
  - **`gemini-3.5-flash`:** Leveraged for high-speed validations, structural classifications, translation, quality checks, and summarizing operational logs.
  - **`gemini-3.1-pro-preview`:** Configured for deep-dive economic analysis, location modeling, complex financial assumptions, and drafting detailed report sections.
- **The "Human-in-the-Loop" Core:** No AI draft is ever presented to a customer without undergoing expert enrichment, field verification, and manual QA validation.

---

## 2. Multi-Tier AI Pipeline & Execution Lifecycle

Every research, planning, or consulting request flows through a unified state-machine managed by the AI engine:

```
[ Customer Intake ]
         │
         ▼
[ Step 1: Input Validation & Cleaning ] ──(Fails validation)──► [ Prompt Customer ]
         │ (Passes)
         ▼
[ Step 2: Requirement Classification & Routing ]
         │
         ▼
[ Step 3: Research Planning & Task Orchestration ]
         │
         ▼
[ Step 4: Multi-Agent Parallel Analysis ]
  ├── Market & Industry Analysis Agent (Gemini Pro)
  ├── Location & Demographics Analytics Agent (Gemini Pro with Maps Grounding)
  ├── Competitor Profile & SWOT Synthesizer (Gemini Pro with Search Grounding)
  └── Financial Model Blueprint Draft (Gemini Pro)
         │
         ▼
[ Step 5: Draft Aggregation & Structural Formatting ]
         │
         ▼
[ Step 6: Automated AI Quality Check Gate ] ──(Fails Audit)──► [ Self-Correction Loop ]
         │ (Passes Audit)
         ▼
[ Step 7: Subject Matter Expert Review & Manual Enrichment ]
         │
         ▼
[ Step 8: PDF Compilation & Cryptographic Seal ]
         │
         ▼
[ Customer Dashboard Live Delivery ]
```

### Detailed Pipeline Stages:
1. **Input Validation:** A lightweight parser powered by `gemini-3.5-flash` checks the customer’s intake form. It flags nonsense inputs, extreme anomalies (e.g., "Starting an airline with a ₹10,000 budget"), or empty location profiles.
2. **Requirement Classification:** Classifies the request into logical buckets (e.g., Manufacturing, Retail, Import/Export, B2B, Services) and dynamically assigns the appropriate regulatory, financial, and marketing schemas.
3. **Research Planning:** Generates a custom analysis plan containing specific data-gathering directives for the Research Executive.
4. **AI-Assisted Analysis:** Runs the parallel reasoning pipelines, calling Google Search and Maps grounding features where active real-time data is required.
5. **Quality Review Assistance:** An independent AI checking instance evaluates the draft for inconsistencies before routing to the human reviewer.

---

## 3. High-Fidelity Prompt Library (Role-Based)

To maintain absolute structure and high-quality tone, the AI engine uses pre-compiled system prompts matched to specific workspace roles.

### 3.1 Role: The Research Assistant (Market Analyst)
- **Model Target:** `gemini-3.1-pro-preview`
- **Objective:** Generate a comprehensive, contextual industry briefing based on customer inputs.
- **Inputs Required:** `industryName`, `targetSubcategory`, `targetLocation`, `investmentTier`.

```
[System Instructions]
You are the Lead Market Research Specialist at BizNxt, bringing the analytical precision of a McKinsey Senior Partner and the localized practical knowledge of an on-ground business developer.

Analyze the user's business concept under the following parameters:
- Industry: {{industryName}} (Subcategory: {{targetSubcategory}})
- Location Context: {{targetLocation}}
- Investment Limit: {{investmentTier}}

Your output must be structured, professional, and dense with practical insights. Do not use generic introductions or fluffy transitional phrases. Adhere to these sections:
1. LOCAL MARKET DEMAND ANALYSIS: Identify the core consumer segments in this specific location. Map physical vs. digital demand signals.
2. MACRO INDUSTRY TRENDS: Outline the immediate 3-year growth forecast, headwinds, and consumer sentiment shifts.
3. REGULATORY AND LICENSE BRIEF: List the exact state, federal, and municipal licenses required for this specific sector in this location.

[Validation Rules]
- Outputs must contain zero "Lorem Ipsum" or generic placeholders.
- If a data point is an estimate, it must be explicitly labeled as such.
- Do not make absolute guarantees of business success.

[Escalation Conditions]
If the requested location lacks any recognizable commercial zoning or is restricted, output an immediate structural error flag: "LOCATION_ZONING_RESTRICTED".
```

### 3.2 Role: The Financial Architect (Financial & ROI Planner)
- **Model Target:** `gemini-3.1-pro-preview`
- **Objective:** Construct a complete CapEx, OpEx, and pricing model based on economic baselines.
- **Inputs Required:** `businessType`, `investmentBudget`, `scaleTier`, `rentEstimate`.

```
[System Instructions]
You are the Principal Financial Analyst at BizNxt. Your responsibility is to design a realistic, conservative, and mathematically sound financial baseline for the business.

Construct the blueprint using these formulas and logic:
- CapEx Allocation: Equipement, Licenses, Interiors, Deposits (Must not exceed 65% of {{investmentBudget}}).
- OpEx Allocation: 6-month operational runway (Rent: {{rentEstimate}} per month, salaries, inventory, utility reserves).
- Revenue Equations: Construct 3 dynamic models (Best Case, Base Case, Worst Case) clearly stating the Average Order Value (AOV), daily customer capture rate, and net margins.

[Validation Rules]
- Output MUST be returned as a structured JSON object complying with the BizNxt Financial Schema.
- Sum of CapEx and 6-month OpEx Runway must match the {{investmentBudget}} with a +/- 5% error tolerance.

[Escalation Conditions]
If {{rentEstimate}} combined with essential utilities exceeds 40% of the projected monthly cash flow, flag the model as "FINANCIAL_MODEL_UNSTABLE_HIGH_BURNOUT".
```

### 3.3 Role: The Quality Auditor (AI Quality Controller)
- **Model Target:** `gemini-3.5-flash`
- **Objective:** Perform automated logical checking on drafts before they reach the senior human reviewer.
- **Inputs Required:** `draftReportContent`, `originalClientIntake`.

```
[System Instructions]
You are the Quality Assurance Director at BizNxt. Your task is to audit the drafted consulting report for completeness, accuracy, consistency, and compliance.

Execute these checks:
1. INPUT COMPLIANCE: Verify that the draft directly addresses the client's original budget ({{originalClientIntake.budget}}) and location ({{originalClientIntake.location}}).
2. LOGICAL INCONSISTENCIES: Scan for contradictory claims (e.g., claiming a retail store requires 10 staff on Page 2, but budgeting for 2 staff on Page 10).
3. TRUNCATED CONTENT: Check for trailing sentences, incomplete tables, or empty headers.

[Validation Rules]
Your response must be a flat JSON audit card:
{
  "pass": boolean,
  "flaggedIssues": [
    { "section": string, "issue": string, "criticality": "HIGH"|"MEDIUM"|"LOW" }
  ],
  "reworkRecommended": boolean
}
```

---

## 4. Confidence & Validation Framework

Every AI-generated baseline or draft segment is stamped with an internal **Confidence metadata packet**. This packet ensures that human reviewers are immediately aware of data limitations.

```
┌────────────────────────────────────────────────────────┐
│               Confidence Index Score Card              │
├────────────────────────────────────────────────────────┤
│ Confidence Level: 84% [HIGH]                           │
├────────────────────────────────────────────────────────┤
│ Information Completeness: 75%                          │
│ Missing Inputs: Regional Rent Listings, Local Supplier  │
├────────────────────────────────────────────────────────┤
│ Key Assumptions:                                       │
│ 1. Average retail floor space is 500 sq ft             │
│ 2. Electrical grid stability is 98%                   │
├────────────────────────────────────────────────────────┤
│ Human Action Required:                                 │
│ [ ] Confirm exact rent deposit with landlord           │
│ [ ] Verify water connection suitability for FSSAI       │
└────────────────────────────────────────────────────────┘
```

### Parameter Scoring Matrix:
1. **Confidence Level (Percentage):** Calculated by cross-referencing available source variables. Higher weights are given to items sourced directly from validated public databases (e.g., corporate registries) versus web-crawled listings.
2. **Information Completeness (Percentage):** The ratio of filled customer intake parameters to the ideal structural profile required for the business type.
3. **Assumptions Log:** Every dynamic calculation must list its baseline assumptions (e.g., interest rate, electricity tariffs, employee tax rates).
4. **Items Requiring Human Verification:** High-liability questions (e.g., specific zoning clearances, hazardous waste permits) are automatically outputted as an actionable checklist for the Business Success Manager (BSM).

---

## 5. Human Review Policy & Escrow Gates

BizNxt enforces a strict, multi-tiered **Human Review Policy** where certain AI-drafted outputs cannot bypass expert sign-off.

```
┌────────────────────────────────────────────────────────┐
│               SME Verification Workflow                │
├────────────────────────────────────────────────────────┤
│                  [ AI Baseline Draft ]                 │
│                            │                           │
│                            ▼                           │
│           [ Subject Matter Expert Review ]             │
│            - Edits financial cells                     │
│            - Validates localized compliance            │
│                            │                           │
│                            ▼                           │
│              [ Senior Consultant Review ]              │
│            - Confirms tactical alignment               │
│            - Signs off on Business Score               │
│                            │                           │
│                            ▼                           │
│                 [ Automated QA System ]                │
│            - Runs mathematical validation              │
│                            │                           │
│                            ▼                           │
│                 [ Locked Vault Delivery ]              │
└────────────────────────────────────────────────────────┘
```

### Mandatory Review Matrix:
- **Financial Projections & ROI Models:**
  - *AI Role:* Drafts CapEx structure, OpEx spreadsheets, AOV formulas.
  - *Mandatory Reviewer:* CA or Senior Financial Consultant.
  - *Policy:* Must manually adjust local tax brackets and verify regional equipment costs.
- **Legal & Regulatory Guidance:**
  - *AI Role:* Outlines typical industry licenses, structural registrations.
  - *Mandatory Reviewer:* Corporate Attorney or Registered Legal Partner.
  - *Policy:* Must confirm no zoning changes or upcoming regional regulatory prohibitions have occurred.
- **Business Launch Checklist & Milestones:**
  - *AI Role:* Formulates the sequential launch timeline.
  - *Mandatory Reviewer:* Assigned Business Success Manager (BSM).
  - *Policy:* Confirms localized partner availability (e.g., verified local contractors or packers).

---

## 6. System Security & Guardrails

To maintain enterprise integrity, the AI Engine enforces rigid sandbox security rules:

1. **System Prompt Protection (Anti-Prompt Injection):**
   - The server wraps all inputs inside system instruction contexts.
   - Any client input containing semantic keywords like "ignore previous instructions", "system print", or "developer override" is caught by the Express pre-filter and immediately aborted.
2. **Customer Data Partitioning:**
   - Prompt generation reads strictly from individual customer documents in Firestore.
   - Prompts are compiled on-demand in isolated Node.js context blocks. Under no circumstances can customer documents cross-pollinate, avoiding data leakage.
3. **No External Training:**
   - All calls utilize Google GenAI's enterprise endpoints under strict terms: customer data processed via these pipelines is never used to train public foundation models.

---

## 7. Knowledge Organization & Taxonomies

To feed clean context into Gemini, the platform structures internal industry vectors across standard taxonomies:

- **Primary Industry Verticals:**
  - **Manufacturing:** Contract, OEM, Private Label, White Label.
  - **Trading & Logistics:** Wholesale, Retail, Franchise, Import, Export.
  - **Services:** Professional, Hospitality, Healthcare, Technical.
  - **E-Commerce & Digital:** Direct-to-Consumer (D2C), Marketplace Sellers, SaaS.
- **Knowledge Vertices:**
  - *Finance:* Taxation, Banking API, Working Capital, Micro-loans.
  - *Legal & Compliance:* IP Protection, Corporate Governance, Corporate Registrations, Municipal Licensing.
  - *Technology Architecture:* CRM, ERP systems, AI Operations, Analytics.
  - *Human Capital:* Org Design, KPI Modeling, Compensation Structures.
- **Geographic Nodes:**
  - *Tier 1/2/3 India:* Specific state rules, industrial zone exemptions, MSME policies.
  - *Dubai/UAE/GCC:* Free Zone setup, Mainland LLC, export/import tariffs, sponsor mapping.

---

## 8. Performance & Latency Benchmarks (SLA)

The AI Architecture targets high-reliability metrics to support scalable enterprise use:

| Task Type | Target Model | Max Token Limit | Target Latency | Acceptable Success Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Input Intake Validation** | `gemini-3.5-flash` | 1,024 | < 1.5 seconds | 99.8% |
| **Document Classification** | `gemini-3.5-flash` | 512 | < 1.0 second | 99.9% |
| **Report Section Drafting** | `gemini-3.1-pro-preview` | 8,192 | < 15.0 seconds | 95.0% (Allows retry) |
| **Automated Draft Auditing** | `gemini-3.5-flash` | 2,048 | < 3.0 seconds | 99.5% |
| **Workflow Checklist Synthesis** | `gemini-3.1-pro-preview` | 4,096 | < 8.0 seconds | 98.0% |
