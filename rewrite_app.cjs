const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard imports with React.lazy
const importsToLazy = [
  'Landing', 'Login', 'Onboarding', 'Dashboard', 'Reports', 'LaunchWizard', 
  'Services', 'PremiumResearch', 'SmartCalendar', 'ResearchExecutiveDashboard', 
  'Partners', 'Settings', 'CRM', 'KnowledgeHub', 'InvestmentMarketplace', 
  'CEOCommandCenter', 'MarketIntelligence', 'AnalyticsPlatform', 'CommunicationHub', 
  'SupportCenter', 'ProjectList', 'ProjectDashboard', 'BSMDashboard', 'AdminDashboard', 
  'AdminLogin', 'DiscoveryHome', 'DiscoveryWizard', 'DiscoveryResult', 'SavedIdeas', 
  'CompareIdeas', 'AdminDiscovery', 'MarketplaceHome', 'ManufacturerRegistration', 
  'ManufacturerDetails', 'GlobalDashboard', 'DubaiSetup', 'TradeDocs', 'ImportExportProjects',
  'AboutUs', 'DocumentCenter', 'DocumentBuilder', 'AdminDocumentCenter', 'ContactUs', 'PrivacyPolicy', 'TermsOfService', 'Careers'
];

content = content.replace("import { BrowserRouter, Routes, Route } from 'react-router-dom';", 
"import { BrowserRouter, Routes, Route } from 'react-router-dom';\nimport React, { Suspense } from 'react';\nimport { HelmetProvider, Helmet } from 'react-helmet-async';\nimport { PageLoader } from './components/PageLoader';");

for (const imp of importsToLazy) {
  let impRegex = new RegExp(`import ${imp} from '\\./pages/(.*?)';\\n`);
  let match = content.match(impRegex);
  if (match) {
    content = content.replace(match[0], `const ${imp} = React.lazy(() => import('./pages/${match[1]}'));\n`);
  } else {
    // For index/special imports
    let impRegex2 = new RegExp(`import ${imp} from '\\./pages/(.*?)/index';\\n`);
    let match2 = content.match(impRegex2);
    if (match2) {
      content = content.replace(match2[0], `const ${imp} = React.lazy(() => import('./pages/${match2[1]}/index'));\n`);
    } else {
      let impRegex3 = new RegExp(`import ${imp} from '\\./pages/(.*?)';`);
      let match3 = content.match(impRegex3);
      if (match3) {
        content = content.replace(match3[0], `const ${imp} = React.lazy(() => import('./pages/${match3[1]}'));`);
      }
    }
  }
}

// Ensure lazy loading for Dashboard which imports as index
if (content.includes("import Dashboard from './pages/business-os/index';")) {
  content = content.replace("import Dashboard from './pages/business-os/index';", "const Dashboard = React.lazy(() => import('./pages/business-os/index'));");
}
if (content.includes("import Dashboard from './pages/business-os';")) {
  content = content.replace("import Dashboard from './pages/business-os';", "const Dashboard = React.lazy(() => import('./pages/business-os'));");
}

// Add Suspense around Routes
content = content.replace(/<Routes>/g, `<Suspense fallback={<PageLoader />}>\n                <Routes>`);
content = content.replace(/<\/Routes>/g, `</Routes>\n                </Suspense>`);

// Add Helmet Provider
content = content.replace(/<ErrorBoundary>/g, `<ErrorBoundary>\n      <HelmetProvider>`);
content = content.replace(/<\/ErrorBoundary>/g, `</HelmetProvider>\n    </ErrorBoundary>`);

// Default Helmet Configuration
content = content.replace(/<BrowserRouter>/g, `<Helmet>\n        <title>BizNxt - Business Operating System</title>\n        <meta name="description" content="The unified platform to manage and grow your business." />\n      </Helmet>\n      <BrowserRouter>`);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx rewritten for Lazy loading and Helmet.");
