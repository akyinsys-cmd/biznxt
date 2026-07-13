const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

code = code.replace(/items\.push\(\{ id: docSnap\.id, service_id: docSnap\.data\(\)\.service_id \|\| docSnap\.id, service_name: docSnap\.data\(\)\.service_name \|\| docSnap\.data\(\)\.title, \.\.\.docSnap\.data\(\) \}\);/g, "items.push({ id: docSnap.id, ...docSnap.data() });");

fs.writeFileSync('src/pages/Services.tsx', code);
