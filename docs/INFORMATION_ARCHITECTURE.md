# BIZNXT 3.0 – Enterprise Information Architecture & Navigation Blueprint

## 1. Design Principles & Navigation Philosophy
BizNxt 3.0’s Information Architecture (IA) is designed to be **Simple, Professional, Premium, Scalable, Fast, Intuitive, Role-Based, and Future-Ready**. 
- **Maximum 3 Clicks:** Critical workflows and core features must be accessible within three clicks from the user's main dashboard.
- **Role-Based Routing:** Every user role logs into a completely distinct portal tailored to their specific objectives.
- **No Dead Ends:** Every empty state, error state, and completion screen provides clear next steps.
- **Omnichannel Consistency:** The IA is unified across Web, Desktop, Tablet, and Mobile Android experiences.

---

## 2. Global Navigation Elements

### 2.1 Top Navigation (Header)
- **Brand Logo:** Routes to the respective Dashboard/Landing page.
- **Global Search:** Command+K / Ctrl+K enabled intelligent search across the platform.
- **Quick Actions (FAB / Header Icon):** Context-aware shortcut menu (e.g., "New Research Request", "Schedule Meeting").
- **Notification Center:** Central hub for alerts, split into "Unread", "Messages", and "System".
- **Profile Menu:** User avatar triggering a dropdown (Settings, Profile, Switch Role (if applicable), Logout).

### 2.2 Side Navigation (Drawer/Sidebar)
- **Primary Links:** Role-specific core modules.
- **Secondary Links:** Support, Settings, Documents.
- **Collapse/Expand:** For desktop spatial optimization.
- **Mobile View:** Collapses into a Hamburger Menu or Bottom Navigation.

### 2.3 Bottom Navigation (Mobile & Tablet)
- Limits to 4-5 high-priority destinations based on role (e.g., Dashboard, Chats, Tasks, Profile).

### 2.4 Structural Elements
- **Breadcrumbs:** Used on deep nested pages (e.g., *Dashboard > Reports > Q3 Market Analysis*).
- **Floating Action Button (FAB):** Mobile-first primary action trigger (e.g., "+" to start a Launch Wizard).

---

## 3. Visitor Experience (Public Site)
*Unauthenticated public-facing pages designed for conversion, SEO, and trust-building.*

- **Home / Landing Page:** Value proposition, Core Services, Testimonials, CTAs.
- **Company:** About Us, Careers, Partner With Us.
- **Services:** Business Research, Business Launch, Manufacturing, White Label, Import Export.
- **Resources:** Blogs, Knowledge Center, FAQs, Case Studies.
- **Legal & Support:** Privacy Policy, Terms & Conditions, Refund Policy, Contact Us.
- **Auth:** Login, Register, Forgot Password.

---

## 4. Customer Experience (Authenticated Portal)
*Focused on consumption of services, tracking progress, and communicating with the BizNxt team.*

- **Dashboard:** Unified overview (Business Score, Next Milestone, Active Tasks, Recent Reports).
- **Research:** Active requests, past requests, request new research.
- **Business Launch:** Launch Wizard, Launch Timeline, Domain/Branding assets.
- **Services:** Marketplace to discover and purchase add-on services.
- **Reports:** Secure vault for all generated PDF and Interactive reports.
- **Meetings:** Calendar view, upcoming consultations, booking interface.
- **Tasks:** Client-side to-dos required by consultants (e.g., "Upload ID", "Review Name").
- **Communications:** Messages, Notifications.
- **Management:** Documents (vault), Payments (Invoices/Receipts), Profile, Settings.
- **Growth (Future):** Referral Program, Business Score Analytics.

---

## 5. Internal Team Portals

### 5.1 Research Executive
*Focused on rapid data processing, AI utilization, and report generation.*
- **Dashboard:** Queue status, SLA countdowns, Performance metrics.
- **Research Queue:** Pending Research, Assigned Research, Completed.
- **Workspace:** AI Research Sandbox, Notes, Quality Check lists, Upload PDF.
- **Communications:** Customer Communication (in-context), Internal Chat.
- **Management:** Documents, Calendar, Profile, Performance Analytics.

