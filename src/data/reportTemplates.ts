export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  order: number;
  defaultContent: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  reportType: string;
  sections: TemplateSection[];
  industry: string;
  country: string;
  language: string;
  version: string;
  isActive: boolean;
  watermark: string;
}

export interface SectionContent {
  id: string;
  title: string;
  content: string;
  order: number;
  metadataType: 'Verified Information' | 'Customer-Provided Information' | 'Estimate' | 'Assumption' | 'Recommendation';
  lastEditedBy?: string;
  updatedAt?: string;
}

export interface ReportVersion {
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  changeNotes: string;
  sectionsSnapshot: SectionContent[];
}

export interface ReportReview {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  passed: boolean;
  comments: string;
  checklistState: {
    noEmptySections: boolean;
    professionalFormatting: boolean;
    noDuplicateContent: boolean;
    consistentTerminology: boolean;
    disclaimersIncluded: boolean;
    supportingReferences: boolean;
  };
  createdAt: string;
}

export interface ReportApproval {
  approverName: string;
  approverRole: string;
  signatureText: string;
  timestamp: string;
}

export interface BusinessReport {
  id: string;
  title: string;
  reportType: string;
  businessName: string;
  customerName: string;
  ownerId: string;
  date: string;
  status: 'payment_received' | 'waiting_assignment' | 'assigned' | 'research_started' | 'market_research' | 'competitor_analysis' | 'financial_analysis' | 'internal_review' | 'qa_review' | 'pdf_generation' | 'approved' | 'delivered' | 'completed';
  assignedExecutive: string;
  assignedManager: string;
  versionNumber: number;
  watermarkEnabled: boolean;
  passwordProtected: boolean;
  pdfPassword?: string;
  sections: SectionContent[];
  versions: ReportVersion[];
  reviews: ReportReview[];
  approvals: ReportApproval[];
  comments: {
    id: string;
    senderName: string;
    senderRole: string;
    message: string;
    timestamp: string;
  }[];
  history: {
    id: string;
    action: string;
    actorName: string;
    details: string;
    timestamp: string;
  }[];
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tmpl_idea_validation',
    name: 'Business Idea Validation Template',
    description: 'Structure for verifying demand, viability, and initial entry pathways for new startup concepts.',
    reportType: 'Business Idea Validation Report',
    industry: 'All Industries',
    country: 'India',
    language: 'English',
    version: 'V1.4',
    isActive: true,
    watermark: 'BizNxt Confidential',
    sections: [
      {
        id: 'sec_val_exec',
        title: 'Executive Summary',
        description: 'Comprehensive overview of the validation findings, primary opportunities, and critical red flags.',
        order: 1,
        defaultContent: 'Enter high-level validation insights...'
      },
      {
        id: 'sec_val_prob',
        title: 'Problem Statement & Target Audience Validation',
        description: 'Analysis of customer pain points, target segment sizes, and verified demand indicators.',
        order: 2,
        defaultContent: 'Enter validation details regarding customer pain points and interviews...'
      },
      {
        id: 'sec_val_usp',
        title: 'Product/Service Definition & USP Audit',
        description: 'Evaluation of the proposed solution, feature priorities, and sustainable competitive advantages.',
        order: 3,
        defaultContent: 'Define products and list unique value propositions...'
      },
      {
        id: 'sec_val_metrics',
        title: 'Initial Viability & Feasibility Scoring',
        description: 'Weighted scorecard analyzing market fit, unit economics feasibility, and regulatory barriers.',
        order: 4,
        defaultContent: 'List key feasibility ratings and scorecard results...'
      },
      {
        id: 'sec_val_plan',
        title: '90-Day Entry Action Plan',
        description: 'Phased checklist for entity registration, product drafting, and initial pilot launch.',
        order: 5,
        defaultContent: 'Phased launch timelines, including legal and technical steps...'
      }
    ]
  },
  {
    id: 'tmpl_market_research',
    name: 'Standard Market Research Template',
    description: 'Detailed structure for macroeconomic size, consumer trends, and industrial value mapping.',
    reportType: 'Market Research Report',
    industry: 'SME / Retail',
    country: 'India',
    language: 'English',
    version: 'V2.1',
    isActive: true,
    watermark: 'BizNxt Market Research',
    sections: [
      {
        id: 'sec_mr_exec',
        title: 'Executive Summary',
        description: 'Key summary of the market demographics, size, and long-term sector trajectories.',
        order: 1,
        defaultContent: 'Provide the executive high-level market findings...'
      },
      {
        id: 'sec_mr_macro',
        title: 'Macroeconomic Sector Landscape',
        description: 'Industry statistics, governmental policies, sectoral growth trends, and capital inflow.',
        order: 2,
        defaultContent: 'Analyze major macroeconomic factors, GDP contribution, and government subsidies...'
      },
      {
        id: 'sec_mr_consumer',
        title: 'Consumer Demographics & Segment Survey',
        description: 'Analysis of buying behavior, spending capacity, demographic brackets, and price sensitivity indices.',
        order: 3,
        defaultContent: 'Details regarding target demographic, age brackets, income distributions, and purchase triggers...'
      },
      {
        id: 'sec_mr_fiveforces',
        title: "Porter's Five Forces Sector Audit",
        description: 'Rigorous assessment of supplier power, buyer power, substitution risks, threat of entry, and rivalry.',
        order: 4,
        defaultContent: 'Detailed Porter\'s 5 forces table and descriptions...'
      },
      {
        id: 'sec_mr_pricing',
        title: 'Pricing Strategy & Margin Structures',
        description: 'Wholesale, distributor, and retail pricing tiers. Margin distribution analysis.',
        order: 5,
        defaultContent: 'Compare pricing models and recommend optimum margins...'
      }
    ]
  },
  {
    id: 'tmpl_financial_feasibility',
    name: 'Financial Feasibility Template',
    description: 'Structure for detailed Capital Expenditure (CapEx), operating cost projections, break-even models, and payback periods.',
    reportType: 'Financial Feasibility Report',
    industry: 'Financial / Commercial',
    country: 'India',
    language: 'English',
    version: 'V1.8',
    isActive: true,
    watermark: 'BizNxt Financial Blueprint',
    sections: [
      {
        id: 'sec_fin_exec',
        title: 'Executive Summary',
        description: 'Brief overview of funding requirements, return on investment (ROI), break-even thresholds, and overall feasibility.',
        order: 1,
        defaultContent: 'Financial overview and summary of investment profitability...'
      },
      {
        id: 'sec_fin_capex',
        title: 'Capital Expenditures (CapEx) Breakdown',
        description: 'One-time setup costs, machinery, real estate leasing, deposit advances, licensing, and initial inventory reserves.',
        order: 2,
        defaultContent: 'Itemized CapEx table with audited equipment and setup charges...'
      },
      {
        id: 'sec_fin_opex',
        title: 'Operational Expenditures (OpEx) Model',
        description: 'Monthly overheads, including salaries, rental overheads, utility charges, raw materials, marketing allocation, and contingency reserves.',
        order: 3,
        defaultContent: 'Itemized monthly running expenses and operational tables...'
      },
      {
        id: 'sec_fin_rev',
        title: 'Revenue Projections & Sensitivity Analysis',
        description: 'Monthly sales models based on average basket values, unit prices, and progressive footfall growth. Best, expected, and worst-case scenarios.',
        order: 4,
        defaultContent: 'Dynamic revenue models with conservative demand metrics...'
      },
      {
        id: 'sec_fin_breakeven',
        title: 'Break-Even & Payback Period Projection',
        description: 'Calculation of monthly break-even units and estimated months required to recoup the total CapEx investment.',
        order: 5,
        defaultContent: 'Break-even formula application and payback timeline...'
      }
    ]
  }
];

