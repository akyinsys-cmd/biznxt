const fs = require('fs');
let content = fs.readFileSync('src/pages/ResearchExecutiveDashboard.tsx', 'utf8');

content = content.replace(/\/\/\s*Contact AI draft API/g, '');

fs.writeFileSync('src/pages/ResearchExecutiveDashboard.tsx', content);
console.log("Patched RED part 2");
