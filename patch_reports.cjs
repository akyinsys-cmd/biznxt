const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

const performancePDF = fs.readFileSync('exportBusinessPerformancePDF.txt', 'utf8');

// Insert after generateConsultingPDF finishes (around line 1024)
code = code.replace(
  `handleLogHistory(report.id, 'pdf_exported', \`Exported and downloaded consulting PDF report. Password Protected: \${passwordProtectionEnabled}\`);\n  };\n\n  return (`,
  `handleLogHistory(report.id, 'pdf_exported', \`Exported and downloaded consulting PDF report. Password Protected: \${passwordProtectionEnabled}\`);\n  };\n\n${performancePDF}\n\n  return (`
);

// Add button next to "Request New Feasibility"
const btn = `
            <button 
              onClick={generatePerformancePDF}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Performance Data</span>
            </button>
            `;

code = code.replace(
  `{activeRole === 'customer' && (\n              <button`,
  `${btn}\n            {activeRole === 'customer' && (\n              <button`
);

fs.writeFileSync('src/pages/Reports.tsx', code);
