# BIZNXT 3.0 – Enterprise Business Rule Engine (BRE)

## 1. Core Operating Philosophy
BizNxt operates as a hybrid tech-enabled consultancy. The Business Rule Engine (BRE) governs the orchestration of every customer request, internal task, and partner interaction. It ensures absolute predictability, accountability, and traceability across the platform. Every action is rule-based; no workflow is left undefined.

---

## 2. Customer Segmentation Rules
Workflows dynamically adapt based on the customer’s classification.

- **Visitor:** Unauthenticated. Access limited to public resources, knowledge base, and inquiry forms.
- **Registered User:** Authenticated but no active payments. Can save preferences, use free AI tools (if applicable), and browse services.
- **Premium Research Customer:** Has paid for a one-time Market Research Report. Workflow prioritized for rapid research delivery (48-hour SLA).
- **Business Launch Customer:** Has paid the consultation fee to start a business. Assigned a dedicated Business Success Manager (BSM). High-touch SLA.
- **Enterprise / Corporate Customer:** Custom pricing, multi-stakeholder approval workflows, dedicated account management team.
- **International Customer:** Workflows adjusted for export/import regulations, currency conversion, and international time zones.

---

## 3. Core Workflows & SLAs

### 3.1 Research Report Workflow
*SLA: 48 Hours from Payment confirmation.*
1. **Request & Validation:** Customer submits form -> System validates completeness.
2. **Payment:** Customer completes transaction.
3. **Ticket Generation:** System auto-generates Research Ticket. (Status: `Pending`)
4. **Assignment:** Auto-assigned to Research Executive based on current load and industry expertise. (Status: `Assigned`)
5. **AI Research (T+4 hrs):** Executive runs AI models to generate baseline data.
6. **Manual Research (T+24 hrs):** Executive conducts deep-dive analysis and market validation. (Status: `Research Started`)
7. **Drafting (T+36 hrs):** Executive structures the report.
8. **Internal Review & QA (T+42 hrs):** Sent to Senior Reviewer. Revisions requested if QA fails. (Status: `In Review`)
9. **Finalization & PDF Creation (T+45 hrs):** Manager approves. System auto-generates locked PDF.
10. **Delivery (T+48 hrs):** Delivered to Customer Dashboard. Email & Push notification sent. (Status: `Delivered`)
11. **Feedback Loop:** Auto-survey sent after 3 days. (Status: `Closed`)

### 3.2 Consulting (Business Launch) Workflow
*SLA: Variable (Project-dependent), Initial Contact < 12 Hours.*
1. **Initiation:** Customer submits Business Launch Form & pays Consultation Fee.
2. **BSM Assignment:** System assigns a Business Success Manager based on capacity.
3. **Welcome Call (T+12 hrs):** BSM schedules and conducts introductory video call.
4. **Requirement Analysis (T+3 Days):** BSM documents exact needs.
5. **Project Timeline & Proposal (T+5 Days):** BSM prepares Service Proposal (Legal, Branding, Tech, etc.) and timeline.
6. **Approval:** Customer reviews and approves Proposal. Initial milestone payment collected.
7. **Execution:** BSM triggers sub-workflows (Legal, Marketing, Tech) to respective partners/teams. (Status: `Execution`)
8. **Weekly Progress:** System auto-reminds BSM to publish weekly updates to Customer Dashboard.
9. **Completion:** All sub-tasks completed and verified by QA.
10. **Handover & Feedback:** Final sign-off. Transition to post-launch support. (Status: `Closed`)

### 3.3 General Service Workflow
*Applies to individual services (e.g., Logo Design, GST Registration).*
1. **Inquiry -> Quotation:** System generates standard quote or BSM generates custom quote.
2. **Approval & Payment:** Customer pays 100% upfront or standard 50% milestone.
3. **Assignment:** Auto-assigned to internal team or External Partner.
4. **Execution:** Status updated to `Execution`.
5. **QA Review:** Internal QA must approve partner/team deliverables.
6. **Delivery & Invoice:** System auto-generates invoice and delivers assets.
7. **Feedback & Archive:** 7-day revision window, then auto-archived.

---

## 4. Partner Workflows

### 4.1 Manufacturer Workflow
1. **Lead Generation:** Validated requirement sent to matching Manufacturers.
2. **Verification & Quotation:** Manufacturer reviews and submits Quote within SLA (48 hrs).
3. **Customer Approval:** Customer reviews and selects Manufacturer.
4. **Coordination:** BSM oversees order timeline and quality checks.
5. **Completion:** Goods delivered. Feedback collected.

