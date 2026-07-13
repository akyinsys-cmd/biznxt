# BIZNXT 3.0 – Enterprise Firebase Database Architecture

## 1. Overview
This document outlines the scalable, enterprise-grade Firebase Database Architecture for BizNxt 3.0. It leverages Cloud Firestore as the primary NoSQL database, Firebase Authentication for robust identity management, and Firebase Storage for handling unstructured documents.

The architecture is designed to support high transaction volumes, maintain strict role-based access control, enforce data normalization where appropriate (while embracing NoSQL document embedding for read optimization), and prepare the platform for future migration to SQL if enterprise needs evolve.

---

## 2. Authentication & Roles

### 2.1 Identity Providers
- Google Login
- Mobile OTP
- Email/Password Login
- Apple Login (Future readiness)

### 2.2 User Roles
The platform operates on a strict Role-Based Access Control (RBAC) model. 
Roles defined:
- **Visitor**: Unauthenticated or basic authenticated user without active service engagements.
- **Customer**: Authenticated user consuming BizNxt services.
- **Internal Team**:
  - **Research Executive**: Handles feasibility and market research.
  - **Business Consultant**: Provides active consulting sessions and strategic guidance.
  - **Admin**: Manages platform operations.
  - **Super Admin**: System owner with unrestricted access.
- **External Partners**:
  - **Partner / Manufacturer / Supplier**: Supply chain and operational execution.
  - **Loan Partner**: Handles financial integrations.
  - **CA / Lawyer / Marketing Partner / Branding Partner**: Specialized domain experts.

---

## 3. Database Collections & Structures

### 3.1 Core System

#### `users`
- **Purpose**: Core identity and profile data. Auth triggers should seed this document.
- **Structure**:
  - `uid` (String, PK)
  - `email`, `phone`, `displayName`, `photoURL` (Strings)
  - `role` (String, Reference to Roles or Enum)
  - `status` (Enum: active, suspended, pending_verification)
  - `createdAt`, `updatedAt`, `lastLoginAt` (Timestamp)
  - `metadata`: (Map) Device info, app version.
- **Indexes**: `role` (Asc), `status` (Asc)

#### `roles` & `permissions`
- **Purpose**: Centralized definition of RBAC to avoid hardcoding permissions.
- **Structure**:
  - `roleId` (String, PK)
  - `name` (String)
  - `permissions` (Array of Strings: e.g., `['read:reports', 'write:reports', 'approve:loans']`)

---

### 3.2 Business & Workflows

#### `business_research_requests`
- **Purpose**: Tracks user requests for market or feasibility research.
- **Structure**:
  - `id` (String, PK)
  - `customerId` (Reference -> users)
  - `assignedExecutiveId` (Reference -> users)
  - `status` (Enum: pending, in_progress, completed, rejected)
  - `industryId`, `location` (References/Strings)
  - `requirements` (Text)
  - `createdAt`, `updatedAt` (Timestamp)
- **Indexes**: `customerId` (Asc), `status` (Asc)

#### `research_reports`
- **Purpose**: Stores the generated reports and deliverables.
- **Structure**:
  - `id` (String, PK)
  - `requestId` (Reference -> business_research_requests)
  - `customerId` (Reference -> users)
  - `title`, `summary` (String)
  - `contentPayload` (Map or reference to storage bucket for large PDFs)
  - `isPublished` (Boolean)
  - `createdAt`, `updatedAt` (Timestamp)
- **Security**: Customers can read where `customerId == request.auth.uid`.

#### `consultation_requests` & `consultation_sessions`
- **Purpose**: Management of consulting meetings.
- **Structure**:
  - `id` (String, PK)
  - `customerId`, `consultantId` (References -> users)
  - `scheduledAt`, `durationMinutes` (Timestamp, Number)
  - `status` (Enum: requested, scheduled, completed, cancelled)
  - `meetingLink` (String)
  - `notes` (String)

---

### 3.3 Partners & Network

#### `partners` (Abstracts Consultants, Manufacturers, CAs, Lawyers)
- **Purpose**: Extends `users` with partner-specific attributes.
- **Structure**:
  - `partnerId` (Reference -> users.uid)
  - `partnerType` (Enum: consultant, manufacturer, CA, lawyer, loan_partner)
  - `specialties` (Array of Strings)
  - `rating` (Number)
  - `availability` (Map: working hours)
  - `verificationStatus` (Enum: pending, verified, rejected)
  - `documents` (Array of Maps: URLs to certifications)

---

### 3.4 Platform Management

#### `services` & `pricing`
- **Purpose**: Catalog of offerings.
- **Structure**:
  - `serviceId` (String, PK)
  - `categoryId` (Reference -> service_categories)
  - `name`, `description` (String)
  - `basePrice` (Number)
  - `isActive` (Boolean)

#### `business_categories`, `industries`, `geographies`
- **Purpose**: Standardized taxonomy.
- **Structure**: Static mappings updated infrequently. Heavily cached on client.

