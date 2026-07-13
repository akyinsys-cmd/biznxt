import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const [timeoutError, setTimeoutError] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setTimeoutError(true);
      }, 10000);
    } else {
      setTimeoutError(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    if (timeoutError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Connection Timeout</h3>
            <p className="text-sm text-slate-500 mb-4">Something went wrong while verifying your identity. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-2xl animate-spin" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    // If we require client and they are customer, let them through
    if (allowedRoles.includes('client') && role === 'customer') {
      // allow
    } else {
      // Prevent infinite redirect loops by checking current path
      const currentPath = location.pathname;
      if (role === 'admin' || role === 'superadmin') {
        return currentPath === '/admin' ? <Navigate to="/" replace /> : <Navigate to="/admin" replace />;
      } else if (role === 'bsm') {
        return currentPath === '/bsm' ? <Navigate to="/" replace /> : <Navigate to="/bsm" replace />;
      } else if (role === 'researcher') {
        return currentPath === '/premium-research-executive' ? <Navigate to="/" replace /> : <Navigate to="/premium-research-executive" replace />;
      } else {
        return currentPath === '/dashboard' ? <Navigate to="/" replace /> : <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
