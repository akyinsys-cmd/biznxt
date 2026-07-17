const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const navItemsReplacement = `
const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  
  // Customer Routes
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['customer'] },
  { name: 'Business Journey', path: '/dashboard', icon: Activity, roles: ['customer'] },
  { name: 'Orders', path: '/dashboard', icon: Briefcase, roles: ['customer'] },
  { name: 'Research Reports', path: '/reports', icon: FileText, roles: ['customer'] },
  { name: 'Projects', path: '/projects', icon: Rocket, roles: ['customer', 'manager', 'super_admin'] },
  { name: 'Payments', path: '/dashboard', icon: BarChart3, roles: ['customer'] },
  { name: 'Invoices', path: '/dashboard', icon: FileText, roles: ['customer'] },
  { name: 'Support', path: '/support', icon: LifeBuoy, roles: ['customer'] },

  // Manager Routes
  { name: 'Assigned Customers', path: '/bsm', icon: Users, roles: ['manager'] },
  { name: 'Tasks', path: '/projects', icon: SearchIcon, roles: ['manager'] },
  { name: 'Meetings', path: '/calendar', icon: Calendar, roles: ['manager'] },
  { name: 'Customer Communication', path: '/communication', icon: MessageSquare, roles: ['manager'] },
  
  // Super Admin Routes
  { name: 'Authentication Settings', path: '/admin', icon: Settings, roles: ['super_admin'] },
  { name: 'API Configuration', path: '/admin', icon: Database, roles: ['super_admin'] },
  { name: 'Firebase', path: '/admin', icon: Activity, roles: ['super_admin'] },
  { name: 'Analytics', path: '/analytics', icon: TrendingUp, roles: ['super_admin'] },
  { name: 'System Logs', path: '/admin', icon: FileText, roles: ['super_admin'] },
  { name: 'Environment Settings', path: '/admin', icon: Globe2, roles: ['super_admin'] },
  { name: 'Debug Tools', path: '/admin', icon: ShieldAlert, roles: ['super_admin'] },
  { name: 'Database Tools', path: '/admin', icon: Database, roles: ['super_admin'] },
  { name: 'Role Management', path: '/admin', icon: Users, roles: ['super_admin'] },
  { name: 'Security', path: '/admin', icon: ShieldAlert, roles: ['super_admin'] },
];
`;

content = content.replace(/const navItems: NavItem\[\] = \[[\s\S]*?\];/, navItemsReplacement.trim());

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout.tsx navItems");
