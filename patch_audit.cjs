const fs = require('fs');
let content = fs.readFileSync('src/context/UserActivityContext.tsx', 'utf8');

content = content.replace(/await addDoc\(collection\(db, 'SystemAudits'\), \{/g, 
  `await addDoc(collection(db, 'SystemAudits'), {
          action,
          category,
          details,`);

fs.writeFileSync('src/context/UserActivityContext.tsx', content);
console.log("Patched UserActivityContext");
