import { Project, ProjectTask, ProjectMilestone, ProjectRisk, ProjectDocument } from '../types/project';

export const PROJECTS: Project[] = [
  {
    id: 'prj-102',
    title: 'Cosmetics Brand Launch - Sarah Khan',
    clientId: 'usr-1',
    clientName: 'Dr. Sarah Khan',
    clientEmail: 'sarah@example.com',
    businessName: 'Khan Cosmetics',
    currentTimelineStep: 'Registration',
    bsmId: 'usr-2',
    bsmName: 'Amit Kumar',
    status: 'Active',
    progress: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    team: [
      { id: 'usr-2', name: 'Amit Kumar', role: 'Success Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
      { id: 'usr-4', name: 'Neha Gupta', role: 'Research Executive', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
      { id: 'usr-3', name: 'Vikas Shah', role: 'Legal Expert', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' }
    ]
  },
  {
    id: 'prj-105',
    title: 'EV Charging Network Feasibility',
    clientId: 'usr-5',
    clientName: 'Rahul Mehta',
    clientEmail: 'rahul@example.com',
    businessName: 'EcoCharge',
    currentTimelineStep: 'Research',
    bsmId: 'usr-2',
    bsmName: 'Amit Kumar',
    status: 'Active',
    progress: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    team: [
      { id: 'usr-2', name: 'Amit Kumar', role: 'Success Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
      { id: 'usr-4', name: 'Neha Gupta', role: 'Research Executive', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }
    ]
  }
];

export const PROJECT_TASKS: ProjectTask[] = [
  {
    id: 'tsk-1',
    projectId: 'prj-102',
    title: 'Trademark Search & Filing',
    description: 'Complete comprehensive trademark search and file application for brand name.',
    assignedTo: 'Vikas Shah',
    assignedRole: 'Legal Expert',
    status: 'In Review',
    priority: 'High',
    deadline: '2026-07-15',
    completionPercentage: 90,
    checklist: [
      { item: 'Check class 3 availability', completed: true },
      { item: 'Verify international conflicts', completed: true },
      { item: 'Draft application', completed: true },
      { item: 'Submit to Registry', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tsk-2',
    projectId: 'prj-102',
    title: 'OEM Partner Selection',
    description: 'Finalize manufacturer from short-listed vendors based on quality audit.',
    assignedTo: 'Amit Kumar',
    assignedRole: 'Success Manager',
    status: 'In Progress',
    priority: 'Medium',
    deadline: '2026-07-20',
    completionPercentage: 45,
    checklist: [
      { item: 'Audit report review', completed: true },
      { item: 'Price negotiation', completed: false },
      { item: 'Contract signing', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export const PROJECT_MILESTONES: ProjectMilestone[] = [
  {
    id: 'mil-1',
    projectId: 'prj-102',
    title: 'Planning Phase Completion',
    expectedDate: '2026-07-05',
    actualDate: '2026-07-04',
    status: 'Completed',
    isPaymentMilestone: false,
    approvalRequired: true
  },
  {
    id: 'mil-2',
    projectId: 'prj-102',
    title: 'Manufacturer Onboarding',
    expectedDate: '2026-07-25',
    status: 'Pending',
    isPaymentMilestone: true,
    approvalRequired: true
  }
];

export const PROJECT_RISKS: ProjectRisk[] = [
  {
    id: 'rsk-1',
    projectId: 'prj-102',
    type: 'Quality',
    description: 'Initial samples from Apex Pharma showed 5% consistency variance.',
    level: 'Medium',
    resolved: false
  }
];

export const PROJECT_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'doc-1',
    projectId: 'prj-102',
    name: 'Market_Research_v1.pdf',
    type: 'Report',
    url: '#',
    uploadedAt: '2026-07-05T10:00:00Z'
  },
  {
    id: 'doc-2',
    projectId: 'prj-102',
    name: 'Trademark_Search_Results.pdf',
    type: 'Design',
    url: '#',
    uploadedAt: '2026-07-10T06:30:00Z'
  }
];
