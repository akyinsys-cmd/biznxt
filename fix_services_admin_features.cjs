const fs = require('fs');
let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

const newField = `
                    <div className="space-y-1 md:col-span-3">
                      <label className="text-slate-500 font-bold block mb-1">Premium Features (Comma Separated)</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. Dedicated Success Manager, Expert Review"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none"
                        value={(adminServiceForm.premium_features_list || []).map(f => typeof f === 'string' ? f : (f.text || f.name)).join(', ')}
                        onChange={(e) => setAdminServiceForm({...adminServiceForm, premium_features_list: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                      />
                    </div>
`;

code = code.replace(/<div className="space-y-1 md:col-span-3">\s*<label className="text-slate-500 font-bold block mb-1">SLA Guarantee Deliverables \(Comma Separated\)<\/label>/, newField.trim() + '\n\n                    <div className="space-y-1 md:col-span-3">\n                      <label className="text-slate-500 font-bold block mb-1">SLA Guarantee Deliverables (Comma Separated)</label>');

fs.writeFileSync('src/pages/Services.tsx', code);
