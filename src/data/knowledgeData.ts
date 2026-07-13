import { 
  KnowledgeArticle, 
  LearningCourse, 
  LearningLesson, 
  BusinessTemplate, 
  SopItem, 
  BusinessChecklist, 
  GovernmentScheme, 
  LearningPath 
} from '../types/knowledge';

export const KNOWLEDGE_CATEGORIES = [
  "Business Ideas", "Manufacturing", "Trading", "Import", "Export", 
  "White Label", "Private Label", "OEM", "Business Planning", "Marketing", 
  "Sales", "Branding", "Finance", "Loans", "Accounting", "GST", 
  "Income Tax", "Trademark", "Patent", "MSME", "Factory Setup", 
  "Digital Business", "AI", "Automation", "HR", "Recruitment", 
  "Leadership", "Operations", "International Business", "Dubai Business", 
  "Funding", "Investor Readiness"
];

export const ARTICLES: KnowledgeArticle[] = [
  {
    id: "art-1",
    title: "How to Setup an OEM/Private Label Cosmetics Manufacturing Unit in India",
    shortSummary: "A comprehensive handbook detailing machinery selection, licensing, raw material sourcing, and commercial margins for building a private label cosmetics business in India.",
    fullArticle: `## Setup Guide: OEM/Private Label Cosmetics Manufacturing

India's cosmetic sector is experiencing exponential growth driven by the D2C revolution. Brands prefer outsourcing formulation and manufacturing to specialized contract manufacturers. Here's a complete breakdown of setting up your OEM/Private Label Cosmetics factory.

### 1. Market Opportunity
*   **Contract Sourcing Growth**: 25% YoY CAGR.
*   **Key Segments**: Organic skin care, vegan serums, herbal hair care, and color cosmetics.
*   **Margins**: OEM manufacturing typically enjoys a 30-40% Gross Margin.

### 2. Statutory Licensing & Compliances
To operate a cosmetics factory in India, you must procure:
1.  **State Cosmetics Manufacturing License**: Issued by the State Drug Control Department under the Drugs and Cosmetics Act, 1940. Requires a certified pharmacist/chemist as a full-time supervisor.
2.  **GST Registration**: Mandatory for inter-state trading and supply.
3.  **NOC from State Pollution Control Board**: Usually classified under Green or Orange category depending on chemical waste discharge.
4.  **Fire Safety Certificate**: Obtained from regional fire department authorities.
5.  **MSME Udyam Registration**: Key for central credit/subsidy benefits.

### 3. Setup Costs & Machinery
For a medium-sized semi-automated cream, lotion, and shampoo formulation unit:
*   **Total CapEx**: ₹25 Lakhs to ₹45 Lakhs.
*   **Key Equipment**:
    *   *Automatic Vacuum Homogenizer Mixer* (₹5,00,000 - ₹8,00,000)
    *   *Double Jacket Heating Vessel* (₹2,50,000)
    *   *Pneumatic Liquid & Cream Filling Machine* (₹1,50,000)
    *   *Storage & Holding Tanks* (₹3,00,000)
    *   *Ro Water Treatment Plant* (₹2,00,000)
    *   *Laboratory Testing Kits (HPLC/Viscometer)* (₹4,00,000)

### 4. Step-by-Step Execution Journey
*   **Step 1: Layout Approval**: Design the facility layout strictly adhering to GMP (Good Manufacturing Practice) standards (Schedule M-II of Drugs & Cosmetics Act). It requires segregation of raw material entry, processing, filling, and packaging areas.
*   **Step 2: Trial Batching**: Refine formulations with high-stability emulsifiers. Get microbial testing done.
*   **Step 3: Client Onboarding Workflow**:
    *   *Briefing & Benchmark matching*
    *   *Sample development & submission*
    *   *Quotation & Packaging approvals*
    *   *Mass Production, Batch coding & Quality Control clearance*

### 5. PDF Generation Sourcing & Sizing
This guide can be generated as a certified Feasibility PDF via the BizNxt exporter tool. All licensing formats must be verified before layout submission.`,
    featuredImage: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?q=80&w=600&auto=format&fit=crop",
    author: {
      name: "Dr. Ramesh Chawla",
      role: "SME Consultant - Chemical & Pharma",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      bio: "25+ years consulting over 120 contract manufacturing factories across Maharashtra, Gujarat and Punjab."
    },
    category: "Manufacturing",
    subCategory: "Private Label & OEM",
    tags: ["Cosmetics", "OEM", "Licensing", "Drugs & Cosmetics Act", "GMP"],
    readingTime: 6,
    difficulty: "Advanced",
    lastUpdated: "2026-06-15",
    isPremium: false
  },
  {
    id: "art-2",
    title: "Mastering the Export of Basmati Rice: APEDA, Port Logistics & Credit Lines",
    shortSummary: "Learn the exact documentation, pre-shipment inspections, packaging norms, and letter of credit (LC) security required for high-volume agro export from India.",
    fullArticle: `## Complete Agro Export Playbook: Basmati Rice

Exporting Basmati Rice from India is highly lucrative but demands absolute alignment with food safety standards, APEDA clearances, and trade logistics.

### 1. Core Documentation Requirements
1.  **IEC (Import Export Code)**: Issued by DGFT.
2.  **APEDA Registration**: Registration-cum-Membership Certificate (RCMC) from the Agricultural and Processed Food Products Export Development Authority.
3.  **Phytosanitary Certificate**: Issued by the Ministry of Agriculture's plant quarantine department, certifying that the consignment is free from pests.
4.  **Certificate of Origin**: Required by importing countries to grant preferential tariffs.
5.  **FSSAI Central License**: Necessary for all food handlers and exporters.

### 2. Logistics & Port Operations
*   **Packaging**: Standard food-grade HDPE, Jute, or BOPP bags (1kg, 5kg, 20kg, 50kg).
*   **Fumigation**: Mandatory container-level fumigation with Methyl Bromide or Phosphine, backed by a Fumigation Certificate.
*   **Port Selection**: Nhava Sheva (JNPT), Mundra, or Kandla are primary ports for rice shipments.

### 3. Financial & Payment Protection
Never export without payment security. Use:
*   **Irrevocable Letter of Credit (LC) at Sight**: Confirmed by a prime international bank.
*   **ECGC Insurance (Export Credit Guarantee Corporation)**: Covers up to 90% of political and commercial default risk.
*   **Pre-shipment Credit (Packing Credit)**: Procure trade credit in Foreign Currency (PCFC) to buy raw paddy at lower interest rates.`,
    featuredImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
    author: {
      name: "Sanjay Singhal",
      role: "International Trade Advisor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      bio: "Ex-Director of Logistics and Customs Brokerage, helping 500+ exporters capture US, European, and Gulf markets."
    },
    category: "Export",
    subCategory: "Agriculture Trade",
    tags: ["APEDA", "Export", "Basmati", "Trade Finance", "IEC"],
    readingTime: 8,
    difficulty: "Intermediate",
    lastUpdated: "2026-07-02",
    isPremium: true
  },
  {
    id: "art-3",
    title: "Understanding GST Compliance, Input Tax Credit (ITC) & E-Way Bills",
    shortSummary: "A clear, actionable guide explaining how MSMEs can optimize their cash flow by correctly claiming Input Tax Credit, avoiding common filing mistakes, and staying fully compliant.",
    fullArticle: `## Understanding GST & Input Tax Credit (ITC) for MSMEs

For an Indian business, managing GST efficiently is not just about compliance—it's a critical factor in cash flow health. This guide breaks down the essential aspects of GST compliance.

### 1. The Core GSTR Filing Cycle
*   **GSTR-1**: Monthly or quarterly filing of Outward Supplies (sales invoice details).
*   **GSTR-3B**: Monthly self-assessment return where tax liability is paid and Input Tax Credit (ITC) is claimed.
*   **GSTR-2B**: An auto-generated static ITC statement showing input availability based on your suppliers' GSTR-1 filings.

### 2. Maximizing Input Tax Credit (ITC) safely
ITC is the backbone of GST. To claim ITC legally, you must satisfy Section 16 of CGST Act:
*   You must possess a valid Tax Invoice or Debit Note.
*   You must have actually received the goods or services.
*   The supplier must have paid the tax to the Government (and populated GSTR-2B).
*   You must file GSTR-3B timely.
*   *Warning*: Never claim ITC on personal items, blocked credits (Section 17(5)), or without GSTR-2B matching, as this triggers heavy penalties.

### 3. E-Way Bill Regulations
*   **When is it required?**: When goods of value exceeding ₹50,000 (limit is ₹1,00,000 in some states) are moved in a vehicle.
*   **Key Fields**: HSN code, vehicle number, transporter ID, and consignee details.
*   *Tip*: Ensure the E-Way bill is generated *before* the vehicle leaves your factory gates to prevent confiscation by checking officers.`,
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    author: {
      name: "CA Neha Agarwal",
      role: "Indirect Tax Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
      bio: "Senior Tax Consultant and auditor, advising top-tier MSMEs and D2C brands on GST optimization and tax litigation."
    },
    category: "GST",
    subCategory: "Taxes & Compliance",
    tags: ["GST", "ITC", "GSTR-3B", "E-Way Bill", "Compliance"],
    readingTime: 5,
    difficulty: "Beginner",
    lastUpdated: "2026-06-29",
    isPremium: false
  },
  {
    id: "art-4",
    title: "The Ultimate Guide to Dubai Business Setup: Freezone vs Mainland",
    shortSummary: "Detailed comparison of IFZA, DMCC, and DED licensing with 100% ownership benefits and tax advantages for Indian entrepreneurs.",
    fullArticle: `## Dubai Business Expansion Guide

Dubai has emerged as the global hub for Indian entrepreneurs looking to scale internationally. Choosing the right license is the most critical decision.

### 1. Freezone Licensing (IFZA, DMCC, JAFZA)
*   **100% Foreign Ownership**: No local sponsor required.
*   **0% Corporate Tax**: Guaranteed for 15-50 years (subject to certain conditions).
*   **No Personal Income Tax**.
*   **Limitation**: You cannot trade directly with the UAE mainland without a local distributor.

### 2. Mainland Licensing (DED)
*   **Direct Access**: Trade anywhere in the UAE market.
*   **Government Tenders**: Eligibility for UAE government projects.
*   **Flexibility**: No office space restrictions in specific zones.

### 3. Steps to Register
1.  **Choose Activity**: Select from 3,000+ business activities.
2.  **Trade Name Approval**: Ensure the name isn't already taken or offensive.
3.  **Initial Approval**: Preliminary green signal from the authority.
4.  **Office Leasing**: Physical or virtual flexi-desk options.
5.  **Final License Issuance**: Payment of fees and submission of MoA.`,
    featuredImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop",
    author: {
      name: "Zaid Al-Hassan",
      role: "Business Setup Consultant - Dubai",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      bio: "Helping Indian tech and trading firms expand into the Middle East for over a decade."
    },
    category: "Dubai Business",
    subCategory: "International Business",
    tags: ["Dubai", "UAE", "Freezone", "Business Setup", "Taxation"],
    readingTime: 7,
    difficulty: "Intermediate",
    lastUpdated: "2026-07-08",
    isPremium: true
  }
];

