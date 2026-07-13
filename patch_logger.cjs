const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/UserActivityLogger.tsx', 'utf8');

code = code.replace(
  '<div className="space-y-4">',
  '<div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">'
);

fs.writeFileSync('src/components/widgets/UserActivityLogger.tsx', code);
