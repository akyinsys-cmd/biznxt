const fs = require('fs');

const file = 'src/pages/Services.tsx';
let content = fs.readFileSync(file, 'utf8');

const CATEGORIES = `const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'business_research', label: 'Business Research' },
  { id: 'gst_services', label: 'GST Services' },
  { id: 'income_tax', label: 'Income Tax Services' },
  { id: 'trade_license', label: 'Trade License' },
];`;

const PACKAGES = `const PACKAGES: any[] = [];`;

const SEED_SERVICES = `const SEED_SERVICES = [
  // BUSINESS RESEARCH PLANS
  {
    id: 'res-basic',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Basic Research',
    description: 'Entry level business research overview with local market feasibility insights.',
    overview: 'Essential research to help you understand market potential and basic competition.',
    deliverables: 'Business Feasibility Overview, Basic Market Overview, Local Competition Snapshot, Investment Estimate, Business Suitability Summary, PDF Report',
    timeline: '24–48 Hours',
    estimatedDuration: 2,
    price: 499,
    benchmark_price: 499,
    biznxt_price: 499,
    premium_features_list: [
      { text: "Business Feasibility Overview", highlight: "Understand if your idea works." },
      { text: "Local Competition Snapshot", highlight: "Know your immediate competitors." },
      { text: "Investment Estimate", highlight: "Initial capital requirement." }
    ],
    discount: 0,
    requiredDocuments: 'Basic idea brief, target location.',
    eligibility: 'Any aspiring founder.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-pro',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Professional Research',
    description: 'Detailed market analysis including location assessment and customer demand.',
    overview: 'In-depth research providing competition analysis and growth opportunities.',
    deliverables: 'Everything in Basic, Detailed Market Research, Competition Analysis, Location Assessment, Customer Demand Analysis, Business Risks, Growth Opportunities, Investment Planning, Professional PDF Report',
    timeline: '3-5 Days',
    estimatedDuration: 5,
    price: 4999,
    benchmark_price: 4999,
    biznxt_price: 4999,
    premium_features_list: [
      { text: "Detailed Market Research", highlight: "Deep dive into your industry." },
      { text: "Location Assessment", highlight: "Optimal business placement." },
      { text: "Investment Planning", highlight: "Financial strategy and budgeting." }
    ],
    discount: 0,
    requiredDocuments: 'Detailed business plan, target audience profile.',
    eligibility: 'Startups and expanding businesses.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-prem',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Premium Research',
    description: 'Advanced analysis with SWOT, launch roadmap, and marketing suggestions.',
    overview: 'Comprehensive research with actionable strategies for market entry.',
    deliverables: 'Everything in Professional, Advanced Business Analysis, Industry Insights, SWOT Analysis, Launch Roadmap, Marketing Suggestions, Financial Planning Overview, Growth Strategy, Executive Summary, Premium PDF Report',
    timeline: '7-10 Days',
    estimatedDuration: 10,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "SWOT Analysis", highlight: "Strengths, Weaknesses, Opportunities, Threats." },
      { text: "Launch Roadmap", highlight: "Step-by-step execution plan." },
      { text: "Growth Strategy", highlight: "Long-term scaling tactics." }
    ],
    discount: 0,
    requiredDocuments: 'Business goals, competitive landscape assumptions.',
    eligibility: 'Businesses ready to launch or scale.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-ent',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Enterprise Research',
    description: 'Comprehensive research covering multi-location expansion and operational planning.',
    overview: 'Enterprise-level strategic research with executive presentation.',
    deliverables: 'Everything in Premium, Comprehensive Research, Multi-location Analysis, Expansion Assessment, Operational Planning, Risk Assessment, Priority Consultation, Executive Presentation, Premium Business Report',
    timeline: '14-21 Days',
    estimatedDuration: 21,
    price: 19999,
    benchmark_price: 19999,
    biznxt_price: 19999,
    premium_features_list: [
      { text: "Multi-location Analysis", highlight: "Assess potential in various markets." },
      { text: "Operational Planning", highlight: "Supply chain and logistics strategy." },
      { text: "Executive Presentation", highlight: "Ready for stakeholder meetings." }
    ],
    discount: 0,
    requiredDocuments: 'Expansion goals, current operational metrics.',
    eligibility: 'Mid to large enterprises.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'res-corp',
    category: 'business_research',
    subCategory: 'Business Research',
    title: 'Corporate Research',
    description: 'Enterprise-grade research with dedicated team and custom business intelligence.',
    overview: 'Ultimate research package providing industry benchmarking and priority support.',
    deliverables: 'Everything in Enterprise, Dedicated Research Team, Custom Business Intelligence, Industry Benchmarking, Advanced Market Study, Executive Presentation, Priority Support, Dedicated Business Success Manager',
    timeline: '30+ Days',
    estimatedDuration: 30,
    price: 49999,
    benchmark_price: 49999,
    biznxt_price: 49999,
    premium_features_list: [
      { text: "Dedicated Research Team", highlight: "A team focused solely on your project." },
      { text: "Custom Business Intelligence", highlight: "Tailored data and analytics." },
      { text: "Dedicated BSM", highlight: "Ongoing personalized support." }
    ],
    discount: 0,
    requiredDocuments: 'Corporate objectives, existing market data.',
    eligibility: 'Corporations and large enterprises.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },

  // GST SERVICES
  {
    id: 'gst-reg',
    category: 'gst_services',
    subCategory: 'Registration',
    title: 'GST Registration + Initial Filing Support Package',
    description: 'Complete GST registration and assistance with your first filing.',
    overview: 'Get your business compliant quickly with our comprehensive registration support.',
    deliverables: 'GST Registration, Initial Filing Assistance, Document Guidance, Application Tracking, Professional Support',
    timeline: '5-7 Days',
    estimatedDuration: 7,
    price: 4999,
    benchmark_price: 4999,
    biznxt_price: 4999,
    premium_features_list: [
      { text: "Application Tracking", highlight: "Real-time updates on your application." },
      { text: "Professional Support", highlight: "Expert guidance throughout the process." }
    ],
    discount: 0,
    requiredDocuments: 'PAN, Aadhaar, Business Address Proof, Bank Details.',
    eligibility: 'Any business requiring GST registration.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'gst-filing',
    category: 'gst_services',
    subCategory: 'Compliance',
    title: 'GST Filing Package',
    description: 'Regular GST filing support to keep your business compliant.',
    overview: 'Avoid penalties with our timely and accurate GST return preparation.',
    deliverables: 'Regular GST Filing Support, Compliance Assistance, Return Preparation Support, Email Support, Priority Handling',
    timeline: 'Monthly',
    estimatedDuration: 30,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "Return Preparation Support", highlight: "Accurate calculation of tax liabilities." },
      { text: "Priority Handling", highlight: "Fast-tracked processing of your returns." }
    ],
    discount: 0,
    requiredDocuments: 'Sales and Purchase Invoices, Bank Statements.',
    eligibility: 'GST registered businesses.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'gst-annual',
    category: 'gst_services',
    subCategory: 'Compliance',
    title: 'Annual GST + ITR Package',
    description: 'Comprehensive annual package covering both GST and Income Tax returns.',
    overview: 'Complete peace of mind for your yearly tax obligations with a dedicated executive.',
    deliverables: 'GST Compliance Support, ITR Filing Support, Dedicated Executive, Priority Support',
    timeline: 'Annual',
    estimatedDuration: 365,
    price: 29999,
    benchmark_price: 29999,
    biznxt_price: 29999,
    premium_features_list: [
      { text: "Dedicated Executive", highlight: "Single point of contact for all tax matters." },
      { text: "Complete Tax Coverage", highlight: "Handles both indirect and direct taxes." }
    ],
    discount: 0,
    requiredDocuments: 'Financial Statements, Invoices, Bank Records, Previous Returns.',
    eligibility: 'Businesses requiring annual tax compliance.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },

  // INCOME TAX SERVICES
  {
    id: 'it-filing',
    category: 'income_tax',
    subCategory: 'Tax Returns',
    title: 'ITR Filing',
    description: 'Professional assistance with filing your Income Tax Return.',
    overview: 'Ensure accurate tax reporting and maximize your deductions.',
    deliverables: 'Return Preparation, Document Review, Professional Filing Assistance, Acknowledgement Support',
    timeline: '3-5 Days',
    estimatedDuration: 5,
    price: 4999,
    benchmark_price: 4999,
    biznxt_price: 4999,
    premium_features_list: [
      { text: "Document Review", highlight: "Thorough check of all financial documents." },
      { text: "Acknowledgement Support", highlight: "Confirmation of successful filing." }
    ],
    discount: 0,
    requiredDocuments: 'Form 16, Bank Statements, Investment Proofs.',
    eligibility: 'Individuals and businesses.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'it-ca-assisted',
    category: 'income_tax',
    subCategory: 'Tax Planning',
    title: 'CA Assisted Tax Filing',
    description: 'Dedicated CA assistance for complex tax situations and planning.',
    overview: 'Expert advice to optimize your tax liabilities and ensure strict compliance.',
    deliverables: 'Dedicated CA Assistance, Tax Planning Support, Compliance Review, Priority Support',
    timeline: '7-10 Days',
    estimatedDuration: 10,
    price: 18999,
    benchmark_price: 18999,
    biznxt_price: 18999,
    premium_features_list: [
      { text: "Tax Planning Support", highlight: "Strategies to minimize tax legally." },
      { text: "Compliance Review", highlight: "Audit of previous tax filings." }
    ],
    discount: 0,
    requiredDocuments: 'Detailed Financial Records, Asset Details, Previous ITRs.',
    eligibility: 'High net worth individuals and complex business structures.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'it-ca-managed',
    category: 'income_tax',
    subCategory: 'Tax Compliance',
    title: 'CA Managed Tax Compliance',
    description: 'Complete annual tax management by a dedicated Chartered Accountant.',
    overview: 'Outsource your entire tax department to our expert CA professionals.',
    deliverables: 'Dedicated CA, Annual Compliance Assistance, Tax Review, Professional Support, Priority Service',
    timeline: 'Annual',
    estimatedDuration: 365,
    price: 24999,
    benchmark_price: 24999,
    biznxt_price: 24999,
    premium_features_list: [
      { text: "Dedicated CA", highlight: "Your personal financial advisor." },
      { text: "Annual Compliance", highlight: "Year-round monitoring and filing." }
    ],
    discount: 0,
    requiredDocuments: 'All financial data throughout the year.',
    eligibility: 'Businesses seeking end-to-end tax management.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },

  // TRADE LICENSE
  {
    id: 'tl-ka',
    category: 'trade_license',
    subCategory: 'Local Registration',
    title: 'Trade License - Karnataka',
    description: 'Assistance in obtaining a trade license from local authorities in Karnataka.',
    overview: 'Mandatory license for operating a commercial establishment in Karnataka.',
    deliverables: 'Application Filing, Document Compilation, Follow-up with Authorities, License Procurement',
    timeline: '15-20 Days',
    estimatedDuration: 20,
    price: 14999,
    benchmark_price: 14999,
    biznxt_price: 14999,
    premium_features_list: [
      { text: "End-to-End Assistance", highlight: "We handle the bureaucracy." },
      { text: "Pricing & Requirements Note", highlight: "Varies depending on local authority and documentation." }
    ],
    discount: 0,
    requiredDocuments: 'Rental Agreement, ID Proof, Property Tax Receipt, NOC from Owner.',
    eligibility: 'Businesses operating in Karnataka.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'tl-tn',
    category: 'trade_license',
    subCategory: 'Local Registration',
    title: 'Trade License - Tamil Nadu',
    description: 'Assistance in obtaining a trade license from local authorities in Tamil Nadu.',
    overview: 'Mandatory license for operating a commercial establishment in Tamil Nadu.',
    deliverables: 'Application Filing, Document Compilation, Follow-up with Authorities, License Procurement',
    timeline: '15-20 Days',
    estimatedDuration: 20,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "End-to-End Assistance", highlight: "We handle the bureaucracy." },
      { text: "Pricing & Requirements Note", highlight: "Varies depending on local authority and documentation." }
    ],
    discount: 0,
    requiredDocuments: 'Rental Agreement, ID Proof, Property Tax Receipt, NOC from Owner.',
    eligibility: 'Businesses operating in Tamil Nadu.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  },
  {
    id: 'tl-ts',
    category: 'trade_license',
    subCategory: 'Local Registration',
    title: 'Trade License - Telangana',
    description: 'Assistance in obtaining a trade license from local authorities in Telangana.',
    overview: 'Mandatory license for operating a commercial establishment in Telangana.',
    deliverables: 'Application Filing, Document Compilation, Follow-up with Authorities, License Procurement',
    timeline: '15-20 Days',
    estimatedDuration: 20,
    price: 9999,
    benchmark_price: 9999,
    biznxt_price: 9999,
    premium_features_list: [
      { text: "End-to-End Assistance", highlight: "We handle the bureaucracy." },
      { text: "Pricing & Requirements Note", highlight: "Varies depending on local authority and documentation." }
    ],
    discount: 0,
    requiredDocuments: 'Rental Agreement, ID Proof, Property Tax Receipt, NOC from Owner.',
    eligibility: 'Businesses operating in Telangana.',
    faqs: [], terms: '', cancellationPolicy: '', refundPolicy: '', dependencies: '', addOnServices: '', relatedServices: [], recommendedNextServices: []
  }
];`;

content = content.replace(/const CATEGORIES = \[[\s\S]*?\];/, CATEGORIES);
content = content.replace(/const PACKAGES = \[[\s\S]*?\];/, PACKAGES);
content = content.replace(/const SEED_SERVICES = \[[\s\S]*?\];/, SEED_SERVICES);

fs.writeFileSync(file, content, 'utf8');