export const COURSES: LearningCourse[] = [
  {
    id: "course-1",
    title: "A-Z of Setting Up a Modern Food Processing Factory",
    description: "Learn building layouts (GMP/FSSAI norms), purchasing automated retort/freeze-drying machinery, sourcing cold chain logistics, and applying for PLI schemes.",
    thumbnail: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop",
    category: "Manufacturing",
    instructor: "Vikramjit Singh (Factory Consultant)",
    difficulty: "Intermediate",
    lessonsCount: 5,
    totalDuration: "2 hrs 15 mins",
    isPremium: false,
    badge: "Food Processing Master"
  },
  {
    id: "course-2",
    title: "Importing from China & Vietnam: Sourcing, Customs Clearance & Freight",
    description: "The complete tactical blueprint to find suppliers on 1688/Alibaba, draft purchase contracts, arrange FOB/CIF terms, inspect goods, and clear Indian Customs smoothly.",
    thumbnail: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop",
    category: "Import",
    instructor: "Chen Jing & Suresh Deora",
    difficulty: "Advanced",
    lessonsCount: 4,
    totalDuration: "1 hr 45 mins",
    isPremium: true,
    badge: "Import Specialist"
  },
  {
    id: "course-3",
    title: "D2C Brand Launch: Brand Building, Marketing & Logistics",
    description: "A complete step-by-step masterclass covering Shopify store development, Meta/Google ad funnel design, scaling ROAS, and tying up with Shiprocket/Delhivery for fast COD shipping.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
    category: "Branding",
    instructor: "Rohit Bansal (D2C Founder)",
    difficulty: "Beginner",
    lessonsCount: 3,
    totalDuration: "1 hr 10 mins",
    isPremium: false,
    badge: "D2C Brand Builder"
  }
];

