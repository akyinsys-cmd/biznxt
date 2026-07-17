const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

content = content.replace(/import \{ LayoutDashboard, /g, "import { LayoutDashboard, Database, ");

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
console.log("Fixed AdminDashboard.tsx errors");
