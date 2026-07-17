const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// Remove the tab button for AI assistant
content = content.replace(/<button[^>]*onClick=\{\(\) => setWorkspaceSubTab\('ai_assistant'\)\}[^>]*>[\s\S]*?<\/button>/, '');
content = content.replace(/<button\s+onClick=\{\(\) => setWorkspaceSubTab\('ai_assistant'\)\}[\s\S]*?<\/button>/, '');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Fixed RTW UI part 3");