export const LESSONS: LearningLesson[] = [
  {
    id: "les-101",
    courseId: "course-1",
    title: "Lesson 1: FSSAI Schedule 4 Guidelines & Factory Layout Design",
    duration: "25:30",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
    summary: "How to draft your production floor map utilizing the uni-directional flow layout required to prevent cross-contamination.",
    notes: `### Factory Layout & FSSAI Schedule 4 Compliance

FSSAI Schedule 4 lays down the detailed general sanitary and hygienic practices to be followed by food business operators.

#### 1. Uni-Directional Flow Concept
*   Your layout must facilitate a strict straight-line or U-shaped movement.
*   Raw materials enter on one side, move to washing, cutting, processing, packaging, and exit as finished goods on the opposite side.
*   **NEVER** allow raw materials to cross paths with processed finished food, as it triggers high microbial cross-contamination.

#### 2. Wall & Floor Architecture
*   Floors must be smooth, impermeable, and sloped towards drainage points.
*   Drainage channels must be covered with wire-mesh traps to keep out rodents.
*   Walls must have light-colored tile cladding up to a minimum of 6 feet to facilitate easy washing.`,
    order: 1
  },
  {
    id: "les-102",
    courseId: "course-1",
    title: "Lesson 2: Industrial Retort & Dehydration Machinery Selection",
    duration: "32:15",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summary: "Selecting machinery based on volume capacity, power loads, and material quality (SS304 vs SS316).",
    notes: `### Industrial Food Processing Machinery

Selecting the right stainless steel and automation grade will protect your product quality and extend shelf-life.

#### 1. Material Grades
*   **SS304**: Excellent for non-acidic general processing, washing basins, holding shelves, and dry conveyors.
*   **SS316**: Mandatory for product contact zones containing high-acid or salty products (sauces, pickles, brine mixtures). SS316 resists pitting and chemical erosion.

#### 2. Retort Processing
*   Retorts are steam chambers that sterilize canned/packed foods, enabling room-temperature shelf life of up to 1-2 years without preservatives.
*   Must be fitted with calibrated temperature sensors, pressure gauges, and automated PLC control.`,
    order: 2
  },
  {
    id: "les-201",
    courseId: "course-2",
    title: "Lesson 1: Supplier Verification on 1688/Alibaba & Sample Inspection",
    duration: "28:10",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    summary: "Identify real manufacturers vs trading companies on 1688.com. Arrange third-party sample inspections.",
    notes: `### China & Vietnam Sourcing Verification

Sourcing high-quality raw components or white-label goods at direct cost requires using specialized direct-wholesale marketplaces.

#### 1. Alibaba vs 1688.com
*   **Alibaba**: High-friction international pricing.
*   **1688.com**: Domestic Chinese pricing. Usually 20-30% cheaper but requires using a local sourcing agent or purchasing broker.
*   *Verification rules*: Look for the \"Bull\" logo on 1688 (indicates verified factory) and check registered capital (minimum RMB 1,000,000).`,
    order: 1
  }
];

