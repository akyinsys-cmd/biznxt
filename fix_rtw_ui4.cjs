const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

content = content.replace(/\{ id: 'ai_assistant', label: '🤖 AI Research Desk', icon: Sparkles \},/, '');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Fixed RTW UI part 4");
