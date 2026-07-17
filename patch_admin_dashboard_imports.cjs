const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

content = content.replace(/import \{ AdminOverview \} from '\.\/admin\/AdminOverview';\n/g, '');
content = content.replace(/import \{ AdminUsers \} from '\.\/admin\/AdminUsers';\n/g, '');
content = content.replace(/import \{ AdminManagers \} from '\.\/admin\/AdminManagers';\n/g, '');
content = content.replace(/import \{ AdminServices \} from '\.\/admin\/AdminServices';\n/g, '');
content = content.replace(/import \{ AdminPricing \} from '\.\/admin\/AdminPricing';\n/g, '');
content = content.replace(/import \{ AdminSystem \} from '\.\/admin\/AdminSystem';\n/g, '');
content = content.replace(/import \{ AdminAds \} from '\.\/admin\/AdminAds';\n/g, '');
content = content.replace(/import \{ AdminActivityLogs \} from '\.\/admin\/AdminActivityLogs';\n/g, '');

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
console.log("Removed unused imports in AdminDashboard.tsx");