export const TEMPLATES: BusinessTemplate[] = [
  {
    id: "temp-1",
    title: "Pitch Deck Presentation Outline",
    description: "An elegant, 10-slide outline structured to hook venture capitalists, detailing problem statement, solution, business model, and financial ask.",
    category: "Pitch Deck",
    structure: [
      {
        sectionName: "Slide 1: Executive Summary & Hook",
        points: ["Catchy 1-sentence description of the venture", "Core metric or achievement that proves immediate traction."]
      },
      {
        sectionName: "Slide 2: Problem Statement",
        points: ["The specific market pain point you are addressing", "Why current existing solutions are completely inadequate."]
      },
      {
        sectionName: "Slide 3: Solution & Value Proposition",
        points: ["Your product/service description with clear benefits", "How you simplify or optimize the customer's workflow."]
      },
      {
        sectionName: "Slide 4: Market Size (TAM, SAM, SOM)",
        points: ["TAM (Total Addressable Market) in Rupees or Dollars", "SAM (Serviceable Addressable Market)", "SOM (Serviceable Obtainable Market) that you plan to capture in 3 years."]
      }
    ],
    tips: [
      "Keep text below 40 words per slide.",
      "Use massive charts rather than dense lists.",
      "Be extremely explicit about your 'Ask' and what the money will be spent on."
    ]
  },
  {
    id: "temp-2",
    title: "Comprehensive Manufacturing Project Report Format",
    description: "Detailed MSME project report layout required for applying to bank loans under PMEGP or Mudra Scheme.",
    category: "Project Report",
    structure: [
      {
        sectionName: "Chapter 1: Executive Profile",
        points: ["Promoter details, education background, past experience", "Project location address and justifications."]
      },
      {
        sectionName: "Chapter 2: Technical Feasibility",
        points: ["Detailed production capacity calculations", "Raw material specifications", "Machinery detailed pricing."]
      },
      {
        sectionName: "Chapter 3: Financial Projections",
        points: ["CapEx breakdown", "Working Capital margin estimations", "Calculated DSCR & BEP."]
      }
    ],
    tips: [
      "Ensure your DSCR stays between 1.5 to 2.2.",
      "Provide actual quotations from certified machinery suppliers."
    ]
  },
  {
    id: "temp-3",
    title: "5-Year Financial Projection Spreadsheet",
    description: "Excel-ready layout for Profit & Loss, Cash Flow, and Balance Sheet modeling.",
    category: "Financial Projection",
    structure: [
      {
        sectionName: "Revenue Streams",
        points: ["Product A, B, C units and pricing", "Service fees", "Other income."]
      },
      {
        sectionName: "Operational Costs",
        points: ["Direct COGS", "Salaries & Benefits", "Marketing budget", "Rent & Utilities."]
      }
    ],
    tips: ["Use conservative growth rates.", "Account for seasonal fluctuations."]
  }
];

