const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// The function is handleGenerateAiDraft (lowercase i) and handleApplyDraftToWorkspace
content = content.replace(/\/\/ Trigger AI Draft Generation from server endpoint[\s\S]*?const handleApplyDraftToWorkspace = \(\) => \{[\s\S]*?setWorkspaceSubTab\('manual'\);\n  \};/g, '');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Patched RTW part 5");
