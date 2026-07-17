import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { logActivity } from '../lib/activity';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

interface UserActivityContextType {
  auditLog: (action: string, category?: 'Business Decision' | 'Document Modification' | 'System', details?: any) => Promise<void>;
  trackEvent: (eventName: string, details?: any) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export function UserActivityProvider({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { error } = useToast();

  const trackEvent = useCallback((eventName: string, details?: any) => {
    if (user) {
      logActivity(user.uid, eventName, details);
    }
  }, [user]);

  const auditLog = useCallback(async (action: string, category: 'Business Decision' | 'Document Modification' | 'System' = 'System', details?: any) => {
    if (user) {
      try {
        await addDoc(collection(db, 'SystemAudits'), {
          action,
          category,
          details,
          actorId: user.email || user.uid,
          actionDescription: `[${category}] ${action} ${details ? '- ' + JSON.stringify(details) : ''}`,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to log audit:', err);
      }
    }
  }, [user]);

  // Track page views
  useEffect(() => {
    if (user) {
      trackEvent('page_view', { path: location.pathname, search: location.search });
    }
  }, [location.pathname, location.search, user, trackEvent]);

  // Inactivity tracking (30 minutes of no interaction)
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;

    const handleInactivityLogout = async () => {
      try {
        await logout();
        error('You have been logged out due to 30 minutes of inactivity to protect sensitive company files.');
        navigate('/login');
      } catch (err) {
        console.error('Failed to log out after inactivity:', err);
      }
    };

    const resetInactivityTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // 30 minutes = 1,800,000 ms
      timeoutId = setTimeout(handleInactivityLogout, 30 * 60 * 1000);
    };

    // Events that signal active user presence
    const userInteractionEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Attach event listeners
    userInteractionEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Start timer on mount/login
    resetInactivityTimer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      userInteractionEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [user, logout, navigate, error]);

  return (
    <UserActivityContext.Provider value={{ trackEvent, auditLog }}>
      {children}
    </UserActivityContext.Provider>
  );
}

export function useUserActivity() {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error('useUserActivity must be used within a UserActivityProvider');
  }
  return context;
}
