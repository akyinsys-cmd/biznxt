export type EventCategory = 'User' | 'Research' | 'Service' | 'Payment' | 'Knowledge' | 'Support' | 'Partner' | 'AI';

export interface AnalyticsEvent {
  id: string;
  category: EventCategory;
  name: string;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface BusinessMetric {
  dau: number;
  mau: number;
  growthRate: number;
  revenue: number;
  aov: number; // Average Order Value
  ltv: number; // Lifetime Value
  conversionRate: number;
}

export interface CustomerJourneyStage {
  stage: 'Visitor' | 'Signup' | 'Onboarding' | 'Discovery' | 'Research' | 'Consultation' | 'Purchase' | 'Launch' | 'Growth' | 'Expansion';
  count: number;
  dropOffRate: number;
}

export interface MarketingMetric {
  source: 'Google' | 'Meta' | 'Instagram' | 'LinkedIn' | 'YouTube' | 'WhatsApp' | 'Referral' | 'Organic';
  traffic: number;
  leads: number;
  conversions: number;
  costPerLead: number;
  costPerCustomer: number;
}

export interface FinanceAnalytics {
  revenueByService: Record<string, number>;
  revenueByCategory: Record<string, number>;
  revenueByRegion: Record<string, number>;
  outstandingPayments: number;
  partnerCommission: number;
  gstSummary: number;
  cashFlow: number;
}

export interface PartnerAnalytics {
  partnerId: string;
  partnerName: string;
  responseTime: string;
  winRate: number;
  completionRate: number;
  qualityRating: number;
  customerRating: number;
  revenueGenerated: number;
  slaCompliance: number;
}

export interface AIUsageAnalytics {
  featureName: string;
  requests: number;
  successRate: number;
  avgResponseTime: number;
  cost: number;
  tokensUsed: number;
}
