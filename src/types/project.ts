export type ProjectStatus = 'Active' | 'Completed' | 'Pending' | 'On Hold' | 'Cancelled' | 'Quotation Pending';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'In Review' | 'Completed' | 'Blocked';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Extreme' | 'Critical';
export type DocumentStatus = 'Pending Upload' | 'Under Review' | 'Approved' | 'Rejected' | 'Revision Requested';

export interface ProjectWorkflow {
  id: string;
  name: string;
  stages: string[];
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  businessName: string;
  businessIdea?: string;
  businessCategory?: string;
  investmentAmount?: string;
  location?: string;
  currentTimelineStep: 'Research' | 'Quotation' | 'Documentation' | 'Registration' | 'Branding' | 'Manufacturer' | 'Website' | 'Marketing' | 'Launch' | 'Growth';
  bsmId: string;
  bsmName?: string;
  status: ProjectStatus;
  progress: number;
  businessScore?: number;
  businessHealth?: 'Healthy' | 'Warning' | 'Critical';
  totalBudget?: number;
  totalPaid?: number;
  totalPending?: number;
  researchReportId?: string;
  createdAt: any;
  updatedAt: any;
  team?: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
}

export interface Quotation {
  id: string;
  projectId: string;
  customerId: string;
  title: string;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  createdAt: any;
  items?: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  name: string;
  price: number;
  gst: number;
  timeline: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedRole?: string;
  status: TaskStatus;
  priority: ProjectPriority;
  deadline: string;
  reminderAt?: string;
  completionPercentage: number;
  dependencies?: string[];
  checklist: { item: string; completed: boolean }[];
  attachments?: { name: string; url: string }[];
  createdAt: any;
}

export interface ProjectMeeting {
  id: string;
  projectId: string;
  bsmId: string;
  clientId: string;
  title: string;
  dateTime: string;
  platform: 'Google Meet' | 'Zoom' | 'WhatsApp' | 'Phone';
  meetingLink?: string;
  meetingNotes?: string;
  actionItems?: string[];
  followUpDate?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
}

export interface CustomerDocument {
  id: string;
  projectId: string;
  clientId: string;
  name: string;
  type: 'GST' | 'Trademark' | 'Logo' | 'Contract' | 'Certificate' | 'Marketing' | 'Business Plan' | 'ID Proof' | 'Address Proof' | 'Other';
  url: string;
  status: DocumentStatus;
  requestedBy: string;
  revisionNotes?: string;
  version: number;
  uploadedAt?: string;
}

export interface BSMDetails {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  assignedCount: number;
  activeProjects: number;
  kpiCompleted: number;
  kpiCsat: number;
  kpiRevenue: number;
  taskCompletionRate: number;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: 'Task' | 'Meeting' | 'Document' | 'Timeline' | 'Payment' | 'Note' | 'System';
  description: string;
  actorId: string;
  actorName: string;
  metadata?: any;
  timestamp: any;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  expectedDate: string;
  actualDate?: string;
  status: 'Pending' | 'Completed';
  isPaymentMilestone: boolean;
  approvalRequired: boolean;
}

export interface ProjectRisk {
  id: string;
  projectId: string;
  type: string;
  description: string;
  level: RiskLevel;
  resolved: boolean;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}
