import { 
  IndustryProfile, 
  LocationProfile, 
  ManufacturerIntel, 
  MarketTrend, 
  AIRecommendation,
  BusinessOpportunity
} from '../types/intelligence';

export const INDUSTRIES: IndustryProfile[] = [
  {
    id: 'ind-cosmetics',
    name: 'Cosmetics & Personal Care',
    overview: 'High-growth sector driven by D2C brands and herbal formulations.',
    typicalProducts: ['Serums', 'Shampoos', 'Face Washes', 'Lipsticks'],
    businessModels: ['Private Label', 'OEM', 'D2C Brand'],
    investmentRange: { min: 2500000, max: 20000000 },
    customerTypes: ['Retail Consumers', 'Salons', 'Spas'],
    growthFactors: ['Increasing Grooming Awareness', 'E-commerce Expansion'],
    challenges: ['Regulatory Compliance', 'Raw Material Price Volatility'],
    regulations: ['Drugs & Cosmetics Act', 'GMP'],
    relatedIndustries: ['Packaging', 'Chemicals', 'Logistics'],
    lastUpdated: '2026-07-01',
    confidence: 'High'
  },
  {
    id: 'ind-ev',
    name: 'Electric Vehicles (EV)',
    overview: 'Emerging industry supported by heavy government subsidies and green initiatives.',
    typicalProducts: ['2-Wheelers', '3-Wheelers', 'Charging Stations', 'Battery Packs'],
    businessModels: ['Assembly', 'Manufacturing', 'Charging Infrastructure'],
    investmentRange: { min: 50000000, max: 500000000 },
    customerTypes: ['Urban Commuters', 'Logistics Firms'],
    growthFactors: ['FAME-II Subsidies', 'Rising Fuel Costs'],
    challenges: ['Battery Tech Dependency', 'Infrastructure Gaps'],
    regulations: ['AIS 156 Standards', 'GST 5%'],
    relatedIndustries: ['Electronics', 'Automotive Components', 'Power'],
    lastUpdated: '2026-07-05',
    confidence: 'Medium'
  }
];

export const LOCATIONS: LocationProfile[] = [
  {
    id: 'loc-surat',
    name: 'Surat',
    type: 'City',
    economicIndicators: { gdpGrowth: '8.5%', industrialOutput: 'High' },
    infrastructureNotes: ['Large Textile Clusters', 'Diamond Bourses', 'Port Proximity'],
    connectivity: 'Excellent via Rail and Sea (Hazira Port)',
    relevantIndustries: ['Textiles', 'Diamonds', 'Chemicals'],
    businessClusters: ['GIDC Pandesara', 'Sachin Industrial Estate'],
    confidence: 'High'
  },
  {
    id: 'loc-bangalore',
    name: 'Bangalore',
    type: 'City',
    economicIndicators: { gdpGrowth: '9.2%', techOutput: 'Very High' },
    infrastructureNotes: ['IT Parks', 'Electronic City', 'Aerospace Hub'],
    connectivity: 'Global Air Hub, Rapid Metro Expansion',
    relevantIndustries: ['SaaS', 'Electronics', 'Aerospace', 'AI'],
    businessClusters: ['Whitefield', 'Electronic City Phase 1 & 2'],
    confidence: 'High'
  }
];

export const MANUFACTURERS: ManufacturerIntel[] = [
  {
    id: 'mfg-1',
    name: 'Apex Pharma & Cosmetics',
    industriesServed: ['Cosmetics', 'Pharma'],
    productionCategories: ['Creams', 'Serums', 'Tablets'],
    moq: '5,000 units',
    leadTime: '30-45 days',
    exportCapability: true,
    certifications: ['ISO 9001', 'GMP', 'FDA'],
    responseMetric: 92,
    qualityMetric: 95,
    verificationStatus: 'Verified'
  }
];

export const TRENDS: MarketTrend[] = [
  {
    id: 'trend-1',
    title: 'Rise of Natural Serums',
    category: 'Product',
    demandLevel: 'High',
    growthPercentage: 35,
    description: 'Significant shift towards active-based natural serums in urban markets.',
    lastAnalysis: '2026-06-30'
  },
  {
    id: 'trend-2',
    title: 'EV Retrofitting Services',
    category: 'Service',
    demandLevel: 'Increasing',
    growthPercentage: 55,
    description: 'Converting existing ICE vehicles to EV is becoming popular in the 3-wheeler segment.',
    lastAnalysis: '2026-07-08'
  }
];

export const RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'rec-1',
    targetId: 'ind-cosmetics',
    type: 'Report',
    title: 'Cosmetics Manufacturing Feasibility Report',
    reason: 'Based on your interest in Manufacturing and recent trends in Surat location.',
    confidence: 0.95
  }
];

export const OPPORTUNITIES: BusinessOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Customized EV Charging Network',
    investmentLevel: 'High',
    competitionLevel: 'Medium',
    complexity: 'High',
    scalability: 9,
    demandIndicator: 8.5,
    digitalReadiness: 9,
    verified: true
  },
  {
    id: 'opp-2',
    title: 'Private Label Organic Skincare',
    investmentLevel: 'Medium',
    competitionLevel: 'High',
    complexity: 'Medium',
    scalability: 8,
    demandIndicator: 9.2,
    digitalReadiness: 7,
    verified: true
  }
];
