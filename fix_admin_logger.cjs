const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

if (!code.includes("import { logUserActivity }")) {
  code = code.replace(
    "import { calculatePremiumPrice, subscribeToPricingConfig } from '../lib/pricingService';",
    "import { calculatePremiumPrice, subscribeToPricingConfig } from '../lib/pricingService';\nimport { logUserActivity } from '../components/widgets/UserActivityLogger';"
  );
}

const handleSaveCode = `  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'service_catalog', adminServiceForm.id), {
        ...adminServiceForm,
        createdAt: new Date().toISOString(),
        isActive: true
      });
      if (adminServiceForm.benchmark_price !== undefined || adminServiceForm.biznxt_price !== undefined) {
        logUserActivity('Catalog Pricing Updated', \`Updated pricing for \${adminServiceForm.id} (Bench: \${adminServiceForm.benchmark_price}, Premium: \${adminServiceForm.biznxt_price})\`, user?.email || 'Admin Desk');
      }
      success(isEditingService ? 'Service updated successfully!' : 'New specialized service added to catalog!');
      setAdminServiceForm(null);
    } catch (err) {
      error('Failed to save service records.');
    }
  };`;

code = code.replace(
  /  const handleSaveService = async \(e: React\.FormEvent\) => \{[\s\S]*?  \};/,
  handleSaveCode
);

const benchmarkFields = `
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">Benchmark Price (INR)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={adminServiceForm.benchmark_price || adminServiceForm.price || 0}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, benchmark_price: Number(e.target.value)})}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold block mb-1">BizNxt Premium Price (INR)</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          required
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                          value={adminServiceForm.biznxt_price || adminServiceForm.price || 0}
                          onChange={(e) => setAdminServiceForm({...adminServiceForm, biznxt_price: Number(e.target.value)})}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const suggested = calculatePremiumPrice(adminServiceForm.benchmark_price || adminServiceForm.price || 0, pricingConfig.enableAutomatedAdjustment);
                            setAdminServiceForm({...adminServiceForm, biznxt_price: suggested});
                          }}
                          className="px-3 py-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 rounded text-xs whitespace-nowrap"
                        >
                          Auto Calc
                        </button>
                      </div>
                    </div>
`;

code = code.replace(
  /<div className="space-y-1">\s*<label className="text-slate-500 font-bold block mb-1">Base Platform Fee \(INR\)<\/label>[\s\S]*?<\/div>/,
  benchmarkFields
);


fs.writeFileSync('src/pages/Services.tsx', code);
