const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const plist = require('@expo/plist').default;

const appRoot = path.resolve(__dirname, '..');
const appConfig = JSON.parse(
  fs.readFileSync(path.join(appRoot, 'app.json'), 'utf8')
).expo;
const buildProperties = appConfig.plugins.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-build-properties'
)?.[1];
assert.equal(
  buildProperties?.ios?.enableSceneSupport,
  true,
  'The SDK 57 sample must opt in to scenes through expo-build-properties'
);
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
  // Expo owns compiler selection through the app's expo-build-properties options.
  const gradleProperties = fs.readFileSync(
    path.join(appRoot, 'android/gradle.properties'),
    'utf8'
  );
  assert.match(gradleProperties, /^android\.kotlinVersion=2\.3\.20$/m);
  assert.equal(
    (gradleProperties.match(/^android\.kotlinVersion=/gm) || []).length,
    1,
    'Expected exactly one Kotlin version property'
  );
  const buildGradle = fs.readFileSync(
    path.join(appRoot, 'android/build.gradle'),
    'utf8'
  );
  assert.ok(
    buildGradle.includes(
      'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin" + (findProperty(\'android.kotlinVersion\') ? ":${findProperty(\'android.kotlinVersion\')}" : ""))'
    ),
    'Expected the Kotlin classpath to honor the app version with a versionless fallback'
  );
  // Expo's expo-build-properties plugin owns the sample's scene migration.
  const iosRoot = path.join(appRoot, 'ios/MappIntelligenceExpo');
  const infoPlist = plist.parse(
    fs.readFileSync(path.join(iosRoot, 'Info.plist'), 'utf8')
  );
  const manifest = infoPlist.UIApplicationSceneManifest;
  assert.equal(manifest?.UIApplicationSupportsMultipleScenes, false);
  assert.equal(
    manifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0]
      .UISceneDelegateClassName,
    'EXExpoAppSceneDelegate'
  );
  const appDelegate = fs.readFileSync(
    path.join(iosRoot, 'AppDelegate.swift'),
    'utf8'
  );
  assert.match(
    appDelegate,
    /AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider/
  );
  assert.doesNotMatch(appDelegate, /UIWindow\(frame:|factory\.startReactNative\(/);
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
