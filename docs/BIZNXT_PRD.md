# BIZNXT 3.0 - PRODUCT REQUIREMENT DOCUMENT (PRD)

## 1. Product Strategy

### Vision
To be the definitive global launchpad and operational ecosystem for entrepreneurs, startups, and enterprises, enabling them to ideate, build, launch, and scale seamlessly from anywhere in the world.

### Mission
To democratize enterprise-grade business intelligence and professional execution services by combining state-of-the-art AI with vetted human expertise.

### Goals
- **Short-term:** Onboard 10,000 active startups within the first 12 months.
- **Mid-term:** Process $10M in service transactions through the marketplace by Year 2.
- **Long-term:** Become the default operating system for new business formation and global expansion (Dubai, Singapore, US, UK).

### Unique Selling Proposition (USP)
"We don't just give you a report; we build your business." 
Unlike traditional consulting or AI report generators, BizNxt provides **End-to-End Execution**—from AI-driven market validation to actual legal registration, tech development, and marketing deployment via our curated partner network.

### Target Market
- Early-stage founders and aspiring entrepreneurs.
- SMEs looking to digitize or expand geographically.
- Global enterprises seeking local market entry (e.g., setting up in Dubai/India).
- Freelancers, consultants, and agencies seeking high-quality leads.

### Target Customers
1. **The Visionary:** Has an idea, needs validation, business plan, and execution team.
2. **The Expander:** Existing business looking to incorporate in Dubai or US.
3. **The Consultant/Partner:** Professional service providers seeking vetted client flow.

### Business Model
B2B SaaS + Managed Marketplace. BizNxt acts as the platform and the trust intermediary between businesses and service providers.

### Revenue Model
1. **Freemium Subscriptions:** Free basic AI research; premium monthly/yearly tiers for deep analytics, competitor tracking, and continuous monitoring.
2. **Marketplace Commission:** 10-20% take-rate on all services executed through the platform (Legal, Tech, Marketing).
3. **Enterprise Packages:** High-ticket done-for-you market entry packages (e.g., $10k-$50k for Dubai Setup).
4. **Report Sales:** One-off purchases for deeply researched, human-validated industry reports ($49-$499).

### Growth Strategy
- **Product-Led Growth (PLG):** Free basic business idea validation tool acts as a powerful lead magnet.
- **Consultant Network Effect:** Partners bring their clients to the platform to manage projects, increasing lock-in.
- **SEO & Content:** Programmatic SEO based on generated industry reports and market trends.

---

## 2. Complete Feature List

### 1. Discovery & Ideation Module
- AI Idea Validator (Instant Score)
- Trend Analyzer & Market Sizing
- Persona Generator

### 2. AI Research & Reports Module
- Instant Competitor Analysis
- Financial Modeling & Projections (3-year/5-year)
- SWOT & Risk Analysis Generator
- Pitch Deck Content Generator

### 3. Launch & Execution Marketplace
- Service Discovery Catalog (Legal, Tech, Marketing, Operations)
- Dynamic Pricing & Scoping Engine
- Secure Payment Escrow
- Project Management Board (Kanban for service delivery)

### 4. Consultant & Partner Hub
- Partner Onboarding & KYC Validation
- Lead Management Pipeline
- Proposal & Contract Generator
- Payout & Earnings Dashboard

### 5. Client Dashboard & Workspace
- "My Ventures" Portfolio View
- Real-time Task & Milestone Tracker
- Secure Document Vault (Incorporation certs, PAN, Tax docs)
- Centralized Messaging/Communication Channel

### 6. Admin & Operations Control Room
- Global Metrics & GMV Dashboard
- Dispute Resolution Center
- Partner KYC Approval Workflow
- AI Quality Control Queue (Human-in-the-loop review)

---

## 3. User Journey

### The "Visionary" Flow
1. **Visitor:** Lands on BizNxt via a targeted ad: "Validate your startup idea in 60 seconds."
2. **Signup:** Creates account via Google/LinkedIn to view the full validation score.
3. **Free Research:** Uses the AI Wizard to generate a basic SWOT analysis and Market Overview.
4. **Premium Report:** Pays $99 (or subscribes) to unlock the Deep-Dive Financial Model and Competitor Matrix.
5. **Consultation:** Books a free 30-min strategy call with a BizNxt Consultant to interpret the report.
6. **Execution:** Purchases the "Private Limited Incorporation + Basic App MVP" package from the marketplace.
7. **Business Growth:** Tracks incorporation and dev progress via the Workspace Dashboard.
8. **Expansion:** 18 months later, uses BizNxt to incorporate a subsidiary in Dubai and hire international marketing agencies.

---

## 4. Information Architecture

### Main Navigation (Public)
- Home | Solutions (Startup, Enterprise, Global Setup) | Services | Pricing | Resources | Login / Signup

### Authenticated Workspace (Customer)
- **Dashboard:** Overview, Active Projects, Recent Reports
- **My Ventures:**
  - Venture A (Settings, Documents, Milestones, Services)
  - Venture B
