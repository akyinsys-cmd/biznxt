const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

const blockStart = '{/* Sub-Tab 2: AI Research Desk Assistant */}';
const blockEndIdx = content.indexOf('{/* Sub-Tab 3: Final PDF Generator & Sign-Off */}');
if (content.includes(blockStart) && blockEndIdx !== -1) {
    const startIdx = content.indexOf(blockStart);
    content = content.slice(0, startIdx) + content.slice(blockEndIdx);
}
fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Fixed RTW UI part 2");