### 4.2 Loan Partner Workflow
1. **Eligibility Check:** System pre-screens based on Customer Profile.
2. **Document Collection:** Customer uploads required financial docs to secure vault.
3. **Assignment:** Assigned to Loan Partner.
4. **Processing:** Partner updates status (`Applied`, `In Review`, `Approved`, `Rejected`).
5. **Disbursement:** Funds transferred. Workflow closed.

### 4.3 Legal & Compliance Workflow
1. **Requirement:** e.g., Company Incorporation.
2. **Document Collection:** KYC, Address Proof uploaded.
3. **Legal Partner Execution:** Partner handles statutory filings. Updates status (`Drafted`, `Filed`, `Approved`).
4. **Completion:** Certificates uploaded to Customer Vault.

### 4.4 Marketing Workflow
1. **Strategy:** Marketing Partner develops campaign strategy.
2. **Approval:** Customer & BSM approve budget and creatives.
3. **Launch & Optimization:** Campaigns go live. Weekly metric updates pushed to dashboard.
4. **Reporting:** Monthly automated performance reports.

---

## 5. Operational Rules Engine

### 5.1 Internal Task Management
- **Auto-Assign:** System assigns standard tasks based on round-robin and capacity.
- **Manual Assign:** Managers can override and manually assign complex tasks.
- **Priority Levels:** Critical, High, Medium, Low.
- **Deadlines:** Every task MUST have a deadline mapped to the parent SLA.
- **Escalation (Rule 1):** If a task reaches 80% of deadline without update -> Alert Manager.
- **Escalation (Rule 2):** If a task breaches deadline -> Alert Operations Head.
- **QA:** A task is not `Completed` until the defined QA role marks it `Approved`.

### 5.2 Payment & Financial Rules
- **One-Time Payments:** 100% advance required for standard Research and basic services.
- **Milestone Payments:** For projects > $1000, 50% advance, 25% mid-point, 25% before final handover.
- **Failed Payments:** Auto-retry after 24 hrs. If failed again, downgrade to `Pending Payment` and notify Customer Support.
- **Invoicing:** Auto-generated upon successful transaction. Must comply with regional tax laws.
- **Refund Policy:** Rule-based approval. If work has not started (0 hrs logged), auto-approve. If work started, requires Manager review.

### 5.3 Document Management
- **Upload:** Scanned for malware. Stored in encrypted, customer-specific buckets.
- **Permissions:** 
  - Customer: Read/Write own documents.
  - Assigned Exec/Partner: Read assigned documents only.
  - Super Admin: Full audit access.
- **Versioning:** Overwriting a document creates a new version (`v1`, `v2`). Old versions are retained but hidden by default.
- **Archive/Delete:** Soft delete only. Financial/Legal documents cannot be deleted for 7 years.

### 5.4 Customer Communication Engine
- **Push/In-App Notifications:** Used for immediate action required (e.g., "Approve Proposal", "Meeting in 15 mins").
- **Email:** Used for formal delivery, receipts, and weekly summaries.
- **Dashboard Timeline:** The single source of truth. Every status change logs an entry here.

---

## 6. Automation & Triggers

- **Auto Ticket Creation:** Upon successful payment or form submission.
- **Auto Reminder:** 24 hours before meeting, 48 hours before task deadline.
- **Auto Escalation:** Based on SLA breach rules.
- **Auto Invoice:** On successful payment gateway webhook.
- **Auto PDF Generation:** When Research Report is marked `Approved` by Manager.
- **Auto Feedback:** Sent 3 days after ticket closure.

---

## 7. Global Status Dictionary
Every entity (Task, Request, Project) must map to one of these standardized statuses:
1. **Pending:** Awaiting action (payment, assignment).
2. **Assigned:** Resource allocated, work not started.
3. **In Progress / Research Started:** Active work is happening.
4. **Waiting Documents / Blocked:** Waiting on Customer or External dependency.
5. **In Review:** Completed by executor, pending QA/Manager approval.
6. **Completed:** QA passed, ready for delivery.
7. **Delivered:** Handed over to Customer.
8. **Closed:** Customer accepted, feedback loop complete.
9. **Cancelled:** Terminated before completion.
10. **Refunded:** Financial reversal completed.

---

## 8. Quality Control (QC) Gateways
- **No Direct Delivery:** A Research Executive or External Partner cannot directly mark a deliverable as `Delivered`.
- **The QA Gate:** Work must be submitted to `In Review`. A designated Reviewer/Manager must transition it to `Completed` to unlock delivery.
- **Audit Logs:** Every status change, assignment change, and file upload is immutably logged with Timestamp, User ID, and IP Address.
