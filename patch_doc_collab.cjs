const fs = require('fs');
let content = fs.readFileSync('src/pages/documents/DocumentBuilder.tsx', 'utf8');

if (!content.includes('DocumentCollaborationPanel')) {
  // Add imports
  content = content.replace(/import \{ SmartTemplateLibraryModal \} from '\.\.\/\.\.\/components\/documents\/SmartTemplateLibraryModal';/,
  "import { SmartTemplateLibraryModal } from '../../components/documents/SmartTemplateLibraryModal';\nimport { DocumentCollaborationPanel } from '../../components/documents/DocumentCollaborationPanel';");

  // Modify activeSidebarTab state
  content = content.replace(/const \[activeSidebarTab, setActiveSidebarTab\] = useState<'drafting' \| 'summary'>\('drafting'\);/,
  "const [activeSidebarTab, setActiveSidebarTab] = useState<'drafting' | 'summary' | 'collaboration'>('drafting');");

  // Add the tab button
  content = content.replace(/<button \n\s*onClick=\{\(\) => setActiveSidebarTab\('summary'\)\}/,
  `<button 
                onClick={() => setActiveSidebarTab('collaboration')}
                className={\`flex-1 py-3 text-sm font-bold rounded-xl transition-all \${activeSidebarTab === 'collaboration' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
              >
                Team
              </button>
              <button 
                onClick={() => setActiveSidebarTab('summary')}`);

  // Add the tab content
  content = content.replace(/\{activeSidebarTab === 'summary' && \(/,
  `{activeSidebarTab === 'collaboration' && (
              <motion.div
                key="collaboration"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DocumentCollaborationPanel documentId={id || ''} />
              </motion.div>
            )}
            
            {activeSidebarTab === 'summary' && (`);

  fs.writeFileSync('src/pages/documents/DocumentBuilder.tsx', content);
  console.log("Patched DocumentBuilder with Collaboration Panel");
}
