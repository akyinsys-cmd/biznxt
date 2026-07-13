export interface ExecutiveMetrics {
  todayRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  activeCustomers: number;
  newCustomers: number;
  activeProjects: number;
  pendingProjects: number;
  delayedProjects: number;
  completedProjects: number;
  researchOrders: number;
  businessLaunchProjects: number;
  manufacturerLeads: number;
  importProjects: number;
  exportProjects: number;
  premiumReports: number;
  supportTickets: number;
  partnerRequests: number;
  pendingPayments: number;
  refundRequests: number;
}

export interface BusinessHealth {
  overallScore: number;
  customerSatisfaction: number;
  nps: number;
  avgResponseTime: string;
  avgDeliveryTime: string;
  revenueTrend: number[];
  profitTrend: number[];
  growthRate: number;
  conversionRate: number;
  retentionRate: number;
  churnRate: number;
  repeatCustomers: number;
}

export interface SalesFunnel {
  leads: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  closed: number;
}

export interface FinanceSummary {
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  gst: number;
  partnerCommission: number;
  pendingPayments: number;
  cashFlow: number;
  outstanding: number;
}

export interface AISystemMonitoring {
  geminiRequests: number;
  successRate: number;
  avgResponseTime: number;
  cost: number;
  tokenUsage: number;
  errors: number;
}

export interface SystemStatus {
  firebase: 'online' | 'degraded' | 'offline';
  firestore: 'online' | 'degraded' | 'offline';
  storage: 'online' | 'degraded' | 'offline';
  auth: 'online' | 'degraded' | 'offline';
  paymentGateway: 'online' | 'degraded' | 'offline';
  emailService: 'online' | 'degraded' | 'offline';
  whatsappService: 'online' | 'degraded' | 'offline';
}

export interface Alert {
  id: string;
  type: 'critical' | 'security' | 'payment' | 'system' | 'customer';
  title: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}
