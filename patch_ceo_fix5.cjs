const fs = require('fs');
let content = fs.readFileSync('src/pages/CEOCommandCenter.tsx', 'utf8');

const targetStr = `                      </div>
                                          </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}`;

const replacementStr = `                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/pages/CEOCommandCenter.tsx', content);
