const fs = require('fs');
const path = require('path');

const pluginName = 'mapp-intelligence-reactnative-plugin';
const source = process.argv[2];
const requestedVersion = process.argv[3];

if (source !== 'local' && source !== 'published') {
  console.error('Usage: set-example-plugin-source.js <local|published>');
  process.exit(1);
}

const packageJsonPath = path.join(__dirname, '..', 'example', 'package.json');
const rootPackageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
const dependency =
  source === 'local' ? 'file:..' : requestedVersion || rootPackageJson.version;

packageJson.dependencies[pluginName] = dependency;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log(`Example plugin source set to ${source} (${dependency}).`);
console.log('Run your package manager install command to apply the change.');
