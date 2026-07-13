import { 
  Investor, 
  StartupProfile, 
  BusinessForSale, 
  FranchiseListing, 
  PartnershipOpportunity 
} from '../types/investment';

export const INVESTORS: Investor[] = [
  {
    id: 'inv-1',
    name: 'Anjali Sharma',
    company: 'Blue Chip Ventures',
    type: 'VC',
    investmentRange: { min: 5000000, max: 50000000 },
    industries: ['SaaS', 'Fintech', 'AI'],
    preferredCountries: ['India', 'Singapore'],
    preferredStates: ['Maharashtra', 'Karnataka'],
    fundingStage: ['Seed', 'Series A'],
    contactEmail: 'anjali@bluechip.vc',
    website: 'https://bluechip.vc',
    isVerified: true,
    portfolio: ['Paytm', 'Zomato', 'Freshworks'],
    bio: 'Former founder turned investor with a focus on high-growth technology startups in the APAC region.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'inv-2',
    name: 'Rajiv Mehra',
    company: 'Mehra Family Office',
    type: 'Family Office',
    investmentRange: { min: 10000000, max: 100000000 },
    industries: ['Manufacturing', 'Real Estate', 'Logistics'],
    preferredCountries: ['India', 'UAE'],
    preferredStates: ['Delhi', 'Gujarat'],
    fundingStage: ['Growth', 'Pre-IPO'],
    contactEmail: 'rajiv@mehraoffice.com',
    isVerified: true,
    portfolio: ['Delhivery', 'Reliance Retail'],
    bio: 'Serial entrepreneur investing in traditional industries undergoing digital transformation.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  }
];

export const STARTUPS: StartupProfile[] = [
  {
    id: 'start-1',
    name: 'AquaSmart AI',
    founder: 'Priya Iyer',
    industry: 'AgriTech',
    revenueStage: 'Early Revenue',
    fundingStage: 'Seed',
    investmentRequired: 15000000,
    equityOffered: 10,
    valuation: 150000000,
    businessModel: 'B2B SaaS subscription for smart irrigation systems.',
    pitchDeckUrl: '#',
    financialSummary: 'Revenue: ₹50L (last 12mo), Burn: ₹5L/mo.',
    traction: '500+ farms onboarded, 30% MoM growth.',
    marketSize: '₹5,000 Cr TAM in India.',
    growthRate: '25% MoM',
    isVerified: true,
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'start-2',
    name: 'ZenLogs Logistics',
    founder: 'Amit Patel',
    industry: 'Logistics',
    revenueStage: 'Scaling',
    fundingStage: 'Series A',
    investmentRequired: 40000000,
    equityOffered: 15,
    valuation: 260000000,
    businessModel: 'AI-driven route optimization for long-haul trucking.',
    pitchDeckUrl: '#',
    financialSummary: 'Revenue: ₹2.5Cr ARR, Positive EBITDA.',
    traction: '10 enterprise clients including Tata Motors.',
    marketSize: '₹15,000 Cr SAM.',
    growthRate: '150% YoY',
    isVerified: true,
    logo: 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=150&auto=format&fit=crop'
  }
];

export const BUSINESSES_FOR_SALE: BusinessForSale[] = [
  {
    id: 'sale-1',
    name: 'Heritage Textiles Factory',
    industry: 'Manufacturing',
    location: 'Surat, Gujarat',
    reasonForSale: 'Retirement of owner.',
    revenue: 120000000,
    profit: 18000000,
    employees: 85,
    assets: ['Land (2 acres)', 'Machinery', 'Existing Contracts'],
    price: 85000000,
    isNegotiable: true,
    businessAge: 22,
    photos: ['https://images.unsplash.com/photo-1558444479-c847513476f1?q=80&w=600&auto=format&fit=crop'],
    isVerified: true,
    summary: 'A well-established textile manufacturing unit with a strong reputation and stable customer base.'
  }
];

export const FRANCHISES: FranchiseListing[] = [
  {
    id: 'fran-1',
    brand: 'Chai Point',
    industry: 'F&B',
    investmentRange: { min: 2500000, max: 5000000 },
    areaRequired: '200 - 500 sq ft',
    roiMonths: 18,
    supportLevel: 'Full',
    trainingProvided: true,
    locationsAvailable: ['Pune', 'Hyderabad', 'Bangalore'],
    royaltyPercentage: 8,
    logo: 'https://images.unsplash.com/photo-1544333346-64e4fe186060?q=80&w=150&auto=format&fit=crop',
    description: 'India\'s fastest-growing chai retail chain with tech-enabled operations.'
  }
];

export const PARTNERSHIPS: PartnershipOpportunity[] = [
  {
    id: 'part-1',
    title: 'Looking for Tech Co-founder for Health-AI',
    type: 'Co-Founder',
    description: 'Seeking a CTO level partner with experience in LLMs and healthcare data.',
    location: 'Remote / Bangalore',
    requirements: ['8+ years in SE', 'Deep Learning expertise', 'Equity focused'],
    postedBy: {
      name: 'Dr. Sarah Khan',
      company: 'MedGenix',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
    },
    postedAt: '2026-07-08'
  }
];
