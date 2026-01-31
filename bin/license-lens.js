#!/usr/bin/env node

const { scanLicenses } = require('../lib/scanner');

const args = process.argv.slice(2);

let outputFile = 'LICENSES.md';
let targetDir = process.cwd();

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-o' || args[i] === '--output') {
    outputFile = args[i + 1];
    i++;
  } else if (args[i] === '-d' || args[i] === '--dir') {
    targetDir = args[i + 1];
    i++;
  } else if (args[i] === '-h' || args[i] === '--help') {
    console.log(`
license-lens - Scan node_modules and generate a markdown report of all package licenses

Usage:
  npx license-lens [options]

Options:
  -o, --output <file>   Output file path (default: LICENSES.md)
  -d, --dir <path>      Target directory to scan (default: current directory)
  -h, --help            Show this help message
  -v, --version         Show version number

Examples:
  npx license-lens
  npx license-lens -o licenses-report.md
  npx license-lens -d ./my-project
`);
    process.exit(0);
  } else if (args[i] === '-v' || args[i] === '--version') {
    const pkg = require('../package.json');
    console.log(pkg.version);
    process.exit(0);
  }
}

scanLicenses(targetDir, outputFile);
