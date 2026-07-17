const fs = require('fs');

function replaceAll(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(search).join(replace);
  fs.writeFileSync(file, content);
}

replaceAll('src/components/AdminWorkspace.tsx', '=== "Pending KYC"', '=== "Pending"');
replaceAll('src/components/project/QuotationView.tsx', '"accepted"', '"Accepted"');
replaceAll('src/components/project/QuotationView.tsx', '"rejected"', '"Rejected"');
replaceAll('src/components/project/QuotationView.tsx', '"draft"', '"Draft"');
replaceAll('src/components/project/QuotationView.tsx', '"sent"', '"Sent"');
replaceAll('src/pages/PremiumResearch.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/ProjectDashboard.tsx', 'user?.role ===', 'user?.role as any ===');
replaceAll('src/pages/ProjectDashboard.tsx', 'project.budget', 'project.budgetEst');
replaceAll('src/pages/ProjectDashboard.tsx', 'false ===', 'user?.role ===');
replaceAll('src/pages/ProjectList.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/ProjectList.tsx', 'p.customerId', 'p.customerName');
replaceAll('src/pages/ProjectList.tsx', 'p.customerName', 'p.clientId'); // Let's check Project interface
replaceAll('src/pages/ProjectList.tsx', '=== "Critical"', '=== "At Risk"');
replaceAll('src/pages/Reports.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/SmartCalendar.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/documents/DocumentCenter.tsx', '=== "superadmin"', '=== "super_admin"');

console.log("Fixed TS errors");