export const INITIAL_REPORTS: BusinessReport[] = [
  {
    id: 'rep_cloud_kitchen_blr',
    title: 'Cloud Kitchen Feasibility & Market Research Dossier',
    reportType: 'Market Research Report',
    businessName: 'Zaika Express Cloud Kitchens',
    customerName: 'Ketan Sharma',
    ownerId: 'usr-1',
    date: '2026-07-09',
    status: 'completed',
    assignedExecutive: 'Sanjay Deshmukh',
    assignedManager: 'Amit Jha',
    versionNumber: 1,
    watermarkEnabled: true,
    passwordProtected: false,
    sections: [
      {
        id: 'rep_ck_sec1',
        title: 'Executive Summary',
        content: `This feasibility report assesses the viability of establishing a multi-brand cloud kitchen network in Indiranagar, Bangalore, targeting the high-density professional demographic. Primary findings indicate that the delivery-only sector in Bangalore has achieved a 35% Year-on-Year (YoY) growth, fueled by hybrid work patterns. High density areas like Indiranagar, HSR Layout, and Koramangala present the lowest customer acquisition costs (CAC) combined with high average order values (AOV) of ₹380-420. Capital investments are estimated at ₹18.5 Lakhs with an estimated break-even period of 14 months, assuming conservative average daily orders of 120 across 3 virtual brands. Key success vectors rely on maintaining a prime micro-location with low commercial rentals (under ₹45,000/month) and leveraging direct-to-consumer (D2C) marketing channels to bypass Zomato/Swiggy commission margins.`,
        order: 1,
        metadataType: 'Recommendation'
      },
      {
        id: 'rep_ck_sec2',
        title: 'Proposed Location & Spatial Suitability',
        content: `The customer proposes to acquire a 600 sq. ft. commercial space near Indiranagar Double Road, Bangalore. Ground truth site verification indicates that the location is zoned commercial and possesses a high-capacity single-phase electrical setup (upgradable to three-phase, which is mandatory for commercial kitchen equipment). Average footfall density is low on the secondary lane, which is highly advantageous as cloud kitchens do not require front-facing high-street frontage, keeping lease rentals below market averages at ₹42,000 per month compared to ₹1.8 Lakhs on the high street. Proper municipal sewage linkages are available. However, a major operational risk is the absence of a high-capacity exhaust duct setup, which will necessitate an initial layout budget addition of ₹65,000 for compliance with Karnataka State Pollution Control Board (KSPCB) guidelines.`,
        order: 2,
        metadataType: 'Verified Information'
      },
      {
        id: 'rep_ck_sec3',
        title: 'Investment Metrics & Capital Structure',
        content: `The customer has specified an available capital budget of ₹15,00,000. However, our audited pricing model indicates that a fully-compliant commercial 3-brand cloud kitchen setup with high-grade stainless steel equipment, commercial exhaust hood, cold storage, and standard fire suppressors requires an estimated CapEx of ₹18,50,000. This presents a budget gap of ₹3,50,000. To prevent liquidity risks, it is highly recommended to lease major heavy appliances (refrigeration units, commercial ovens) which reduces the upfront equipment budget from ₹8,50,000 to ₹3,80,000, thereby aligning the total setup CapEx within the customer's comfortable limit. Working capital reserves must be locked at ₹3,00,000 to cover the initial 4 months of operational overheads prior to positive cash flow.`,
        order: 3,
        metadataType: 'Estimate'
      },
      {
        id: 'rep_ck_sec4',
        title: 'Market Growth & Sector Projections',
        content: `We assume a steady 12% annual compounding growth rate (CAGR) for the online food ordering sector in Bangalore East over the next 5 years (2026-2031). It is assumed that 75% of order volumes will continue to flow through consolidated aggregators (Swiggy/Zomato), while 25% can be successfully diverted to direct WhatsApp/Web Ordering systems through localized digital target campaigns. Aggregator commissions are calculated at a flat 24% of order value. Packing and delivery charges are assumed at 8% of order value. Operating days are scheduled at 365 days a year with peak volumes concentrated during weekend dinner windows (Friday-Sunday, accounting for 52% of weekly sales volume).`,
        order: 4,
        metadataType: 'Assumption'
      },
      {
        id: 'rep_ck_sec5',
        title: 'Regulatory & Compliance Roadmap',
        content: `To launch legally in Bangalore, Karnataka, the venture must secure: (1) FSSAI State License (₹3,000/year, processing time: 25 days), (2) BBMP Trade License (₹12,000/year, processing time: 30 days), (3) Fire NOC from Karnataka Fire & Emergency Services (applicable for spaces above 500 sq. ft. commercial, processing time: 45 days), (4) GST Registration (Mandatory for aggregator listings, processing time: 7 days), and (5) KSPCB Consent to Establish (CTE/CTO) under the green/orange category. The estimated cumulative time for legal clearances is 45-60 days. Food handler medical certificates must be compiled for all kitchen staff before operations begin.`,
        order: 5,
        metadataType: 'Verified Information'
      }
    ],
    versions: [
      {
        versionNumber: 1,
        createdAt: '2026-07-09T14:30:00Z',
        createdBy: 'Sanjay Deshmukh',
        changeNotes: 'Initial comprehensive market feasibility draft completed.',
        sectionsSnapshot: []
      }
    ],
    reviews: [
      {
        id: 'rev_1',
        reviewerName: 'Priyanka Sen',
        reviewerRole: 'Quality Review Analyst',
        passed: true,
        comments: 'Verified information segments checked against municipal laws and local commercial registry. Financial models have conservative sensitivity structures applied. Ready for digital signoff.',
        checklistState: {
          noEmptySections: true,
          professionalFormatting: true,
          noDuplicateContent: true,
          consistentTerminology: true,
          disclaimersIncluded: true,
          supportingReferences: true
        },
        createdAt: '2026-07-09T16:00:00Z'
      }
    ],
    approvals: [
      {
        approverName: 'Amit Jha',
        approverRole: 'Principal BSM Manager',
        signatureText: 'AMIT JHA • BIZNXT DIGITAL APPROVAL • LIC 2026-9921',
        timestamp: '2026-07-09T18:00:00Z'
      }
    ],
    comments: [
      {
        id: 'c_1',
        senderName: 'Ketan Sharma',
        senderRole: 'Customer',
        message: 'Can we add a regional competitor mapping for Indiranagar specifically?',
        timestamp: '2026-07-09T10:15:00Z'
      },
      {
        id: 'c_2',
        senderName: 'Sanjay Deshmukh',
        senderRole: 'Research Expert',
        message: 'Yes, Ketan. I have updated the location suitability index to reflect the proximity of the top 3 competitive cloud brands in a 2.5km radius.',
        timestamp: '2026-07-09T12:00:00Z'
      }
    ],
    history: [
      {
        id: 'h_1',
        action: 'report_created',
        actorName: 'System',
        details: 'Research request received via launch checkout.',
        timestamp: '2026-07-08T09:00:00Z'
      },
      {
        id: 'h_2',
        action: 'bsm_assigned',
        actorName: 'Admin',
        details: 'Venture assigned to Principal BSM Amit Jha.',
        timestamp: '2026-07-08T10:30:00Z'
      },
      {
        id: 'h_3',
        action: 'researcher_assigned',
        actorName: 'Amit Jha',
        details: 'Senior Analyst Sanjay Deshmukh assigned to prepare findings.',
        timestamp: '2026-07-08T11:45:00Z'
      },
      {
        id: 'h_4',
        action: 'ai_draft_generated',
        actorName: 'Sanjay Deshmukh',
        details: 'Triggered Gemini AI core SWOT and market size estimates draft.',
        timestamp: '2026-07-08T14:20:00Z'
      },
      {
        id: 'h_5',
        action: 'findings_modified',
        actorName: 'Sanjay Deshmukh',
        details: 'Refined and localized the legal and investment breakdown parameters.',
        timestamp: '2026-07-09T14:15:00Z'
      },
      {
        id: 'h_6',
        action: 'quality_reviewed',
        actorName: 'Priyanka Sen',
        details: 'Passed rigorous compliance and disclaimer checks.',
        timestamp: '2026-07-09T16:05:00Z'
      },
      {
        id: 'h_7',
        action: 'digitally_approved',
        actorName: 'Amit Jha',
        details: 'Digital signoff and approval applied to V1.',
        timestamp: '2026-07-09T18:02:00Z'
      }
    ]
  },
  {
    id: 'rep_apparel_mfg_tirupur',
    title: 'Knitwear Manufacturing Feasibility & Unit Economics',
    reportType: 'Manufacturing Feasibility Report',
    businessName: 'Apex Knitwear Manufacturing',
    customerName: 'Dr. Sneha Roy',
    ownerId: 'usr-2',
    date: '2026-07-07',
    status: 'research_started',
    assignedExecutive: 'Sanjay Deshmukh',
    assignedManager: 'Amit Jha',
    versionNumber: 1,
    watermarkEnabled: true,
    passwordProtected: false,
    sections: [
      {
        id: 'rep_ap_sec1',
        title: 'Executive Summary',
        content: `This report details the operational setup feasibility of a high-efficiency circular knitwear manufacturing unit in Tirupur, Tamil Nadu. Tirupur represents the textile capital of India, housing over 9,000 auxiliary knitting, dyeing, and processing units. Establishing a unit here provides immediate access to high-quality combed cotton yarns, low-cost specialized machinery maintenance, and skilled labor. Initial setup cost projections stand at ₹45 Lakhs, with machinery constituting 65% of the total budget. The primary commercial bottleneck is the high cost of dyeing and wet-processing compliance under Zero Liquid Discharge (ZLD) requirements in Tamil Nadu. The project is currently in active research phase with our expert team mapping local raw yarn wholesale vendor networks.`,
        order: 1,
        metadataType: 'Recommendation'
      },
      {
        id: 'rep_ap_sec2',
        title: 'Yarn Sourcing & Vendor Matrix',
        content: `Tirupur yarn prices for 30s Combed Cotton range between ₹245-₹265 per Kg as of July 2026. Major local spinners like Eastman, Cotton Blossom, and local spinning associations provide wholesale credit lines of 45-60 days to verified manufacturing entities. Sourcing of raw fabrics and processing accessories (organic dyes, premium rib knit collars, polyester sewing threads, eco-friendly tagging cards) can be completely centralized within a 15km radius of the proposed industrial site in Netaji Apparel Park. Sourcing cost indices are verified to be 18% lower than North Indian clusters, offering a massive operational margin buffer.`,
        order: 2,
        metadataType: 'Verified Information'
      }
    ],
    versions: [],
    reviews: [],
    approvals: [],
    comments: [],
    history: [
      {
        id: 'h_1',
        action: 'report_created',
        actorName: 'System',
        details: 'Manufacturing feasibility order logged.',
        timestamp: '2026-07-07T11:00:00Z'
      },
      {
        id: 'h_2',
        action: 'assigned',
        actorName: 'Amit Jha',
        details: 'Assigned to Senior Researcher Sanjay Deshmukh.',
        timestamp: '2026-07-07T14:00:00Z'
      }
    ]
  }
];
