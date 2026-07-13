export type InvestmentStage = 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Pre-IPO' | 'Growth';
export type InvestorType = 'Angel Investor' | 'VC' | 'Family Office' | 'Private Investor' | 'Corporate Investor' | 'Strategic Investor' | 'Government Funding' | 'Incubator' | 'Accelerator' | 'Bank' | 'NBFC' | 'CSR Funding' | 'International Investor';

export interface Investor {
  id: string;
  name: string;
  company: string;
  type: InvestorType;
  investmentRange: { min: number; max: number };
  industries: string[];
  preferredCountries: string[];
  preferredStates: string[];
  fundingStage: InvestmentStage[];
  contactEmail: string;
  website?: string;
  isVerified: boolean;
  portfolio: string[];
  successStories?: string[];
  bio: string;
  avatar: string;
}

export interface StartupProfile {
  id: string;
  name: string;
  founder: string;
  industry: string;
  revenueStage: 'Pre-revenue' | 'Early Revenue' | 'Profitable' | 'Scaling';
  fundingStage: InvestmentStage;
  investmentRequired: number;
  equityOffered: number;
  valuation: number;
  businessModel: string;
  pitchDeckUrl: string;
  financialSummary: string;
  traction: string;
  marketSize: string;
  growthRate: string;
  isVerified: boolean;
  logo: string;
}

export interface BusinessForSale {
  id: string;
  name: string;
  industry: string;
  location: string;
  reasonForSale: string;
  revenue: number;
  profit: number;
  employees: number;
  assets: string[];
  price: number;
  isNegotiable: boolean;
  businessAge: number;
  photos: string[];
  isVerified: boolean;
  summary: string;
}

export interface FranchiseListing {
  id: string;
  brand: string;
  industry: string;
  investmentRange: { min: number; max: number };
  areaRequired: string;
  roiMonths: number;
  supportLevel: 'Basic' | 'Comprehensive' | 'Full';
  trainingProvided: boolean;
  locationsAvailable: string[];
  royaltyPercentage: number;
  logo: string;
  description: string;
}

export interface PartnershipOpportunity {
  id: string;
  title: string;
  type: 'Co-Founder' | 'Investor' | 'Manufacturer' | 'Distributor' | 'Sales' | 'Marketing' | 'Technology' | 'Export';
  description: string;
  location: string;
  requirements: string[];
  postedBy: {
    name: string;
    company: string;
    avatar: string;
  };
  postedAt: string;
}

export interface PitchDeck {
  id: string;
  userId: string;
  title: string;
  version: string;
  url: string;
  lastEdited: string;
  aiScore: number;
  aiReviewSummary: string;
}

export interface BusinessValuationReport {
  id: string;
  businessName: string;
  revenueMultiple: number;
  ebitda: number;
  assetValue: number;
  growthScore: number;
  riskScore: number;
  industryBenchmark: number;
  estimatedValuation: number;
  generatedAt: string;
}
