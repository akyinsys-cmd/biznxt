const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

if (!code.includes("<ValueComparisonModal isOpen={compareModalOpen}")) {
  code = code.replace(
    "{/* View Service Details Modal */}", 
    "<ValueComparisonModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} serviceTitle={compareServiceTitle} />\n      {/* View Service Details Modal */}"
  );
}

fs.writeFileSync('src/pages/Services.tsx', code);
