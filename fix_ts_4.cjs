const fs = require('fs');

function replaceAll(file, search, replace) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(search).join(replace);
  fs.writeFileSync(file, content);
}

replaceAll('src/pages/business-os/index.tsx', '(taskId: string, currentStatus: BusinessTask[\'status\'], taskName: string)', '(taskId: string, currentStatus: BusinessTask[\'status\'], taskName?: string)');
replaceAll('src/pages/business-os/index.tsx', '(taskId: string, taskName: string)', '(taskId: string, taskName?: string)');
replaceAll('src/pages/business-os/TaskManager.tsx', 'onDeleteTask: (taskId: string)', 'onDeleteTask: (taskId: string, taskName?: string)');

replaceAll('src/components/project/QuotationView.tsx', '{ status: "accepted" | "rejected"', '{ status: "Accepted" | "Rejected"');

replaceAll('src/pages/ProjectDashboard.tsx', 'project.budget', 'project.budgetEst');
replaceAll('src/pages/ProjectList.tsx', '=== "Critical"', '=== "At Risk"');

console.log("Fixed TS errors 4");
