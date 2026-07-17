const fs = require('fs');
let content = fs.readFileSync('src/components/documents/SmartTemplateLibraryModal.tsx', 'utf8');

// Add imports
if (!content.includes('firebase/firestore')) {
  content = content.replace(/import \{ Sparkles, X, ChevronRight, FileText, Zap \} from 'lucide-react';/,
  "import { Sparkles, X, ChevronRight, FileText, Zap } from 'lucide-react';\nimport { collection, query, where, getDocs } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';\nimport { useAuth } from '../../context/AuthContext';\nimport { Project } from '../../types/project';");
}

if (!content.includes('useAuth')) {
  content = content.replace(/export function SmartTemplateLibraryModal\(\{/, 
  "export function SmartTemplateLibraryModal({\n  ");
  content = content.replace(/const \[activePhase, setActivePhase\] = useState\('Research'\);/, 
  "const { user } = useAuth();\n  const [activePhase, setActivePhase] = useState('Research');\n  const [isGenerating, setIsGenerating] = useState(false);");
}

const generateSOW = `
  const generateSOW = async (suggestion: Suggestion) => {
    if (suggestion.title !== 'Statement of Work (SOW)') {
      onSelectStructure(suggestion.structure);
      return;
    }
    
    if (!user) return;
    setIsGenerating(true);
    try {
      const q = query(collection(db, 'projects'));
      const snap = await getDocs(q);
      const projects = snap.docs.map(d => d.data() as Project);
      const project = projects[0]; // grab the first project for demonstration

      if (project) {
        const dynamicStructure = \`# 1. Project Scope
Project: \${project.name}
Description: \${project.description || 'Provide innovative digital solutions.'}

# 2. Deliverables
\${project.team ? project.team.map(t => '- ' + t.role + ' services').join('\\n') : '- Full stack development\\n- UX/UI Design'}

# 3. Timeline & Milestones
Start Date: \${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}
End Date: \${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}

# 4. Pricing & Payment Terms
Total Budget: $\${project.totalBudget?.toLocaleString() || '100,000'}
Payment structure will be defined in subsequent invoices.

# 5. Acceptance Criteria
All deliverables must meet the quality standards outlined by \${project.clientName || 'the client'}.\`;
        onSelectStructure(dynamicStructure);
      } else {
        onSelectStructure(suggestion.structure);
      }
    } catch (err) {
      console.error(err);
      onSelectStructure(suggestion.structure);
    } finally {
      setIsGenerating(false);
    }
  };
`;

content = content.replace(/const filtered = suggestions\.filter\(s => s\.phase === activePhase\);/, generateSOW + "\n  const filtered = suggestions.filter(s => s.phase === activePhase);");

content = content.replace(/<button \n\s*onClick=\{\(\) => onSelectStructure\(suggestion\.structure\)\}/,
`<button 
                    onClick={() => generateSOW(suggestion)}
                    disabled={isGenerating}`);

content = content.replace(/<Zap size=\{14\} \/> Apply Structure\n\s*<\/button>/,
`<Zap size={14} /> {isGenerating && suggestion.title === 'Statement of Work (SOW)' ? 'Generating SOW...' : 'Apply Structure'}
                  </button>`);

fs.writeFileSync('src/components/documents/SmartTemplateLibraryModal.tsx', content);
console.log("Patched SmartTemplateLibraryModal SOW generator");
