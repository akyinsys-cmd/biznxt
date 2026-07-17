// @vitest-environment jsdom
import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import * as AuthContext from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  AlertTriangle: () => null,
  RefreshCcw: () => null,
  ShieldCheck: () => null,
  KeyRound: () => null,
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders security verification loading screen when auth is loading', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      role: null,
      userData: null,
      loading: true,
      accessToken: null,
      logout: async () => {},
      revalidateRole: async () => null,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute allowedRoles={['super_admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Verifying Fresh Session')).toBeDefined();
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  test('redirects to login when user is unauthenticated', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      role: null,
      userData: null,
      loading: false,
      accessToken: null,
      logout: async () => {},
      revalidateRole: async () => null,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute allowedRoles={['super_admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  test('renders children when user has allowed role', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: {
        uid: '123',
        email: 'admin@biznxt.io',
        getIdToken: vi.fn().mockResolvedValue('token')
      } as any,
      role: 'super_admin',
      userData: { role: 'super_admin' },
      loading: false,
      accessToken: 'token',
      logout: async () => {},
      revalidateRole: vi.fn().mockResolvedValue('super_admin'),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute allowedRoles={['super_admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('protected-content').textContent).toBe('Protected Content');
    });
  });

  test('redirects user when they lack permitted role', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: {
        uid: '456',
        email: 'customer@biznxt.io',
        getIdToken: vi.fn().mockResolvedValue('token')
      } as any,
      role: 'customer',
      userData: { role: 'customer' },
      loading: false,
      accessToken: 'token',
      logout: async () => {},
      revalidateRole: vi.fn().mockResolvedValue('customer'),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <ProtectedRoute allowedRoles={['super_admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Wait for the verification loader to finish
    await waitFor(() => {
      expect(screen.queryByText('Verifying Fresh Session')).toBeNull();
    });

    // The protected content must not be rendered
    expect(screen.queryByTestId('protected-content')).toBeNull();
  });
});
