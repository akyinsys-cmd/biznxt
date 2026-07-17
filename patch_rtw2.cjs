const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// Replace the handleGenerateAIDraft & handleApplyAIDraft completely
content = content.replace(/const handleGenerateAIDraft = async \(\) => \{[\s\S]*?\};\s*\/\/\s*Apply AI Draft into manual research or Parent findings state/g, '// AI Draft generation removed \n  // Apply AI Draft into manual research or Parent findings state');

content = content.replace(/const handleApplyAIDraft = \(\) => \{[\s\S]*?\};\s*\/\/\s*Submit manual findings/g, '// Apply AI draft removed\n  // Submit manual findings');

// Also remove any UI buttons or blocks referencing these
content = content.replace(/\{\/\* Smart Co-Pilot Generation Center \*\/\}[\s\S]*?\{\/\* Terminal Output \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g, '');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Patched RTW part 2");