---

### 3.5 Operations & Transactions

#### `payments` & `transactions`
- **Purpose**: Ledger of all financial movements.
- **Structure**:
  - `id` (String, PK)
  - `customerId` (Reference -> users)
  - `amount`, `currency` (Number, String)
  - `status` (Enum: pending, success, failed, refunded)
  - `gatewayReference` (String)
  - `serviceType` (String)
  - `createdAt` (Timestamp)
- **Note**: Immutable records. Updates only to `status`.

#### `notifications`
- **Purpose**: In-app and push notification state.
- **Structure**:
  - `id` (String, PK)
  - `userId` (Reference -> users)
  - `title`, `message`, `type` (String)
  - `read` (Boolean)
  - `link` (String - deep link)

---

### 3.6 System & Logs

#### `audit_logs` & `system_logs`
- **Purpose**: Security compliance and activity history.
- **Structure**:
  - `id` (String, PK)
  - `userId` (Reference -> users)
  - `action` (String)
  - `resourceId`, `resourceType` (String)
  - `oldValue`, `newValue` (Map)
  - `ipAddress`, `userAgent` (String)
  - `timestamp` (Timestamp)
- **Security**: Write-only for system. Read-only for Super Admins.

#### `feature_flags` & `settings`
- **Purpose**: Remote configuration.

---

## 4. Workflow Database Design

### 4.1 Report Generation Workflow
1. **Creation**: `business_research_requests` document created with `status: pending`.
2. **Assignment**: Trigger updates `assignedExecutiveId`, `status: in_progress`.
3. **Execution**: `tasks` collection tracks sub-items. `uploads` collection tracks draft assets.
4. **Completion**: `research_reports` document created. Request updated to `status: completed`.
5. **Notification**: Document added to `notifications`.

### 4.2 Consultation Workflow
1. **Request**: `consultation_requests` created.
2. **Payment**: `transactions` generated. On success, trigger moves request to `scheduled`.
3. **Calendar Integration**: Webhook creates entry in `calendar_events` and maps back.

---

## 5. Firebase Storage Structure

Organize using strict paths with user/entity isolation:

```
/
├── customers/
│   └── {customerId}/
│       ├── profile/
│       ├── documents/
│       │   ├── identity/
│       │   └── contracts/
│       └── reports/
├── businesses/
│   └── {businessId}/
│       ├── assets/ (Logos, branding)
│       └── financials/
├── partners/
│   └── {partnerId}/
│       └── certifications/
└── templates/
    └── reports/
```

**Storage Security Rules**: Limit read/write strictly by `customerId` matching `request.auth.uid`, with override access for Admin/Executive roles based on custom claims.

---

## 6. Security Rules Strategy

- **Custom Claims**: Use Firebase Auth Custom Claims for top-level roles (`admin`, `consultant`) to keep rule evaluation fast and avoid recursive database lookups.
- **Document-Level**: 
  ```javascript
  match /research_reports/{reportId} {
    allow read: if request.auth.uid == resource.data.customerId || request.auth.token.role == 'executive';
  }
  ```
- **Soft Delete**: Ensure queries append `where("isDeleted", "==", false)`. Security rules can block physical deletes: `allow delete: if false;`.

---

## 7. Performance & Optimization Strategy

- **Read Optimization**: Pre-compute aggregations (e.g., `totalReports` on the user profile) using Cloud Functions. 
- **Pagination**: Use `startAfter()` cursors with deterministic ordering.
- **Search**: Since Firestore lacks native full-text search, sync critical collections (users, reports) to a dedicated search engine (Typesense, Algolia, or ElasticSearch).
- **Index Management**: Explicitly define composite indexes in `firestore.indexes.json` for complex dashboard queries.

---

## 8. Backup, Recovery & Archiving Strategy

- **Automated Backups**: Enable Google Cloud Firestore Scheduled Backups (Daily).
- **Archive Strategy**: Move "closed" workflows older than 2 years to a cold storage bucket or a BigQuery data warehouse to keep operational Firestore sizes manageable.
- **Data Warehousing**: Stream Firestore changes to BigQuery via the official Firebase Extension for heavy analytics, completely removing analytical load from the transactional database.

---

## 9. Future Scaling (Firestore to SQL Migration Path)

To prevent vendor lock-in and prepare for potential migration:
1. **Repository Pattern**: Backend code should use an abstraction layer (Interfaces/Repositories) for all database access.
2. **UUIDs**: Use universally unique identifiers (v4) instead of Firestore's auto-generated IDs to ensure compatibility with standard SQL primary keys.
3. **Normalization where logical**: While NoSQL favors embedding, keep distinct entities (Users, Transactions, Services) normalized with explicit references, acting as foreign keys.
4. **Event Sourcing (Audit Logs)**: A robust `audit_logs` collection ensures data can be reconstructed or mapped into relational tables (PostgreSQL) incrementally using ETL pipelines.
