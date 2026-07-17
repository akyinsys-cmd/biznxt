const fs = require('fs');
let content = fs.readFileSync('src/components/communication/AIMeetingAssistantModal.tsx', 'utf8');

content = content.replace(/<div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-slate-700 leading-relaxed min-h-\[150px\]">\n\s*\{transcript\}\n\s*<\/div>/,
`<textarea 
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Dictate using the mic or paste meeting transcript here..."
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-slate-700 leading-relaxed min-h-[150px] outline-none focus:border-indigo-300 resize-y"
                />`);

// If transcript is empty, show the textarea anyway so they can paste
content = content.replace(/\{!notes && !loading && transcript && \(/, '{!notes && !loading && (');

fs.writeFileSync('src/components/communication/AIMeetingAssistantModal.tsx', content);
