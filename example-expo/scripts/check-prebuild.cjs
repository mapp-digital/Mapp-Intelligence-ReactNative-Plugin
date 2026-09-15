const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const appRoot = path.resolve(__dirname, '..');
function canonicalizePbxProject(contents) {
  const ids = new Map();
  return contents.replace(/[A-F0-9]{24}/g, (id) => {
    if (!ids.has(id)) ids.set(id, `PBX_ID_${ids.size + 1}`);
    return ids.get(id);
  });
}
function snapshot(directory, prefix = '') {
  const files = {};
  for (const entry of fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.join(prefix, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) Object.assign(files, snapshot(absolute, relative));
    else {
      let contents = fs.readFileSync(absolute);
      // Expo generates fresh Xcode object IDs for each clean project. Replace
      // those opaque IDs by their stable encounter order before comparing the
      // otherwise identical project structure.
      if (entry.name === 'project.pbxproj') {
        contents = canonicalizePbxProject(contents.toString('utf8'));
      }
      files[relative] = createHash('sha256').update(contents).digest('hex');
    }
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
      'all',
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
  return {
    android: snapshot(path.join(appRoot, 'android')),
    ios: snapshot(path.join(appRoot, 'ios')),
  };
}
const first = prebuild();
const second = prebuild();
assert.deepEqual(
  second,
  first,
  'Repeated clean prebuild changed generated native files'
);
console.log(
  `Prebuild is idempotent (${Object.keys(first.android).length} Android and ${Object.keys(first.ios).length} iOS files compared).`
);
