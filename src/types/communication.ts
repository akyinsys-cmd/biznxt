export type ChatRoomType = 'Direct' | 'Group' | 'Project' | 'Support' | 'Manufacturer';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  replyTo?: string;
}

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  name: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    lastSeen?: string;
  }[];
  lastMessage?: ChatMessage;
  projectId?: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  attachments: string[];
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  participants: string[];
  type: 'Discovery' | 'Consultation' | 'Project Review' | 'Sales';
  agenda: string[];
  notes?: string;
  actionItems?: string[];
  recordingUrl?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'System' | 'Payment' | 'Project' | 'Research' | 'Meeting';
  priority: 'High' | 'Normal' | 'Low';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'Message' | 'Meeting' | 'Payment' | 'Report' | 'Task' | 'Status';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
