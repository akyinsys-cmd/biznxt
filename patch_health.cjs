const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDashboard.tsx', 'utf8');

// Add import
content = content.replace(/import \{ ProjectRiskMonitorWidget \} from '\.\.\/components\/project\/ProjectRiskMonitorWidget';/,
"import { ProjectRiskMonitorWidget } from '../components/project/ProjectRiskMonitorWidget';\nimport { ProjectHealthScoreWidget } from '../components/project/ProjectHealthScoreWidget';");

// Add widget
content = content.replace(/<BSMControls \n\s*project=\{project\}\n\s*onUpdate=\{\(\) => \{\}\}\n\s*onAdvanceStage=\{handleAdvanceStage\}\n\s*\/>\n\s*\)\}/,
`<BSMControls 
                project={project}
                onUpdate={() => {}}
                onAdvanceStage={handleAdvanceStage}
              />
            )}
            
            <div className="mb-10">
              <ProjectHealthScoreWidget projectId={id || ''} />
            </div>`);

fs.writeFileSync('src/pages/ProjectDashboard.tsx', content);