- **Research Hub:** New AI Research, Saved Reports, Competitor Tracking
- **Marketplace:** Browse Services, My Cart, Active Orders
- **Communications:** Chat, Video Calls, Notifications
- **Settings:** Profile, Billing, Security

### Authenticated Workspace (Partner/Consultant)
- **Partner Dashboard:** Earnings, Active Orders, Lead Pipeline
- **My Services:** Service Listings, Pricing Configuration
- **Order Management:** Milestones, Client Chat, Deliverables Upload
- **Settings:** Payout Details, KYC/Compliance, Team Members

### Authenticated Workspace (Admin)
- **Platform Overview:** GMV, User Growth, Revenue
- **User Management:** Customers, Partners, Roles, Permissions
- **Service Management:** Approve/Reject Service Listings, Dispute Resolution
- **Content & Reports:** AI Prompt Management, Human Review Queue

---

## 5. Firestore Database Structure

### Collections & Subcollections

- **`users`**
  - `uid` (String, PK)
  - `role` (String: customer, consultant, partner, admin, superadmin)
  - `email`, `displayName`, `photoURL`, `createdAt`, `lastLogin`
  - *Subcollection:* **`ventures`** (Projects/Startups owned by user)

- **`ventures`** (Group-level queryable)
  - `ventureId` (String, PK)
  - `ownerId` (String, FK -> users)
  - `name`, `industry`, `stage`, `createdAt`
  - *Subcollection:* **`documents`** (Legal files, pitch decks)
  - *Subcollection:* **`research_reports`** (Generated AI reports)

- **`services`** (Marketplace Listings)
  - `serviceId` (String, PK)
  - `partnerId` (String, FK -> users)
  - `category` (legal, tech, marketing)
  - `title`, `description`, `price`, `deliveryDays`, `status` (active/pending_approval)

- **`orders`** (Transactions & Execution)
  - `orderId` (String, PK)
  - `clientId` (String, FK -> users)
  - `partnerId` (String, FK -> users)
  - `ventureId` (String, FK -> ventures)
  - `serviceId` (String, FK -> services)
  - `amount`, `status` (pending, active, in_review, completed, disputed)
  - *Subcollection:* **`milestones`** (Tasks within the order)
  - *Subcollection:* **`messages`** (Order-specific chat)

### Indexes
- `orders`: [clientId, status], [partnerId, status]
- `services`: [category, status, price]
- `ventures`: [ownerId, industry]

### Scalability & Migration
- Firestore is highly scalable for document reads.
- **Future Migration:** High-frequency transaction logs or complex relational financial data will be migrated to Google Cloud SQL (PostgreSQL), while keeping Firestore for real-time chat, notifications, and user metadata.

---

## 6. User Roles & Permissions

1. **Visitor:** Can browse landing pages, view high-level public services. No platform access.
2. **Customer:** Can create ventures, run AI research, purchase services, communicate with partners. Cannot provide services.
3. **Research Executive:** Internal BizNxt employee. Can view AI generated reports, edit them for quality, and approve them for the customer.
4. **Consultant:** Independent strategic advisors. Can view assigned customer ventures, schedule calls, and recommend marketplace services.
5. **Partner:** Vetted service agencies (Lawyers, Dev Shops). Can create service listings, manage received orders, upload deliverables, and receive payouts.
6. **Admin:** Platform managers. Can approve Partner KYC, moderate service listings, handle order disputes, and view platform metrics.
7. **Super Admin:** Founders/C-Suite. Full system access. Can modify system configurations, manage Admins, and view overarching financial analytics.

---

## 7. Business Services Architecture

### Categories & Structure
1. **Legal & Compliance**
   - Incorporation (LLC, Pvt Ltd, C-Corp, Dubai Freezone)
   - Tax & Accounting (GST, VAT, Bookkeeping)
   - IP Protection (Trademarks, Patents)
2. **Technology & Product**
   - MVP Development (Web, Mobile)
   - UI/UX Design & Branding
   - Cloud Infrastructure & Security Audit
3. **Growth & Marketing**
   - Go-to-Market Strategy
   - SEO & Content Marketing
   - Paid Ads Management (Google, Meta)

### Workflow
- **Service Discovery** -> **Scope Customization** -> **Payment (Escrow)** -> **Kickoff** -> **Milestone 1 Delivery** -> **Client Approval** -> **Milestone 2 Delivery** -> **Final Approval** -> **Payout to Partner (minus commission)**.

---

## 8. Report Architecture

Reports are generated hierarchically, moving from broad to specific.

1. **Market Overview Report:** TAM/SAM/SOM sizing, macro trends, regulatory environment.
2. **Competitor Intelligence Report:** Feature matrices, pricing comparisons, marketing channel analysis of top 5 competitors.
3. **Financial Projections Report:** 36-month P&L forecast, burn rate analysis, break-even point estimation.
4. **Risk & Mitigation Report:** Legal risks, tech debt risks, market adoption risks, and strategic pivots.
5. **Investor Pitch Teaser:** 2-page executive summary designed specifically for VC/Angel outreach.

