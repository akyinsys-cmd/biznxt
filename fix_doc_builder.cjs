const fs = require('fs');
let content = fs.readFileSync('src/pages/documents/DocumentBuilder.tsx', 'utf8');

content = content.replace(/<textarea \n\s*value=\{formData\[field\.id\] \|\| ''\}\n\s*onChange=\{\(e\) => handleInputChange\(field\.id, e\.target\.value\)\}\n\s*placeholder=\{field\.placeholder\}\n\s*rows=\{4\}\n\s*className="w-full bg-transparent border-none p-1 text-sm font-medium text-slate-700 outline-none resize-none placeholder:text-slate-300 leading-relaxed pb-10"\n\s*\/>\n\s*<DictateButton onResult=\{\(text\) => handleInputChange\(field\.id, \(formData\[field\.id\] \|\| ''\) \+ text\)\} \/>/g, 
`<>
                          <textarea 
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full bg-transparent border-none p-1 text-sm font-medium text-slate-700 outline-none resize-none placeholder:text-slate-300 leading-relaxed pb-10"
                          />
                          <DictateButton onResult={(text) => handleInputChange(field.id, (formData[field.id] || '') + text)} />
                        </>`);

fs.writeFileSync('src/pages/documents/DocumentBuilder.tsx', content);
