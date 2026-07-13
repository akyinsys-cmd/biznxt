/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/business-os/index';
import Reports from './pages/Reports';
import LaunchWizard from './pages/LaunchWizard';
import Services from './pages/Services';
import PremiumResearch from './pages/PremiumResearch';
import SmartCalendar from './pages/SmartCalendar';
import ResearchExecutiveDashboard from './pages/ResearchExecutiveDashboard';
import Partners from './pages/Partners';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserActivityProvider } from './context/UserActivityContext';
import { ThemeProvider } from './context/ThemeContext';
import { CommandPalette } from './components/CommandPalette';
import { FirstLoginWizard } from './components/widgets/FirstLoginWizard';
import Settings from './pages/Settings';
import CRM from './pages/CRM';
import KnowledgeHub from './pages/KnowledgeHub';
import InvestmentMarketplace from './pages/InvestmentMarketplace';
import CEOCommandCenter from './pages/CEOCommandCenter';
import MarketIntelligence from './pages/MarketIntelligence';
import AnalyticsPlatform from './pages/AnalyticsPlatform';
import CommunicationHub from './pages/CommunicationHub';
import SupportCenter from './pages/SupportCenter';
import ProjectList from './pages/ProjectList';
import ProjectDashboard from './pages/ProjectDashboard';
import BSMDashboard from './pages/BSMDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

import DiscoveryHome from './pages/discovery/DiscoveryHome';
import DiscoveryWizard from './pages/discovery/DiscoveryWizard';
import DiscoveryResult from './pages/discovery/DiscoveryResult';
import SavedIdeas from './pages/discovery/SavedIdeas';
import CompareIdeas from './pages/discovery/CompareIdeas';
import AdminDiscovery from './pages/discovery/AdminDiscovery';

import MarketplaceHome from './pages/marketplace/MarketplaceHome';
import ManufacturerRegistration from './pages/marketplace/ManufacturerRegistration';
import ManufacturerDetails from './pages/marketplace/ManufacturerDetails';

import GlobalDashboard from './pages/global/GlobalDashboard';
import DubaiSetup from './pages/global/DubaiSetup';
import TradeDocs from './pages/global/TradeDocs';
import ImportExportProjects from './pages/global/ImportExportProjects';

import { ProtectedRoute } from './components/ProtectedRoute';

import AboutUs from './pages/AboutUs';
import DocumentCenter from './pages/documents/DocumentCenter';
import DocumentBuilder from './pages/documents/DocumentBuilder';
import AdminDocumentCenter from './pages/documents/AdminDocumentCenter';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Careers from './pages/Careers';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <UserActivityProvider>
            <ToastProvider>
              <NotificationProvider>
                <CommandPalette />
                <FirstLoginWizard />
                <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Landing />} />
                  <Route path="documents" element={<ProtectedRoute><DocumentCenter /></ProtectedRoute>} />
                  <Route path="documents/build/:templateId" element={<ProtectedRoute><DocumentBuilder /></ProtectedRoute>} />
                  <Route path="documents/edit/:documentId" element={<ProtectedRoute><DocumentBuilder /></ProtectedRoute>} />
                  <Route path="documents/admin" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminDocumentCenter /></ProtectedRoute>} />
                  <Route path="about" element={<AboutUs />} />
                  <Route path="contact" element={<ContactUs />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="command-center" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <CEOCommandCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="intelligence" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <MarketIntelligence />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <AnalyticsPlatform />
                    </ProtectedRoute>
                  } />
                  <Route path="communication" element={
                    <ProtectedRoute>
                      <CommunicationHub />
                    </ProtectedRoute>
                  } />
                  <Route path="support" element={
                    <ProtectedRoute>
                      <SupportCenter />
                    </ProtectedRoute>
                  } />
                  <Route path="projects" element={<ProtectedRoute allowedRoles={['customer', 'client', 'admin', 'superadmin']} />}>
                    <Route index element={<ProjectList />} />
                    <Route path=":id" element={<ProjectDashboard />} />
                  </Route>
                  <Route path="bsm" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'bsm']}>
                      <BSMDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="admin" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['customer', 'client', 'admin', 'superadmin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="calendar" element={
                    <ProtectedRoute>
                      <SmartCalendar />
                    </ProtectedRoute>
                  } />
                  <Route path="crm" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <CRM />
                    </ProtectedRoute>
                  } />
                  {/* Placeholders for future pages */}
                  <Route path="search" element={
                    <ProtectedRoute>
                      <PremiumResearch />
                    </ProtectedRoute>
                  } />
                  <Route path="premium-research" element={
                    <ProtectedRoute>
                      <PremiumResearch />
                    </ProtectedRoute>
                  } />
                  <Route path="premium-research-executive" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'researcher']}>
                      <ResearchExecutiveDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="discovery">
                    <Route index element={<DiscoveryHome />} />
                    <Route path="wizard" element={<DiscoveryWizard />} />
                    <Route path="results/:id" element={<DiscoveryResult />} />
                    <Route path="saved" element={<SavedIdeas />} />
                    <Route path="compare" element={<CompareIdeas />} />
                    <Route path="admin" element={
                      <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                        <AdminDiscovery />
                      </ProtectedRoute>
                    } />
                  </Route>
                  <Route path="launch" element={
                    <ProtectedRoute>
                      <LaunchWizard />
                    </ProtectedRoute>
                  } />
                  <Route path="services" element={<Services />} />
                  <Route path="reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  <Route path="partners" element={<Partners />} />
                  <Route path="academy" element={<KnowledgeHub />} />
                  <Route path="investment" element={<InvestmentMarketplace />} />
                  <Route path="marketplace">
                    <Route index element={<MarketplaceHome />} />
                    <Route path="register" element={<ManufacturerRegistration />} />
                    <Route path="manufacturer/:id" element={<ManufacturerDetails />} />
                  </Route>
                  <Route path="global" element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'bsm', 'consultant']}>
                      <GlobalDashboard />
                    </ProtectedRoute>
                  }>
                    <Route index element={<GlobalDashboard />} />
                    <Route path="dubai-setup" element={<DubaiSetup />} />
                    <Route path="trade-docs" element={<TradeDocs />} />
                    <Route path="import-export" element={<ImportExportProjects />} />
                  </Route>
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/onboarding" element={<Onboarding />} />
              </Routes>
            </NotificationProvider>
          </ToastProvider>
        </UserActivityProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
