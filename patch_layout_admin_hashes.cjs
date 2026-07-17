const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(/\{ name: 'Authentication Settings', path: '\/admin', icon: Settings, roles: \['super_admin'\] \},/, "{ name: 'Authentication Settings', path: '/admin#auth', icon: Settings, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'API Configuration', path: '\/admin', icon: Database, roles: \['super_admin'\] \},/, "{ name: 'API Configuration', path: '/admin#api', icon: Database, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'Firebase', path: '\/admin', icon: Activity, roles: \['super_admin'\] \},/, "{ name: 'Firebase', path: '/admin#firebase', icon: Activity, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'System Logs', path: '\/admin', icon: FileText, roles: \['super_admin'\] \},/, "{ name: 'System Logs', path: '/admin#logs', icon: FileText, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'Environment Settings', path: '\/admin', icon: Globe2, roles: \['super_admin'\] \},/, "{ name: 'Environment Settings', path: '/admin#env', icon: Globe2, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'Debug Tools', path: '\/admin', icon: ShieldAlert, roles: \['super_admin'\] \},/, "{ name: 'Debug Tools', path: '/admin#debug', icon: ShieldAlert, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'Database Tools', path: '\/admin', icon: Database, roles: \['super_admin'\] \},/, "{ name: 'Database Tools', path: '/admin#db', icon: Database, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'Role Management', path: '\/admin', icon: Users, roles: \['super_admin'\] \},/, "{ name: 'Role Management', path: '/admin#roles', icon: Users, roles: ['super_admin'] },");
content = content.replace(/\{ name: 'Security', path: '\/admin', icon: ShieldAlert, roles: \['super_admin'\] \},/, "{ name: 'Security', path: '/admin#security', icon: ShieldAlert, roles: ['super_admin'] },");

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout admin hashes");