export const SOPS: SopItem[] = [
  {
    id: "sop-1",
    title: "Lead Nurturing & Follow-up SOP",
    category: "Sales",
    purpose: "To standardize the process of contacting, qualification, and regular follow-up of incoming business inquiries.",
    scope: "Applies to all inside sales executives.",
    responsibilities: [
      "Inside Sales Specialist: 1st call within 15 mins.",
      "Sales Manager: Reviews weekly lead conversion logs."
    ],
    steps: [
      {
        stepNo: 1,
        title: "Initial CRM Ingest",
        action: "As soon as a lead lands, verify details and assign tags."
      },
      {
        stepNo: 2,
        title: "15-Minute Response Call",
        action: "Initiate contact over phone. Qualify prospect."
      }
    ]
  },
  {
    id: "sop-2",
    title: "Factory Raw Material Intake & Inspection SOP",
    category: "Manufacturing",
    purpose: "To ensure raw ingredients comply with technical quality spec sheets.",
    scope: "Warehouse Managers and Quality Control supervisors.",
    responsibilities: [
      "Warehouse Clerk: Unloads and logs quantity.",
      "QC Chemist: Performs testing."
    ],
    steps: [
      {
        stepNo: 1,
        title: "Gate Inward Entry",
        action: "Match incoming truck weight with supplier packing list."
      },
      {
        stepNo: 2,
        title: "Batch Sampling",
        action: "Draw random samples for QC lab."
      }
    ]
  }
];

export const CHECKLISTS: BusinessChecklist[] = [
  {
    id: "chk-startup",
    title: "Business Startup & Launch Checklist",
    description: "Legal, fiscal, and administrative steps for a certified business entity in India.",
    category: "Business Startup",
    items: [
      { id: "s-1", task: "Obtain PAN and TAN cards", description: "Mandatory tax registration.", completed: false },
      { id: "s-2", task: "Incorporate Entity (LLP/Pvt Ltd)", description: "File SPICe+ forms on MCA portal.", completed: false },
      { id: "s-3", task: "Open Current Bank Account", description: "Requires COI and Board Resolution.", completed: false },
      { id: "s-4", task: "Register for GSTIN", description: "File on GST portal.", completed: false }
    ]
  },
  {
    id: "chk-factory",
    title: "Factory Setup Compliances",
    description: "Safety and authorization needed for an industrial unit.",
    category: "Factory Setup",
    items: [
      { id: "f-1", task: "Obtain Factory Plan Approval", description: "Approval of layout by Inspector of Factories.", completed: false },
      { id: "f-2", task: "Procure Industrial Power Connection", description: "Apply to state DISCOM.", completed: false },
      { id: "f-3", task: "Pollution Control Board NOC", description: "Consent to Establish.", completed: false }
    ]
  },
  {
    id: "chk-import",
    title: "Import Logistics Checklist",
    description: "Steps for importing goods into India.",
    category: "Import",
    items: [
      { id: "i-1", task: "Obtain IEC Code", description: "Import Export Code from DGFT.", completed: false },
      { id: "i-2", task: "Register with Customs (ICEGATE)", description: "Electronic filing portal.", completed: false },
      { id: "i-3", task: "Authorize Custom House Agent (CHA)", description: "For cargo clearance.", completed: false }
    ]
  }
];

