const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

// The DB retrieval code maps doc.id to id. Let's make sure it also grabs service_id and service_name.
code = code.replace(/id: docSnap.id, ...docSnap.data\(\)/g, "id: docSnap.id, service_id: docSnap.data().service_id || docSnap.id, service_name: docSnap.data().service_name || docSnap.data().title, ...docSnap.data()");

fs.writeFileSync('src/pages/Services.tsx', code);
