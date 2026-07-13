import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { initAuth, logout } from '../lib/auth';
import { db } from '../lib/firebase';

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  userData: null,
  loading: true,
  accessToken: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubUser: (() => void) | null = null;
    let isMounted = true;

    // Safety timeout in case Firebase Auth hangs
    const safetyTimer = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        console.warn('Auth state detection timed out.');
      }
    }, 10000);

    const unsubscribe = initAuth(
      (currentUser, token) => {
        if (!isMounted) return;
        setLoading(true);
        setUser(currentUser);
        setAccessToken(token);
        
        // Dynamic, live listener for user role and profile document in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        
        if (unsubUser) {
          unsubUser();
        }

        unsubUser = onSnapshot(userRef, (snap) => {
          if (!isMounted) return;
          if (snap.exists()) {
            const data = snap.data();
            setRole(data.role as UserRole);
            setUserData(data);
          } else {
            setRole('customer'); // Fallback default
            setUserData({ role: 'customer' });
          }
          setLoading(false);
          clearTimeout(safetyTimer);
        }, (err) => {
          console.error("Firestore error listening to user role:", err);
          if (isMounted) {
            setRole('customer');
            setUserData({ role: 'customer' });
            setLoading(false);
            clearTimeout(safetyTimer);
          }
        });
      },
      () => {
        if (!isMounted) return;
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
    await logout();
    setUser(null);
    setRole(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, userData, loading, accessToken, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
