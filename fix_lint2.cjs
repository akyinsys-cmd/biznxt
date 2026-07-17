const fs = require('fs');
let al = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');
al = al.replace(/showToastError\(([^,]+),\s*'error'\)/g, 'showToastError($1)');
al = al.replace(/showToastError\(([^,]+),\s*"error"\)/g, 'showToastError($1)');
fs.writeFileSync('src/pages/AdminLogin.tsx', al);
console.log("Fixed AdminLogin.tsx lint error");
