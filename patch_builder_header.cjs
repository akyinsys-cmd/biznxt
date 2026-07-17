const fs = require('fs');
let content = fs.readFileSync('src/pages/documents/DocumentBuilder.tsx', 'utf8');

// Add the smart templates button before AI Analysis button
content = content.replace(/<button \n\s*onClick=\{analyzeAI\}/,
`<button 
            onClick={() => setShowSmartTemplates(true)}
            className="p-3 text-slate-400 hover:text-primary bg-slate-50 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
            title="Smart Templates"
          >
            <Sparkles size={20} />
          </button>
          <button 
            onClick={analyzeAI}`);

// Add the modal at the bottom
content = content.replace(/\{showAI && \(/,
`{showSmartTemplates && (
        <SmartTemplateLibraryModal 
          onClose={() => setShowSmartTemplates(false)}
          onSelectStructure={(structure) => {
            // In a real app we'd map the structure fields to the current document
            // For now, we'll just set it to a main content field if it exists, or alert
            if (template?.formFields.find(f => f.id === 'content' || f.id === 'body' || f.id === 'executive_summary')) {
              const field = template.formFields.find(f => f.id === 'content' || f.id === 'body' || f.id === 'executive_summary');
              if (field) handleInputChange(field.id, structure);
            }
            setShowSmartTemplates(false);
          }}
        />
      )}
      
      {showAI && (`);

fs.writeFileSync('src/pages/documents/DocumentBuilder.tsx', content);
console.log("Patched DocumentBuilder Header");
