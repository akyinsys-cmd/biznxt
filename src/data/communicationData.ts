import { ChatRoom, ChatMessage, SupportTicket, Meeting, AppNotification, TimelineEvent } from '../types/communication';

export const CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-1',
    type: 'Project',
    name: 'Cosmetics Brand Launch - Project #102',
    projectId: 'p-102',
    participants: [
      { id: 'usr-1', name: 'Dr. Sarah Khan', role: 'Customer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop' },
      { id: 'usr-2', name: 'Amit Kumar', role: 'Success Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
      { id: 'usr-3', name: 'Vikas Shah', role: 'Legal Expert', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' }
    ],
    lastMessage: {
      id: 'msg-1',
      roomId: 'room-1',
      senderId: 'usr-2',
      senderName: 'Amit Kumar',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
      content: 'I have uploaded the initial trademark search report for your review.',
      timestamp: '2026-07-10T06:30:00Z',
      status: 'read'
    },
    unreadCount: 0,
    isOnline: true
  },
  {
    id: 'room-2',
    type: 'Direct',
    name: 'Manufacturer Support - Apex Pharma',
    participants: [
      { id: 'usr-2', name: 'Amit Kumar', role: 'Success Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
      { id: 'mfg-1', name: 'Rajesh (Apex)', role: 'Manufacturer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop' }
    ],
    lastMessage: {
      id: 'msg-2',
      roomId: 'room-2',
      senderId: 'mfg-1',
      senderName: 'Rajesh (Apex)',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      content: 'What is the MOQ for the new serum formulation?',
      timestamp: '2026-07-10T05:45:00Z',
      status: 'delivered'
    },
    unreadCount: 2
  }
];

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    roomId: 'room-1',
    senderId: 'usr-1',
    senderName: 'Dr. Sarah Khan',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
    content: 'Hi Amit, can we speed up the trademark search?',
    timestamp: '2026-07-10T06:15:00Z',
    status: 'read'
  },
  {
    id: 'm-2',
    roomId: 'room-1',
    senderId: 'usr-2',
    senderName: 'Amit Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    content: 'Yes Sarah, I am coordinating with Vikas. He will upload the report shortly.',
    timestamp: '2026-07-10T06:20:00Z',
    status: 'read'
  },
  {
    id: 'm-3',
    roomId: 'room-1',
    senderId: 'usr-2',
    senderName: 'Amit Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    content: 'I have uploaded the initial trademark search report for your review.',
    timestamp: '2026-07-10T06:30:00Z',
    status: 'read',
    attachments: [
      { name: 'Trademark_Search_v1.pdf', url: '#', type: 'application/pdf' }
    ]
  }
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 't-1001',
    customerId: 'usr-1',
    customerName: 'Dr. Sarah Khan',
    subject: 'Payment failed for FSSAI Registration',
    description: 'Tried paying via UPI but the transaction timed out.',
    priority: 'High',
    status: 'In Progress',
    category: 'Billing',
    assignedTo: 'Neha (Finance)',
    createdAt: '2026-07-09T10:00:00Z',
    updatedAt: '2026-07-10T05:00:00Z',
    slaDeadline: '2026-07-10T14:00:00Z',
    attachments: []
  }
];

export const MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Manufacturing Strategy Session',
    description: 'Finalizing OEM partners for skincare line.',
    startTime: '2026-07-11T11:00:00Z',
    endTime: '2026-07-11T12:00:00Z',
    participants: ['usr-1', 'usr-2', 'mfg-1'],
    type: 'Project Review',
    agenda: [
      'Cost per unit finalization',
      'Quality control standards',
      'Packaging design review'
    ]
  }
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    userId: 'usr-1',
    title: 'Report Ready',
    message: 'Your Market Intelligence report for Cosmetics is now available.',
    type: 'Research',
    priority: 'High',
    isRead: false,
    timestamp: '2026-07-10T06:00:00Z',
    actionUrl: '/intelligence'
  },
  {
    id: 'n-2',
    userId: 'usr-1',
    title: 'Meeting Scheduled',
    message: 'Strategy session with Amit Kumar confirmed for tomorrow.',
    type: 'Meeting',
    priority: 'Normal',
    isRead: true,
    timestamp: '2026-07-09T18:00:00Z'
  }
];

export const CUSTOMER_TIMELINE: TimelineEvent[] = [
  {
    id: 'te-1',
    type: 'Status',
    title: 'Project Initialized',
    description: 'Cosmetics Brand Launch project started.',
    timestamp: '2026-07-01T09:00:00Z'
  },
  {
    id: 'te-2',
    type: 'Payment',
    title: 'Feasibility Fee Paid',
    description: 'Payment of ₹15,000 received successfully.',
    timestamp: '2026-07-02T14:30:00Z'
  },
  {
    id: 'te-3',
    type: 'Report',
    title: 'Market Analysis Delivered',
    description: 'V1 Research report uploaded by Research Team.',
    timestamp: '2026-07-05T11:00:00Z'
  },
  {
    id: 'te-4',
    type: 'Message',
    title: 'Trademark Search Query',
    description: 'Sarah Khan requested expedited trademark search.',
    timestamp: '2026-07-10T06:15:00Z'
  }
];
