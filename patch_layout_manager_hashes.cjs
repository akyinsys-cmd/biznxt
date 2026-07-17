const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(/\{ name: 'Assigned Customers', path: '\/bsm', icon: Users, roles: \['manager'\] \},/, "{ name: 'Assigned Customers', path: '/bsm#customers', icon: Users, roles: ['manager'] },");
content = content.replace(/\{ name: 'Tasks', path: '\/projects#tasks', icon: SearchIcon, roles: \['manager'\] \},/, "{ name: 'Tasks', path: '/bsm#tasks', icon: SearchIcon, roles: ['manager'] },");
content = content.replace(/\{ name: 'Meetings', path: '\/calendar', icon: Calendar, roles: \['manager'\] \},/, "{ name: 'Meetings', path: '/bsm#meetings', icon: Calendar, roles: ['manager'] },");
content = content.replace(/\{ name: 'Customer Communication', path: '\/communication', icon: MessageSquare, roles: \['manager'\] \},/, "{ name: 'Customer Communication', path: '/bsm#communication', icon: MessageSquare, roles: ['manager'] },");

// Add Projects, Documents, Progress to manager
content = content.replace(/\/\/ Super Admin Routes/, "{ name: 'Projects', path: '/bsm#projects', icon: Rocket, roles: ['manager'] },\n  { name: 'Documents', path: '/bsm#documents', icon: FileText, roles: ['manager'] },\n  { name: 'Progress', path: '/bsm#progress', icon: Activity, roles: ['manager'] },\n\n  // Super Admin Routes");

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout manager hashes");
