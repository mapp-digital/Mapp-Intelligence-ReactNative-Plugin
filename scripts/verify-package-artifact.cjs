const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const result = spawnSync(
  'npm',
  ['pack', '--dry-run', '--json', '--ignore-scripts'],
  {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: path.join(os.tmpdir(), 'mapp-intelligence-npm-cache'),
    },
  }
);

if (result.error) throw result.error;
assert.equal(result.status, 0, result.stderr || 'npm pack failed');

const jsonStart = result.stdout.indexOf('[\n  {\n    "id"');
assert.notEqual(jsonStart, -1, `Could not find npm pack JSON:\n${result.stdout}`);
const manifest = JSON.parse(result.stdout.slice(jsonStart))[0];
const files = new Set(manifest.files.map((file) => file.path));

for (const required of [
  'app.plugin.js',
  'android/build.gradle',
  'android/src/main/AndroidManifest.xml',
  'ios/MappinteligencePlugin.mm',
  'ios/Frameworks/MappIntelligenceiOS.xcframework/Info.plist',
  'lib/module/index.js',
  'lib/typescript/src/index.d.ts',
  'mapp-intelligence-reactnative-plugin.podspec',
  'src/index.tsx',
]) {
  assert.ok(files.has(required), `Published artifact is missing ${required}`);
}

assert.ok(
  [...files].every(
    (file) => !file.startsWith('example/') && !file.startsWith('example-expo/')
  ),
  'Published artifact contains an example application'
);

console.log(
  `Published artifact contains the Expo plugin and native entry points (${files.size} files checked).`
);
