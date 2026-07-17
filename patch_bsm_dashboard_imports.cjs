const fs = require('fs');
let content = fs.readFileSync('src/pages/BSMDashboard.tsx', 'utf8');

content = content.replace(/import \{ BSMOverview \} from '\.\/bsm\/BSMOverview';\n/g, '');

fs.writeFileSync('src/pages/BSMDashboard.tsx', content);
console.log("Removed unused imports in BSMDashboard.tsx");
