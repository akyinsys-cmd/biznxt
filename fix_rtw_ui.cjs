const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// Using the exact text around it
const blockStart = '{/* Smart Co-Pilot Generation Center */}';
const blockEndIdx = content.indexOf('{/* Live Research Notebook */}');
if (content.includes(blockStart) && blockEndIdx !== -1) {
    const startIdx = content.indexOf(blockStart);
    content = content.slice(0, startIdx) + content.slice(blockEndIdx);
}
fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Fixed RTW UI");