export const SCHEMES: GovernmentScheme[] = [
  {
    id: "scheme-pmegp",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    overview: "Credit-linked subsidy scheme for new micro-enterprises.",
    eligibility: ["Any individual above 18 years.", "Self Help Groups."],
    benefits: ["Subsidies of 15% to 35% of project cost.", "Bank financing for 90-95%."],
    documentsRequired: ["Aadhaar & PAN.", "Project Report (DPR)."],
    applicationGuidance: ["Prepare DPR.", "File on KVIC portal."],
    officialSource: "https://www.kviconline.gov.in/pmegpeportal/",
    lastUpdated: "2026-05-10",
    state: "Central",
    industry: "All Industries",
    businessSize: "Micro",
    category: "MSME"
  },
  {
    id: "scheme-startup-india",
    name: "Startup India Recognition",
    overview: "Provides tax exemptions, easier winding up, and IPR support.",
    eligibility: ["Incorporated as Pvt Ltd or LLP.", "Turnover < ₹100 Crores.", "Innovation focused."],
    benefits: ["80IAC Tax Exemption for 3 years.", "Self-certification for labor laws.", "Patent fee reduction (80%)."],
    documentsRequired: ["Certificate of Incorporation.", "Pitch Deck.", "Write-up on Innovation."],
    applicationGuidance: ["Apply on startupindia.gov.in.", "Provide DPIT recognition details."],
    officialSource: "https://www.startupindia.gov.in/",
    lastUpdated: "2026-07-05",
    state: "Central",
    industry: "Technology/Innovation",
    businessSize: "Startup",
    category: "MSME"
  }
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "path-1",
    title: "Start My First Business Journey",
    description: "Legal registration, tax planning, and landing your first client.",
    icon: "Rocket",
    steps: [
      { title: "Legal & Registrations Master Checklist", type: "checklist", refId: "chk-startup", duration: "10 mins" },
      { title: "Understand GST Compliance & GSTR Cycle", type: "article", refId: "art-3", duration: "5 mins" },
      { title: "Pitch Deck & VC Proposal Outline Template", type: "template", refId: "temp-1", duration: "15 mins" }
    ]
  },
  {
    id: "path-2",
    title: "SME Manufacturing Masterclass",
    description: "Establishing manufacturing operations: factory laws and machinery.",
    icon: "Factory",
    steps: [
      { title: "OEM/Private Label Factory Sourcing Guide", type: "article", refId: "art-1", duration: "8 mins" },
      { title: "FSSAI Schedule 4 Guidelines", type: "video", refId: "les-101", duration: "25 mins" },
      { title: "Industrial Retort Machinery Sourcing", type: "video", refId: "les-102", duration: "32 mins" },
      { title: "Raw Material Intake Quality Check SOP", type: "template", refId: "sop-2", duration: "12 mins" }
    ]
  },
  {
    id: "path-3",
    title: "Import Journey Masterclass",
    description: "Sourcing globally, clearing customs, and optimizing freight costs.",
    icon: "Ship",
    steps: [
      { title: "IEC Code & Customs Registration Checklist", type: "checklist", refId: "chk-import", duration: "15 mins" },
      { title: "Supplier Verification on Alibaba/1688", type: "video", refId: "les-201", duration: "28 mins" }
    ]
  },
  {
    id: "path-4",
    title: "Export Journey Mastery",
    description: "Capture international markets with high-volume agro and textile exports.",
    icon: "Globe",
    steps: [
      { title: "Basmati Rice Export Playbook", type: "article", refId: "art-2", duration: "8 mins" }
    ]
  },
  {
    id: "path-5",
    title: "Dubai Expansion Journey",
    description: "Setup your international presence in Dubai Freezones.",
    icon: "Building",
    steps: [
      { title: "Dubai Business Setup Guide", type: "article", refId: "art-4", duration: "7 mins" }
    ]
  }
];