---

## 9. AI Architecture

### Stack
- **Model:** Google Gemini 1.5 Pro (via Vertex AI / AI Studio interactions API).

### Workflow
1. **Prompt Flow:** User inputs business idea -> System injects proprietary BizNxt contextual prompt templates -> Gemini processes.
2. **Validation Layer:** Output is parsed via structured JSON schema validation to ensure no hallucinated formatting.
3. **Human Review (Quality Control):** For premium reports, the AI output is routed to a `Research Executive` dashboard. The executive reviews, refines, and stamps a "Human Validated" badge before client delivery.
4. **Confidence Score:** AI generates an internal confidence score based on available training data for the niche. Low scores automatically trigger mandatory human review.

---

## 10. Enterprise Folder Structure (Flutter / Firebase Target)

```text
biznxt_enterprise/
├── .github/                # CI/CD pipelines
├── firebase/
│   ├── firestore.rules
│   ├── storage.rules
│   └── functions/          # Cloud Functions (Stripe, AI, Email)
│       ├── src/
│       │   ├── api/
│       │   ├── triggers/
│       │   └── services/
└── lib/                    # Flutter Client App
    ├── main.dart
    ├── core/               # App-wide constants, themes, routing
    │   ├── constants/
    │   ├── theme/
    │   └── routing/
    ├── data/               # Models, Repositories, Network
    │   ├── models/
    │   ├── repositories/
    │   └── providers/      # Firebase/API integration
    ├── logic/              # State Management (Riverpod / Bloc)
    │   ├── auth/
    │   ├── workspace/
    │   └── marketplace/
    ├── presentation/       # UI Layer
    │   ├── components/     # Reusable UI elements (Buttons, Inputs)
    │   ├── widgets/        # Complex UI structures (Cards, Navbars)
    │   └── screens/        # Full pages
    │       ├── auth/
    │       ├── dashboard/
    │       ├── marketplace/
    │       └── reports/
    └── utils/              # Helpers, formatting, validators
```

---

## 11. API Architecture

- **GraphQL / REST Hybrid:** 
  - Real-time features (Chat, Order status) rely on Firebase Firestore SDKs (WebSockets/gRPC).
  - Heavy compute (AI Generation, PDF Export, Payment Processing) rely on RESTful Google Cloud Functions.
- **Service Boundaries:**
  - `AuthService`: Handles Firebase Auth tokens and RBAC claims.
  - `BillingService`: Interfaces with Stripe Connect for escrow and payouts.
  - `IntelligenceService`: Interfaces with Gemini AI for report generation.
  - `NotificationService`: SendGrid (Email), Twilio (SMS), Firebase Cloud Messaging (Push).

---

## 12. Security Architecture

- **Authentication:** Firebase Auth (Email/Pass, Google, LinkedIn Enterprise). Custom JWT Claims to embed roles (`admin`, `partner`).
- **Authorization:** Strict `firestore.rules`. Users can only read/write their own `ventures`. Partners can only read `orders` assigned to them.
- **Encryption:** 
  - Data at rest encrypted by Google Cloud default AES-256.
  - PII and financial docs in Cloud Storage enforce strict signed-URL access.
- **Audit Logs:** Every state change on an `order` or `service` triggers a Cloud Function that writes an immutable log to an `audit_logs` collection.
- **Backup & Recovery:** Automated daily Firestore point-in-time recovery (PITR) enabled. Nightly BigQuery exports for analytics and redundancy.

---

## 13. Roadmap

### Phase 1: Foundation & Ideation (Months 1-3)
- Core Platform Auth & RBAC.
- AI Business Validation Wizard (Free Tier).
- Basic Workspace Dashboard.

### Phase 2: Monetization & Intelligence (Months 4-6)
- Premium AI Report Generation (Stripe Integration).
- Human-in-the-loop QC Dashboard for Research Executives.
- Document Vault & PDF Exports.

### Phase 3: The Marketplace (Months 7-9)
- Partner Portal Launch & KYC.
- Service Catalog (Legal & Tech initially).
- Order Management & Escrow System.

### Phase 4: Scale & Network Effects (Months 10-12)
- Consultant Hub (Advisory matching).
- Real-time Chat & Video Integration.
- Advanced Project Management (Kanban, Milestones).

### Phase 5: Global Enterprise Expansion (Year 2+)
- Dedicated "Dubai Setup" and "US Setup" Enterprise funnels.
- Multi-currency wallet handling.
- Localization (Arabic, Spanish, Mandarin).
- AI Agent continuous market monitoring (push alerts for competitors).

---
*Document prepared by the Chief Product Officer, BizNxt.*
*Target: Enterprise SaaS Production Standard.*
