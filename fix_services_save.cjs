const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

const replacement = `
      const saveData = {
        ...adminServiceForm,
        service_id: adminServiceForm.id,
        service_name: adminServiceForm.title,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Ensure premium features are stored as string labels if they are objects
      if (adminServiceForm.premium_features_list && Array.isArray(adminServiceForm.premium_features_list)) {
        saveData.premium_features_list = adminServiceForm.premium_features_list.map((f: any) => typeof f === 'string' ? f : (f.text || f.name || 'Premium Feature'));
      }

      await setDoc(doc(db, 'service_catalog', adminServiceForm.id), saveData);
`;

code = code.replace(/await setDoc\(doc\(db, 'service_catalog', adminServiceForm\.id\), \{[\s\S]*?isActive: true\s*\}\);/, replacement.trim());

fs.writeFileSync('src/pages/Services.tsx', code);