### 5.2 Business Consultant
*Focused on client relationship management, strategy formulation, and project tracking.*
- **Dashboard:** Today's Meetings, Client Alerts, Launch Project Status.
- **Client Management:** Assigned Clients, Business Plans, Launch Projects.
- **Workspace:** Tasks (assigning/reviewing), Documents, Invoices.
- **Communications:** Video Consultation hub, Chat.
- **Management:** Timeline mapping, Profile, Availability Settings.

---

## 6. Partner Portal (Manufacturers, Suppliers, CAs, Lawyers, Marketing, Loan)
*Focused on lead management, service fulfillment, and revenue tracking.*
- **Dashboard:** New Leads, Active Engagements, Revenue.
- **Opportunities:** Lead inbox, Bid/Accept interface.
- **Execution:** Tasks, Documents upload/download, Messages.
- **Financials:** Payments, Payout tracking, Invoices.
- **Management:** Profile (public-facing data), Reviews/Ratings, Performance metrics.

---

## 7. Administrative Portals

### 7.1 Admin
*Focused on platform operations, moderation, and business unit management.*
- **Dashboard:** High-level operational metrics, System alerts, Revenue overview.
- **User Management:** Users, Research Execs, Consultants, Partners, Manufacturers.
- **Catalog Management:** Services, Pricing, Categories.
- **Financials:** Payments, Revenue, Refund processing.
- **Content:** Blogs, Knowledge Base, Notifications.
- **System:** Cities, PIN Codes, Support Tickets.

### 7.2 Super Admin
*Focused on absolute system control, technical configuration, and security.*
- **Everything Admin has, plus:**
- **Access Control:** Role Management, Permissions, Audit Logs.
- **Technical Config:** Feature Flags, API Settings, Firebase Config, Gemini Config, Payment Config.
- **Infrastructure:** Database Monitoring, Storage Monitoring, Cloud Functions logs.
- **DevOps:** Version Control overview, Deployment Settings, Maintenance Mode toggle, System Health dashboard.

---

## 8. Standard Page Anatomy
To ensure absolute consistency, every major page in the application MUST adhere to this structure:

1. **Header:** Page Title, Contextual Actions (e.g., "Export", "Filter"), Breadcrumbs.
2. **Top Widgets (Optional):** KPI Cards (e.g., Total Revenue, Pending Tasks).
3. **Control Bar:** Search Input, Filter Dropdowns, Sort toggles, View toggles (List/Grid).
4. **Primary Content:** Table, Grid of Cards, Kanban Board, or Form.
5. **State Management:**
   - **Loading State:** Skeleton screens mirroring the content layout.
   - **Empty State:** Illustration, explanatory text, and a primary CTA (e.g., "Create your first report").
   - **Error State:** Friendly error message, "Try Again" button, Support link.
6. **Footer/Pagination:** Pagination controls, Contextual help.

---

## 9. Global Search Architecture
Search is an omnipresent, intelligent routing tool accessible via `Cmd+K`.
- **Global Search:** Indexes across all accessible entities based on Role.
- **Domain-Specific Searches:**
  - Business Search (Customers)
  - Manufacturer/Partner Search (B2B Directory)
  - Service Search (Catalog)
  - Report Search (Document contents/titles)
  - Knowledge Search (Help/FAQs)
  - Location Search (City, PIN Code)

---

## 10. Core User Journey Flow
The Golden Path for a Customer:
1. **Visitor** lands on Marketing Site -> Explores 'Business Research'.
2. **Signup/Login** -> Redirected to Customer Dashboard (Empty State: Prompt to Start Research).
3. **Research Request** -> Fills multi-step form -> Submitted.
4. **Processing (Wait State)** -> Tracks status via Dashboard Timeline.
5. **Report Delivery** -> Notification received -> Views Interactive Report.
6. **Consultation** -> Books meeting with Consultant via Report page CTA.
7. **Launch** -> Upgrades to Launch Package -> Enters Launch Wizard.
8. **Growth** -> Tracks Business Score, Engages Partners (Legal, Marketing).
9. **Expansion** -> Continuous use of Services Marketplace and Analytics.
