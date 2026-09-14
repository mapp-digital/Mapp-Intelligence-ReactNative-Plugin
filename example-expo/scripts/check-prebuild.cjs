const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const appRoot = path.resolve(__dirname, '..');
function snapshot(directory, prefix = '') {
  const files = {};
  for (const entry of fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) Object.assign(files, snapshot(absolute, relative));
    else
      files[relative] = createHash('sha256')
        .update(fs.readFileSync(absolute))
        .digest('hex');
  }
  return files;
}
function prebuild() {
  const result = spawnSync(
    process.execPath,
    [
      require.resolve('expo/bin/cli'),
      'prebuild',
      '--clean',
      '--platform',
      'android',
      '--no-install',
    ],
    {
      cwd: appRoot,
      stdio: 'inherit',
      env: Object.assign({}, process.env, { CI: '1' }),
    }
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, 'Expo prebuild failed');
  return snapshot(path.join(appRoot, 'android'));
}
const first = prebuild();
const second = prebuild();
assert.deepEqual(
  second,
  first,
  'Repeated clean prebuild changed generated Android files'
);
console.log(
  `Prebuild is idempotent (${Object.keys(first).length} files compared).`
);
