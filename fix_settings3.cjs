const fs = require('fs');

// We will just read the original file and do precise replacements.
// Wait, I already messed up Settings.tsx. Can I get it from git? No git here probably.
// Let's just fix it.

let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

// The incorrect part:
/*
355               )}
356 
357                                 </>
358                 )}
359 
360                 {activeTab === 'security' && (
*/
code = code.replace(`                                </>\n                )}`, ``);

/*
228                     </div>
229                   </div>
230                 </div>
231               )}
232               {activeTab === 'preferences' && (
*/
// The problem is that line 230 has `</div>` and line 231 is `)}` but wait, what happened to `)}`?
// In my earlier sed or node script, I might have messed up the `activeTab === 'profile'` closing.
code = code.replace(
  `                      />\n                    </div>\n                  </div>\n                </div>\n              )}`,
  `                      />\n                    </div>\n                  </div>\n                </div>\n              </>\n              )}`
);

fs.writeFileSync('src/pages/Settings.tsx', code);
