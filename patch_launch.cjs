const fs = require('fs');
let content = fs.readFileSync('src/pages/LaunchWizard.tsx', 'utf8');

content = content.replace(/import \{ formDraftsDB \} from '\.\.\/lib\/indexedDB';\n/g, '');

const loadDraftRegex = /\s*\/\/ First try indexedDB[\s\S]*?try \{[\s\S]*?const draft = await formDraftsDB\.getDraft\('launch_wizard_draft'\);[\s\S]*?if \(draft\) \{[\s\S]*?setFormData\(prev => \(\{ \.\.\.prev, \.\.\.draft \}\)\);[\s\S]*?success\('Local draft loaded\.'\);[\s\S]*?\}[\s\S]*?\} catch \(err\) \{[\s\S]*?console\.warn\('Could not load local draft', err\);[\s\S]*?\}/;
content = content.replace(loadDraftRegex, '');

const saveDraftRegex = /useEffect\(\(\) => \{\s*const saveDraft = async \(\) => \{[\s\S]*?return \(\) => clearTimeout\(t\);\s*\}, \[formData\]\);\s*/;
content = content.replace(saveDraftRegex, '');

fs.writeFileSync('src/pages/LaunchWizard.tsx', content);
console.log("Patched LaunchWizard.tsx");
