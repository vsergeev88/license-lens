# license-lens

A tiny CLI tool to scan node_modules and generate a markdown report of all package licenses.

## Installation

```bash
npm install -g license-lens
```

Or use directly with npx (no installation required):

```bash
npx license-lens
```

## Usage

Run in your project directory:

```bash
npx license-lens
```

This will create a `LICENSES.md` file with a table of all dependencies and their licenses.

### Options

```
-o, --output <file>   Output file path (default: LICENSES.md)
-d, --dir <path>      Target directory to scan (default: current directory)
-h, --help            Show help message
-v, --version         Show version number
```

### Examples

```bash
# Generate report in current directory
npx license-lens

# Custom output file
npx license-lens -o licenses-report.md

# Scan a specific directory
npx license-lens -d ./my-project
```

## Output

The generated markdown file includes:

- Total package count
- MIT vs Non-MIT license breakdown
- Sorted table with package name, version, and license type
- Visual indicators (✅ for MIT, ❌ for non-MIT)

## Programmatic Usage

```javascript
const { scanLicenses, scanNodeModules, generateMarkdown } = require('license-lens');

// Full scan with file output
scanLicenses('./my-project', 'LICENSES.md');

// Or use individual functions
const packages = scanNodeModules('./my-project/node_modules');
const markdown = generateMarkdown(packages);
```

## License

MIT
