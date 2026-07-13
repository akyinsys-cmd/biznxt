import { 
  ExecutiveMetrics, 
  BusinessHealth, 
  SalesFunnel, 
  FinanceSummary, 
  AISystemMonitoring, 
  SystemStatus, 
  Alert 
} from '../types/bi';

export const EXECUTIVE_METRICS: ExecutiveMetrics = {
  todayRevenue: 245000,
  monthlyRevenue: 8500000,
  annualRevenue: 98000000,
  activeCustomers: 4500,
  newCustomers: 120,
  activeProjects: 340,
  pendingProjects: 45,
  delayedProjects: 12,
  completedProjects: 1200,
  researchOrders: 85,
  businessLaunchProjects: 12,
  manufacturerLeads: 240,
  importProjects: 34,
  exportProjects: 28,
  premiumReports: 156,
  supportTickets: 18,
  partnerRequests: 42,
  pendingPayments: 1250000,
  refundRequests: 3
};

export const BUSINESS_HEALTH: BusinessHealth = {
  overallScore: 92,
  customerSatisfaction: 4.8,
  nps: 78,
  avgResponseTime: "12 mins",
  avgDeliveryTime: "4.2 days",
  revenueTrend: [45, 52, 48, 61, 58, 72, 85],
  profitTrend: [12, 15, 14, 18, 17, 22, 28],
  growthRate: 24.5,
  conversionRate: 12.4,
  retentionRate: 88,
  churnRate: 2.1,
  repeatCustomers: 65
};

export const SALES_FUNNEL: SalesFunnel = {
  leads: 1200,
  qualified: 850,
  proposal: 420,
  negotiation: 180,
  closed: 120
};

export const FINANCE_SUMMARY: FinanceSummary = {
  revenue: 8500000,
  expenses: 5200000,
  grossProfit: 3300000,
  netProfit: 2100000,
  gst: 1530000,
  partnerCommission: 425000,
  pendingPayments: 1250000,
  cashFlow: 3800000,
  outstanding: 850000
};

export const AI_MONITORING: AISystemMonitoring = {
  geminiRequests: 12450,
  successRate: 99.8,
  avgResponseTime: 1.2,
  cost: 450,
  tokenUsage: 8500000,
  errors: 24
};

export const SYSTEM_STATUS: SystemStatus = {
  firebase: 'online',
  firestore: 'online',
  storage: 'online',
  auth: 'online',
  paymentGateway: 'online',
  emailService: 'online',
  whatsappService: 'degraded'
};

export const ALERTS: Alert[] = [
  {
    id: 'alt-1',
    type: 'critical',
    title: 'Server Load High',
    message: 'CPU usage exceeded 90% on primary database node.',
    timestamp: '2026-07-10T06:15:00Z',
    status: 'pending'
  },
  {
    id: 'alt-2',
    type: 'payment',
    title: 'High Failure Rate',
    message: 'Razorpay webhook errors detected for subscription renewals.',
    timestamp: '2026-07-10T05:45:00Z',
    status: 'pending'
  },
  {
    id: 'alt-3',
    type: 'security',
    title: 'Suspicious Login',
    message: 'Multiple failed login attempts from unknown IP: 192.168.1.1',
    timestamp: '2026-07-10T04:20:00Z',
    status: 'resolved'
  }
];

export const REVENUE_CHART_DATA = [
  { month: 'Jan', revenue: 4500000, profit: 1200000 },
  { month: 'Feb', revenue: 5200000, profit: 1500000 },
  { month: 'Mar', revenue: 4800000, profit: 1400000 },
  { month: 'Apr', revenue: 6100000, profit: 1800000 },
  { month: 'May', revenue: 5800000, profit: 1700000 },
  { month: 'Jun', revenue: 7200000, profit: 2200000 },
  { month: 'Jul', revenue: 8500000, profit: 2800000 }
];

export const SERVICE_PERFORMANCE = [
  { name: 'Company Registration', revenue: 2400000, units: 120 },
  { name: 'GST Filing', revenue: 850000, units: 450 },
  { name: 'Trademark Filing', revenue: 1200000, units: 85 },
  { name: 'Market Research', revenue: 3200000, units: 45 },
  { name: 'Factory Setup', revenue: 5800000, units: 12 }
];

export const GEO_DATA = [
  { city: 'Mumbai', value: 850, type: 'Customer' },
  { city: 'Delhi', value: 720, type: 'Customer' },
  { city: 'Bangalore', value: 650, type: 'Customer' },
  { city: 'Surat', value: 420, type: 'Manufacturer' },
  { city: 'Ahmedabad', value: 380, type: 'Manufacturer' },
  { city: 'Dubai', value: 120, type: 'Partner' },
  { city: 'Singapore', value: 45, type: 'Partner' }
];
