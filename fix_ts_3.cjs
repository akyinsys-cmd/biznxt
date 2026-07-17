const fs = require('fs');

function replaceAll(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(search).join(replace);
  fs.writeFileSync(file, content);
}

replaceAll('src/components/AdminWorkspace.tsx', '"Pending KYC"', '"Pending"');
replaceAll('src/components/project/QuotationView.tsx', 'status: "accepted"', 'status: "Accepted"');
replaceAll('src/components/project/QuotationView.tsx', 'status: "rejected"', 'status: "Rejected"');
replaceAll('src/components/project/QuotationView.tsx', '=== "draft"', '=== "Draft"');
replaceAll('src/components/project/QuotationView.tsx', '=== "sent"', '=== "Sent"');
replaceAll('src/components/project/QuotationView.tsx', '=== "accepted"', '=== "Accepted"');
replaceAll('src/components/project/QuotationView.tsx', '=== "rejected"', '=== "Rejected"');
replaceAll('src/pages/PremiumResearch.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/ProjectDashboard.tsx', 'user?.role ===', '(user as any)?.role ===');
replaceAll('src/pages/ProjectDashboard.tsx', 'project.budget', 'project.budgetEst');
replaceAll('src/pages/ProjectList.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/ProjectList.tsx', '=== "Critical"', '=== "At Risk"');
replaceAll('src/pages/Reports.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/SmartCalendar.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/documents/DocumentCenter.tsx', '=== "superadmin"', '=== "super_admin"');
replaceAll('src/pages/business-os/index.tsx', '<TaskManager />', '<TaskManager tasks={tasks} projects={projects} onCreateTask={handleCreateTask} onToggleTaskStatus={handleToggleTaskStatus} onDeleteTask={handleDeleteTask} />');

console.log("Fixed TS errors 3");
