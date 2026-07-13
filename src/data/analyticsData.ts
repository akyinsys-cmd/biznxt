import { 
  AnalyticsEvent, 
  BusinessMetric, 
  CustomerJourneyStage, 
  MarketingMetric, 
  FinanceAnalytics, 
  PartnerAnalytics, 
  AIUsageAnalytics 
} from '../types/analytics';

export const RECENT_EVENTS: AnalyticsEvent[] = [
  { id: 'ev-1', category: 'User', name: 'User Signup', userId: 'usr-123', metadata: { source: 'Google Ads' }, timestamp: '2026-07-10T06:45:00Z' },
  { id: 'ev-2', category: 'Research', name: 'Research Started', userId: 'usr-456', metadata: { industry: 'EV' }, timestamp: '2026-07-10T06:40:00Z' },
  { id: 'ev-3', category: 'Payment', name: 'Payment Success', userId: 'usr-789', metadata: { amount: 15000, service: 'Cosmetics Feasibility' }, timestamp: '2026-07-10T06:30:00Z' },
  { id: 'ev-4', category: 'AI', name: 'AI Review Completed', userId: 'usr-123', metadata: { score: 92 }, timestamp: '2026-07-10T06:15:00Z' }
];

export const CORE_METRICS: BusinessMetric = {
  dau: 1250,
  mau: 28000,
  growthRate: 18.5,
  revenue: 8500000,
  aov: 24500,
  ltv: 185000,
  conversionRate: 8.4
};

export const CUSTOMER_JOURNEY: CustomerJourneyStage[] = [
  { stage: 'Visitor', count: 50000, dropOffRate: 0 },
  { stage: 'Signup', count: 12000, dropOffRate: 76 },
  { stage: 'Onboarding', count: 8500, dropOffRate: 29 },
  { stage: 'Discovery', count: 6200, dropOffRate: 27 },
  { stage: 'Research', count: 2400, dropOffRate: 61 },
  { stage: 'Consultation', count: 1200, dropOffRate: 50 },
  { stage: 'Purchase', count: 850, dropOffRate: 29 },
  { stage: 'Launch', count: 340, dropOffRate: 60 },
  { stage: 'Growth', count: 120, dropOffRate: 65 },
  { stage: 'Expansion', count: 45, dropOffRate: 62 }
];

export const MARKETING_METRICS: MarketingMetric[] = [
  { source: 'Google', traffic: 15000, leads: 1200, conversions: 180, costPerLead: 150, costPerCustomer: 1000 },
  { source: 'Meta', traffic: 12000, leads: 950, conversions: 140, costPerLead: 180, costPerCustomer: 1200 },
  { source: 'LinkedIn', traffic: 5000, leads: 600, conversions: 110, costPerLead: 450, costPerCustomer: 2500 },
  { source: 'YouTube', traffic: 8000, leads: 400, conversions: 65, costPerLead: 300, costPerCustomer: 1800 },
  { source: 'Organic', traffic: 20000, leads: 1800, conversions: 240, costPerLead: 0, costPerCustomer: 0 },
];

export const FINANCE_ANALYTICS: FinanceAnalytics = {
  revenueByService: {
    'Market Research': 3200000,
    'Company Registration': 2400000,
    'Trademark Filing': 1200000,
    'GST Services': 850000,
    'Factory Setup': 5800000
  },
  revenueByCategory: {
    'Legal': 4200000,
    'Consulting': 6500000,
    'Research': 4800000,
    'Operations': 3200000
  },
  revenueByRegion: {
    'Maharashtra': 3500000,
    'Gujarat': 2800000,
    'Karnataka': 2200000,
    'Delhi': 1800000,
    'International': 1200000
  },
  outstandingPayments: 1250000,
  partnerCommission: 425000,
  gstSummary: 1530000,
  cashFlow: 3800000
};

export const AI_USAGE: AIUsageAnalytics[] = [
  { featureName: 'Market Insights', requests: 4500, successRate: 99.2, avgResponseTime: 1.2, cost: 180, tokensUsed: 4500000 },
  { featureName: 'Pitch Deck Review', requests: 1200, successRate: 98.5, avgResponseTime: 2.4, cost: 120, tokensUsed: 2800000 },
  { featureName: 'Document Analyzer', requests: 3400, successRate: 99.7, avgResponseTime: 0.8, cost: 95, tokensUsed: 1500000 },
  { featureName: 'Chat Assistant', requests: 12000, successRate: 99.1, avgResponseTime: 0.5, cost: 240, tokensUsed: 8000000 }
];

export const PARTNER_PERFORMANCE: PartnerAnalytics[] = [
  { 
    partnerId: 'p-1', 
    partnerName: 'Vikas Shah (Legal)', 
    responseTime: '1.5 hrs', 
    winRate: 75, 
    completionRate: 98, 
    qualityRating: 4.8, 
    customerRating: 4.9, 
    revenueGenerated: 1200000, 
    slaCompliance: 99 
  },
  { 
    partnerId: 'p-2', 
    partnerName: 'Creative Labs (Marketing)', 
    responseTime: '4 hrs', 
    winRate: 62, 
    completionRate: 92, 
    qualityRating: 4.5, 
    customerRating: 4.6, 
    revenueGenerated: 850000, 
    slaCompliance: 95 
  }
];
