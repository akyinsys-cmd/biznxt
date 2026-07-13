import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../lib/activity';
import { useLocation } from 'react-router-dom';

export function useActivityTracker() {
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

  return { trackEvent };
}
