const fs = require('fs');

// Fix DocumentBuilder.tsx
let docsCode = fs.readFileSync('src/pages/documents/DocumentBuilder.tsx', 'utf8');
docsCode = docsCode.replace(
  "useAutoSave(`biznxt_doc_${documentId || templateId || 'draft'}`, {});",
  "useAutoSave<Record<string, any>>(`biznxt_doc_${documentId || templateId || 'draft'}`, {});"
);
fs.writeFileSync('src/pages/documents/DocumentBuilder.tsx', docsCode);

// Fix LaunchWizard.tsx
let launchCode = fs.readFileSync('src/pages/LaunchWizard.tsx', 'utf8');
launchCode = launchCode.replace(
  "useAutoSave('biznxt_launch_wizard_draft', {",
  "useAutoSave<any>('biznxt_launch_wizard_draft', {"
);
fs.writeFileSync('src/pages/LaunchWizard.tsx', launchCode);

console.log('Fixed useAutoSave types');
