export type IntelligenceConfidence = 'High' | 'Medium' | 'Low';

export interface IndustryProfile {
  id: string;
  name: string;
  overview: string;
  typicalProducts: string[];
  businessModels: string[];
  investmentRange: { min: number; max: number };
  customerTypes: string[];
  growthFactors: string[];
  challenges: string[];
  regulations: string[];
  relatedIndustries: string[];
  lastUpdated: string;
  confidence: IntelligenceConfidence;
}

export interface LocationProfile {
  id: string;
  name: string;
  type: 'Country' | 'State' | 'District' | 'City' | 'Industrial Area' | 'Business Zone';
  parentLocationId?: string;
  economicIndicators?: Record<string, any>;
  infrastructureNotes: string[];
  connectivity: string;
  relevantIndustries: string[];
  businessClusters: string[];
  confidence: IntelligenceConfidence;
}

export interface ManufacturerIntel {
  id: string;
  name: string;
  industriesServed: string[];
  productionCategories: string[];
  moq: string;
  leadTime: string;
  exportCapability: boolean;
  certifications: string[];
  responseMetric: number; // 0-100
  qualityMetric: number; // 0-100
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
}

export interface MarketTrend {
  id: string;
  title: string;
  category: 'Industry' | 'Service' | 'Location' | 'Product';
  demandLevel: 'High' | 'Increasing' | 'Stable' | 'Decreasing';
  growthPercentage: number;
  description: string;
  lastAnalysis: string;
}

export interface AIRecommendation {
  id: string;
  targetId: string; // ID of the item being recommended
  type: 'Service' | 'Article' | 'Template' | 'Manufacturer' | 'Partner' | 'Report' | 'Path';
  title: string;
  reason: string;
  confidence: number;
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  investmentLevel: 'Low' | 'Medium' | 'High';
  competitionLevel: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
  scalability: number; // 0-10
  demandIndicator: number; // 0-10
  digitalReadiness: number; // 0-10
  verified: boolean;
}
