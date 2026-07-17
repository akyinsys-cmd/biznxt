const fs = require('fs');
let content = fs.readFileSync('src/components/ErrorBoundary.tsx', 'utf8');

// Replace the render function's contents
const replacement = `
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <GlobalErrorView onReset={this.handleReset} />
        </div>
      );
    }
    return this.props.children;
  }
}
`;

content = content.replace(/render\(\) \{[\s\S]*\}\s*\}\s*$/m, replacement);
content = "import { GlobalErrorView } from './GlobalErrorView';\n" + content;

fs.writeFileSync('src/components/ErrorBoundary.tsx', content);
console.log("Patched ErrorBoundary to use GlobalErrorView");
