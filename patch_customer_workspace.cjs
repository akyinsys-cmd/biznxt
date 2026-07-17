const fs = require('fs');
let content = fs.readFileSync('src/pages/bsm/CustomerWorkspace/index.tsx', 'utf8');

const tabsReplacement = `
  const tabs = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'tracker', label: 'Tracker', icon: Target },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
  ];
`;
content = content.replace(/const tabs = \[[\s\S]*?\];/, tabsReplacement.trim());

// And rounded-full for tabs
content = content.replace(/rounded-2xl text-\[10px\]/g, 'rounded-full text-[10px]');

fs.writeFileSync('src/pages/bsm/CustomerWorkspace/index.tsx', content);
console.log("Patched CustomerWorkspace index");
