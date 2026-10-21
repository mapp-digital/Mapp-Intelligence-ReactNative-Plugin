const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

// Run the plugin's real callbacks against Gradle fixtures without requiring Expo
// in the CLI workspace. Real Expo mod execution is covered by test:prebuild.
function applyPlugin(properties, contents) {
  const sandbox = {
    module: { exports: {} },
    require(name) {
      assert.equal(name, 'expo/config-plugins');
      return {
        withProjectBuildGradle(config, action) {
          config.gradle = action({
            modResults: { language: 'groovy', contents },
          }).modResults.contents;
          return config;
        },
      };
    },
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, '../app.plugin.js'), 'utf8'),
    sandbox
  );
  const config = { properties };
  return sandbox.module.exports(config);
}

const template =
  "dependencies { classpath('org.jetbrains.kotlin:kotlin-gradle-plugin') }";

test('leaves compiler selection to the app or framework without adding a default', () => {
  const result = applyPlugin([], template);
  assert.deepEqual(result.properties, []);
  assert.ok(result.gradle.includes("findProperty('android.kotlinVersion')"));
  assert.ok(result.gradle.includes(': ""'));
  assert.ok(!result.gradle.includes('2.3.20'));
});

test('preserves the consuming app Kotlin setting and unrelated properties', () => {
  const properties = [
    { type: 'property', key: 'android.kotlinVersion', value: '2.3.10' },
    { type: 'property', key: 'android.compileSdkVersion', value: '36' },
  ];
  const before = JSON.stringify(properties);
  const result = applyPlugin(properties, template);
  assert.equal(JSON.stringify(result.properties), before);
});

test('reapplying mods does not duplicate properties or modify the Gradle dependency again', () => {
  const first = applyPlugin([], template);
  const second = applyPlugin(first.properties, first.gradle);
  assert.equal(JSON.stringify(second), JSON.stringify(first));
});

test('preserves an explicitly versioned Kotlin dependency', () => {
  const contents =
    'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.3.10")';
  assert.equal(applyPlugin([], contents).gradle, contents);
});
