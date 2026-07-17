const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');
content = content.replace(/Backup previous drafts, keep version histories, and download or preview reference uploads safely\./g, 'Keep version histories and download or preview reference uploads safely.');
content = content.replace(/\{\/\* New report draft backup uploads \*\/\}/g, '{/* Document uploads */}');
content = content.replace(/Draft draft auto-saved to cloud ledger\./g, 'Report auto-saved to cloud ledger.');
fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Patched ResearchTeamWorkspace.tsx for drafts");
