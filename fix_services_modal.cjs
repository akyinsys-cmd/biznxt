const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

code = code.replace(
  "const [compareServiceTitle, setCompareServiceTitle] = useState('');",
  "const [compareService, setCompareService] = useState<any>(null);"
);

code = code.replace(
  "setCompareServiceTitle(service.title);",
  "setCompareService(service);"
);

code = code.replace(
  "<ValueComparisonModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} serviceTitle={compareServiceTitle} />",
  "<ValueComparisonModal isOpen={compareModalOpen} onClose={() => setCompareModalOpen(false)} service={compareService} />"
);

fs.writeFileSync('src/pages/Services.tsx', code);
