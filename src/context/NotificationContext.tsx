import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface Notification {
  link?: string;
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
  isLocal?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addLocalNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt' | 'isLocal'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [dbNotifications, setDbNotifications] = useState<Notification[]>([]);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  const notifications = [...localNotifications, ...dbNotifications].sort((a, b) => {
    const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
    const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
    return timeB - timeA;
  });

  const addLocalNotification = (notif: Omit<Notification, 'id' | 'read' | 'createdAt' | 'isLocal'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      read: false,
      createdAt: Date.now(),
      isLocal: true,
    };
    setLocalNotifications(prev => [newNotif, ...prev]);
    showToast(newNotif.message, newNotif.type === 'error' || newNotif.type === 'alert' ? 'error' : newNotif.type === 'success' ? 'success' : 'info');
  };

  useEffect(() => {
    if (!user) {
      setDbNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    let isFirstLoad = true;

    // Automated milestone deadline check
    const checkDeadlines = async () => {
      try {
        const projectsQuery = query(collection(db, 'client_projects'), where('clientEmail', '==', user.email));
        const projectsSnap = await getDocs(projectsQuery);
        const projectIds = projectsSnap.docs.map(d => d.id);
        
        if (projectIds.length > 0) {
          const now = new Date();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          // Firestore 'in' queries support up to 10 items. Batching for robustness
          const batches = [];
          for (let i = 0; i < projectIds.length; i += 10) {
            batches.push(projectIds.slice(i, i + 10));
          }
          
          for (const batch of batches) {
            const milestonesQuery = query(collection(db, 'project_milestones'), where('projectId', 'in', batch), where('status', '==', 'Pending'));
            const milestonesSnap = await getDocs(milestonesQuery);
            
            milestonesSnap.forEach(docSnap => {
              const milestone = docSnap.data();
              if (milestone.expectedDate) {
                const expectedDate = new Date(milestone.expectedDate);
                const timeDiff = expectedDate.getTime() - now.getTime();
                
                // If approaching within 24 hours and in the future
                if (timeDiff > 0 && timeDiff <= twentyFourHours) {
                   const hoursLeft = Math.ceil(timeDiff / (60 * 60 * 1000));
                   const notifId = `milestone-alert-${docSnap.id}`;
                   
                   // Avoid duplicate notifications in local state
                   setLocalNotifications(prev => {
                     if (prev.some(n => n.id === notifId)) return prev;
                     
                     const newNotif = {
                       id: notifId,
                       type: 'warning',
                       title: 'Approaching Deadline',
                       message: `Milestone "${milestone.title}" is due in ${hoursLeft} hours.`,
                       link: `/projects/${milestone.projectId}`,
                       read: false,
                       createdAt: Date.now(),
                       isLocal: true,
                     };
                     
                     // Use setTimeout to avoid calling showToast during setState
                     setTimeout(() => showToast(newNotif.message, 'warning'), 0);
                     return [newNotif, ...prev];
                   });
                }
              }
            });
          }
        }
      } catch (err) {
        console.error("Failed to check milestone deadlines:", err);
      }
    };
    
    // Check initially and then every hour
    checkDeadlines();
    const intervalId = setInterval(checkDeadlines, 60 * 60 * 1000);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (!isFirstLoad && !data.read) {
            showToast(data.message, data.type === 'error' || data.type === 'alert' ? 'error' : data.type === 'success' ? 'success' : 'info');
          }
        }
      });

      isFirstLoad = false;
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
      setDbNotifications(notifs);
    });

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [user, showToast]);

  const markAsRead = async (id: string) => {
    if (id.startsWith('local_')) {
      setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      return;
    }
    if (!user) return;
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (!user) return;
    const unread = dbNotifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount: notifications.filter(n => !n.read).length, markAsRead, markAllAsRead, addLocalNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
