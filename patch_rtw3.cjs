const fs = require('fs');
let content = fs.readFileSync('src/components/ResearchTeamWorkspace.tsx', 'utf8');

// Use a more generic regex to remove those handles if the previous one failed
content = content.replace(/const handleGenerateAIDraft = async \(\) => \{[\s\S]*?\}\s*};\s*\/\/\s*AI Draft/s, '// Removed handleGenerateAIDraft');
content = content.replace(/const handleApplyAIDraft = \(\) => \{[\s\S]*?\}\s*};\s*\/\/\s*Submit/s, '// Submit');
content = content.replace(/Internal analytics console to verify, draft, audit, and deliver RBI-compliant premium research dossiers./g, 'Internal analytics console to verify, audit, and deliver RBI-compliant premium research dossiers.');
content = content.replace(/Synthesizer draft appears here/g, 'Synthesizer output appears here');
content = content.replace(/Key launch directions, branding tagline drafts, partner selections/g, 'Key launch directions, branding taglines, partner selections');
content = content.replace(/Zero placeholder drafts remain/g, 'Zero placeholders remain');
content = content.replace(/Internal team drafts and helper notes removed/g, 'Internal team notes and helper notes removed');

fs.writeFileSync('src/components/ResearchTeamWorkspace.tsx', content);
console.log("Patched RTW part 3");
