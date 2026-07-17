const fs = require('fs');
let content = fs.readFileSync('src/pages/documents/DocumentCenter.tsx', 'utf8');

// Fix the loading block
content = content.replace(/<p className="text-\[10px\] font-black text-slate-400 uppercase tracking-widest">Loading Document Repository...<\/p>\n\s*<ScanDocumentModal isOpen=\{isScanModalOpen\} onClose=\{\[Function: onClose\]|[^]*?\} \/>\n\s*<\/div>\n\s*\);\n\s*\}/g,
`<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Document Repository...</p>
        </div>
      </div>
    );
  }`);

// Make sure the bottom has the modal
if (!content.includes('<ScanDocumentModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />')) {
  const parts = content.split('</div>');
  // Just replace the very last `</div>\n  );`
  content = content.substring(0, content.lastIndexOf('</div>')) + 
    `\n      <ScanDocumentModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />\n    </div>` + 
    content.substring(content.lastIndexOf('</div>') + 6);
}

fs.writeFileSync('src/pages/documents/DocumentCenter.tsx', content);
