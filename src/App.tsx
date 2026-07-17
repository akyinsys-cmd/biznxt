/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { PageLoader } from './components/PageLoader';
import { Layout } from './components/Layout';

const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/business-os/index'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Services = React.lazy(() => import('./pages/Services'));
const SmartCalendar = React.lazy(() => import('./pages/SmartCalendar'));
const Partners = React.lazy(() => import('./pages/Partners'));

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserActivityProvider } from './context/UserActivityContext';
import { ThemeProvider } from './context/ThemeContext';
import { CommandPalette } from './components/CommandPalette';
import { FirstLoginWizard } from './components/widgets/FirstLoginWizard';

const Settings = React.lazy(() => import('./pages/Settings'));
const CRM = React.lazy(() => import('./pages/CRM'));
const CEOCommandCenter = React.lazy(() => import('./pages/CEOCommandCenter'));
const MarketIntelligence = React.lazy(() => import('./pages/MarketIntelligence'));
const AnalyticsPlatform = React.lazy(() => import('./pages/AnalyticsPlatform'));
const CommunicationHub = React.lazy(() => import('./pages/CommunicationHub'));
const SupportCenter = React.lazy(() => import('./pages/SupportCenter'));
const ProjectList = React.lazy(() => import('./pages/ProjectList'));
const ProjectDashboard = React.lazy(() => import('./pages/ProjectDashboard'));
const BSMDashboard = React.lazy(() => import('./pages/BSMDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));

import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkStatus } from './components/NetworkStatus';
import { GlobalErrorView } from './components/GlobalErrorView';

const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const Careers = React.lazy(() => import('./pages/Careers'));

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
      <Helmet>
        <title>BizNxt - Business Operating System</title>
        <meta name="description" content="The unified platform to manage and grow your business." />
      </Helmet>
      <BrowserRouter>
        <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <UserActivityProvider>
              <NotificationProvider>
                <NetworkStatus />
                <CommandPalette />
                <FirstLoginWizard />
                <Suspense fallback={<PageLoader />}>
                <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Landing />} />
                  <Route path="about" element={<AboutUs />} />
                  <Route path="contact" element={<ContactUs />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="careers" element={<Careers />} />
                  
                  <Route path="command-center" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <CEOCommandCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="intelligence" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <MarketIntelligence />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <AnalyticsPlatform />
                    </ProtectedRoute>
                  } />
                  <Route path="communication" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <CommunicationHub />
                    </ProtectedRoute>
                  } />
                  <Route path="support" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <SupportCenter />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="projects" element={<ProtectedRoute allowedRoles={['customer', 'manager', 'super_admin']} />}>
                    <Route index element={<ProjectList />} />
                    <Route path=":id" element={<ProjectDashboard />} />
                  </Route>
                  
                  <Route path="bsm" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <BSMDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="admin" element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="calendar" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <SmartCalendar />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="crm" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'manager']}>
                      <CRM />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="services" element={<Services />} />
                  
                  <Route path="reports" element={
                    <ProtectedRoute allowedRoles={['customer', 'super_admin', 'manager']}>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="partners" element={<Partners />} />
                  
                  <Route path="profile" element={
                    <ProtectedRoute allowedRoles={['customer', 'super_admin', 'manager']}>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="settings" element={
                    <ProtectedRoute allowedRoles={['customer', 'super_admin', 'manager']}>
                      <Settings />
                    </ProtectedRoute>
                  } />
                </Route>
                
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={
                  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <GlobalErrorView />
                  </div>
                } />
              </Routes>
                </Suspense>
              </NotificationProvider>
            </UserActivityProvider>
          </ToastProvider>
        </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
