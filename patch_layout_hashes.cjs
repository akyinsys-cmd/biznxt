const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(/path: '\/dashboard', icon: Activity, roles: \['customer'\] \},/, "path: '/dashboard#journey', icon: Activity, roles: ['customer'] },");
content = content.replace(/path: '\/dashboard', icon: Briefcase, roles: \['customer'\] \},/, "path: '/dashboard#orders', icon: Briefcase, roles: ['customer'] },");
content = content.replace(/path: '\/dashboard', icon: BarChart3, roles: \['customer'\] \},/, "path: '/dashboard#payments', icon: BarChart3, roles: ['customer'] },");
content = content.replace(/path: '\/dashboard', icon: FileText, roles: \['customer'\] \},/, "path: '/dashboard#invoices', icon: FileText, roles: ['customer'] },");

// Fix Duplicate icons in Layout
content = content.replace(/\{ name: 'Orders', path: '\/dashboard#orders', icon: Briefcase, roles: \['customer'\] \},/, "{ name: 'Orders', path: '/dashboard#orders', icon: LayoutDashboard, roles: ['customer'] },");

// Fix Manager Routes
content = content.replace(/path: '\/projects', icon: SearchIcon, roles: \['manager'\] \},/, "path: '/projects#tasks', icon: SearchIcon, roles: ['manager'] },");
content = content.replace(/path: '\/communication', icon: MessageSquare, roles: \['manager'\] \},/, "path: '/communication', icon: MessageSquare, roles: ['manager'] },");

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout hashes");
