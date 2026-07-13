# BizNxt 3.0 Enterprise Architecture

## 1. System Overview
BizNxt is an enterprise SaaS platform serving as a comprehensive Business Success Ecosystem. It facilitates business discovery, validation, research, launch, and growth for entrepreneurs through AI-assisted consulting, specialized reporting, and a vast service marketplace.

*Note: While the original specification requested Flutter, this environment natively supports React/TypeScript Web Applications. The architecture below is designed for a highly scalable Web App using React, Vite, Tailwind CSS, and Firebase.*

## 2. User Roles & Access Control
The system implements strict Role-Based Access Control (RBAC):
- **Visitor**: Unauthenticated, can browse public pages, landing, and general service catalog.
- **Customer**: Authenticated entrepreneur, can purchase reports, book consultations, track progress.
- **Research Executive**: Internal staff, handles research tickets, uses AI for insights, validates data, generates reports.
- **Business Consultant**: Expert assigned to customers for roadmaps and execution.
- **Partner**: Third-party service providers (legal, manufacturing, etc.).
- **Admin**: Manages catalog, users, basic disputes, operations.
- **Super Admin**: System-wide configuration, financial overview, analytics, role management.

## 3. Database Design (Cloud Firestore)

### `users`
- `uid` (Doc ID)
- `email`, `displayName`, `photoURL`, `phoneNumber`
- `role`: enum (customer, researcher, consultant, partner, admin, superadmin)
- `createdAt`, `lastLogin`
- `profile`: Map (company details, preferences)

### `researchTickets` (Product 1)
- `ticketId` (Doc ID)
- `customerId` (Ref)
- `assignedResearcherId` (Ref, nullable)
- `status`: enum (pending_payment, assigned, researching, verification, report_design, completed)
- `businessCategory`, `description`, `goals`, `budget`, `timeline`
- `aiInsights`: Map (summary, strengths, risks, nextSteps)
- `reportData`: Map (marketAnalysis, competitorAnalysis, growthStrategy, scores)
- `pdfUrl`: String (Firebase Storage path)
- `createdAt`, `updatedAt`

### `consultationRequests` (Product 2)
- `requestId` (Doc ID)
- `customerId` (Ref)
- `assignedConsultantId` (Ref, nullable)
- `status`: enum (pending_payment, scheduled, active, completed)
- `topic`, `scheduledDate`, `notes`, `roadmapData`

### `services` (Marketplace)
- `serviceId` (Doc ID)
- `title`, `category`, `description`, `basePrice`, `estimatedTimeline`
- `requirements`: Array of Strings
- `isActive`: Boolean

### `orders`
- `orderId` (Doc ID)
- `customerId` (Ref)
- `items`: Array of Objects (serviceId, price, status)
- `totalAmount`
- `paymentStatus`: enum (pending, paid, failed, refunded)
- `razorpayOrderId`, `razorpayPaymentId`

## 4. UI/UX Design System
- **Theme**: Premium White, Minimalist.
- **Style**: Glassmorphism, soft shadows, rounded corners (xl, 2xl).
- **Typography**: Inter (UI), Space Grotesk/Display fonts (Headings).
- **Inspiration**: Apple, Stripe, Linear.

## 5. Development Roadmap (Module by Module)
1. **Module 1**: Core Architecture, Role-Based Auth, Multi-Dashboard Routing. *(Current)*
2. **Module 2**: Discovery & AI Research Ticket Flow (Product 1).
3. **Module 3**: Business Launch & Consultation Booking (Product 2).
4. **Module 4**: Service Marketplace Catalog & Cart.
5. **Module 5**: Payment Gateway Integration (Razorpay).
6. **Module 6**: Admin & Researcher Workspaces.
