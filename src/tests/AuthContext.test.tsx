// @vitest-environment jsdom
import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as authLib from '../lib/auth';

// Mock the Firebase imports to prevent errors
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {
    currentUser: null,
  },
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
}));

vi.mock('../lib/auth', () => ({
  initAuth: vi.fn(),
  logout: vi.fn(),
  getRoleFromEmail: vi.fn((email: string) => {
    if (email.endsWith('@biznxt.io')) return 'super_admin';
    return 'customer';
  }),
}));

const TestComponent = () => {
  const { user, role, loading } = useAuth();
  if (loading) return <div data-testid="loading">Loading...</div>;
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <div data-testid="role">{role || 'No Role'}</div>
    </div>
  );
};

describe('AuthProvider Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('provides null user and null role initially when logged out', async () => {
    vi.mocked(authLib.initAuth).mockImplementation((onAuth, onUnauth) => {
      // Immediately invoke unauth to simulate no active session
      onUnauth();
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('No User');
    expect(screen.getByTestId('role').textContent).toBe('No Role');
  });

  test('resolves user and role based on email when logged in', async () => {
    vi.mocked(authLib.initAuth).mockImplementation((onAuth, onUnauth) => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'admin@biznxt.io',
        emailVerified: true,
        metadata: {},
      };
      // Simulate auth change with token
      onAuth(mockUser as any, 'mock-token');
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // After loading resolves
    expect(screen.getByTestId('user').textContent).toBe('admin@biznxt.io');
    expect(screen.getByTestId('role').textContent).toBe('super_admin');
  });
});
