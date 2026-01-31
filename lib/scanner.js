const fs = require('fs');
const path = require('path');

function getLicenseFromPackageJson(packageJsonPath) {
  try {
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const pkg = JSON.parse(content);
    return {
      license: pkg.license || pkg.licenses || 'Not specified',
      name: pkg.name || 'unknown',
      version: pkg.version || 'unknown'
    };
  } catch (e) {
    return null;
  }
}

function formatLicense(license) {
  if (typeof license === 'object') {
    if (Array.isArray(license)) {
      return license.map(l => l.type || l).join(', ');
    }
    return license.type || JSON.stringify(license);
  }
  return license;
}

function isMIT(license) {
  const licenseStr = formatLicense(license).toLowerCase();
  return licenseStr.includes('mit');
}

function scanNodeModules(dir, packages = []) {
  if (!fs.existsSync(dir)) {
    return packages;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const entryPath = path.join(dir, entry.name);

    if (entry.name.startsWith('@')) {
      const scopedPackages = fs.readdirSync(entryPath, { withFileTypes: true });
      for (const scopedEntry of scopedPackages) {
        if (!scopedEntry.isDirectory()) continue;
        const scopedPath = path.join(entryPath, scopedEntry.name);
        const packageJsonPath = path.join(scopedPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const info = getLicenseFromPackageJson(packageJsonPath);
          if (info) {
            packages.push(info);
          }
        }
      }
    } else if (!entry.name.startsWith('.')) {
      const packageJsonPath = path.join(entryPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const info = getLicenseFromPackageJson(packageJsonPath);
        if (info) {
          packages.push(info);
        }
      }
    }
  }

  return packages;
}

function generateMarkdown(packages) {
  const sorted = packages.sort((a, b) => a.name.localeCompare(b.name));

  let md = '# Project Dependencies Licenses\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += `Total packages: ${packages.length}\n\n`;

  const mitCount = packages.filter(p => isMIT(p.license)).length;
  const nonMitCount = packages.length - mitCount;

  md += `- ✅ MIT: ${mitCount}\n`;
  md += `- ❌ Non-MIT: ${nonMitCount}\n\n`;

  md += '| Status | Package | Version | License |\n';
  md += '|:------:|---------|---------|--------|\n';

  for (const pkg of sorted) {
    const license = formatLicense(pkg.license);
    const status = isMIT(pkg.license) ? '✅' : '❌';
    md += `| ${status} | ${pkg.name} | ${pkg.version} | ${license} |\n`;
  }

  return md;
}

function scanLicenses(targetDir, outputFile) {
  const nodeModulesPath = path.join(targetDir, 'node_modules');
  const outputPath = path.isAbsolute(outputFile) 
    ? outputFile 
    : path.join(targetDir, outputFile);

  console.log('Scanning node_modules for licenses...');

  if (!fs.existsSync(nodeModulesPath)) {
    console.error(`Error: node_modules not found at ${nodeModulesPath}`);
    console.error('Make sure you run this command in a directory with installed dependencies.');
    process.exit(1);
  }

  const packages = scanNodeModules(nodeModulesPath);

  console.log(`Found ${packages.length} packages`);

  const markdown = generateMarkdown(packages);

  fs.writeFileSync(outputPath, markdown, 'utf8');

  console.log(`Licenses written to ${outputPath}`);
}

module.exports = {
  scanLicenses,
  scanNodeModules,
  generateMarkdown,
  formatLicense,
  isMIT,
  getLicenseFromPackageJson
};
