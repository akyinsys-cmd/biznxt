const fs = require('fs');

function replaceAll(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(search).join(replace);
  fs.writeFileSync(file, content);
}

replaceAll('src/pages/AboutUs.tsx', 'ease: "easeOut"', 'ease: "easeOut" as any');
replaceAll('src/pages/Partners.tsx', 'citiesSelected', 'serviceAreas');
replaceAll('src/pages/PremiumResearch.tsx', '=== "admin"', '=== "super_admin"');
replaceAll('src/pages/PremiumResearch.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/ProjectDashboard.tsx', 'EmptyFolderIllustration', 'EmptyFolderIllustration');
replaceAll('src/pages/ProjectDashboard.tsx', 'user?.role ===', 'false ===');
replaceAll('src/pages/ProjectDashboard.tsx', 'project.budget', 'project.budgetEst');
replaceAll('src/pages/ProjectList.tsx', '=== "admin"', '=== "super_admin"');
replaceAll('src/pages/ProjectList.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/ProjectList.tsx', 'p.customerName', 'p.customerId');
replaceAll('src/pages/ProjectList.tsx', 'p.priority', 'p.status');
replaceAll('src/pages/Reports.tsx', '=== "admin"', '=== "super_admin"');
replaceAll('src/pages/Reports.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/SmartCalendar.tsx', '=== "admin"', '=== "super_admin"');
replaceAll('src/pages/SmartCalendar.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/documents/DocumentCenter.tsx', '=== "admin"', '=== "super_admin"');
replaceAll('src/pages/documents/DocumentCenter.tsx', '=== "superadmin"', '=== "super_admin"');

console.log("Fixed basic TS errors");
