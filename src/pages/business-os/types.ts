/**
 * Firestore Database collection schemas for BizNxt Business OS 3.0
 */

export interface BusinessProfile {
  id?: string;
  ownerId: string;
  businessName: string;
  businessCategory: string;
  industry: string;
  gst: string;
  pan: string;
  msme: string;
  iec: string;
  trademarkStatus: 'Not Applied' | 'In Progress' | 'Registered' | 'Opposed';
  employees: number;
  office: string;
  factory: string;
  warehouse: string;
  website: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  timeline: {
    date: string;
    title: string;
    description: string;
  }[];
  updatedAt: string;
}

export interface BusinessGoal {
  id?: string;
  ownerId: string;
  monthlyRevenueGoal: number;
  monthlyRevenueCurrent: number;
  annualRevenueGoal: number;
  annualRevenueCurrent: number;
  expansionGoal: string;
  hiringGoal: string;
  fundingGoal: string;
  exportGoal: string;
  brandGoal: string;
  completionPercentage: number;
  updatedAt: string;
}

export type ProjectType =
  | 'Research Project'
  | 'Manufacturing Project'
  | 'Website Project'
  | 'Marketing Project'
  | 'GST Project'
  | 'Trademark Project'
  | 'Loan Project'
  | 'Import Project'
  | 'Export Project'
  | 'Expansion Project';

export interface BusinessProject {
  id?: string;
  ownerId: string;
  name: string;
  type: ProjectType;
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';
  team: string[];
  timeline: {
    phase: string;
    deadline: string;
    status: 'pending' | 'completed';
  }[];
  createdAt: string;
}

export interface BusinessTask {
  id?: string;
  ownerId: string;
  projectId?: string; // Links to business_projects
  taskName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  assignedPerson: string;
  checklist: {
    text: string;
    done: boolean;
  }[];
  attachments: string[];
  dependencies: string[];
  progress: number; // 0 to 100
  status: 'Pending' | 'In Progress' | 'Completed';
  calendarIntegration: boolean;
  createdAt: string;
}

export interface BusinessDocument {
  id?: string;
  ownerId: string;
  name: string;
  category: 'GST' | 'PAN' | 'IEC' | 'Trademark' | 'Business Registration' | 'Invoice' | 'Research Report' | 'Business Plan' | 'Contract' | 'Certificate';
  url: string;
  uploadedAt: string;
  version: number;
  history: {
    version: number;
    url: string;
    uploadedAt: string;
    changedBy: string;
  }[];
}

export interface CalendarEvent {
  id?: string;
  ownerId: string;
  title: string;
  type: 'Meeting' | 'Call' | 'Task Deadline' | 'Document Renewal' | 'Business Event' | 'Reminder';
  dateTime: string;
  description: string;
  reminderSent: boolean;
  googleCalendarSynced: boolean;
}

export interface FinanceRecord {
  id?: string;
  ownerId: string;
  type: 'Expense' | 'Revenue' | 'Service Payment' | 'Invoice';
  category: string;
  amount: number;
  status: 'Pending' | 'Completed';
  dueDate?: string;
  description: string;
  createdAt: string;
}

export interface BusinessNotification {
  id?: string;
  ownerId: string;
  type: 'Document Expiry' | 'GST Reminder' | 'Trademark Reminder' | 'Meeting Reminder' | 'Task Reminder' | 'Payment Reminder' | 'Report Ready' | 'New Recommendation';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface BusinessActivity {
  id?: string;
  ownerId: string;
  action: string;
  module: string;
  details: string;
  createdAt: string;
}

export interface BusinessHealth {
  id?: string;
  ownerId: string;
  healthScore: number; // 0 - 100
  readinessScore: number; // 0 - 100
  growthIndex: number; // 0 - 100
  riskAlerts: {
    type: 'High' | 'Medium' | 'Low';
    message: string;
  }[];
  growthOpportunities: string[];
  updatedAt: string;
}
