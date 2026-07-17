import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDocFromServer, onSnapshot } from 'firebase/firestore';
import { initAuth, logout, getRoleFromEmail } from '../lib/auth';
import { db, auth } from '../lib/firebase';

export type UserRole = 
  | 'customer' 
  | 'manager' 
  | 'super_admin' 
  | 'bsm'
  | 'researcher'
  | 'consultant'
  | 'ca'
  | 'lawyer'
  | 'manufacturer'
  | 'marketing'
  | 'websiteteam'
  | 'finance'
  | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  userData: any;
  loading: boolean;
  accessToken: string | null;
  logout: () => Promise<void>;
  revalidateRole: () => Promise<UserRole>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  userData: null,
  loading: true,
  accessToken: null,
  logout: async () => {},
  revalidateRole: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Forced role revalidation against Firestore
  const revalidateRole = async (): Promise<UserRole> => {
    if (!auth.currentUser) {
      console.warn('[AuthContext] revalidateRole called, but no active Firebase user is logged in.');
      return null;
    }
    
    console.group(`[AuthContext] revalidateRole: Forced Re-Validation for UID: ${auth.currentUser.uid}`);
    console.log('Initiating server-side fetch to bypass cache...');
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDocFromServer(userRef);
      
      if (snap.exists()) {
        const data = snap.data();
        const freshRole = data.role as UserRole;
        console.log(`Successfully retrieved fresh role: "${freshRole}"`);
        setRole(freshRole);
        setUserData(data);
        console.groupEnd();
        return freshRole;
      } else {
        console.warn(`No user document found in Firestore for UID ${auth.currentUser.uid}.`);
        const fallbackRole = getRoleFromEmail(auth.currentUser.email || '');
        console.log(`Falling back to email-derived role: "${fallbackRole}"`);
        setRole(fallbackRole);
        setUserData({ role: fallbackRole });
        console.groupEnd();
        return fallbackRole;
      }
    } catch (err: any) {
      console.error('Firestore server role re-validation failed:', err);
      const fallbackRole = getRoleFromEmail(auth.currentUser.email || '');
      console.log(`Falling back on local email-derived role resolution: "${fallbackRole}"`);
      setRole(fallbackRole);
      console.groupEnd();
      return fallbackRole;
    }
  };

  useEffect(() => {
    let unsubUser: (() => void) | null = null;
    let isMounted = true;

    // Safety timeout in case Firebase Auth hangs
    const safetyTimer = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        console.warn('[AuthContext] Auth state detection timed out after 10s.');
      }
    }, 10000);

    const unsubscribe = initAuth(
      (currentUser, token) => {
        if (!isMounted) return;
        
        console.group('[AuthContext] Firebase Auth State Changed - User Detected');
        console.log(`UID: ${currentUser.uid}`);
        console.log(`Email: ${currentUser.email || 'N/A'}`);
        console.log(`Email Verified: ${currentUser.emailVerified}`);
        console.log(`Anonymous Session: ${currentUser.isAnonymous}`);
        console.log(`Provider Data:`, currentUser.providerData?.map(p => ({
          providerId: p.providerId,
          email: p.email,
          uid: p.uid
        })));
        console.log(`Metadata - Created: ${currentUser.metadata.creationTime}`);
        console.log(`Metadata - Last Login: ${currentUser.metadata.lastSignInTime}`);
        console.groupEnd();

        setLoading(true); // Set loading to true while fetching role from Firestore
        setUser(currentUser);
        setAccessToken(token);
        
        // Dynamic, live listener for user role and profile document in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        
        if (unsubUser) {
          unsubUser();
        }

        unsubUser = onSnapshot(userRef, (snap) => {
          if (!isMounted) return;
          
          console.group('[AuthContext] Firestore User Profile Document Snapshot');
          if (snap.exists()) {
            const data = snap.data();
            console.log(`Profile doc exists. Assigned Role: "${data.role}"`);
            console.log('Profile Document Fields:', data);
            setRole(data.role as UserRole);
            setUserData(data);
          } else {
            console.warn(`No Firestore document found for UID: ${currentUser.uid}.`);
            const fallbackRole = getRoleFromEmail(currentUser.email || '');
            console.log(`Applying fallback email-derived role: "${fallbackRole}"`);
            setRole(fallbackRole);
            setUserData({ role: fallbackRole });
          }
          console.groupEnd();
          setLoading(false);
          clearTimeout(safetyTimer);
        }, (err) => {
          console.error("[AuthContext] Firestore realtime snapshot listener error:", err);
          if (isMounted) {
            const fallbackRole = getRoleFromEmail(currentUser.email || '');
            setRole(fallbackRole);
            setUserData({ role: fallbackRole });
            setLoading(false);
            clearTimeout(safetyTimer);
          }
        });
      },
      () => {
        if (!isMounted) return;
        console.log('[AuthContext] Firebase Auth State Changed - No active session (unauthenticated).');
        if (unsubUser) {
          unsubUser();
          unsubUser = null;
        }
        setUser(null);
        setRole(null);
        setUserData(null);
        setAccessToken(null);
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
      if (unsubUser) {
        unsubUser();
      }
    };
  }, []);

  const handleLogout = async () => {
    console.log('[AuthContext] Initiating logout request...');
    await logout();
    setUser(null);
    setRole(null);
    setAccessToken(null);
    setUserData(null);
    console.log('[AuthContext] Logout complete. Context state cleared.');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      userData, 
      loading, 
      accessToken, 
      logout: handleLogout,
      revalidateRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
