import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, RefreshCcw, ShieldCheck, KeyRound } from 'lucide-react';
import { GlobalErrorView } from './GlobalErrorView';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading, revalidateRole } = useAuth();
  const location = useLocation();
  const [timeoutError, setTimeoutError] = useState(false);
  const [securityError, setSecurityError] = useState(false);
  
  // Local validation states to prevent blank screens and show beautiful loaders
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidationDone, setRevalidationDone] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);
  const [lastUid, setLastUid] = useState(user?.uid);

  // If path or user session changes, reset validation so we re-verify fresh security context
  if (user?.uid !== lastUid || location.pathname !== lastPath) {
    setLastUid(user?.uid);
    setLastPath(location.pathname);
    setRevalidationDone(false);
    setSecurityError(false);
  }

  const isAdminRoute = allowedRoles?.includes('super_admin') || allowedRoles?.includes('manager') || allowedRoles?.includes('bsm');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading || (isAdminRoute && user && !revalidationDone)) {
      timer = setTimeout(() => {
        setTimeoutError(true);
      }, 15000); // 15-second safety timer for deep auth checks
    } else {
      setTimeoutError(false);
    }
    return () => clearTimeout(timer);
  }, [loading, isAdminRoute, user, revalidationDone]);

  useEffect(() => {
    let active = true;
    
    // Only execute forced re-auth and server-side role revalidation for admin/manager routes
    if (!loading && user && isAdminRoute && !revalidationDone && !isRevalidating) {
      const executeSecurityChecks = async () => {
        setIsRevalidating(true);
        console.group('[ProtectedRoute] Initiating Force Re-Authentication Context check...');
        try {
          // 1. Force refresh ID token from Firebase Auth server (Forced Re-Authentication Check)
          console.log('[ProtectedRoute] Forced ID Token refreshing from Firebase servers...');
          await user.getIdToken(true);
          console.log('[ProtectedRoute] Firebase session re-authenticated & verified fresh.');

          // 2. Refresh role from Firestore bypassing local cache
          console.log('[ProtectedRoute] Force fetching fresh role and user record from Firestore server...');
          const freshRole = await revalidateRole();
          console.log(`[ProtectedRoute] Role verified successfully against Firestore. Resolved: "${freshRole}"`);
        } catch (err) {
          console.warn('System Gateway: Secure session verification timed out or encountered a network revalidation issue. Activating protection fallback.');
          setSecurityError(true);
        } finally {
          if (active) {
            setIsRevalidating(false);
            setRevalidationDone(true);
          }
          console.groupEnd();
        }
      };
      
      executeSecurityChecks();
    }
    
    return () => {
      active = false;
    };
  }, [loading, user, isAdminRoute, revalidationDone, isRevalidating, revalidateRole]);

  // Loading or Active Role Re-Validation in progress
  if (securityError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <GlobalErrorView onReset={() => { setSecurityError(false); setRevalidationDone(false); }} />
      </div>
    );
  }

  if (loading || (isAdminRoute && user && !revalidationDone)) {
    if (timeoutError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <GlobalErrorView onReset={() => window.location.reload()} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
        {/* Decorative background visual blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm px-6">
          <div className="relative flex items-center justify-center">
            {/* Double ring loaders */}
            <div className="w-20 h-20 border-4 border-slate-900 border-t-indigo-500 border-b-indigo-500 rounded-full animate-spin" />
            <div className="absolute w-14 h-14 border-2 border-slate-800 border-l-emerald-400 border-r-emerald-400 rounded-full animate-spin direction-reverse" />
            <div className="absolute flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Identity Assurance
            </div>
            <h4 className="text-base font-bold text-slate-100 tracking-tight">Establishing Secure Connection</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Verifying your secure credentials and business permissions with the gateway. Please wait.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Session Status</span>
              <span className="text-indigo-400 font-bold animate-pulse">Establishing Secure Link</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-1">
              Your connection is protected by enterprise-grade token security.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    // Prevent infinite redirect loops by checking current path
    const currentPath = location.pathname;
    
    if (role === 'super_admin') {
      return currentPath.startsWith('/admin') ? <Navigate to="/" replace /> : <Navigate to="/admin" replace />;
    } else if (role === 'manager') {
      return currentPath.startsWith('/bsm') ? <Navigate to="/" replace /> : <Navigate to="/bsm" replace />;
    } else {
      // Default for customers or anyone else
      return currentPath === '/dashboard' ? <Navigate to="/" replace /> : <Navigate to="/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
