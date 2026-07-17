const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// I notice the block inside RTW is still there from line 481, so we'll just nuke from 'const handleGenerateAIDraft' or from line 480 to 540
content = content.replace(/try\s*\{\s*const response = await fetch\('\/api\/research\/draft'[\s\S]*?\}\s*\}\s*\/\//g, '//');
content = content.replace(/const mapTypeToKey[\s\S]*?setManualFindings\([^;]+;\s*\}/g, '');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Patched RTW part 4");
