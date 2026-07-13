const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/ValueComparisonModal.tsx', 'utf8');

code = code.replace(/Standard Market Approach<br\/>/g, 'Basic Market Scope<br/>');
code = code.replace(/BizNxt Premium<br\/>/g, 'BizNxt Premium Deliverables<br/>');

fs.writeFileSync('src/components/widgets/ValueComparisonModal.tsx', code);
