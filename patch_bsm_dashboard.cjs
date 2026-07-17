const fs = require('fs');
let content = fs.readFileSync('src/pages/BSMDashboard.tsx', 'utf8');

// Prune tabs to just essentials for production module
const tabsReplacement = `
  const tabs = [
    { id: 'customers', label: 'Assigned Customers', icon: Users },
    { id: 'projects', label: 'Projects', icon: LayoutDashboard },
    { id: 'communication', label: 'Communication', icon: Users },
  ];
`;
content = content.replace(/const tabs = \[[\s\S]*?\];/, tabsReplacement.trim());

// Upgrade styling
content = content.replace(/rounded-2xl/g, 'rounded-full'); // mainly for tabs container and buttons
content = content.replace(/rounded-\[2rem\]/g, 'rounded-[2rem] shadow-lg shadow-slate-200/50');

fs.writeFileSync('src/pages/BSMDashboard.tsx', content);
console.log("Patched BSMDashboard.tsx");
