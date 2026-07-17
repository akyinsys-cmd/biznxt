const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(/\{ name: 'Projects', path: '\/projects', icon: Rocket, roles: \['customer', 'manager', 'super_admin'\] \},/, "{ name: 'Projects', path: '/projects', icon: Rocket, roles: ['customer', 'super_admin'] },");

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout projects roles");
