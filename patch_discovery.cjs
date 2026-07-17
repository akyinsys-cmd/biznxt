const fs = require('fs');
let content = fs.readFileSync('src/pages/discovery/DiscoveryWizard.tsx', 'utf8');

content = content.replace(/import \{ formDraftsDB \} from '\.\.\/\.\.\/lib\/indexedDB';\n/g, '');

const loadDraftRegex = /useEffect\(\(\) => \{\s*const loadDraft = async \(\) => \{[\s\S]*?loadDraft\(\);\s*\}, \[\]\);\s*/;
content = content.replace(loadDraftRegex, '');

const saveDraftRegex = /useEffect\(\(\) => \{\s*const saveDraft = async \(\) => \{[\s\S]*?return \(\) => clearTimeout\(t\);\s*\}, \[formData\]\);\s*/;
content = content.replace(saveDraftRegex, '');

fs.writeFileSync('src/pages/discovery/DiscoveryWizard.tsx', content);
console.log("Patched DiscoveryWizard.tsx");
