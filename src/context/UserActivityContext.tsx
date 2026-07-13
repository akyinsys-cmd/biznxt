import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { logActivity } from '../lib/activity';
import { useLocation } from 'react-router-dom';

interface UserActivityContextType {
  trackEvent: (eventName: string, details?: any) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export function UserActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  const trackEvent = useCallback((eventName: string, details?: any) => {
    if (user) {
      logActivity(user.uid, eventName, details);
    }
  }, [user]);

  // Track page views
  useEffect(() => {
    if (user) {
      trackEvent('page_view', { path: location.pathname, search: location.search });
    }
  }, [location.pathname, location.search, user, trackEvent]);

  return (
    <UserActivityContext.Provider value={{ trackEvent }}>
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
